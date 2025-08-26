import { NextRequest, NextResponse } from 'next/server';
import { newsAggregator } from '@/lib/sources/newsSources';
import { quoteService } from '@/lib/sources/quoteSources';

export async function GET(request: NextRequest) {
  // Verify internal API key for cron jobs
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.INTERNAL_API_KEY;
  
  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or missing API key',
        timestamp: new Date().toISOString()
      },
      { status: 401 }
    );
  }

  try {
    console.log('Pre-market cron job started:', new Date().toISOString());
    
    // Fetch fresh market data
    const marketData = await quoteService.getMarketData();
    
    // Fetch latest news
    const news = await newsAggregator.fetchAllNews();
    const topHeadlines = news.slice(0, 6);
    
    // Generate market sentiment
    const marketSentiment = calculateMarketSentiment(marketData, topHeadlines);
    
    // Create market summary
    const marketSummary = {
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

    // Generate economic calendar (mock for now)
    const economicEvents = generateEconomicEvents();
    
    // Generate trading reminders
    const tradingReminders = generateTradingReminders(marketData, economicEvents);

    const dailyBrief = {
      marketSummary,
      economicEvents,
      topHeadlines,
      tradingReminders,
      timestamp: new Date()
    };

    console.log('Pre-market daily brief generated successfully');
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Pre-market daily brief generated',
        dailyBrief,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Pre-market cron job failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Pre-market brief generation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function calculateMarketSentiment(marketData: any, headlines: any[]): 'bullish' | 'bearish' | 'neutral' {
  let score = 0;
  
  // SPY movement
  if (marketData.spy.changePercent > 0.5) score += 2;
  else if (marketData.spy.changePercent < -0.5) score -= 2;
  
  // VIX movement (inverse relationship)
  if (marketData.vix.change < -0.5) score += 1;
  else if (marketData.vix.change > 0.5) score -= 1;
  
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
    
    if (text.includes('fed') || text.includes('federal reserve')) {
      keyEvents.push(`Federal Reserve: ${headline.title}`);
    }
    if (text.includes('earnings') || text.includes('quarterly')) {
      keyEvents.push(`Earnings: ${headline.title}`);
    }
    if (text.includes('inflation') || text.includes('cpi')) {
      keyEvents.push(`Inflation Data: ${headline.title}`);
    }
  });
  
  return keyEvents.slice(0, 3);
}

function generateEconomicEvents() {
  return [
    {
      id: "1",
      time: "8:30 AM ET",
      event: "CPI (Consumer Price Index)",
      impact: "high",
      previous: "3.1%",
      forecast: "3.0%",
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
    }
  ];
}

function generateTradingReminders(marketData: any, economicEvents: any[]): string[] {
  const reminders: string[] = [];
  
  // High impact events
  const highImpactEvents = economicEvents.filter((event: any) => event.impact === 'high');
  highImpactEvents.forEach((event: any) => {
    reminders.push(`${event.event} at ${event.time} - High Impact`);
  });
  
  // Market conditions
  if (marketData.vix.price < 20) {
    reminders.push("VIX below 20 - Low volatility expected");
  } else if (marketData.vix.price > 30) {
    reminders.push("VIX above 30 - High volatility expected");
  }
  
  // General reminders
  reminders.push("Check options expiration dates");
  reminders.push("Review open positions");
  reminders.push("Set stop losses");
  
  return reminders.slice(0, 5);
}
