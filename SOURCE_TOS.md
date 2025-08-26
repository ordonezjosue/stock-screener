# Data Source Terms of Service & Rate Limits

This document outlines the data sources used by StockScreener, their terms of service compliance, and rate limiting information.

## News Sources

### CNBC RSS Feed
- **URL**: `https://www.cnbc.com/id/100003114/device/rss/rss.html`
- **Terms**: Public RSS feed, no scraping restrictions
- **Rate Limit**: None specified
- **Content**: Business and financial news headlines
- **Compliance**: ✅ ToS compliant

### MarketWatch RSS Feed
- **URL**: `https://feeds.marketwatch.com/marketwatch/topstories/`
- **Terms**: Public RSS feed, no scraping restrictions
- **Rate Limit**: None specified
- **Content**: Market news and analysis
- **Compliance**: ✅ ToS compliant

### Reuters Business RSS Feed
- **URL**: `https://feeds.reuters.com/reuters/businessNews`
- **Terms**: Public RSS feed, no scraping restrictions
- **Rate Limit**: None specified
- **Content**: Business and financial news
- **Compliance**: ✅ ToS compliant

### Bloomberg RSS Feed
- **URL**: `https://feeds.bloomberg.com/markets/news.rss`
- **Terms**: Public RSS feed, no scraping restrictions
- **Rate Limit**: None specified
- **Content**: Market news and analysis
- **Compliance**: ✅ ToS compliant

## Stock Quote Sources

### Alpha Vantage
- **URL**: `https://www.alphavantage.co/query`
- **Terms**: Free tier available, API key required
- **Rate Limit**: 5 requests per minute (free tier)
- **Content**: Stock quotes, market data, fundamentals
- **Compliance**: ✅ ToS compliant
- **Registration**: Required at https://www.alphavantage.co/support/#api-key

## Options Data Sources

### Polygon.io
- **URL**: `https://api.polygon.io/v3`
- **Terms**: Free tier available, API key required
- **Rate Limit**: 5 requests per minute (free tier)
- **Content**: Options chains, market data
- **Compliance**: ✅ ToS compliant
- **Registration**: Required at https://polygon.io/
- **Note**: Free tier may not include options data

## Data Usage Policy

### RSS Feeds
- **Storage**: Headlines, descriptions, and metadata are stored
- **Linking**: All content links back to original sources
- **Attribution**: Source attribution maintained for all content
- **Updates**: Feeds refreshed hourly during market hours

### API Data
- **Caching**: Data cached for 1-5 minutes to respect rate limits
- **Fallbacks**: Mock data provided when APIs fail or rate limits exceeded
- **Error Handling**: Graceful degradation when sources unavailable

## Rate Limiting Implementation

### News Sources
- **Refresh Interval**: 5 minutes (300 seconds)
- **Concurrent Requests**: Limited to prevent overwhelming sources
- **Error Handling**: Sources disabled after 3 consecutive failures

### Quote Sources
- **Rate Limiting**: Enforced per API key
- **Request Spacing**: 200ms between requests
- **Fallback**: Mock data when rate limits exceeded

### Options Sources
- **Rate Limiting**: Enforced per API key
- **Request Spacing**: 200ms between requests
- **Fallback**: Mock data when rate limits exceeded

## Compliance Notes

### ToS Compliance
- ✅ **RSS Feeds**: All RSS sources are public and allow automated access
- ✅ **APIs**: All APIs used have free tiers and allow automated access
- ❌ **Scraping**: No web scraping of paywalled or restricted content
- ✅ **Attribution**: All content properly attributed to original sources

### Data Storage
- **News**: Headlines, descriptions, and metadata stored
- **Quotes**: Current prices and basic metrics stored
- **Options**: Chain data and calculated metrics stored
- **User Data**: No user data stored (stateless application)

### Fallback Strategy
1. **Primary**: Real-time API data
2. **Secondary**: Cached data (1-5 minutes old)
3. **Tertiary**: Mock data for demonstration

## Environment Variables Required

```bash
# Alpha Vantage API Key (Free tier)
ALPHA_VANTAGE_KEY=your_key_here

# Polygon.io API Key (Free tier)
POLYGON_API_KEY=your_key_here

# Internal API Key for cron jobs
INTERNAL_API_KEY=your_internal_key_here
```

## Monitoring & Alerts

### Source Health
- **Status Endpoints**: `/api/news?action=status`, `/api/quotes?action=status`
- **Error Tracking**: Failed sources logged and monitored
- **Auto-Disable**: Sources disabled after repeated failures

### Rate Limit Monitoring
- **Remaining Requests**: Tracked per API key
- **Reset Times**: Monitored for optimal request timing
- **Fallback Triggers**: Mock data when limits approached

## Future Enhancements

### Additional Sources (When Available)
- **SEC EDGAR**: Company filings via official API
- **Reddit API**: Social sentiment from r/stocks, r/options
- **Economic Calendar**: Fed calendar, earnings dates
- **Options IV**: Real-time implied volatility data

### Premium Tier Support
- **Polygon Pro**: Higher rate limits for options data
- **Alpha Vantage Premium**: Higher rate limits for quotes
- **News APIs**: Premium news sources with higher limits

## Legal Disclaimer

This application complies with all known terms of service for the data sources used. Users are responsible for:
- Obtaining their own API keys
- Complying with individual service terms
- Respecting rate limits and usage policies
- Not using the application for illegal purposes

## Support & Issues

For issues with specific data sources:
- **Alpha Vantage**: https://www.alphavantage.co/support/
- **Polygon.io**: https://polygon.io/support
- **RSS Issues**: Check source websites for feed status

---

*Last Updated: January 2025*
*Version: 1.0*
