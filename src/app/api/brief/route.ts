import { NextRequest, NextResponse } from 'next/server';
import { newsAggregator } from '@/lib/sources/newsSources';
import { quoteService } from '@/lib/sources/quoteSources';

export interface EconomicEvent {
  id: string;
  time: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  previous: string;
  forecast: string;
  actual?: string;
  currency: string;
}

export interface MarketSummary {
  date: string;
  spyChange: number;
  spyChangePercent: number;
  vix: number;
  vixChange: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  keyEvents: string[];
}

export interface DailyBrief {
  marketSummary: MarketSummary;
  economicEvents: EconomicEvent[];
  topHeadlines: any[];
  tradingReminders: string[];
  timestamp: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'refresh') {
      // Force refresh of all data
      return await generateDailyBrief(true);
    } else {
      // Return cached/generated brief
      return await generateDailyBrief(false);
    }

  } catch (error) {
    console.error('Daily Brief API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate daily brief',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'generate':
        // Generate new daily brief
        return await generateDailyBrief(true);

      case 'status':
        // Return brief generation status
        return NextResponse.json({
          success: true,
          data: {
            status: 'operational',
            lastGenerated: new Date().toISOString(),
            timestamp: new Date().toISOString()
          }
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            message: 'Supported actions: generate, status',
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Daily Brief API POST error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function generateDailyBrief(forceRefresh: boolean = false): Promise<NextResponse> {
  try {
    // Fetch market data
    const marketData = await quoteService.getMarketData();
    
    // Fetch latest news
    const news = await newsAggregator.fetchAllNews();
    const topHeadlines = news.slice(0, 6); // Top 6 headlines
    
    // Generate market sentiment
    const marketSentiment = calculateMarketSentiment(marketData, topHeadlines);
    
    // Create market summary
    const marketSummary: MarketSummary = {
      date: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      spyChange: marketData.spy.change,
      spyChangePercent: marketData.spy.changePercent,
      vix: marketData.vix.price,
      vixChange: marketData.vix.change,
      marketSentiment,
      keyEvents: extractKeyEvents(topHeadlines)
    };

    // Generate economic calendar (mock data for now)
    const economicEvents: EconomicEvent[] = generateEconomicEvents();
    
    // Generate trading reminders
    const tradingReminders = generateTradingReminders(marketData, economicEvents);

    const dailyBrief: DailyBrief = {
      marketSummary,
      economicEvents,
      topHeadlines,
      tradingReminders,
      timestamp: new Date()
    };

    return NextResponse.json({
      success: true,
      data: dailyBrief
    });

  } catch (error) {
    console.error('Error generating daily brief:', error);
    throw error;
  }
}

function calculateMarketSentiment(marketData: any, headlines: any[]): 'bullish' | 'bearish' | 'neutral' {
  let score = 0;
  
  // SPY movement
  if (marketData.spy.changePercent > 0.5) score += 2;
  else if (marketData.spy.changePercent < -0.5) score -= 2;
  
  // VIX movement (inverse relationship)
  if (marketData.vix.change < -0.5) score += 1; // VIX down = bullish
  else if (marketData.vix.change > 0.5) score -= 1; // VIX up = bearish
  
  // Headline sentiment
  headlines.forEach(headline => {
    const text = `${headline.title} ${headline.description}`.toLowerCase();
    if (text.includes('bullish') || text.includes('up') || text.includes('gain')) score += 1;
    if (text.includes('bearish') || text.includes('down') || text.includes('drop')) score -= 1;
  });
  
  if (score >= 2) return 'bullish';
  if (score <= -2) return 'bearish';
  return 'neutral';
}

function extractKeyEvents(headlines: any[]): string[] {
  const keyEvents: string[] = [];
  
  headlines.forEach(headline => {
    const text = headline.title.toLowerCase();
    
    // Look for important keywords
    if (text.includes('fed') || text.includes('federal reserve')) {
      keyEvents.push(`Federal Reserve: ${headline.title}`);
    }
    if (text.includes('earnings') || text.includes('quarterly')) {
      keyEvents.push(`Earnings: ${headline.title}`);
    }
    if (text.includes('inflation') || text.includes('cpi')) {
      keyEvents.push(`Inflation Data: ${headline.title}`);
    }
    if (text.includes('oil') || text.includes('opec')) {
      keyEvents.push(`Oil Markets: ${headline.title}`);
    }
  });
  
  // Limit to 3 key events
  return keyEvents.slice(0, 3);
}

function generateEconomicEvents(): EconomicEvent[] {
  // Mock economic calendar data
  // In production, this would come from a real economic calendar API
  return [
    {
      id: "1",
      time: "8:30 AM ET",
      event: "CPI (Consumer Price Index)",
      impact: "high",
      previous: "3.1%",
      forecast: "3.0%",
      actual: "2.9%",
      currency: "USD"
    },
    {
      id: "2",
      time: "10:00 AM ET",
      event: "Fed Chair Powell Speech",
      impact: "high",
      previous: "N/A",
      forecast: "N/A",
      currency: "USD"
    },
    {
      id: "3",
      time: "2:00 PM ET",
      event: "FOMC Meeting Minutes",
      impact: "medium",
      previous: "N/A",
      forecast: "N/A",
      currency: "USD"
    },
    {
      id: "4",
      time: "4:00 PM ET",
      event: "Crude Oil Inventories",
      impact: "low",
      previous: "-2.3M",
      forecast: "-1.5M",
      currency: "USD"
    }
  ];
}

function generateTradingReminders(marketData: any, economicEvents: EconomicEvent[]): string[] {
  const reminders: string[] = [];
  
  // High impact events
  const highImpactEvents = economicEvents.filter(event => event.impact === 'high');
  highImpactEvents.forEach(event => {
    reminders.push(`${event.event} at ${event.time} - High Impact`);
  });
  
  // Market conditions
  if (marketData.vix.price < 20) {
    reminders.push("VIX below 20 - Low volatility expected");
  } else if (marketData.vix.price > 30) {
    reminders.push("VIX above 30 - High volatility expected");
  }
  
  if (marketData.spy.changePercent > 1) {
    reminders.push("S&P 500 showing strong momentum");
  } else if (marketData.spy.changePercent < -1) {
    reminders.push("S&P 500 showing weakness");
  }
  
  // General reminders
  reminders.push("Check options expiration dates");
  reminders.push("Review open positions");
  reminders.push("Set stop losses");
  
  return reminders.slice(0, 5); // Limit to 5 reminders
}
