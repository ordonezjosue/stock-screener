export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  dividend: number;
  dividendYield: number;
  high52: number;
  low52: number;
  avgVolume: number;
  timestamp: Date;
}

export interface MarketData {
  spy: {
    price: number;
    change: number;
    changePercent: number;
  };
  vix: {
    price: number;
    change: number;
  };
  advanceDecline: {
    advancing: number;
    declining: number;
    unchanged: number;
  };
  timestamp: Date;
}

export class QuoteService {
  private apiKey: string;
  private baseUrl = 'https://www.alphavantage.co/query';
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT = 5; // 5 requests per minute (free tier)
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_KEY || '';
    if (!this.apiKey) {
      console.warn('ALPHA_VANTAGE_KEY not set. Quote service will use mock data.');
    }
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now - this.lastRequestTime > this.RATE_LIMIT_WINDOW) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    // Check if we're at the limit
    if (this.requestCount >= this.RATE_LIMIT) {
      const waitTime = this.RATE_LIMIT_WINDOW - (now - this.lastRequestTime);
      throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    this.requestCount++;
  }

  private async makeRequest(params: Record<string, string>): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Alpha Vantage API key not configured');
    }

    await this.checkRateLimit();

    const url = new URL(this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'StockScreener/1.0 (https://github.com/ordonezjosue/stock-screener)'
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      throw new Error(`API Limit: ${data['Note']}`);
    }

    return data;
  }

  public async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const data = await this.makeRequest({
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: this.apiKey
      });

      const quote = data['Global Quote'];
      if (!quote) {
        throw new Error(`No data returned for ${symbol}`);
      }

      return {
        symbol: quote['01. symbol'] || symbol,
        price: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
        volume: parseInt(quote['06. volume']) || 0,
        marketCap: 0, // Not available in free tier
        pe: 0, // Not available in free tier
        dividend: 0, // Not available in free tier
        dividendYield: 0, // Not available in free tier
        high52: 0, // Not available in free tier
        low52: 0, // Not available in free tier
        avgVolume: parseInt(quote['06. volume']) || 0,
        timestamp: new Date()
      };

    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      
      // Return mock data if API fails
      return this.getMockQuote(symbol);
    }
  }

  public async getMarketData(): Promise<MarketData> {
    try {
      const [spyData, vixData] = await Promise.all([
        this.getStockQuote('SPY'),
        this.getStockQuote('^VIX')
      ]);

      return {
        spy: {
          price: spyData.price,
          change: spyData.change,
          changePercent: spyData.changePercent
        },
        vix: {
          price: vixData.price,
          change: vixData.change
        },
        advanceDecline: {
          advancing: 0, // Not available in free tier
          declining: 0,
          unchanged: 0
        },
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Error fetching market data:', error);
      
      // Return mock data if API fails
      return this.getMockMarketData();
    }
  }

  public async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = [];
    
    for (const symbol of symbols) {
      try {
        const quote = await this.getStockQuote(symbol);
        quotes.push(quote);
        
        // Rate limiting between requests
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error);
      }
    }

    return quotes;
  }

  // Mock data fallbacks
  private getMockQuote(symbol: string): StockQuote {
    const mockQuotes: Record<string, StockQuote> = {
      'AAPL': {
        symbol: 'AAPL',
        price: 175.43,
        change: 2.15,
        changePercent: 1.24,
        volume: 45678900,
        marketCap: 2750000000000,
        pe: 28.5,
        dividend: 0.92,
        dividendYield: 2.1,
        high52: 198.23,
        low52: 124.17,
        avgVolume: 45678900,
        timestamp: new Date()
      },
      'MSFT': {
        symbol: 'MSFT',
        price: 378.85,
        change: -1.23,
        changePercent: -0.32,
        volume: 23456700,
        marketCap: 2810000000000,
        pe: 35.2,
        dividend: 3.00,
        dividendYield: 0.8,
        high52: 420.82,
        low52: 213.43,
        avgVolume: 23456700,
        timestamp: new Date()
      }
    };

    return mockQuotes[symbol] || {
      symbol,
      price: 100.00,
      change: 0,
      changePercent: 0,
      volume: 1000000,
      marketCap: 1000000000,
      pe: 20.0,
      dividend: 0,
      dividendYield: 0,
      high52: 110.00,
      low52: 90.00,
      avgVolume: 1000000,
      timestamp: new Date()
    };
  }

  private getMockMarketData(): MarketData {
    return {
      spy: {
        price: 456.78,
        change: 3.45,
        changePercent: 0.76
      },
      vix: {
        price: 18.45,
        change: -0.23
      },
      advanceDecline: {
        advancing: 2456,
        declining: 1890,
        unchanged: 234
      },
      timestamp: new Date()
    };
  }

  public getRateLimitStatus(): { remaining: number; resetTime: number } {
    const now = Date.now();
    const timeSinceReset = now - this.lastRequestTime;
    const remaining = Math.max(0, this.RATE_LIMIT - this.requestCount);
    const resetTime = this.lastRequestTime + this.RATE_LIMIT_WINDOW;

    return {
      remaining,
      resetTime
    };
  }
}

// Export singleton instance
export const quoteService = new QuoteService();
