import { parseStringPromise } from 'xml2js';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  publishedAt: Date;
  tickerSymbols: string[];
  summary: string;
}

export interface NewsSource {
  name: string;
  url: string;
  enabled: boolean;
  lastFetch?: Date;
  errorCount: number;
}

export class NewsAggregator {
  private sources: NewsSource[] = [
    {
      name: 'CNBC',
      url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
      enabled: true,
      errorCount: 0
    },
    {
      name: 'MarketWatch',
      url: 'https://feeds.marketwatch.com/marketwatch/topstories/',
      enabled: true,
      errorCount: 0
    },
    {
      name: 'Reuters Business',
      url: 'https://feeds.reuters.com/reuters/businessNews',
      enabled: true,
      errorCount: 0
    },
    {
      name: 'Bloomberg',
      url: 'https://feeds.bloomberg.com/markets/news.rss',
      enabled: true,
      errorCount: 0
    }
  ];

  private async fetchRSS(url: string, sourceName: string): Promise<NewsItem[]> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'StockScreener/1.0 (https://github.com/ordonezjosue/stock-screener)',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlText = await response.text();
      const result = await parseStringPromise(xmlText);
      
      if (!result.rss || !result.rss.channel || !result.rss.channel[0].item) {
        throw new Error('Invalid RSS format');
      }

      const items = result.rss.channel[0].item;
      return items.map((item: any, index: number) => ({
        id: `${sourceName}-${index}-${Date.now()}`,
        title: item.title?.[0] || 'No Title',
        description: item.description?.[0] || '',
        link: item.link?.[0] || '',
        source: sourceName,
        publishedAt: item.pubDate?.[0] ? new Date(item.pubDate[0]) : new Date(),
        tickerSymbols: this.extractTickers(item.title?.[0] || ''),
        summary: this.generateSummary(item.description?.[0] || '')
      }));

    } catch (error) {
      console.error(`Error fetching RSS from ${sourceName}:`, error);
      throw error;
    }
  }

  private extractTickers(text: string): string[] {
    // Extract ticker symbols (e.g., AAPL, MSFT, TSLA)
    const tickerRegex = /\b[A-Z]{1,5}\b/g;
    const tickers = text.match(tickerRegex) || [];
    
    // Filter out common words that might match ticker pattern
    const commonWords = ['THE', 'AND', 'FOR', 'ARE', 'YOU', 'ALL', 'NEW', 'TOP', 'BIG', 'LOW', 'HIGH'];
    return tickers.filter(ticker => !commonWords.includes(ticker));
  }

  private generateSummary(description: string): string {
    // Clean up description and limit length
    const cleanDesc = description
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Replace HTML entities
      .trim();
    
    return cleanDesc.length > 200 
      ? cleanDesc.substring(0, 200) + '...'
      : cleanDesc;
  }

  public async fetchAllNews(): Promise<NewsItem[]> {
    const allNews: NewsItem[] = [];
    const errors: string[] = [];

    for (const source of this.sources) {
      if (!source.enabled) continue;

      try {
        const news = await this.fetchRSS(source.url, source.name);
        allNews.push(...news);
        source.lastFetch = new Date();
        source.errorCount = 0;
      } catch (error) {
        source.errorCount++;
        errors.push(`${source.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Disable source if it fails too many times
        if (source.errorCount >= 3) {
          source.enabled = false;
          console.warn(`Disabled ${source.name} due to repeated failures`);
        }
      }

      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (errors.length > 0) {
      console.warn('Some news sources failed:', errors);
    }

    // Sort by publication date (newest first)
    return allNews.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  public async fetchNewsByTicker(ticker: string): Promise<NewsItem[]> {
    const allNews = await this.fetchAllNews();
    return allNews.filter(item => 
      item.tickerSymbols.some(symbol => 
        symbol.toUpperCase() === ticker.toUpperCase()
      )
    );
  }

  public getSourceStatus(): NewsSource[] {
    return this.sources.map(source => ({
      ...source,
      lastFetch: source.lastFetch,
      errorCount: source.errorCount
    }));
  }
}

// Export singleton instance
export const newsAggregator = new NewsAggregator();
