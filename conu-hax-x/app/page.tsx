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

// Decorative cloud component
function Clouds() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Clouds */}
      <div className="cloud cloud--1" />
      <div className="cloud cloud--2" />
      <div className="cloud cloud--3" />
      <div className="cloud cloud--4" />
    </div>
  )
}

// Stars background
function Stars() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Static stars */}
      <div className="star star--small" style={{ top: '5%', left: '10%' }} />
      <div className="star star--medium star--twinkle" style={{ top: '12%', left: '25%' }} />
      <div className="star star--small" style={{ top: '8%', left: '40%' }} />
      <div className="star star--large star--twinkle animation-delay-300" style={{ top: '15%', left: '55%' }} />
      <div className="star star--small" style={{ top: '6%', left: '70%' }} />
      <div className="star star--medium star--twinkle animation-delay-500" style={{ top: '18%', left: '85%' }} />
      <div className="star star--small" style={{ top: '22%', left: '15%' }} />
      <div className="star star--medium" style={{ top: '25%', left: '35%' }} />
      <div className="star star--small star--twinkle animation-delay-700" style={{ top: '20%', left: '60%' }} />
      <div className="star star--large" style={{ top: '28%', left: '78%' }} />
      <div className="star star--small" style={{ top: '35%', left: '8%' }} />
      <div className="star star--medium star--twinkle animation-delay-200" style={{ top: '32%', left: '92%' }} />
    </div>
  )
}

// Floating coin decoration
function FloatingCoin({ className }: { className?: string }) {
  return (
    <div className={`coin animate-float-coin ${className}`}>
      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-amber-900">
        ¢
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen sky-background">
      {/* Decorative elements */}
      <Stars />
      <Clouds />
      
      {/* Floating decorations */}
      <div className="fixed pointer-events-none z-10">
        <FloatingCoin className="absolute top-32 left-[5%] animation-delay-200" />
        <FloatingCoin className="absolute top-48 right-[8%] animation-delay-500" />
        <div className="absolute top-64 left-[12%] text-4xl animate-float animation-delay-300">⚔️</div>
        <div className="absolute top-40 right-[15%] text-3xl animate-float-slow animation-delay-700">🏆</div>
      </div>
      
      {/* Main content */}
      <div className="relative z-20">
        <Header />
        <main>
          <Hero />
          
          {/* Quest System Highlight */}
          <section className="py-16 container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary animate-pulse-glow">
                🗺️ New Feature
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl text-gradient-gold mb-4 text-shadow-glow">
                Quest System
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete progressive challenges to earn exclusive badges. Each quest has 3 stages
                that build upon each other, simulating real-world development scenarios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Theme Cards */}
              <Card className="card-fantasy p-6 border-2 border-red-500/50 hover:scale-105 transition-all duration-300 hover:border-red-400 group">
                <div className="text-4xl mb-3 animate-bounce-gentle">🐛</div>
                <h3 className="font-display text-lg text-gradient-gold mb-2">
                  Regression & Tech Debt
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Fix bugs, refactor code, and eliminate technical debt in Next.js apps
                </p>
                <Badge variant="outline" className="border-red-500 text-red-400 group-hover:bg-red-500/20">
                  3 Quests
                </Badge>
              </Card>

              <Card className="card-fantasy p-6 border-2 border-green-500/50 hover:scale-105 transition-all duration-300 hover:border-green-400 group">
                <div className="text-4xl mb-3 animate-bounce-gentle animation-delay-200">✨</div>
                <h3 className="font-display text-lg text-gradient-gold mb-2">
                  Feature Creation
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Build new features from scratch using TypeScript and MongoDB
                </p>
                <Badge variant="outline" className="border-green-500 text-green-400 group-hover:bg-green-500/20">
                  3 Quests
                </Badge>
              </Card>

              <Card className="card-fantasy p-6 border-2 border-yellow-500/50 hover:scale-105 transition-all duration-300 hover:border-yellow-400 group">
                <div className="text-4xl mb-3 animate-bounce-gentle animation-delay-300">🔧</div>
                <h3 className="font-display text-lg text-gradient-gold mb-2">
                  Debugging & Problem Solving
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Hunt down bugs and solve complex issues in production code
                </p>
                <Badge variant="outline" className="border-yellow-500 text-yellow-400 group-hover:bg-yellow-500/20">
                  3 Quests
                </Badge>
              </Card>
            </div>

            {/* Quest Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 glass p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center animate-glow">
                  <Map className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Progressive Map</div>
                  <div className="text-xs text-muted-foreground">Easy → Medium → Hard</div>
                </div>
              </div>
              <div className="flex items-center gap-3 glass p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center animate-glow animation-delay-200">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Exclusive Badges</div>
                  <div className="text-xs text-muted-foreground">300 points per quest</div>
                </div>
              </div>
              <div className="flex items-center gap-3 glass p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center animate-glow animation-delay-300">
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
                <Button size="lg" className="btn-rpg group text-lg px-8 py-6">
                  Explore Quests
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Separator */}
          <div className="container mx-auto px-4">
            <div className="separator-heart py-8">
              <span className="text-2xl">❤️</span>
            </div>
          </div>

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
    </div>
  )
}
