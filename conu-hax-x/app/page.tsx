import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
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
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        
        {/* Quest System Highlight */}
        <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-yellow-500/20 text-yellow-900 border-yellow-500">
              🗺️ New Feature
            </Badge>
            <h2 
              className="font-display text-3xl md:text-4xl mb-4"
              style={{ 
                color: '#1e1e2e',
                textShadow: '2px 2px 0 #fde047',
              }}
            >
              Quest System
            </h2>
            <p className="text-slate-700 max-w-2xl mx-auto font-medium">
              Complete progressive challenges to earn exclusive badges. Each quest has 3 stages
              that build upon each other, simulating real-world development scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Theme Cards */}
            <Card 
              className="p-6 hover:scale-[1.02] transition-all duration-300 hover:-translate-y-1"
              style={{ 
                backgroundColor: 'rgba(30, 30, 46, 0.9)',
                border: '3px solid #1e1e2e',
                boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
              }}
            >
              <div className="text-4xl mb-3">🐛</div>
              <h3 className="font-display text-lg text-yellow-400 mb-2">
                Regression & Tech Debt
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Fix bugs, refactor code, and eliminate technical debt in Next.js apps
              </p>
              <Badge variant="outline" className="border-red-500 text-red-400 bg-red-500/20">
                3 Quests
              </Badge>
            </Card>

            <Card 
              className="p-6 hover:scale-[1.02] transition-all duration-300 hover:-translate-y-1"
              style={{ 
                backgroundColor: 'rgba(30, 30, 46, 0.9)',
                border: '3px solid #1e1e2e',
                boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
              }}
            >
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-display text-lg text-yellow-400 mb-2">
                Feature Creation
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Build new features from scratch using TypeScript and MongoDB
              </p>
              <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500/20">
                3 Quests
              </Badge>
            </Card>

            <Card 
              className="p-6 hover:scale-[1.02] transition-all duration-300 hover:-translate-y-1"
              style={{ 
                backgroundColor: 'rgba(30, 30, 46, 0.9)',
                border: '3px solid #1e1e2e',
                boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
              }}
            >
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-display text-lg text-yellow-400 mb-2">
                Debugging & Problem Solving
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Hunt down bugs and solve complex issues in production code
              </p>
              <Badge variant="outline" className="border-orange-500 text-orange-400 bg-orange-500/20">
                3 Quests
              </Badge>
            </Card>
          </div>

          {/* Quest Features */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto p-6 rounded-xl"
            style={{ 
              backgroundColor: 'rgba(30, 30, 46, 0.85)',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
              border: '3px solid #1e1e2e',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500">
                <Map className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="font-bold text-white">Progressive Map</div>
                <div className="text-xs text-slate-400">Easy → Medium → Hard</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="font-bold text-white">Exclusive Badges</div>
                <div className="text-xs text-slate-400">300 points per quest</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="font-bold text-white">Real Scenarios</div>
                <div className="text-xs text-slate-400">Next.js + MongoDB</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/quests">
              <Button 
                size="lg" 
                className="group text-lg px-8 py-6 font-bold"
                style={{
                  backgroundColor: '#fde047',
                  color: '#1e1e2e',
                  boxShadow: '4px 4px 0 rgba(0,0,0,0.4)',
                  border: '3px solid #1e1e2e',
                }}
              >
                Explore Quests
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Separator */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 py-8">
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent rounded" />
            <svg viewBox="0 0 32 32" className="w-8 h-8" style={{ imageRendering: 'pixelated' }}>
              {/* Pixelated Crown */}
              <rect x="8" y="12" width="4" height="4" fill="#fde047"/>
              <rect x="12" y="16" width="4" height="4" fill="#fde047"/>
              <rect x="16" y="12" width="4" height="4" fill="#fde047"/>
              <rect x="20" y="16" width="4" height="4" fill="#fde047"/>
              <rect x="8" y="16" width="4" height="4" fill="#fde047"/>
              <rect x="20" y="16" width="4" height="4" fill="#fde047"/>
              <rect x="6" y="20" width="20" height="8" fill="#fde047"/>
              <rect x="12" y="8" width="4" height="4" fill="#fde047"/>
              <rect x="16" y="8" width="4" height="4" fill="#fde047"/>
              {/* Jewels */}
              <rect x="10" y="22" width="2" height="2" fill="#ef4444"/>
              <rect x="15" y="22" width="2" height="2" fill="#22c55e"/>
              <rect x="20" y="22" width="2" height="2" fill="#3b82f6"/>
            </svg>
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent rounded" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-12">
            <DailyStreak />
            <Leaderboard />
          </div>
        </div>
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
