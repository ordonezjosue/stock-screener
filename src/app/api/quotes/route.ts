import { NextRequest, NextResponse } from 'next/server';
import { quoteService } from '@/lib/sources/quoteSources';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const symbols = searchParams.get('symbols'); // Comma-separated list

    if (!symbol && !symbols) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing symbol parameter',
          message: 'Provide either "symbol" or "symbols" parameter',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    let data;
    if (symbol) {
      // Single symbol
      data = await quoteService.getStockQuote(symbol);
    } else if (symbols) {
      // Multiple symbols
      const symbolList = symbols.split(',').map(s => s.trim());
      data = await quoteService.getMultipleQuotes(symbolList);
    }

    // Get rate limit status
    const rateLimitStatus = quoteService.getRateLimitStatus();

    return NextResponse.json({
      success: true,
      data: {
        quotes: Array.isArray(data) ? data : [data],
        total: Array.isArray(data) ? data.length : 1,
        rateLimitStatus,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Quotes API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quotes',
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
      case 'market':
        // Get market data (SPY, VIX, etc.)
        const marketData = await quoteService.getMarketData();
        
        return NextResponse.json({
          success: true,
          data: {
            market: marketData,
            timestamp: new Date().toISOString()
          }
        });

      case 'status':
        // Return rate limit status
        const rateLimitStatus = quoteService.getRateLimitStatus();
        
        return NextResponse.json({
          success: true,
          data: {
            rateLimitStatus,
            timestamp: new Date().toISOString()
          }
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            message: 'Supported actions: market, status',
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Quotes API POST error:', error);
    
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
