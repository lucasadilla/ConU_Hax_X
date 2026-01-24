"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, TrendingUp, Calendar, Award } from "lucide-react"

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  totalDaysActive: number
  nextMilestone?: {
    days: number
    badgeName: string
    points: number
  }
  needsWarning?: boolean
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  totalDaysActive,
  nextMilestone,
  needsWarning = false,
}: StreakDisplayProps) {
  const progressToNextMilestone = nextMilestone
    ? (currentStreak / nextMilestone.days) * 100
    : 100

  const getStreakLevel = (days: number) => {
    if (days >= 100) return { emoji: '👑', label: 'Legendary', color: 'text-yellow-400' }
    if (days >= 60) return { emoji: '💎', label: 'Diamond', color: 'text-purple-400' }
    if (days >= 30) return { emoji: '🏆', label: 'Master', color: 'text-blue-400' }
    if (days >= 14) return { emoji: '💪', label: 'Titan', color: 'text-green-400' }
    if (days >= 7) return { emoji: '⚡', label: 'Warrior', color: 'text-orange-400' }
    if (days >= 3) return { emoji: '🔥', label: 'Starter', color: 'text-red-400' }
    return { emoji: '🌱', label: 'Beginner', color: 'text-gray-400' }
  }

  const level = getStreakLevel(currentStreak)

  return (
    <Card className="p-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Warning Banner */}
      {needsWarning && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border-2 border-red-500/50">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <Flame className="w-4 h-4 animate-pulse" />
            <span className="font-bold">Streak at risk!</span>
            <span>Submit a solution today to keep your {currentStreak}-day streak!</span>
          </div>
        </div>
      )}

      {/* Main Streak Display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center">
              <Flame className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
              {currentStreak}
            </div>
          </div>
          <div>
            <div className="text-2xl font-display text-primary">
              {currentStreak} Day Streak
            </div>
            <div className={`text-sm font-bold ${level.color}`}>
              {level.emoji} {level.label} Level
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Longest Streak</span>
          </div>
          <div className="text-xl font-bold text-foreground">{longestStreak} days</div>
        </div>
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Total Days</span>
          </div>
          <div className="text-xl font-bold text-foreground">{totalDaysActive} days</div>
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <div>
                <div className="font-bold text-foreground text-sm">Next Milestone</div>
                <div className="text-xs text-muted-foreground">{nextMilestone.badgeName}</div>
              </div>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              +{nextMilestone.points} pts
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold text-primary">
                {currentStreak} / {nextMilestone.days} days
              </span>
            </div>
            <Progress value={progressToNextMilestone} className="h-2" />
          </div>
        </div>
      )}

      {/* Completed all milestones */}
      {!nextMilestone && currentStreak > 0 && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 text-center">
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-bold text-foreground">All Milestones Completed!</div>
          <div className="text-xs text-muted-foreground">You're a true coding champion!</div>
        </div>
      )}
    </Card>
  )
}
