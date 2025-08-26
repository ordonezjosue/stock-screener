"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { 
  Newspaper, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Eye,
  Share2,
  Bookmark
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  tickers: string[];
  category: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Simulate loading news data
    setTimeout(() => {
      const mockNews: NewsItem[] = [
        {
          id: "1",
          title: "Apple Reports Record Q4 Earnings, iPhone Sales Surge 15%",
          description: "Apple Inc. reported record-breaking fourth-quarter earnings, with iPhone sales jumping 15% year-over-year, driven by strong demand for the iPhone 15 Pro models.",
          url: "https://example.com/apple-earnings",
          source: "CNBC",
          publishedAt: "2024-01-15T10:30:00Z",
          sentiment: "positive",
          tickers: ["AAPL"],
          category: "Earnings"
        },
        {
          id: "2",
          title: "Federal Reserve Signals Potential Rate Cuts in 2024",
          description: "Federal Reserve officials indicated they may begin cutting interest rates in 2024 as inflation continues to moderate and economic growth shows signs of cooling.",
          url: "https://example.com/fed-rate-cuts",
          source: "MarketWatch",
          publishedAt: "2024-01-15T09:15:00Z",
          sentiment: "positive",
          tickers: ["SPY", "QQQ", "IWM"],
          category: "Federal Reserve"
        },
        {
          id: "3",
          title: "Tesla Faces Production Delays Due to Supply Chain Issues",
          description: "Tesla Inc. announced production delays for several models due to ongoing supply chain disruptions, particularly affecting battery components from Asian suppliers.",
          url: "https://example.com/tesla-delays",
          source: "Reuters",
          publishedAt: "2024-01-15T08:45:00Z",
          sentiment: "negative",
          tickers: ["TSLA"],
          category: "Production"
        },
        {
          id: "4",
          title: "Microsoft Cloud Services Revenue Exceeds Expectations",
          description: "Microsoft Corporation reported stronger-than-expected cloud services revenue, with Azure growth accelerating to 28% year-over-year in the latest quarter.",
          url: "https://example.com/microsoft-cloud",
          source: "CNBC",
          publishedAt: "2024-01-15T07:30:00Z",
          sentiment: "positive",
          tickers: ["MSFT"],
          category: "Earnings"
        },
        {
          id: "5",
          title: "Oil Prices Drop 3% on Increased OPEC+ Production",
          description: "Crude oil prices fell 3% after OPEC+ announced plans to increase production by 500,000 barrels per day starting next month, easing supply concerns.",
          url: "https://example.com/oil-prices",
          source: "Bloomberg",
          publishedAt: "2024-01-15T06:20:00Z",
          sentiment: "negative",
          tickers: ["XOM", "CVX", "USO"],
          category: "Commodities"
        },
        {
          id: "6",
          title: "NVIDIA Announces New AI Chip for Data Centers",
          description: "NVIDIA Corporation unveiled its latest AI chip designed specifically for data centers, promising 40% better performance than previous generation models.",
          url: "https://example.com/nvidia-ai-chip",
          source: "TechCrunch",
          publishedAt: "2024-01-15T05:15:00Z",
          sentiment: "positive",
          tickers: ["NVDA"],
          category: "Technology"
        }
      ];
      
      setNews(mockNews);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tickers.some(ticker => ticker.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSource = selectedSource === "all" || item.source === selectedSource;
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesSource && matchesCategory;
  });

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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading latest news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Financial News
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Stay informed with the latest market news, earnings reports, and economic updates
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
            <CardDescription>
              Find specific news by keyword, source, or category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search news, tickers, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Source</label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="CNBC">CNBC</SelectItem>
                    <SelectItem value="MarketWatch">MarketWatch</SelectItem>
                    <SelectItem value="Reuters">Reuters</SelectItem>
                    <SelectItem value="Bloomberg">Bloomberg</SelectItem>
                    <SelectItem value="TechCrunch">TechCrunch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Earnings">Earnings</SelectItem>
                    <SelectItem value="Federal Reserve">Federal Reserve</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Commodities">Commodities</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Results */}
        <div className="space-y-6">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-blue-600">{item.source}</span>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                          {getSentimentIcon(item.sentiment)}
                          {item.sentiment}
                        </div>
                        <span className="text-sm text-muted-foreground">{item.category}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-foreground leading-tight">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>

                      {/* Tickers and Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.tickers.map((ticker) => (
                            <span
                              key={ticker}
                              className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium"
                            >
                              {ticker}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatTimeAgo(item.publishedAt)}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Read
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No News Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find relevant news
              </p>
            </Card>
          )}
        </div>

        {/* Results Count */}
        {filteredNews.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {filteredNews.length} of {news.length} news articles
          </div>
        )}
      </div>
    </div>
  );
}
