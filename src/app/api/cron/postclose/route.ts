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
    console.log('Post-close cron job started:', new Date().toISOString());
    
    // Get final market data for the day
    const marketData = await quoteService.getMarketData();
    
    // Get final news count for the day
    const news = await newsAggregator.fetchAllNews();
    
    // Get source status for monitoring
    const newsSourceStatus = newsAggregator.getSourceStatus();
    const quoteRateLimit = quoteService.getRateLimitStatus();
    
    // Generate daily summary
    const dailySummary = {
      date: new Date().toLocaleDateString('en-US'),
      finalSPY: marketData.spy.price,
      finalVIX: marketData.vix.price,
      totalNewsItems: news.length,
      newsSourceStatus,
      quoteRateLimit,
      timestamp: new Date()
    };
    
    console.log('Daily summary generated:', dailySummary);
    console.log('Post-close cron job completed successfully');
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Post-close daily summary completed',
        dailySummary,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Post-close cron job failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Post-close summary failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
