"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { useToast } from "@/hooks/useToast";
import { 
  BarChart3, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  Zap,
  Eye,
  ArrowUpRight
} from "lucide-react";

interface ScreenerResult {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  iv: number;
  targetDelta: number;
  dte: number;
  score: number;
  newsSentiment: 'positive' | 'negative' | 'neutral';
}

export default function ScreenerPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScreenerResult[]>([]);
  
  // Filter states
  const [minPrice, setMinPrice] = useState("10");
  const [maxPrice, setMaxPrice] = useState("200");
  const [targetDelta, setTargetDelta] = useState("0.25");
  const [minOI, setMinOI] = useState("1000");
  const [maxSpread, setMaxSpread] = useState("20");
  const [minIV, setMinIV] = useState("30");

  const handleRunScreener = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults: ScreenerResult[] = [
        {
          symbol: "AAPL",
          price: 175.43,
          change: 2.15,
          changePercent: 1.24,
          volume: 45678900,
          marketCap: 2750000000000,
          iv: 45.2,
          targetDelta: 0.28,
          dte: 35,
          score: 8.7,
          newsSentiment: 'positive'
        },
        {
          symbol: "MSFT",
          price: 378.85,
          change: -1.23,
          changePercent: -0.32,
          volume: 23456700,
          marketCap: 2810000000000,
          iv: 38.7,
          targetDelta: 0.22,
          dte: 42,
          score: 8.3,
          newsSentiment: 'neutral'
        },
        {
          symbol: "GOOGL",
          price: 142.56,
          change: 3.45,
          changePercent: 2.48,
          volume: 34567800,
          marketCap: 1790000000000,
          iv: 52.1,
          targetDelta: 0.31,
          dte: 38,
          score: 9.1,
          newsSentiment: 'positive'
        },
        {
          symbol: "TSLA",
          price: 248.42,
          change: -8.76,
          changePercent: -3.41,
          volume: 67890100,
          marketCap: 789000000000,
          iv: 78.9,
          targetDelta: 0.26,
          dte: 33,
          score: 7.8,
          newsSentiment: 'negative'
        },
        {
          symbol: "NVDA",
          price: 485.09,
          change: 12.34,
          changePercent: 2.61,
          volume: 45678900,
          marketCap: 1190000000000,
          iv: 65.4,
          targetDelta: 0.24,
          dte: 40,
          score: 8.9,
          newsSentiment: 'positive'
        }
      ];
      
      setResults(mockResults);
      setLoading(false);
      
      toast({
        title: "Screener Complete",
        description: `Found ${mockResults.length} potential opportunities`,
        variant: "success",
      });
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
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Options Screener
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Find high-probability put credit spreads with AI-powered analysis
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Screening Filters
            </CardTitle>
            <CardDescription>
              Customize your search parameters to find the best opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Delta</label>
                <Select value={targetDelta} onValueChange={setTargetDelta}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.20">0.20</SelectItem>
                    <SelectItem value="0.25">0.25</SelectItem>
                    <SelectItem value="0.30">0.30</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Open Interest</label>
                <Input
                  placeholder="1000"
                  value={minOI}
                  onChange={(e) => setMinOI(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Spread %</label>
                <Input
                  placeholder="20"
                  value={maxSpread}
                  onChange={(e) => setMaxSpread(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min IV %</label>
                <Input
                  placeholder="30"
                  value={minIV}
                  onChange={(e) => setMinIV(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={handleRunScreener} 
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Screening...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Run Screener
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Screening Results
              </CardTitle>
              <CardDescription>
                {results.length} opportunities found matching your criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                      <th className="pb-3 pr-4">Symbol</th>
                      <th className="pb-3 pr-4">Price</th>
                      <th className="pb-3 pr-4">Change</th>
                      <th className="pb-3 pr-4">Volume</th>
                      <th className="pb-3 pr-4">IV %</th>
                      <th className="pb-3 pr-4">Target Delta</th>
                      <th className="pb-3 pr-4">DTE</th>
                      <th className="pb-3 pr-4">Score</th>
                      <th className="pb-3 pr-4">Sentiment</th>
                      <th className="pb-3 pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="font-semibold text-foreground">{result.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            ${(result.marketCap / 1e9).toFixed(1)}B
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium">${result.price.toFixed(2)}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className={`flex items-center gap-1 ${
                            result.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.change >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                              {result.change >= 0 ? '+' : ''}{result.change.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.changePercent >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="text-sm">
                            {(result.volume / 1e6).toFixed(1)}M
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium">{result.iv.toFixed(1)}%</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{result.targetDelta}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span>{result.dte}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">{result.score.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(result.newsSentiment)}`}>
                            {getSentimentIcon(result.newsSentiment)}
                            {result.newsSentiment}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <Link href={`/ticker/${result.symbol}`}>
                            <Button variant="outline" size="sm">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
              <p className="text-muted-foreground mb-4">
                Run the screener with your preferred filters to find options opportunities
              </p>
              <Button onClick={handleRunScreener}>
                <Search className="h-4 w-4 mr-2" />
                Run Screener
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
