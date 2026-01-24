"use client"

import { Card } from "@/components/ui/card"
import { Check, X, Minus } from "lucide-react"

interface StreakCalendarProps {
  activityData: {
    date: string // YYYY-MM-DD
    hasActivity: boolean
    count?: number
  }[]
}

export function StreakCalendar({ activityData }: StreakCalendarProps) {
  // Get last 7 weeks (49 days) for display
  const today = new Date()
  const days = []
  
  for (let i = 48; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const activity = activityData.find(a => a.date === dateStr)
    days.push({
      date,
      dateStr,
      hasActivity: activity?.hasActivity || false,
      count: activity?.count || 0,
      isToday: i === 0,
    })
  }

  // Group by weeks
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card className="p-6">
      <h3 className="text-lg font-display text-primary mb-4">Activity Calendar</h3>
      
      {/* Day labels */}
      <div className="flex gap-1 mb-2">
        <div className="w-8" /> {/* Spacer for week labels */}
        {dayLabels.map((label, i) => (
          <div key={i} className="flex-1 text-xs text-muted-foreground text-center">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            <div className="w-8 flex items-center justify-center text-xs text-muted-foreground">
              W{weekIndex + 1}
            </div>
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`
                  flex-1 aspect-square rounded border-2 flex items-center justify-center
                  transition-all hover:scale-110 cursor-pointer
                  ${day.isToday ? 'border-primary bg-primary/20' : ''}
                  ${day.hasActivity && !day.isToday ? 'border-green-500 bg-green-500/20' : ''}
                  ${!day.hasActivity && !day.isToday ? 'border-border bg-muted/20' : ''}
                `}
                title={`${day.dateStr}${day.hasActivity ? ` - ${day.count} submission(s)` : ''}`}
              >
                {day.hasActivity && (
                  <Check className="w-3 h-3 text-green-500" />
                )}
                {!day.hasActivity && !day.isToday && (
                  <Minus className="w-3 h-3 text-muted-foreground opacity-30" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-green-500 bg-green-500/20" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-primary bg-primary/20" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-border bg-muted/20" />
          <span>Inactive</span>
        </div>
      </div>
    </Card>
  )
}
