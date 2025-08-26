"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar, 
  DollarSign,
  Activity,
  Target,
  Zap,
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface TickerData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  dividend: number;
  dividendYield: number;
  high52: number;
  low52: number;
  avgVolume: number;
}

interface OptionsData {
  expiration: string;
  strike: number;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export default function TickerDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [optionsData, setOptionsData] = useState<OptionsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickerData();
  }, [symbol]);

  const loadTickerData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockTickerData: TickerData = {
        symbol: symbol,
        companyName: symbol === "AAPL" ? "Apple Inc." : 
                    symbol === "MSFT" ? "Microsoft Corporation" :
                    symbol === "GOOGL" ? "Alphabet Inc." :
                    symbol === "TSLA" ? "Tesla Inc." :
                    symbol === "NVDA" ? "NVIDIA Corporation" : "Company Name",
        price: symbol === "AAPL" ? 175.43 :
               symbol === "MSFT" ? 378.85 :
               symbol === "GOOGL" ? 142.56 :
               symbol === "TSLA" ? 248.42 :
               symbol === "NVDA" ? 485.09 : 100.00,
        change: symbol === "AAPL" ? 2.15 :
                symbol === "MSFT" ? -1.23 :
                symbol === "GOOGL" ? 3.45 :
                symbol === "TSLA" ? -8.76 :
                symbol === "NVDA" ? 12.34 : 1.50,
        changePercent: symbol === "AAPL" ? 1.24 :
                      symbol === "MSFT" ? -0.32 :
                      symbol === "GOOGL" ? 2.48 :
                      symbol === "TSLA" ? -3.41 :
                      symbol === "NVDA" ? 2.61 : 1.50,
        volume: 45678900,
        marketCap: 2750000000000,
        pe: 28.5,
        dividend: 0.92,
        dividendYield: 2.1,
        high52: 198.23,
        low52: 124.17,
        avgVolume: 45678900
      };

      const mockOptionsData: OptionsData[] = [
        {
          expiration: "2024-02-16",
          strike: 170,
          bid: 8.50,
          ask: 8.65,
          last: 8.60,
          volume: 1250,
          openInterest: 3450,
          impliedVolatility: 0.45,
          delta: -0.28,
          gamma: 0.015,
          theta: -0.12,
          vega: 0.85
        },
        {
          expiration: "2024-02-16",
          strike: 175,
          bid: 4.20,
          ask: 4.35,
          last: 4.30,
          volume: 890,
          openInterest: 2100,
          impliedVolatility: 0.42,
          delta: -0.22,
          gamma: 0.018,
          theta: -0.15,
          vega: 0.92
        },
        {
          expiration: "2024-02-16",
          strike: 180,
          bid: 1.85,
          ask: 1.95,
          last: 1.90,
          volume: 1560,
          openInterest: 1890,
          impliedVolatility: 0.38,
          delta: -0.15,
          gamma: 0.020,
          theta: -0.18,
          vega: 0.78
        }
      ];

      setTickerData(mockTickerData);
      setOptionsData(mockOptionsData);
      setLoading(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading {symbol} data...</p>
        </div>
      </div>
    );
  }

  if (!tickerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ticker Not Found</h2>
          <p className="text-muted-foreground mb-4">Could not load data for {symbol}</p>
          <Link href="/screener">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Screener
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/screener">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Screener
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {tickerData.symbol} - {tickerData.companyName}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Comprehensive analysis and options data
          </p>
        </div>

        {/* Stock Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Stock Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">${tickerData.price.toFixed(2)}</div>
                <div className={`text-lg font-semibold ${
                  tickerData.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tickerData.change >= 0 ? '+' : ''}{tickerData.change.toFixed(2)} 
                  ({tickerData.changePercent >= 0 ? '+' : ''}{tickerData.changePercent.toFixed(2)}%)
                </div>
                <div className="text-sm text-muted-foreground">Current Price</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">${(tickerData.marketCap / 1e9).toFixed(1)}B</div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{tickerData.pe.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">P/E Ratio</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{tickerData.dividendYield.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Dividend Yield</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{(tickerData.volume / 1e6).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Volume</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">${tickerData.high52.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">52-Week High</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">${tickerData.low52.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">52-Week Low</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Options Chain */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Put Options Chain (30-45 DTE)
            </CardTitle>
            <CardDescription>
              Options data for put credit spread strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                    <th className="pb-3 pr-4">Expiration</th>
                    <th className="pb-3 pr-4">Strike</th>
                    <th className="pb-3 pr-4">Bid</th>
                    <th className="pb-3 pr-4">Ask</th>
                    <th className="pb-3 pr-4">Last</th>
                    <th className="pb-3 pr-4">Volume</th>
                    <th className="pb-3 pr-4">OI</th>
                    <th className="pb-3 pr-4">IV</th>
                    <th className="pb-3 pr-4">Delta</th>
                    <th className="pb-3 pr-4">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {optionsData.map((option, index) => {
                    const score = calculateOptionScore(option);
                    return (
                      <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="font-medium">{option.expiration}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-semibold">${option.strike}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium">${option.bid.toFixed(2)}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium">${option.ask.toFixed(2)}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium">${option.last.toFixed(2)}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="text-sm">{option.volume.toLocaleString()}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="text-sm">{option.openInterest.toLocaleString()}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium">{(option.impliedVolatility * 100).toFixed(1)}%</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium">{option.delta.toFixed(3)}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">{score.toFixed(1)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-4" />
              Strategy Recommendations
            </CardTitle>
            <CardDescription>
              Based on current market conditions and options data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Put Credit Spread</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sell Put:</span>
                    <span className="font-medium">${tickerData.price * 0.95} strike</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buy Put:</span>
                    <span className="font-medium">${tickerData.price * 0.90} strike</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Risk:</span>
                    <span className="font-medium">$500 per contract</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Return:</span>
                    <span className="font-medium text-green-600">15-20%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Market Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span>Strong technical support at ${(tickerData.price * 0.92).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span>Implied volatility suggests premium selling opportunity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span>30-45 DTE optimal for theta decay</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function calculateOptionScore(option: OptionsData): number {
  // Simple scoring algorithm based on liquidity, IV, and delta
  const liquidityScore = Math.min(option.volume / 1000 + option.openInterest / 5000, 10);
  const ivScore = option.impliedVolatility * 20; // Higher IV = higher score
  const deltaScore = Math.abs(option.delta) * 10; // Closer to 0.30 = higher score
  
  return (liquidityScore + ivScore + deltaScore) / 3;
}
