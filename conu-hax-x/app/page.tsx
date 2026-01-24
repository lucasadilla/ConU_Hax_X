import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { DailyStreak } from "@/components/daily-streak"
import { Leaderboard } from "@/components/leaderboard"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Map, Trophy, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        
        {/* Quest System Highlight */}
        <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary">
              🗺️ New Feature
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
              Quest System
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete progressive challenges to earn exclusive badges. Each quest has 3 stages
              that build upon each other, simulating real-world development scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Theme Cards */}
            <Card className="p-6 border-2 border-red-500/50 bg-red-500/5 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">🐛</div>
              <h3 className="font-display text-lg text-primary mb-2">
                Regression & Tech Debt
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Fix bugs, refactor code, and eliminate technical debt in Next.js apps
              </p>
              <Badge variant="outline" className="border-red-500 text-red-400">
                3 Quests
              </Badge>
            </Card>

            <Card className="p-6 border-2 border-green-500/50 bg-green-500/5 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-display text-lg text-primary mb-2">
                Feature Creation
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Build new features from scratch using TypeScript and MongoDB
              </p>
              <Badge variant="outline" className="border-green-500 text-green-400">
                3 Quests
              </Badge>
            </Card>

            <Card className="p-6 border-2 border-yellow-500/50 bg-yellow-500/5 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-display text-lg text-primary mb-2">
                Debugging & Problem Solving
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hunt down bugs and solve complex issues in production code
              </p>
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                3 Quests
              </Badge>
            </Card>
          </div>

          {/* Quest Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Map className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-bold text-foreground">Progressive Map</div>
                <div className="text-xs text-muted-foreground">Easy → Medium → Hard</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-bold text-foreground">Exclusive Badges</div>
                <div className="text-xs text-muted-foreground">300 points per quest</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-bold text-foreground">Real Scenarios</div>
                <div className="text-xs text-muted-foreground">Next.js + MongoDB</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/quests">
              <Button size="lg" className="group">
                Explore Quests
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        <Categories />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* This would be your problem list or other content */}
            </div>
            <div className="space-y-8">
              <DailyStreak />
              <Leaderboard />
            </div>
          </div>
        </div>
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
