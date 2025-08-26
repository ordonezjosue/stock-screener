import { NextRequest, NextResponse } from 'next/server';
import { newsAggregator } from '@/lib/sources/newsSources';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const limit = parseInt(searchParams.get('limit') || '50');

    let news;
    if (ticker) {
      news = await newsAggregator.fetchNewsByTicker(ticker);
    } else {
      news = await newsAggregator.fetchAllNews();
    }

    // Limit results if specified
    const limitedNews = news.slice(0, limit);

    // Get source status for monitoring
    const sourceStatus = newsAggregator.getSourceStatus();

    return NextResponse.json({
      success: true,
      data: {
        news: limitedNews,
        total: news.length,
        returned: limitedNews.length,
        sourceStatus,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('News API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news',
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
      case 'refresh':
        // Force refresh of all news sources
        const news = await newsAggregator.fetchAllNews();
        const sourceStatus = newsAggregator.getSourceStatus();
        
        return NextResponse.json({
          success: true,
          data: {
            news: news.slice(0, 50), // Return top 50
            total: news.length,
            sourceStatus,
            timestamp: new Date().toISOString()
          }
        });

      case 'status':
        // Return source status only
        const status = newsAggregator.getSourceStatus();
        
        return NextResponse.json({
          success: true,
          data: {
            sourceStatus: status,
            timestamp: new Date().toISOString()
          }
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            message: 'Supported actions: refresh, status',
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('News API POST error:', error);
    
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
