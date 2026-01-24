"use client"

import { Flame, Gift, Zap, Calendar, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const weekDays = [
  { day: "Mon", completed: true, reward: 10 },
  { day: "Tue", completed: true, reward: 10 },
  { day: "Wed", completed: true, reward: 10 },
  { day: "Thu", completed: true, reward: 10 },
  { day: "Fri", completed: false, reward: 10, current: true },
  { day: "Sat", completed: false, reward: 15 },
  { day: "Sun", completed: false, reward: 25 },
]

export function DailyStreak() {
  const currentStreak = 4
  const totalXP = weekDays.filter(d => d.completed).reduce((acc, d) => acc + d.reward, 0)

  return (
    <section id="streak" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-primary mb-4">
              Daily Quest
            </h2>
            <p className="text-muted-foreground">
              Complete a challenge every day to maintain your streak and earn bonus XP!
            </p>
          </div>

          {/* Streak Card */}
          <div className="rounded-2xl border-2 border-border bg-card p-6 md:p-8">
            {/* Current Streak */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center">
                    <Flame className="h-10 w-10 text-accent" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-[family-name:var(--font-display)] text-xs text-primary-foreground">
                    {currentStreak}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{currentStreak} Day Streak!</div>
                  <div className="text-muted-foreground">Keep it up! 3 more days for bonus XP</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 rounded-lg bg-muted border-2 border-border">
                  <div className="text-sm text-muted-foreground">Weekly XP</div>
                  <div className="font-[family-name:var(--font-display)] text-lg text-primary">{totalXP} XP</div>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                  <Calendar className="h-4 w-4 mr-2" />
                  {"Today's Quest"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Week Progress */}
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {weekDays.map((day, index) => (
                <DayCard key={day.day} {...day} />
              ))}
            </div>

            {/* Weekly Bonus */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Gift className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Weekly Bonus Unlocked!</div>
                    <div className="text-sm text-muted-foreground">Complete all 7 days for 50 bonus XP</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-3 rounded-full bg-muted border border-border overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${(currentStreak / 7) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-primary">{currentStreak}/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DayCard({ 
  day, 
  completed, 
  reward, 
  current = false 
}: { 
  day: string
  completed: boolean
  reward: number
  current?: boolean
}) {
  return (
    <div 
      className={`relative p-3 md:p-4 rounded-xl border-2 text-center transition-all ${
        completed 
          ? "border-easy bg-easy/10" 
          : current 
            ? "border-primary bg-primary/10 animate-pulse" 
            : "border-border bg-muted/30"
      }`}
    >
      <div className={`text-xs font-medium mb-2 ${completed ? "text-easy" : current ? "text-primary" : "text-muted-foreground"}`}>
        {day}
      </div>
      
      {completed ? (
        <div className="w-8 h-8 mx-auto rounded-full bg-easy/20 border-2 border-easy flex items-center justify-center">
          <Zap className="h-4 w-4 text-easy" />
        </div>
      ) : current ? (
        <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
          <Flame className="h-4 w-4 text-primary" />
        </div>
      ) : (
        <div className="w-8 h-8 mx-auto rounded-full bg-muted border-2 border-border flex items-center justify-center">
          <Gift className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      <div className={`text-xs mt-2 font-medium ${completed ? "text-easy" : current ? "text-primary" : "text-muted-foreground"}`}>
        +{reward}
      </div>
    </div>
  )
}
