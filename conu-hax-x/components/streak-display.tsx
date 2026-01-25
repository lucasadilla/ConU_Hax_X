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
    <Card 
      className="p-6"
      style={{
        backgroundColor: 'rgba(253, 224, 71, 0.1)',
        border: '3px solid #1e1e2e',
        boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
      }}
    >
      {/* Warning Banner */}
      {needsWarning && (
        <div 
          className="mb-4 p-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid #ef4444',
          }}
        >
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
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                border: '4px solid #f97316',
              }}
            >
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <div 
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
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
            <div 
              className="text-2xl font-display"
              style={{
                color: '#fde047',
                textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
              }}
            >
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
        <div 
          className="p-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(30, 30, 46, 0.5)',
            border: '2px solid #1e1e2e',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Longest Streak</span>
          </div>
          <div className="text-xl font-bold text-white">{longestStreak} days</div>
        </div>
        <div 
          className="p-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(30, 30, 46, 0.5)',
            border: '2px solid #1e1e2e',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Total Days</span>
          </div>
          <div className="text-xl font-bold text-white">{totalDaysActive} days</div>
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <div 
          className="p-4 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(253, 224, 71, 0.2), rgba(249, 115, 22, 0.2))',
            border: '2px solid #fde047',
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="font-bold text-white text-sm">Next Milestone</div>
                <div className="text-xs text-slate-400">{nextMilestone.badgeName}</div>
              </div>
            </div>
            <Badge 
              style={{
                backgroundColor: 'rgba(253, 224, 71, 0.2)',
                color: '#fde047',
                border: '1px solid #fde047',
              }}
            >
              +{nextMilestone.points} pts
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Progress</span>
              <span className="font-bold text-yellow-400">
                {currentStreak} / {nextMilestone.days} days
              </span>
            </div>
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressToNextMilestone}%`,
                  backgroundColor: '#fde047',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Completed all milestones */}
      {!nextMilestone && currentStreak > 0 && (
        <div 
          className="p-4 rounded-lg text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(253, 224, 71, 0.2), rgba(251, 191, 36, 0.2))',
            border: '2px solid #fde047',
          }}
        >
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-bold text-white">All Milestones Completed!</div>
          <div className="text-xs text-slate-400">You're a true coding champion!</div>
        </div>
      )}
    </Card>
  )
}
