"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Lock, Play } from "lucide-react"
import Link from "next/link"

interface QuestStage {
  difficulty: 'easy' | 'medium' | 'hard'
  ticketId: string
  order: number
  unlocked: boolean
  completed?: boolean
  score?: number
}

interface QuestMapProps {
  questId: string
  questTitle: string
  stages: QuestStage[]
  userProgress?: {
    currentStage: number
    completedStages: number[]
    stageScores: { stageIndex: number; score: number }[]
  }
}

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
}

const difficultyLabels = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export function QuestMap({ questId, questTitle, stages, userProgress }: QuestMapProps) {
  const sortedStages = [...stages].sort((a, b) => a.order - b.order)

  const getStageStatus = (stageIndex: number) => {
    if (!userProgress) {
      return stageIndex === 0 ? 'unlocked' : 'locked'
    }

    if (userProgress.completedStages.includes(stageIndex)) {
      return 'completed'
    }

    if (stageIndex === userProgress.currentStage) {
      return 'current'
    }

    if (stageIndex < userProgress.currentStage) {
      return 'unlocked'
    }

    return 'locked'
  }

  const getStageScore = (stageIndex: number): number | undefined => {
    return userProgress?.stageScores.find(s => s.stageIndex === stageIndex)?.score
  }

  return (
    <div className="relative py-12">
      {/* Quest Title */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-display text-primary mb-2">{questTitle}</h2>
        <p className="text-muted-foreground">Complete all 3 stages to earn the badge!</p>
      </div>

      {/* Map Path */}
      <div className="relative max-w-4xl mx-auto">
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full -z-10" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {sortedStages.length > 1 && (
            <>
              {/* Line from stage 1 to 2 */}
              <line
                x1="16.67%"
                y1="50%"
                x2="50%"
                y2="50%"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                strokeDasharray={getStageStatus(0) === 'completed' ? '0' : '8 4'}
              />
              {/* Line from stage 2 to 3 */}
              <line
                x1="50%"
                y1="50%"
                x2="83.33%"
                y2="50%"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                strokeDasharray={getStageStatus(1) === 'completed' ? '0' : '8 4'}
              />
            </>
          )}
        </svg>

        {/* Stage Nodes */}
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {sortedStages.map((stage, index) => {
            const status = getStageStatus(index)
            const score = getStageScore(index)
            const isLocked = status === 'locked'
            const isCompleted = status === 'completed'
            const isCurrent = status === 'current'

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Stage Node */}
                <div className="relative mb-4">
                  {/* Glow effect for current stage */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                  )}
                  
                  {/* Node Circle */}
                  <div
                    className={`
                      relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4
                      flex items-center justify-center transition-all duration-300
                      ${isLocked ? 'border-muted bg-muted/20 opacity-50' : ''}
                      ${isCurrent ? 'border-primary bg-primary/10 scale-110' : ''}
                      ${isCompleted ? 'border-green-500 bg-green-500/20' : ''}
                      ${!isLocked && !isCurrent && !isCompleted ? 'border-border bg-card' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-10 h-10 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    ) : (
                      <Play className="w-8 h-8 text-primary" />
                    )}

                    {/* Stage Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold">
                      {stage.order}
                    </div>
                  </div>
                </div>

                {/* Stage Info Card */}
                <Card className="w-full max-w-xs p-4 text-center">
                  {/* Difficulty Badge */}
                  <Badge
                    variant="outline"
                    className={`mb-2 ${
                      stage.difficulty === 'easy'
                        ? 'border-green-500 text-green-500'
                        : stage.difficulty === 'medium'
                        ? 'border-yellow-500 text-yellow-500'
                        : 'border-red-500 text-red-500'
                    }`}
                  >
                    {difficultyLabels[stage.difficulty]}
                  </Badge>

                  {/* Stage Title */}
                  <h3 className="text-sm font-display text-foreground mb-2">
                    Stage {stage.order}
                  </h3>

                  {/* Score Display */}
                  {score !== undefined && (
                    <div className="text-xs text-muted-foreground mb-3">
                      Score: <span className="text-primary font-bold">{score}</span>/100
                    </div>
                  )}

                  {/* Action Button */}
                  {!isLocked && (
                    <Link
                      href={`/ticket/${
                        typeof stage.ticketId === 'string'
                          ? stage.ticketId
                          : (stage.ticketId as any)?._id?.toString?.() ??
                            (stage.ticketId as any)?.id?.toString?.() ??
                            ''
                      }`}
                    >
                      <Button
                        size="sm"
                        variant={isCompleted ? 'outline' : 'default'}
                        className="w-full"
                      >
                        {isCompleted ? 'Review' : isCurrent ? 'Continue' : 'Start'}
                      </Button>
                    </Link>
                  )}

                  {isLocked && (
                    <Button size="sm" variant="ghost" disabled className="w-full">
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </Button>
                  )}
                </Card>
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-muted-foreground">Quest Progress</span>
            <span className="text-primary font-bold">
              {userProgress?.completedStages.length || 0} / 3 Stages
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{
                width: `${((userProgress?.completedStages.length || 0) / 3) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
