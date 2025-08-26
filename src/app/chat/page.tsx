"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Newspaper, 
  AlertTriangle,
  Clock,
  ExternalLink,
  RefreshCw,
  BarChart3,
  DollarSign,
  Activity,
  Globe
} from "lucide-react";

interface MarketSummary {
  date: string;
  sp500Change: number;
  sp500ChangePercent: number;
  vix: number;
  vixChange: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  keyEvents: string[];
}

interface EconomicEvent {
  id: string;
  time: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  previous: string;
  forecast: string;
  actual?: string;
  currency: string;
}

interface NewsSummary {
  source: string;
  headline: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  tickers: string[];
  summary: string;
}

export default function DailyMarketBriefPage() {
  const [loading, setLoading] = useState(true);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [newsSummary, setNewsSummary] = useState<NewsSummary[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    loadMarketBrief();
  }, []);

  const loadMarketBrief = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockMarketSummary: MarketSummary = {
        date: new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        sp500Change: 15.67,
        sp500ChangePercent: 0.34,
        vix: 18.45,
        vixChange: -0.23,
        marketSentiment: 'bullish',
        keyEvents: [
          "Federal Reserve meeting minutes released",
          "Apple earnings beat expectations",
          "Oil prices stabilize after OPEC+ decision"
        ]
      };

      const mockEconomicEvents: EconomicEvent[] = [
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

      const mockNewsSummary: NewsSummary[] = [
        {
          source: "CNBC",
          headline: "Federal Reserve Signals Potential Rate Cuts in 2024",
          sentiment: "positive",
          impact: "high",
          tickers: ["SPY", "QQQ", "IWM"],
          summary: "Fed officials indicated they may begin cutting interest rates in 2024 as inflation continues to moderate."
        },
        {
          source: "MarketWatch",
          headline: "Apple Reports Record Q4 Earnings, iPhone Sales Surge 15%",
          sentiment: "positive",
          impact: "medium",
          tickers: ["AAPL"],
          summary: "Apple Inc. reported record-breaking fourth-quarter earnings, with iPhone sales jumping 15% year-over-year."
        },
        {
          source: "Reuters",
          headline: "Tesla Faces Production Delays Due to Supply Chain Issues",
          sentiment: "negative",
          impact: "medium",
          tickers: ["TSLA"],
          summary: "Tesla Inc. announced production delays for several models due to ongoing supply chain disruptions."
        },
        {
          source: "Bloomberg",
          headline: "Oil Prices Drop 3% on Increased OPEC+ Production",
          sentiment: "negative",
          impact: "low",
          tickers: ["XOM", "CVX", "USO"],
          summary: "Crude oil prices fell 3% after OPEC+ announced plans to increase production by 500,000 barrels per day."
        }
      ];

      setMarketSummary(mockMarketSummary);
      setEconomicEvents(mockEconomicEvents);
      setNewsSummary(mockNewsSummary);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    }, 2000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading today's market brief...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Daily Market Brief
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Your comprehensive morning briefing for informed trading decisions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm text-muted-foreground">
                <div>Last updated</div>
                <div className="font-medium">{lastUpdated}</div>
              </div>
              <Button onClick={loadMarketBrief} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Market Summary */}
        {marketSummary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Overview - {marketSummary.date}
              </CardTitle>
              <CardDescription>
                Key market indicators and sentiment for today's trading session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">S&P 500</div>
                  <div className={`text-xl font-semibold ${
                    marketSummary.sp500Change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketSummary.sp500Change >= 0 ? '+' : ''}{marketSummary.sp500Change.toFixed(2)} 
                    ({marketSummary.sp500ChangePercent >= 0 ? '+' : ''}{marketSummary.sp500ChangePercent.toFixed(2)}%)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">VIX</div>
                  <div className={`text-xl font-semibold ${
                    marketSummary.vixChange >= 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {marketSummary.vix.toFixed(2)} 
                    ({marketSummary.vixChange >= 0 ? '+' : ''}{marketSummary.vixChange.toFixed(2)})
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">Sentiment</div>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    marketSummary.marketSentiment === 'bullish' ? 'text-green-600 bg-green-100' :
                    marketSummary.marketSentiment === 'bearish' ? 'text-red-600 bg-red-100' :
                    'text-gray-600 bg-gray-100'
                  }`}>
                    {marketSummary.marketSentiment === 'bullish' ? <TrendingUp className="h-4 w-4" /> :
                     marketSummary.marketSentiment === 'bearish' ? <TrendingDown className="h-4 w-4" /> :
                     <Activity className="h-4 w-4" />}
                    {marketSummary.marketSentiment.charAt(0).toUpperCase() + marketSummary.marketSentiment.slice(1)}
                  </div>
                </div>
              </div>
              
              {marketSummary.keyEvents.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Key Events Today:</h4>
                  <ul className="space-y-2">
                    {marketSummary.keyEvents.map((event, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Economic Calendar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Economic Calendar
            </CardTitle>
            <CardDescription>
              Today's important economic events and their potential market impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {economicEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">Time</div>
                      <div className="font-semibold">{event.time}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{event.event}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(event.impact)}`}>
                          {event.impact.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.currency} • Previous: {event.previous} • Forecast: {event.forecast}
                        {event.actual && ` • Actual: ${event.actual}`}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* News Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Market News Summary
            </CardTitle>
            <CardDescription>
              Curated headlines from major financial sources with sentiment analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {newsSummary.map((news, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-blue-600">{news.source}</span>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(news.sentiment)}`}>
                          {getSentimentIcon(news.sentiment)}
                          {news.sentiment}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(news.impact)}`}>
                          {news.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-foreground leading-tight">
                        {news.headline}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm">
                        {news.summary}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        {news.tickers.map((ticker) => (
                          <span
                            key={ticker}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium"
                          >
                            {ticker}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Read
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trading Reminders */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Pre-Trading Checklist
            </CardTitle>
            <CardDescription>
              Important reminders before you start trading today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">High Impact Events</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    CPI data release at 8:30 AM ET
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    Fed Chair Powell speech at 10:00 AM ET
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Market Conditions</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    VIX below 20 - low volatility expected
                  </li>
                  <li className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    S&P 500 showing bullish momentum
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
