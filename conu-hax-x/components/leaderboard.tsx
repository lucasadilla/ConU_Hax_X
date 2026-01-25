"use client"

import { Trophy, Medal, Crown, TrendingUp, Flame } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string
  xp: number
  level: number
  streak: number
  change: "up" | "down" | "same"
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: "CodeWarrior99", avatar: "C", xp: 125400, level: 87, streak: 156, change: "same" },
  { rank: 2, username: "AlgoMaster", avatar: "A", xp: 118200, level: 82, streak: 89, change: "up" },
  { rank: 3, username: "ByteSlayer", avatar: "B", xp: 112800, level: 79, streak: 234, change: "up" },
  { rank: 4, username: "NinjaCode", avatar: "N", xp: 98700, level: 71, streak: 45, change: "down" },
  { rank: 5, username: "StackOverflow", avatar: "S", xp: 94200, level: 68, streak: 67, change: "same" },
  { rank: 6, username: "RecursiveKing", avatar: "R", xp: 89100, level: 65, streak: 112, change: "up" },
  { rank: 7, username: "BinaryBoss", avatar: "B", xp: 84500, level: 62, streak: 23, change: "down" },
  { rank: 8, username: "TreeTraverser", avatar: "T", xp: 79800, level: 59, streak: 78, change: "same" },
]

export function Leaderboard() {
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

        {/* Top 3 Podium */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-12">
          {/* Second Place */}
          <PodiumCard entry={leaderboardData[1]} position={2} />
          {/* First Place */}
          <PodiumCard entry={leaderboardData[0]} position={1} />
          {/* Third Place */}
          <PodiumCard entry={leaderboardData[2]} position={3} />
        </div>

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

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: 1 | 2 | 3 }) {
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
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
        style={{
          backgroundColor: 'rgba(30, 30, 46, 0.8)',
          border: `4px solid ${style.borderColor}`,
          color: style.iconColor,
        }}
      >
        {entry.avatar}
      </div>

      {/* Info */}
      <div className="text-center">
        <div className="font-medium text-white truncate max-w-full">{entry.username}</div>
        <div className="text-sm text-slate-400">Level {entry.level}</div>
      </div>

      {/* XP */}
      <div 
        className="font-[family-name:var(--font-display)] text-lg"
        style={{ color: style.iconColor }}
      >
        {entry.xp.toLocaleString()} XP
      </div>
    </div>
  )
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
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
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-yellow-400"
          style={{
            backgroundColor: 'rgba(253, 224, 71, 0.2)',
            border: '2px solid #fde047',
          }}
        >
          {entry.avatar}
        </div>
        <span className="font-medium text-white truncate">{entry.username}</span>
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
          {entry.streak}
        </span>
      </div>

      {/* XP */}
      <div className="col-span-2 text-right font-medium text-yellow-400">
        {entry.xp.toLocaleString()}
      </div>
    </div>
  )
}
