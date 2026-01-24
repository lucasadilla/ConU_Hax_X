"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, Target } from "lucide-react"
import Link from "next/link"

interface QuestCardProps {
  quest: {
    _id: string
    title: string
    description: string
    theme: 'regression' | 'feature-creation' | 'debugging'
    iconEmoji: string
    estimatedTime: number
    badgePoints: number
    completionRate?: number
  }
  userProgress?: {
    currentStage: number
    completedStages: number[]
    isCompleted: boolean
  }
}

const themeStyles = {
  regression: {
    gradient: 'from-red-500/20 to-orange-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-400 border-red-500',
  },
  'feature-creation': {
    gradient: 'from-green-500/20 to-teal-500/20',
    border: 'border-green-500/50',
    text: 'text-green-400',
    badge: 'bg-green-500/20 text-green-400 border-green-500',
  },
  debugging: {
    gradient: 'from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/50',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
  },
}

const themeLabels = {
  regression: 'Regression & Tech Debt',
  'feature-creation': 'Feature Creation',
  debugging: 'Debugging',
}

export function QuestCard({ quest, userProgress }: QuestCardProps) {
  const progress = userProgress ? (userProgress.completedStages.length / 3) * 100 : 0
  const style = themeStyles[quest.theme]
  const isStarted = userProgress && userProgress.completedStages.length > 0
  const isCompleted = userProgress?.isCompleted

  return (
    <Card className={`relative overflow-hidden border-2 ${style.border} hover:scale-105 transition-transform duration-200`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-50`} />
      
      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{quest.iconEmoji}</span>
            <div>
              <h3 className="font-display text-lg text-foreground mb-1">
                {quest.title}
              </h3>
              <Badge variant="outline" className={style.badge}>
                {themeLabels[quest.theme]}
              </Badge>
            </div>
          </div>
          
          {isCompleted && (
            <Badge className="bg-primary text-primary-foreground">
              <Trophy className="w-3 h-3 mr-1" />
              Complete
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {quest.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{quest.estimatedTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>3 Stages</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            <span>{quest.badgePoints} pts</span>
          </div>
        </div>

        {/* Progress */}
        {isStarted && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className={style.text}>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <Link href={`/quest/${quest._id}`} className="block">
          <Button className="w-full" variant={isCompleted ? 'outline' : 'default'}>
            {isCompleted ? 'Review Quest' : isStarted ? 'Continue Quest' : 'Start Quest'}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
