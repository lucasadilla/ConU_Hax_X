"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Zap, Flame, Target, TrendingUp, Users, Award, Star } from "lucide-react"
import Link from "next/link"

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  displayName?: string
  avatarUrl?: string
  totalPoints: number
  experience: number
  level: number
  ticketsCompleted: number
  currentStreak: number
  badges: number
}

interface LeaderboardStats {
  totalUsers: number
  totalXP: number
  totalTicketsCompleted: number
  averageLevel: number
  topStreak: number
}

export default function LeaderboardPage() {
  const [category, setCategory] = useState<'xp' | 'points' | 'streak' | 'completed'>('xp')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [stats, setStats] = useState<LeaderboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [category])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/leaderboard?category=${category}&limit=100`)
      const data = await response.json()
      
      if (data.success) {
        setLeaderboard(data.leaderboard)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankMedal = (rank: number) => {
    if (rank === 1) return <span className="text-3xl">🥇</span>
    if (rank === 2) return <span className="text-3xl">🥈</span>
    if (rank === 3) return <span className="text-3xl">🥉</span>
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "border-yellow-500 bg-yellow-500/10"
    if (rank === 2) return "border-gray-400 bg-gray-400/10"
    if (rank === 3) return "border-amber-600 bg-amber-600/10"
    return "border-border bg-card"
  }

  const getCategoryValue = (entry: LeaderboardEntry) => {
    switch (category) {
      case 'xp':
        return `${entry.experience.toLocaleString()} XP`
      case 'points':
        return `${entry.totalPoints.toLocaleString()} pts`
      case 'streak':
        return `${entry.currentStreak} days`
      case 'completed':
        return `${entry.ticketsCompleted} solved`
    }
  }

  const getCategoryIcon = () => {
    switch (category) {
      case 'xp':
        return <Zap className="w-4 h-4" />
      case 'points':
        return <Star className="w-4 h-4" />
      case 'streak':
        return <Flame className="w-4 h-4" />
      case 'completed':
        return <Target className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-display text-primary">Global Leaderboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Compete with coders worldwide and climb the ranks!
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4 text-center border-2">
              <Users className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </Card>
            <Card className="p-4 text-center border-2">
              <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{(stats.totalXP / 1000).toFixed(1)}K</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </Card>
            <Card className="p-4 text-center border-2">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.totalTicketsCompleted.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Solved</div>
            </Card>
            <Card className="p-4 text-center border-2">
              <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.averageLevel}</div>
              <div className="text-xs text-muted-foreground">Avg Level</div>
            </Card>
            <Card className="p-4 text-center border-2">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.topStreak}</div>
              <div className="text-xs text-muted-foreground">Top Streak</div>
            </Card>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={category} onValueChange={(v) => setCategory(v as any)} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="xp" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Experience</span>
              <span className="sm:hidden">XP</span>
            </TabsTrigger>
            <TabsTrigger value="points" className="gap-2">
              <Star className="w-4 h-4" />
              Points
            </TabsTrigger>
            <TabsTrigger value="streak" className="gap-2">
              <Flame className="w-4 h-4" />
              Streak
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">Done</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Leaderboard */}
        {loading ? (
          <Card className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </Card>
        ) : leaderboard.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground">No users on the leaderboard yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <Card className={`p-6 text-center ${getRankStyle(2)} border-2`}>
                  <div className="mb-3">{getRankMedal(2)}</div>
                  <Link href={`/profile/${leaderboard[1].userId}`}>
                    <Avatar className="w-16 h-16 mx-auto mb-3 border-4 border-gray-400">
                      <AvatarImage src={leaderboard[1].avatarUrl} />
                      <AvatarFallback className="bg-gray-400/20 text-lg">
                        {leaderboard[1].username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="font-bold text-foreground mb-1">
                    {leaderboard[1].displayName || leaderboard[1].username}
                  </div>
                  <Badge variant="secondary" className="mb-2">Level {leaderboard[1].level}</Badge>
                  <div className="text-sm font-bold text-gray-400">
                    {getCategoryValue(leaderboard[1])}
                  </div>
                </Card>

                {/* 1st Place */}
                <Card className={`p-6 text-center ${getRankStyle(1)} border-2 transform scale-110`}>
                  <div className="mb-3">{getRankMedal(1)}</div>
                  <Link href={`/profile/${leaderboard[0].userId}`}>
                    <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-yellow-500">
                      <AvatarImage src={leaderboard[0].avatarUrl} />
                      <AvatarFallback className="bg-yellow-500/20 text-xl">
                        {leaderboard[0].username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="font-bold text-foreground mb-1">
                    {leaderboard[0].displayName || leaderboard[0].username}
                  </div>
                  <Badge variant="default" className="mb-2 bg-yellow-500">Level {leaderboard[0].level}</Badge>
                  <div className="text-sm font-bold text-yellow-500">
                    {getCategoryValue(leaderboard[0])}
                  </div>
                </Card>

                {/* 3rd Place */}
                <Card className={`p-6 text-center ${getRankStyle(3)} border-2`}>
                  <div className="mb-3">{getRankMedal(3)}</div>
                  <Link href={`/profile/${leaderboard[2].userId}`}>
                    <Avatar className="w-16 h-16 mx-auto mb-3 border-4 border-amber-600">
                      <AvatarImage src={leaderboard[2].avatarUrl} />
                      <AvatarFallback className="bg-amber-600/20 text-lg">
                        {leaderboard[2].username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="font-bold text-foreground mb-1">
                    {leaderboard[2].displayName || leaderboard[2].username}
                  </div>
                  <Badge variant="secondary" className="mb-2">Level {leaderboard[2].level}</Badge>
                  <div className="text-sm font-bold text-amber-600">
                    {getCategoryValue(leaderboard[2])}
                  </div>
                </Card>
              </div>
            )}

            {/* Rest of the list */}
            {leaderboard.slice(3).map((entry) => (
              <Card key={entry.userId} className="p-4 border-2 hover:border-primary transition-colors">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 text-center flex-shrink-0">
                    {getRankMedal(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <Link href={`/profile/${entry.userId}`}>
                    <Avatar className="w-12 h-12 border-2 border-border">
                      <AvatarImage src={entry.avatarUrl} />
                      <AvatarFallback className="bg-primary/20">
                        {entry.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/profile/${entry.userId}`}>
                      <div className="font-bold text-foreground hover:text-primary transition-colors">
                        {entry.displayName || entry.username}
                      </div>
                    </Link>
                    <div className="text-sm text-muted-foreground">@{entry.username}</div>
                  </div>

                  {/* Level Badge */}
                  <Badge variant="outline" className="hidden sm:flex">
                    Level {entry.level}
                  </Badge>

                  {/* Category Value */}
                  <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/30">
                    {getCategoryIcon()}
                    <span className="font-bold text-primary">
                      {getCategoryValue(entry)}
                    </span>
                  </div>

                  {/* Extra Stats */}
                  <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {entry.badges}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {entry.ticketsCompleted}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
