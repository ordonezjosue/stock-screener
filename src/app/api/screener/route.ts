import { NextRequest, NextResponse } from 'next/server';
import { optionsService } from '@/lib/sources/optionsSources';
import { quoteService } from '@/lib/sources/quoteSources';
import { newsAggregator } from '@/lib/sources/newsSources';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      minPrice = 10,
      maxPrice = 200,
      targetDelta = 0.25,
      minOI = 1000,
      maxSpread = 20,
      minIV = 30,
      dteRange = [30, 45]
    } = body;

    // Validate input parameters
    if (minPrice < 0 || maxPrice < minPrice) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid price range',
          message: 'minPrice must be >= 0 and maxPrice must be >= minPrice',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    if (targetDelta < 0 || targetDelta > 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid target delta',
          message: 'targetDelta must be between 0 and 1',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    if (dteRange[0] < 0 || dteRange[1] < dteRange[0]) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid DTE range',
          message: 'DTE range must be positive and min <= max',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // Run the screener
    const screeningCriteria = {
      minPrice,
      maxPrice,
      targetDelta,
      minOI,
      maxSpread,
      minIV,
      dteRange
    };

    const results = await optionsService.screenOptions(screeningCriteria);

    // Enhance results with additional data
    const enhancedResults = await Promise.all(
      results.map(async (result) => {
        try {
          // Get current quote data
          const quote = await quoteService.getStockQuote(result.symbol);
          
          // Get news sentiment for the ticker
          const news = await newsAggregator.fetchNewsByTicker(result.symbol);
          
          // Calculate news sentiment score
          const sentimentScore = calculateNewsSentiment(news);
          
          // Get put credit spread recommendation
          const pcsRecommendation = await optionsService.getPutCreditSpreadRecommendation(
            result.symbol,
            quote.price
          );

          return {
            ...result,
            currentPrice: quote.price,
            priceChange: quote.change,
            priceChangePercent: quote.changePercent,
            volume: quote.volume,
            marketCap: quote.marketCap,
            newsCount: news.length,
            sentiment: sentimentScore,
            pcsRecommendation
          };
        } catch (error) {
          console.error(`Error enhancing result for ${result.symbol}:`, error);
          return result;
        }
      })
    );

    // Sort by score (highest first)
    const sortedResults = enhancedResults.sort((a, b) => b.score - a.score);

    // Get rate limit statuses
    const optionsRateLimit = optionsService.getRateLimitStatus();
    const quotesRateLimit = quoteService.getRateLimitStatus();

    return NextResponse.json({
      success: true,
      data: {
        results: sortedResults,
        total: sortedResults.length,
        criteria: screeningCriteria,
        rateLimits: {
          options: optionsRateLimit,
          quotes: quotesRateLimit
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Screener API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run screener',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        // Return service status and rate limits
        const optionsRateLimit = optionsService.getRateLimitStatus();
        const quotesRateLimit = quoteService.getRateLimitStatus();
        
        return NextResponse.json({
          success: true,
          data: {
            services: {
              options: {
                status: 'operational',
                rateLimit: optionsRateLimit
              },
              quotes: {
                status: 'operational',
                rateLimit: quotesRateLimit
              }
            },
            timestamp: new Date().toISOString()
          }
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            message: 'Supported actions: status',
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Screener API GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get status',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate news sentiment score based on recent headlines
 */
function calculateNewsSentiment(news: any[]): 'positive' | 'negative' | 'neutral' {
  if (news.length === 0) return 'neutral';

  // Simple keyword-based sentiment analysis
  const positiveKeywords = ['up', 'rise', 'gain', 'positive', 'bullish', 'beat', 'higher', 'increase'];
  const negativeKeywords = ['down', 'fall', 'drop', 'negative', 'bearish', 'miss', 'lower', 'decrease'];

  let positiveCount = 0;
  let negativeCount = 0;

  news.forEach(item => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    
    positiveKeywords.forEach(keyword => {
      if (text.includes(keyword)) positiveCount++;
    });
    
    negativeKeywords.forEach(keyword => {
      if (text.includes(keyword)) negativeCount++;
    });
  });

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}
