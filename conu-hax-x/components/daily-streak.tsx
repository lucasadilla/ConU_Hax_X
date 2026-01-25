"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Flame, Gift, Zap, Calendar, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StreakInfo } from "@/services/streakService"

interface DailyStreakProps {
  streak: StreakInfo | null
}

export function DailyStreak({ streak }: DailyStreakProps) {
  const router = useRouter()
  const [isLoadingQuest, setIsLoadingQuest] = useState(false)
  const [questError, setQuestError] = useState<string | null>(null)

  const handleTodaysQuest = async () => {
    try {
      setIsLoadingQuest(true)
      setQuestError(null)

      const response = await fetch("/api/quests/random", { cache: "no-store" })
      if (!response.ok) {
        throw new Error("No quests available")
      }
      const data = await response.json()
      if (!data?.id) {
        throw new Error("No quests available")
      }

      router.push(`/quest/${data.id}`)
    } catch (error) {
      setQuestError("No quests available yet. Try again soon.")
    } finally {
      setIsLoadingQuest(false)
    }
  }

  // Default values if no streak data provided (not logged in or error)
  const currentStreak = streak?.currentStreak || 0
  const streakStatus = streak?.streakStatus || 'new'

  // Calculate week days dynamically based on current date
  const today = new Date()
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Create array of last 7 days ending with today (or upcoming days if we want a static Mon-Sun week, 
  // but "last 7 days" is usually better for personal streaks. 
  // However, the original design looked like a fixed Mon-Sun week. 
  // Let's stick to a rolling 7-day window ending on Today for immediate feedback, 
  // OR a standard Mon-Sun week. 
  // Let's do a standard Mon-Sun week for consistency with the UI.

  const currentDayOfWeek = today.getDay() // 0 = Sun, 1 = Mon, ..., 6 = Sat
  // Adjust to make Mon = 0, Sun = 6
  const adjustedDayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1

  // Get start of week (Monday)
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - adjustedDayIndex)
  startOfWeek.setHours(0, 0, 0, 0)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)

    const isToday = date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    const isPast = date < today
    let completed = false

    // Determine if this day was completed based on streak history
    // Since we don't have a full daily log, we infer it:
    // If we have an active streak of N days, and the last submission was Today,
    // then Today, Yesterday, ..., (Today - N + 1) are completed.

    if (streak && streak.lastSubmissionDate) {
      const lastSub = new Date(streak.lastSubmissionDate)
      lastSub.setHours(0, 0, 0, 0)

      // Calculate days difference between this date and last submission
      const diffTime = lastSub.getTime() - date.getTime()
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24))

      // If date is on or before last submission, and within current streak count
      if (diffDays >= 0 && diffDays < streak.currentStreak) {
        completed = true
      }
    }

    return {
      day: dayNames[date.getDay()],
      completed,
      reward: 10, // Placeholder reward
      current: isToday,
      date: date
    }
  })

  // Calculate total XP for display (just visual for now)
  const totalXP = weekDays.filter(d => d.completed).reduce((acc, d) => acc + d.reward, 0)

  return (
    <section id="streak" className="py-16" style={{ scrollMarginTop: '100px' }}>
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
                    <Flame className={`h-10 w-10 ${currentStreak > 0 ? "text-orange-500" : "text-slate-500"}`} />
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
                  <div className="text-slate-400">
                    {currentStreak === 0
                      ? "Start your journey today!"
                      : streakStatus === 'broken'
                        ? "Streak broken! Start again today."
                        : "Keep it up! Consistency is key."}
                  </div>
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
                  onClick={handleTodaysQuest}
                  disabled={isLoadingQuest}
                  style={{
                    backgroundColor: '#fde047',
                    color: '#1e1e2e',
                    border: '2px solid #1e1e2e',
                    boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {isLoadingQuest ? "Finding Quest..." : "Today's Quest"}
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
                        width: `${Math.min((currentStreak / 7) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #fde047, #f97316)',
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-yellow-400">{Math.min(currentStreak, 7)}/7</span>
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
