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
}

export function StreakMilestones({ milestones, currentStreak, earnedBadges = [] }: StreakMilestonesProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-display text-primary mb-4">Streak Milestones</h3>
      
      <div className="space-y-3">
        {milestones.map((milestone, index) => {
          const isCompleted = currentStreak >= milestone.days
          const isNext = !isCompleted && (index === 0 || currentStreak >= milestones[index - 1].days)
          const isLocked = !isCompleted && !isNext

          return (
            <div
              key={milestone.days}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${isCompleted ? 'border-green-500 bg-green-500/10' : ''}
                ${isNext ? 'border-primary bg-primary/10' : ''}
                ${isLocked ? 'border-border bg-muted/20 opacity-60' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Icon */}
                  <div
                    className={`
                      w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${isCompleted ? 'border-green-500 bg-green-500/20' : ''}
                      ${isNext ? 'border-primary bg-primary/20' : ''}
                      ${isLocked ? 'border-border bg-muted' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Flame className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-foreground text-sm">
                        {milestone.badgeName}
                      </h4>
                      {isCompleted && (
                        <Badge variant="outline" className="border-green-500 text-green-500 text-xs">
                          Earned
                        </Badge>
                      )}
                      {isNext && (
                        <Badge variant="outline" className="border-primary text-primary text-xs">
                          Next
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {milestone.badgeDescription}
                    </p>
                    
                    {/* Progress bar for next milestone */}
                    {isNext && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {currentStreak} / {milestone.days} days
                          </span>
                          <span className="text-primary font-bold">
                            {Math.round((currentStreak / milestone.days) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                            style={{ width: `${(currentStreak / milestone.days) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-lg font-bold text-primary">+{milestone.points}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Milestones Completed</span>
          <span className="font-bold text-primary">
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
