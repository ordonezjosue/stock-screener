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
    console.log('Hourly cron job started:', new Date().toISOString());
    
    // Refresh news sources
    const news = await newsAggregator.fetchAllNews();
    console.log(`Refreshed ${news.length} news items`);
    
    // Refresh market data (SPY, VIX)
    const marketData = await quoteService.getMarketData();
    console.log('Refreshed market data:', {
      spy: marketData.spy.price,
      vix: marketData.vix.price
    });
    
    // Get source status for monitoring
    const newsSourceStatus = newsAggregator.getSourceStatus();
    const quoteRateLimit = quoteService.getRateLimitStatus();
    
    console.log('Hourly cron job completed successfully');
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Hourly data refresh completed',
        newsCount: news.length,
        newsSourceStatus,
        quoteRateLimit,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Hourly cron job failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Hourly refresh failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
