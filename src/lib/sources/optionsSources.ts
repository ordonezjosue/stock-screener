import { calculateIV } from '../iv/blackScholes';

export interface OptionQuote {
  symbol: string;
  expiration: string;
  strike: number;
  type: 'call' | 'put';
  bid: number;
  ask: number;
  last: number;
  volume: number;
  openInterest: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  impliedVolatility: number;
  timestamp: Date;
}

export interface OptionsChain {
  symbol: string;
  expiration: string;
  calls: OptionQuote[];
  puts: OptionQuote[];
  timestamp: Date;
}

export interface ScreeningCriteria {
  minPrice: number;
  maxPrice: number;
  targetDelta: number;
  minOI: number;
  maxSpread: number;
  minIV: number;
  dteRange: [number, number]; // [min, max] days to expiration
}

export interface ScreeningResult {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  iv: number;
  targetDelta: number;
  dte: number;
  score: number;
  newsSentiment: 'positive' | 'negative' | 'neutral';
  bestOption?: OptionQuote;
}

export class OptionsService {
  private apiKey: string;
  private baseUrl = 'https://api.polygon.io/v3'; // Polygon.io for options data
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT = 5; // 5 requests per minute (free tier)
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds

  constructor() {
    this.apiKey = process.env.POLYGON_API_KEY || '';
    if (!this.apiKey) {
      console.warn('POLYGON_API_KEY not set. Options service will use mock data.');
    }
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    
    if (now - this.lastRequestTime > this.RATE_LIMIT_WINDOW) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    if (this.requestCount >= this.RATE_LIMIT) {
      const waitTime = this.RATE_LIMIT_WINDOW - (now - this.lastRequestTime);
      throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    this.requestCount++;
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Polygon API key not configured');
    }

    await this.checkRateLimit();

    const url = `${this.baseUrl}${endpoint}?apiKey=${this.apiKey}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'StockScreener/1.0 (https://github.com/ordonezjosue/stock-screener)'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  public async getOptionsChain(symbol: string, expiration?: string): Promise<OptionsChain> {
    try {
      // For now, return mock data since Polygon free tier doesn't include options
      // In production, you'd implement the real API call here
      return this.getMockOptionsChain(symbol, expiration);
    } catch (error) {
      console.error(`Error fetching options chain for ${symbol}:`, error);
      return this.getMockOptionsChain(symbol, expiration);
    }
  }

  public async screenOptions(criteria: ScreeningCriteria): Promise<ScreeningResult[]> {
    // Mock screening results for now
    // In production, this would fetch real data and apply filters
    const mockResults: ScreeningResult[] = [
      {
        symbol: 'AAPL',
        price: 175.43,
        change: 2.15,
        changePercent: 1.24,
        volume: 45678900,
        marketCap: 2750000000000,
        iv: 45.2,
        targetDelta: 0.28,
        dte: 35,
        score: 8.7,
        newsSentiment: 'positive'
      },
      {
        symbol: 'MSFT',
        price: 378.85,
        change: -1.23,
        changePercent: -0.32,
        volume: 23456700,
        marketCap: 2810000000000,
        iv: 38.7,
        targetDelta: 0.22,
        dte: 42,
        score: 8.3,
        newsSentiment: 'neutral'
      },
      {
        symbol: 'GOOGL',
        price: 142.56,
        change: 3.45,
        changePercent: 2.48,
        volume: 34567800,
        marketCap: 1790000000000,
        iv: 52.1,
        targetDelta: 0.31,
        dte: 38,
        score: 9.1,
        newsSentiment: 'positive'
      },
      {
        symbol: 'TSLA',
        price: 248.42,
        change: -8.76,
        changePercent: -3.41,
        volume: 67890100,
        marketCap: 789000000000,
        iv: 78.9,
        targetDelta: 0.26,
        dte: 33,
        score: 7.8,
        newsSentiment: 'negative'
      },
      {
        symbol: 'NVDA',
        price: 485.09,
        change: 12.34,
        changePercent: 2.61,
        volume: 45678900,
        marketCap: 1190000000000,
        iv: 65.4,
        targetDelta: 0.24,
        dte: 40,
        score: 8.9,
        newsSentiment: 'positive'
      }
    ];

    // Apply basic filtering based on criteria
    return mockResults.filter(result => {
      return result.price >= criteria.minPrice &&
             result.price <= criteria.maxPrice &&
             result.iv >= criteria.minIV &&
             result.dte >= criteria.dteRange[0] &&
             result.dte <= criteria.dteRange[1];
    });
  }

  public calculateOptionScore(option: OptionQuote): number {
    // Scoring algorithm based on liquidity, IV, and delta
    const liquidityScore = Math.min(option.volume / 1000 + option.openInterest / 5000, 10);
    const ivScore = option.impliedVolatility * 20; // Higher IV = higher score
    const deltaScore = Math.abs(option.delta) * 10; // Closer to 0.30 = higher score
    
    return (liquidityScore + ivScore + deltaScore) / 3;
  }

  public async getPutCreditSpreadRecommendation(symbol: string, currentPrice: number): Promise<{
    shortStrike: number;
    longStrike: number;
    credit: number;
    maxRisk: number;
    probabilityOfProfit: number;
  }> {
    // Calculate recommended strikes based on current price
    const shortStrike = Math.round(currentPrice * 0.95); // 5% below current price
    const longStrike = Math.round(currentPrice * 0.90); // 10% below current price
    const spreadWidth = shortStrike - longStrike;
    
    // Estimate credit based on IV and distance from current price
    const estimatedCredit = spreadWidth * 0.3; // Rough estimate
    const maxRisk = spreadWidth - estimatedCredit;
    const probabilityOfProfit = 0.75; // Rough estimate for Δ≈0.25

    return {
      shortStrike,
      longStrike,
      credit: Math.round(estimatedCredit * 100) / 100,
      maxRisk: Math.round(maxRisk * 100) / 100,
      probabilityOfProfit
    };
  }

  private getMockOptionsChain(symbol: string, expiration?: string): OptionsChain {
    const mockExpiration = expiration || '2024-02-16';
    const mockStrikes = [160, 165, 170, 175, 180, 185, 190];
    
    const puts: OptionQuote[] = mockStrikes.map(strike => ({
      symbol,
      expiration: mockExpiration,
      strike,
      type: 'put',
      bid: Math.max(0.05, (180 - strike) * 0.1),
      ask: Math.max(0.10, (180 - strike) * 0.1 + 0.05),
      last: Math.max(0.08, (180 - strike) * 0.1 + 0.03),
      volume: Math.floor(Math.random() * 2000) + 500,
      openInterest: Math.floor(Math.random() * 5000) + 1000,
      delta: Math.max(-0.9, (strike - 175) * 0.1),
      gamma: 0.01 + Math.random() * 0.02,
      theta: -0.1 - Math.random() * 0.1,
      vega: 0.5 + Math.random() * 0.5,
      impliedVolatility: 0.3 + Math.random() * 0.3,
      timestamp: new Date()
    }));

    const calls: OptionQuote[] = mockStrikes.map(strike => ({
      symbol,
      expiration: mockExpiration,
      strike,
      type: 'call',
      bid: Math.max(0.05, (strike - 175) * 0.1),
      ask: Math.max(0.10, (strike - 175) * 0.1 + 0.05),
      last: Math.max(0.08, (strike - 175) * 0.1 + 0.03),
      volume: Math.floor(Math.random() * 2000) + 500,
      openInterest: Math.floor(Math.random() * 5000) + 1000,
      delta: Math.min(0.9, (175 - strike) * 0.1),
      gamma: 0.01 + Math.random() * 0.02,
      theta: -0.1 - Math.random() * 0.1,
      vega: 0.5 + Math.random() * 0.5,
      impliedVolatility: 0.3 + Math.random() * 0.3,
      timestamp: new Date()
    }));

    return {
      symbol,
      expiration: mockExpiration,
      calls,
      puts,
      timestamp: new Date()
    };
  }

  public getRateLimitStatus(): { remaining: number; resetTime: number } {
    const now = Date.now();
    const remaining = Math.max(0, this.RATE_LIMIT - this.requestCount);
    const resetTime = this.lastRequestTime + this.RATE_LIMIT_WINDOW;

    return {
      remaining,
      resetTime
    };
  }
}

// Export singleton instance
export const optionsService = new OptionsService();
