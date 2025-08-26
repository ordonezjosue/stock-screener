# StockScreener - AI-Powered Options Analysis

A beautiful and elegant web application for screening options strategies, with a focus on put credit spreads and naked puts. Features real-time market data, comprehensive news analysis, and automated daily briefs.

## 🚀 Features

- **Options Screener**: Find 30-45 DTE put credit spreads with target delta (0.20-0.30)
- **Daily Market Brief**: Comprehensive morning briefing with economic calendar and news sentiment
- **Financial News**: Curated headlines from major sources with sentiment analysis
- **Ticker Analysis**: Detailed stock information and options chain data
- **Real Data APIs**: Live market data from Alpha Vantage, Polygon.io, and RSS feeds
- **Black-Scholes IV Solver**: Calculate implied volatility and options pricing
- **Automated Updates**: Vercel cron jobs for hourly data refresh
- **Beautiful UI**: Modern, responsive design with dark mode

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React hooks
- **Styling**: CSS variables with dark mode support
- **Backend**: Next.js API routes
- **Data Sources**: Alpha Vantage, Polygon.io, RSS feeds
- **Options Pricing**: Black-Scholes model with IV calculation
- **Automation**: Vercel Cron jobs
- **Deployment**: Vercel (serverless)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ordonezjosue/stock-screener.git
   cd stock-screener
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Required

### Free Tier APIs (Required)
- **Alpha Vantage**: [Get free key](https://www.alphavantage.co/support/#api-key)
  - Stock quotes and market data
  - Rate limit: 5 requests/minute
  
- **Polygon.io**: [Get free key](https://polygon.io/)
  - Options chain data
  - Rate limit: 5 requests/minute

### Internal API Key
- Generate a random string for `INTERNAL_API_KEY`
- Used to protect cron job endpoints

## 🎯 How to Use

### 1. Homepage
- Landing page with feature overview
- Quick access to screener and market brief

### 2. Options Screener
- Set your screening criteria (price range, target delta, etc.)
- Run the screener to find opportunities
- View detailed results with scoring and sentiment

### 3. Daily Market Brief
- Get comprehensive market overview
- Check economic calendar for high-impact events
- Review news sentiment and market conditions

### 4. Financial News
- Browse headlines from major financial sources
- Filter by source, category, or search terms
- View sentiment analysis and ticker mentions

### 5. Ticker Analysis
- Click "View" on any screener result
- See comprehensive stock information
- Analyze options chain for put credit spreads
- Get strategy recommendations

## 🔧 Development

The app is built with a component-based architecture:

- **UI Components**: Reusable components in `src/components/ui/`
- **Layout Components**: Navigation and structure in `src/components/layout/`
- **Pages**: Main application pages in `src/app/`
- **API Routes**: Backend endpoints in `src/app/api/`
- **Data Sources**: External API integrations in `src/lib/sources/`
- **Options Pricing**: Black-Scholes implementation in `src/lib/iv/`
- **Utilities**: Helper functions in `src/lib/utils.ts`

## 📊 Data Sources

### News Sources (RSS Feeds)
- **CNBC**: Business and financial news
- **MarketWatch**: Market analysis and headlines
- **Reuters**: Business news and updates
- **Bloomberg**: Market news and analysis

### Market Data
- **Alpha Vantage**: Stock quotes, fundamentals
- **Polygon.io**: Options chains, market data
- **RSS Feeds**: Real-time news and sentiment

### Options Data
- **Black-Scholes Model**: IV calculation and pricing
- **Greeks Calculation**: Delta, gamma, theta, vega
- **Risk Analysis**: Probability of profit, max risk/reward

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect GitHub repo** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main

### Environment Variables in Vercel
```bash
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
POLYGON_API_KEY=your_polygon_api_key
INTERNAL_API_KEY=your_internal_api_key
```

### Cron Jobs
- **Hourly**: Data refresh and monitoring
- **Pre-market**: Daily brief generation
- **Post-close**: Daily summary and cleanup

## 🎨 Design System

- **Color Scheme**: Dark mode with blue/purple accent colors
- **Typography**: Inter font family with proper hierarchy
- **Components**: Consistent card layouts and interactive elements
- **Responsive**: Mobile-first design with responsive breakpoints

## 🚧 Current Status

This is a **fully functional production-ready application** with:
- ✅ Complete UI/UX implementation
- ✅ Real backend APIs and data sources
- ✅ Options pricing and IV calculation
- ✅ Automated data updates via cron jobs
- ✅ Rate limiting and error handling
- ✅ ToS compliance documentation
- ✅ Responsive design
- ✅ Vercel deployment ready

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🔒 Compliance & Security

- **ToS Compliant**: All data sources respect terms of service
- **Rate Limiting**: Proper API usage within free tier limits
- **Error Handling**: Graceful degradation when sources fail
- **No User Data**: Stateless application, no personal data stored
- **API Protection**: Cron jobs protected with internal API keys

## 📚 API Documentation

### News API
- `GET /api/news` - Fetch all news
- `GET /api/news?ticker=AAPL` - News for specific ticker
- `POST /api/news` - Refresh news sources

### Quotes API
- `GET /api/quotes?symbol=AAPL` - Stock quote
- `GET /api/quotes?symbols=AAPL,MSFT` - Multiple quotes
- `POST /api/quotes?action=market` - Market data (SPY, VIX)

### Screener API
- `POST /api/screener` - Run options screener
- `GET /api/screener?action=status` - Service status

### Daily Brief API
- `GET /api/brief` - Get daily market brief
- `POST /api/brief?action=generate` - Generate new brief

### Cron Jobs
- `GET /api/cron/hourly` - Hourly data refresh
- `GET /api/cron/premarket` - Pre-market brief generation
- `GET /api/cron/postclose` - Post-close summary

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ordonezjosue/stock-screener/issues)
- **Documentation**: [SOURCE_TOS.md](SOURCE_TOS.md) for data source details
- **API Limits**: Check individual service documentation

---

**Ready to start screening options?** 🎯

Run `npm run dev` and navigate to the screener to find your next trading opportunity!

**Production Ready**: Deploy to Vercel with real market data and automated updates! 🚀
