import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StreakDisplay } from "@/components/streak-display"
import { StreakMilestones } from "@/components/streak-milestones"
import { ProfileClientWrapper } from "@/components/ProfileClientWrapper"
import { UserBadgesDisplay } from "@/components/UserBadgesDisplay"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Target, Zap, Award } from "lucide-react"
import StreakService from "@/services/streakService"
import User from "@/models/User"
import { connectToDatabase } from "@/lib/mongodb"

interface ProfilePageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params
  
  let user = null
  let streakInfo = null
  let nextMilestone = null
  let milestones: any[] = []
  let error = null
  
  try {
    await connectToDatabase()
    user = await User.findById(userId).populate('badges')
    
    if (user) {
      streakInfo = await StreakService.getStreakInfo(userId)
      nextMilestone = await StreakService.getNextMilestone(userId)
      milestones = StreakService.getStreakMilestones()
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load profile'
  }

  if (error || !user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div 
            className="text-center p-8 rounded-xl max-w-md mx-auto"
            style={{
              backgroundColor: 'rgba(253, 224, 71, 0.1)',
              border: '3px solid #1e1e2e',
              boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
            }}
          >
            <h1 
              className="text-2xl font-display mb-4"
              style={{ 
                color: '#fde047',
                textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
              }}
            >
              Profile Not Found
            </h1>
            <p className="text-slate-400">The user profile doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Profile Header */}
        <Card 
          className="p-8 mb-8"
          style={{
            backgroundColor: 'rgba(30, 30, 46, 0.9)',
            border: '3px solid #1e1e2e',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex items-start gap-6">
            <Avatar 
              className="w-24 h-24"
              style={{
                border: '4px solid #fde047',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
              }}
            >
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback 
                style={{
                  backgroundColor: 'rgba(253, 224, 71, 0.2)',
                  color: '#fde047',
                }}
                className="text-2xl font-bold"
              >
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 
                className="text-3xl font-display mb-2"
                style={{ 
                  color: '#fde047',
                  textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                }}
              >
                {user.displayName || user.username}
              </h1>
              <p className="text-slate-400 mb-4">@{user.username}</p>
              
              {user.bio && (
                <p className="text-white mb-4">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(253, 224, 71, 0.2)',
                      border: '2px solid #fde047',
                    }}
                  >
                    <Trophy className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{user.totalPoints}</div>
                    <div className="text-xs text-slate-500">Points</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      border: '2px solid #22c55e',
                    }}
                  >
                    <Target className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{user.ticketsCompleted}</div>
                    <div className="text-xs text-slate-500">Completed</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      border: '2px solid #3b82f6',
                    }}
                  >
                    <Zap className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Level {user.level}</div>
                    <div className="text-xs text-slate-500">{user.experience} XP</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(249, 115, 22, 0.2)',
                      border: '2px solid #f97316',
                    }}
                  >
                    <Award className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{user.badges.length}</div>
                    <div className="text-xs text-slate-500">Badges</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Streak Display */}
            {streakInfo && (
              <StreakDisplay
                currentStreak={streakInfo.currentStreak}
                longestStreak={streakInfo.longestStreak}
                totalDaysActive={streakInfo.totalDaysActive}
                needsWarning={streakInfo.daysUntilBreak === 0 && streakInfo.currentStreak > 0}
              />
            )}

            {/* Badges */}
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'rgba(30, 30, 46, 0.9)',
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
                Earned Badges
              </h3>
              <UserBadgesDisplay userId={userId} />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Phantom Wallet Connection */}
            <ProfileClientWrapper userId={userId} />

            {/* Streak Milestones */}
            <StreakMilestones
              milestones={milestones}
              backgroundColor="rgba(30, 30, 46, 0.9)"
              currentStreak={streakInfo?.currentStreak || 0}
              earnedBadges={user.badges.map((b: any) => b.name)}
            />

            {/* Recent Activity */}
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'rgba(30, 30, 46, 0.9)',
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
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Success Rate</span>
                  <span className="font-bold text-green-500">
                    {user.ticketsAttempted > 0
                      ? Math.round((user.ticketsCompleted / user.ticketsAttempted) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Attempts</span>
                  <span className="font-bold text-white">{user.ticketsAttempted}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Preferred Language</span>
                  <Badge 
                    style={{
                      backgroundColor: 'rgba(253, 224, 71, 0.2)',
                      color: '#fde047',
                      border: '1px solid #fde047',
                    }}
                  >
                    {user.preferredLanguage}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Difficulty</span>
                  <Badge
                    variant="outline"
                    className={
                      user.difficulty === 'easy'
                        ? 'border-green-500 text-green-500'
                        : user.difficulty === 'medium'
                        ? 'border-orange-500 text-orange-500'
                        : 'border-red-500 text-red-500'
                    }
                  >
                    {user.difficulty}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
