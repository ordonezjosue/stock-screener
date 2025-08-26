# StockScreener - AI-Powered Options Analysis

A beautiful and elegant web application for screening options strategies, with a focus on put credit spreads and naked puts. Features real-time market data, comprehensive news analysis, and automated daily briefs.

## 🚀 Features

- **Options Screener**: Find 30-45 DTE put credit spreads with target delta (0.20-0.30)
- **Daily Market Brief**: Comprehensive morning briefing with economic calendar and news sentiment
- **Financial News**: Curated headlines from major sources with sentiment analysis
- **Ticker Analysis**: Detailed stock information and options chain data
- **Beautiful UI**: Modern, responsive design with dark mode

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React hooks
- **Styling**: CSS variables with dark mode support

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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
- **Utilities**: Helper functions in `src/lib/utils.ts`

## 🎨 Design System

- **Color Scheme**: Dark mode with blue/purple accent colors
- **Typography**: Inter font family with proper hierarchy
- **Components**: Consistent card layouts and interactive elements
- **Responsive**: Mobile-first design with responsive breakpoints

## 🚧 Current Status

This is a **fully functional frontend prototype** with:
- ✅ Complete UI/UX implementation
- ✅ Mock data for demonstration
- ✅ Responsive design
- ✅ Navigation between all pages
- ✅ Component library

**Next Steps for Production:**
- Integrate real market data APIs
- Add backend services
- Implement real-time updates
- Add user preferences and watchlists

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Ready to start screening options?** 🎯

Run `npm run dev` and navigate to the screener to find your next trading opportunity!
