"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Swords, ChevronRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Floating pixel decorations */}
      <FloatingPixel className="absolute top-20 left-[15%]" color="#fde047" delay={0} />
      <FloatingPixel className="absolute top-40 right-[20%]" color="#22c55e" delay={0.5} />
      <FloatingPixel className="absolute bottom-32 left-[25%]" color="#f97316" delay={1} />
      <FloatingPixel className="absolute bottom-20 right-[15%]" color="#ef4444" delay={1.5} />

      <div className="container relative mx-auto px-4 text-center">
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 mb-8"
          style={{
            backgroundColor: 'rgba(30, 30, 46, 0.9)',
            border: '3px solid #fde047',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
          }}
        >
          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
          <span className="text-sm font-medium text-yellow-400">Season 10 Now Live!</span>
        </div>

        {/* Main title */}
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl lg:text-6xl mb-6 leading-tight">
          <span 
            className="block"
            style={{ 
              color: '#1e1e2e',
              textShadow: '3px 3px 0 #fde047, 6px 6px 0 rgba(0,0,0,0.2)',
            }}
          >
            Level Up Your
          </span>
          <span 
            className="block mt-2"
            style={{ 
              color: '#1e1e2e',
              textShadow: '3px 3px 0 #22c55e, 6px 6px 0 rgba(0,0,0,0.2)',
            }}
          >
            Coding Skills
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className="max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed font-medium"
          style={{ 
            color: '#1e3a5f',
            textShadow: '1px 1px 0 rgba(255,255,255,0.5)',
          }}
        >
          Embark on an epic coding adventure! Solve algorithmic quests, 
          earn XP, unlock achievements, and climb the global leaderboard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg"
            className="font-[family-name:var(--font-display)] text-sm px-8 py-6 transition-all hover:-translate-y-1"
            style={{
              backgroundColor: '#fde047',
              color: '#1e1e2e',
              border: '3px solid #1e1e2e',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.4)',
            }}
          >
            <Swords className="h-5 w-5 mr-2" />
            Start Your Quest
          </Button>
          <Button 
            size="lg"
            className="px-8 py-6 transition-all hover:-translate-y-1"
            style={{
              backgroundColor: 'rgba(30, 30, 46, 0.9)',
              color: 'white',
              border: '3px solid #1e1e2e',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            View Challenges
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
          <StatBox value="500+" label="Quests" color="#fde047" />
          <StatBox value="50K+" label="Warriors" color="#22c55e" />
          <StatBox value="1M+" label="Submissions" color="#f97316" />
          <StatBox value="100+" label="Achievements" color="#ef4444" />
        </div>
      </div>
    </section>
  )
}

function StatBox({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div 
      className="rounded-xl p-4 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(30, 30, 46, 0.85)',
        border: `3px solid ${color}`,
        boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
      }}
    >
      <div 
        className="font-[family-name:var(--font-display)] text-xl md:text-2xl"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-sm text-slate-300 mt-1">{label}</div>
    </div>
  )
}

function FloatingPixel({ className, color, delay }: { className: string; color: string; delay: number }) {
  return (
    <div 
      className={`${className} h-4 w-4 rotate-45 opacity-80`}
      style={{
        backgroundColor: color,
        animation: `float 3s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        boxShadow: `2px 2px 0 rgba(0,0,0,0.3)`,
      }}
    />
  )
}
