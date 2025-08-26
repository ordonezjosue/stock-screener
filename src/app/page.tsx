import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  BarChart3, 
  TrendingUp, 
  Newspaper, 
  MessageSquare, 
  Zap,
  Shield,
  Target,
  Brain
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              AI-Powered{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Options Screener
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Discover high-probability put credit spreads with advanced AI analysis, 
              real-time market data, and automated insights. Trade smarter, not harder.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/screener">
                <Button size="lg" className="text-lg px-8 py-6">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Start Screening
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  AI Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[50%] top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#36b49f] to-[#DBFF75] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#36b49f]/30 dark:to-[#DBFF75]/30 dark:opacity-100"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to succeed in options trading
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Professional-grade tools designed for serious traders who want to maximize their edge.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Smart Screening</CardTitle>
                <CardDescription>
                  Find 30-45 DTE put credit spreads with optimal delta (0.20-0.30) using advanced algorithms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>
                  Get instant insights on market sentiment, news impact, and technical analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-green-700 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Real-time Data</CardTitle>
                <CardDescription>
                  Live quotes, options chains, and implied volatility calculations updated every minute.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-600 to-orange-700 group-hover:scale-110 transition-transform">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <CardTitle>News Integration</CardTitle>
                <CardDescription>
                  RSS feeds from CNBC, MarketWatch, SEC filings, and Reddit for comprehensive market coverage.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Risk Management</CardTitle>
                <CardDescription>
                  Built-in position sizing, risk calculations, and portfolio heat maps.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Performance Tracking</CardTitle>
                <CardDescription>
                  Monitor your trades, track P&L, and analyze your strategy performance over time.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to transform your options trading?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of traders who are already using AI to find better opportunities and manage risk.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/screener">
                <Button size="lg" className="text-lg px-8 py-6">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Try AI Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
