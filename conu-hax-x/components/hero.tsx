"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Swords, ChevronRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      {/* Floating pixel decorations */}
      <FloatingPixel className="absolute top-20 left-[15%] text-primary" delay={0} />
      <FloatingPixel className="absolute top-40 right-[20%] text-accent" delay={0.5} />
      <FloatingPixel className="absolute bottom-32 left-[25%] text-easy" delay={1} />
      <FloatingPixel className="absolute bottom-20 right-[15%] text-primary" delay={1.5} />

      <div className="container relative mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/50 bg-muted px-4 py-2 mb-8">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Season 10 Now Live!</span>
        </div>

        {/* Main title */}
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl lg:text-6xl text-primary mb-6 leading-tight">
          <span className="block">Level Up Your</span>
          <span className="block mt-2 text-foreground">Coding Skills</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
          Embark on an epic coding adventure! Solve algorithmic quests, 
          earn XP, unlock achievements, and climb the global leaderboard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-[family-name:var(--font-display)] text-sm px-8 py-6 border-b-4 border-primary/60 hover:border-primary/40 active:border-b-0 active:mt-1 transition-all"
          >
            <Swords className="h-5 w-5 mr-2" />
            Start Your Quest
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-muted-foreground/50 text-foreground hover:border-primary hover:text-primary px-8 py-6 bg-transparent"
          >
            View Challenges
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
          <StatBox value="500+" label="Quests" />
          <StatBox value="50K+" label="Warriors" />
          <StatBox value="1M+" label="Submissions" />
          <StatBox value="100+" label="Achievements" />
        </div>
      </div>
    </section>
  )
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border-2 border-border bg-card/50 p-4 backdrop-blur">
      <div className="font-[family-name:var(--font-display)] text-xl md:text-2xl text-primary">
        {value}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

function FloatingPixel({ className, delay }: { className: string; delay: number }) {
  return (
    <div 
      className={`${className} h-3 w-3 rotate-45 opacity-60`}
      style={{
        animation: `float 3s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    />
  )
}
