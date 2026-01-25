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
            <h2 
              className="font-[family-name:var(--font-display)] text-2xl md:text-3xl mb-4"
              style={{ 
                color: '#1e1e2e',
                textShadow: '2px 2px 0 #f97316',
              }}
            >
              Daily Quest
            </h2>
            <p className="text-slate-700 font-medium">
              Complete a challenge every day to maintain your streak and earn bonus XP!
            </p>
          </div>

          {/* Streak Card */}
          <div 
            className="rounded-2xl p-6 md:p-8"
            style={{
              backgroundColor: 'rgba(30, 30, 46, 0.9)',
              border: '3px solid #1e1e2e',
              boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
            }}
          >
            {/* Current Streak */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(249, 115, 22, 0.2)',
                      border: '4px solid #f97316',
                    }}
                  >
                    <Flame className="h-10 w-10 text-orange-500" />
                  </div>
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-[family-name:var(--font-display)] text-xs"
                    style={{
                      backgroundColor: '#fde047',
                      color: '#1e1e2e',
                      border: '2px solid #1e1e2e',
                    }}
                  >
                    {currentStreak}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{currentStreak} Day Streak!</div>
                  <div className="text-slate-400">Keep it up! 3 more days for bonus XP</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div 
                  className="text-center px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(253, 224, 71, 0.1)',
                    border: '2px solid #fde047',
                  }}
                >
                  <div className="text-sm text-slate-400">Weekly XP</div>
                  <div className="font-[family-name:var(--font-display)] text-lg text-yellow-400">{totalXP} XP</div>
                </div>
                <Button 
                  className="font-medium"
                  style={{
                    backgroundColor: '#fde047',
                    color: '#1e1e2e',
                    border: '2px solid #1e1e2e',
                    boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {"Today's Quest"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Week Progress */}
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {weekDays.map((day) => (
                <DayCard key={day.day} {...day} />
              ))}
            </div>

            {/* Weekly Bonus */}
            <div 
              className="mt-8 p-4 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(253, 224, 71, 0.2), rgba(249, 115, 22, 0.2))',
                border: '2px solid #fde047',
              }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Gift className="h-8 w-8 text-yellow-400" />
                  <div>
                    <div className="font-medium text-white">Weekly Bonus Unlocked!</div>
                    <div className="text-sm text-slate-400">Complete all 7 days for 50 bonus XP</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-32 h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${(currentStreak / 7) * 100}%`,
                        background: 'linear-gradient(90deg, #fde047, #f97316)',
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-yellow-400">{currentStreak}/7</span>
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
  const getBorderColor = () => {
    if (completed) return '#22c55e'
    if (current) return '#fde047'
    return '#3f3f5a'
  }

  const getBgColor = () => {
    if (completed) return 'rgba(34, 197, 94, 0.15)'
    if (current) return 'rgba(253, 224, 71, 0.15)'
    return 'rgba(63, 63, 90, 0.3)'
  }

  return (
    <div 
      className={`relative p-3 md:p-4 rounded-xl text-center transition-all ${current ? 'animate-pulse' : ''}`}
      style={{
        backgroundColor: getBgColor(),
        border: `2px solid ${getBorderColor()}`,
      }}
    >
      <div 
        className="text-xs font-medium mb-2"
        style={{ color: completed ? '#22c55e' : current ? '#fde047' : '#94a3b8' }}
      >
        {day}
      </div>
      
      {completed ? (
        <div 
          className="w-8 h-8 mx-auto rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '2px solid #22c55e' }}
        >
          <Zap className="h-4 w-4 text-green-500" />
        </div>
      ) : current ? (
        <div 
          className="w-8 h-8 mx-auto rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(253, 224, 71, 0.2)', border: '2px solid #fde047' }}
        >
          <Flame className="h-4 w-4 text-yellow-400" />
        </div>
      ) : (
        <div 
          className="w-8 h-8 mx-auto rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(63, 63, 90, 0.5)', border: '2px solid #3f3f5a' }}
        >
          <Gift className="h-4 w-4 text-slate-500" />
        </div>
      )}

      <div 
        className="text-xs mt-2 font-medium"
        style={{ color: completed ? '#22c55e' : current ? '#fde047' : '#94a3b8' }}
      >
        +{reward}
      </div>
    </div>
  )
}
