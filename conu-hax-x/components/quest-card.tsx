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
    borderColor: '#ef4444',
    text: 'text-red-400',
    badgeBg: 'rgba(239, 68, 68, 0.2)',
    badgeText: '#f87171',
  },
  'feature-creation': {
    borderColor: '#22c55e',
    text: 'text-green-400',
    badgeBg: 'rgba(34, 197, 94, 0.2)',
    badgeText: '#4ade80',
  },
  debugging: {
    borderColor: '#f97316',
    text: 'text-orange-400',
    badgeBg: 'rgba(249, 115, 22, 0.2)',
    badgeText: '#fb923c',
  },
}

const themeLabels = {
  regression: 'Bug Slayer',
  'feature-creation': 'Feature Builder',
  debugging: 'Debug Master',
}

export function QuestCard({ quest, userProgress }: QuestCardProps) {
  const progress = userProgress ? (userProgress.completedStages.length / 3) * 100 : 0
  const style = themeStyles[quest.theme]
  const isStarted = userProgress && userProgress.completedStages.length > 0
  const isCompleted = userProgress?.isCompleted

  return (
    <Card 
      className="relative overflow-hidden hover:scale-105 hover:-translate-y-1 transition-all duration-200"
      style={{
        backgroundColor: 'rgba(30, 30, 46, 0.9)',
        border: `3px solid ${style.borderColor}`,
        boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
      }}
    >
      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{quest.iconEmoji}</span>
            <div>
              <h3 className="font-display text-lg text-white mb-1">
                {quest.title}
              </h3>
              <Badge 
                variant="outline" 
                style={{
                  backgroundColor: style.badgeBg,
                  color: style.badgeText,
                  borderColor: style.borderColor,
                }}
              >
                {themeLabels[quest.theme]}
              </Badge>
            </div>
          </div>
          
          {isCompleted && (
            <Badge 
              style={{
                backgroundColor: '#fde047',
                color: '#1e1e2e',
                border: '2px solid #1e1e2e',
              }}
            >
              <Trophy className="w-3 h-3 mr-1" />
              Complete
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {quest.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
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
              <span className="text-slate-500">Progress</span>
              <span className={style.text}>{Math.round(progress)}%</span>
            </div>
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: style.borderColor,
                }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link href={`/quest/${quest._id}`} className="block">
          <Button 
            className="w-full font-bold transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: isCompleted ? 'transparent' : '#fde047',
              color: isCompleted ? '#fde047' : '#1e1e2e',
              border: `2px solid ${isCompleted ? '#fde047' : '#1e1e2e'}`,
              boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
            }}
          >
            {isCompleted ? 'Review Quest' : isStarted ? 'Continue Quest' : 'Start Quest'}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
