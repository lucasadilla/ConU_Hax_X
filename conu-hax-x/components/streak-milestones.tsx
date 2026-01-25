"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Lock } from "lucide-react"

interface Milestone {
  days: number
  badgeName: string
  badgeDescription: string
  points: number
  color: string
}

interface StreakMilestonesProps {
  milestones: Milestone[]
  currentStreak: number
  earnedBadges?: string[] // Badge names that were earned
  backgroundColor?: string
}

export function StreakMilestones({ 
  milestones, 
  currentStreak, 
  earnedBadges = [],
  backgroundColor = 'rgba(253, 224, 71, 0.1)'
}: StreakMilestonesProps) {
  return (
    <Card 
      className="p-6"
      style={{
        backgroundColor,
        border: '3px solid #1e1e2e',
        boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
      }}
    >
      <h3 
        className="text-lg font-display mb-4"
        style={{ 
          color: '#fde047',
          textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
        }}
      >
        Streak Milestones
      </h3>
      
      <div className="space-y-3">
        {milestones.map((milestone, index) => {
          const isCompleted = currentStreak >= milestone.days
          const isNext = !isCompleted && (index === 0 || currentStreak >= milestones[index - 1].days)
          const isLocked = !isCompleted && !isNext

          return (
            <div
              key={milestone.days}
              className="p-4 rounded-lg transition-all"
              style={{
                backgroundColor: isCompleted 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : isNext 
                    ? 'rgba(253, 224, 71, 0.15)'
                    : 'rgba(30, 30, 46, 0.3)',
                border: isCompleted
                  ? '2px solid #22c55e'
                  : isNext
                    ? '2px solid #fde047'
                    : '2px solid #3f3f5a',
                opacity: isLocked ? 0.6 : 1,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isCompleted
                        ? 'rgba(34, 197, 94, 0.2)'
                        : isNext
                          ? 'rgba(253, 224, 71, 0.2)'
                          : 'rgba(63, 63, 90, 0.5)',
                      border: isCompleted
                        ? '2px solid #22c55e'
                        : isNext
                          ? '2px solid #fde047'
                          : '2px solid #3f3f5a',
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : (
                      <Flame className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm">
                        {milestone.badgeName}
                      </h4>
                      {isCompleted && (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{
                            borderColor: '#22c55e',
                            color: '#22c55e',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          }}
                        >
                          Earned
                        </Badge>
                      )}
                      {isNext && (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{
                            borderColor: '#fde047',
                            color: '#fde047',
                            backgroundColor: 'rgba(253, 224, 71, 0.1)',
                          }}
                        >
                          Next
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      {milestone.badgeDescription}
                    </p>
                    
                    {/* Progress bar for next milestone */}
                    {isNext && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            {currentStreak} / {milestone.days} days
                          </span>
                          <span className="text-yellow-400 font-bold">
                            {Math.round((currentStreak / milestone.days) * 100)}%
                          </span>
                        </div>
                        <div 
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <div
                            className="h-full transition-all duration-500"
                            style={{ 
                              width: `${(currentStreak / milestone.days) * 100}%`,
                              backgroundColor: '#fde047',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-lg font-bold text-yellow-400">+{milestone.points}</div>
                  <div className="text-xs text-slate-500">points</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div 
        className="mt-6 pt-6"
        style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Milestones Completed</span>
          <span className="font-bold text-yellow-400">
            {milestones.filter(m => m.days <= currentStreak).length} / {milestones.length}
          </span>
        </div>
      </div>
    </Card>
  )
}

function Flame({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2c1.5 2.5 3 5.5 3 8.5 0 3-2 5.5-5 5.5s-5-2.5-5-5.5c0-3 1.5-6 3-8.5-.5 3 1 5 3 5 2 0 3.5-2 3-5z" />
    </svg>
  )
}
