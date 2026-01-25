"use client"

import { Trophy, Medal, Crown, TrendingUp, Flame, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { LeaderboardEntry } from "@/services/leaderboardService"

type LeaderboardUIEntry = LeaderboardEntry & { change: "up" | "down" | "same" }

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUIEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard?category=xp&limit=10')
        const data = await res.json()

        if (data.success && data.leaderboard) {
          // Add dummy 'change' field for UI compatibility since backend doesn't track historic rank yet
          const uiData = data.leaderboard.map((entry: LeaderboardEntry) => ({
            ...entry,
            change: "same" as const // Default to "same" for now
          }))
          setLeaderboardData(uiData)
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <section id="leaderboard" className="py-16">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        </div>
      </section>
    )
  }

  // If no data or not enough for podium, fallback or empty state
  if (leaderboardData.length < 3) {
    // return null or minimal state. For now let's just show what we have in a list if < 3
  }

  return (
    <section id="leaderboard" className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 mb-4"
            style={{
              backgroundColor: 'rgba(30, 30, 46, 0.9)',
              border: '3px solid #fde047',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Season 10 Rankings</span>
          </div>
          <h2
            className="font-[family-name:var(--font-display)] text-2xl md:text-3xl mb-4"
            style={{
              color: '#1e1e2e',
              textShadow: '2px 2px 0 #fde047',
            }}
          >
            Hall of Champions
          </h2>
          <p className="text-slate-700 font-medium max-w-md mx-auto">
            The mightiest warriors who have conquered the most quests
          </p>
        </div>

        {/* Top 3 Podium - Only show if we have enough data */}
        {leaderboardData.length >= 3 && (
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-12">
            {/* Second Place */}
            <PodiumCard entry={leaderboardData[1]} position={2} />
            {/* First Place */}
            <PodiumCard entry={leaderboardData[0]} position={1} />
            {/* Third Place */}
            <PodiumCard entry={leaderboardData[2]} position={3} />
          </div>
        )}

        {/* Leaderboard Table */}
        <div
          className="max-w-3xl mx-auto rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'rgba(30, 30, 46, 0.9)',
            border: '3px solid #1e1e2e',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-slate-400"
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderBottom: '2px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Warrior</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-center">Streak</div>
            <div className="col-span-2 text-right">XP</div>
          </div>

          <div className="divide-y divide-white/10">
            {leaderboardData.slice(3).map((entry) => (
              <LeaderboardRow key={entry.rank} entry={entry} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PodiumCard({ entry, position }: { entry: LeaderboardUIEntry; position: 1 | 2 | 3 }) {
  const positionStyles = {
    1: {
      height: "h-48 md:h-56",
      borderColor: "#fde047",
      iconColor: "#fde047",
      icon: Crown,
    },
    2: {
      height: "h-40 md:h-44",
      borderColor: "#94a3b8",
      iconColor: "#94a3b8",
      icon: Medal,
    },
    3: {
      height: "h-36 md:h-40",
      borderColor: "#f97316",
      iconColor: "#f97316",
      icon: Medal,
    },
  }

  const style = positionStyles[position]
  const Icon = style.icon

  return (
    <div
      className={`w-full md:w-52 ${style.height} rounded-xl p-4 flex flex-col items-center justify-between relative overflow-hidden`}
      style={{
        backgroundColor: 'rgba(30, 30, 46, 0.9)',
        border: `3px solid ${style.borderColor}`,
        boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
      }}
    >
      {/* Position Badge */}
      <div className="absolute -top-1 -right-1 w-12 h-12 flex items-center justify-center">
        <Icon className="h-8 w-8" style={{ color: style.iconColor }} />
      </div>

      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold uppercase"
        style={{
          backgroundColor: 'rgba(30, 30, 46, 0.8)',
          border: `4px solid ${style.borderColor}`,
          color: style.iconColor,
        }}
      >
        {entry.avatarUrl ? (
          <img src={entry.avatarUrl} alt={entry.username} className="w-full h-full rounded-full object-cover" />
        ) : (
          (entry.displayName || entry.username || "U")[0]
        )}
      </div>

      {/* Info */}
      <div className="text-center w-full">
        <div className="font-medium text-white truncate max-w-full px-2" title={entry.displayName || entry.username}>
          {entry.displayName || entry.username}
        </div>
        <div className="text-sm text-slate-400">Level {entry.level}</div>
      </div>

      {/* XP */}
      <div
        className="font-[family-name:var(--font-display)] text-lg"
        style={{ color: style.iconColor }}
      >
        {(entry.experience || 0).toLocaleString()} XP
      </div>
    </div>
  )
}

function LeaderboardRow({ entry }: { entry: LeaderboardUIEntry }) {
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-white/5 transition-colors items-center">
      {/* Rank */}
      <div className="col-span-1 flex items-center gap-1">
        <span className="font-medium text-slate-400">{entry.rank}</span>
        {entry.change === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
        {entry.change === "down" && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
      </div>

      {/* User */}
      <div className="col-span-5 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-yellow-400 overflow-hidden uppercase"
          style={{
            backgroundColor: 'rgba(253, 224, 71, 0.2)',
            border: '2px solid #fde047',
          }}
        >
          {entry.avatarUrl ? (
            <img src={entry.avatarUrl} alt={entry.username} className="w-full h-full object-cover" />
          ) : (
            (entry.displayName || entry.username || "U")[0]
          )}
        </div>
        <span className="font-medium text-white truncate" title={entry.displayName || entry.username}>
          {entry.displayName || entry.username}
        </span>
      </div>

      {/* Level */}
      <div className="col-span-2 text-center">
        <span
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-yellow-400"
          style={{ backgroundColor: 'rgba(253, 224, 71, 0.15)' }}
        >
          Lv. {entry.level}
        </span>
      </div>

      {/* Streak */}
      <div className="col-span-2 text-center">
        <span className="inline-flex items-center gap-1 text-sm text-slate-400">
          <Flame className="h-4 w-4 text-orange-500" />
          {entry.currentStreak}
        </span>
      </div>

      {/* XP */}
      <div className="col-span-2 text-right font-medium text-yellow-400">
        {(entry.experience || 0).toLocaleString()}
      </div>
    </div>
  )
}
