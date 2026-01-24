import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StreakDisplay } from "@/components/streak-display"
import { StreakMilestones } from "@/components/streak-milestones"
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
  let milestones = []
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
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-display text-primary mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground">The user profile doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-display text-primary mb-2">
                {user.displayName || user.username}
              </h1>
              <p className="text-muted-foreground mb-4">@{user.username}</p>
              
              {user.bio && (
                <p className="text-foreground mb-4">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{user.totalPoints}</div>
                    <div className="text-xs text-muted-foreground">Points</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{user.ticketsCompleted}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Level {user.level}</div>
                    <div className="text-xs text-muted-foreground">{user.experience} XP</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Award className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{user.badges.length}</div>
                    <div className="text-xs text-muted-foreground">Badges</div>
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
                nextMilestone={nextMilestone}
                needsWarning={streakInfo.daysUntilBreak === 0 && streakInfo.currentStreak > 0}
              />
            )}

            {/* Badges */}
            <Card className="p-6">
              <h3 className="text-lg font-display text-primary mb-4">
                Earned Badges ({user.badges.length})
              </h3>
              {user.badges.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No badges earned yet. Complete challenges to earn your first badge!
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {user.badges.map((badge: any) => (
                    <div
                      key={badge._id}
                      className="p-4 rounded-lg border-2 border-border bg-card text-center hover:scale-105 transition-transform"
                    >
                      <div className="text-3xl mb-2">
                        {badge.category === 'streak' ? '🔥' : '🏆'}
                      </div>
                      <div className="text-sm font-bold text-foreground mb-1">
                        {badge.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        +{badge.pointsAwarded} pts
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Streak Milestones */}
            <StreakMilestones
              milestones={milestones}
              currentStreak={streakInfo?.currentStreak || 0}
              earnedBadges={user.badges.map((b: any) => b.name)}
            />

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-display text-primary mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-bold text-green-500">
                    {user.ticketsAttempted > 0
                      ? Math.round((user.ticketsCompleted / user.ticketsAttempted) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Attempts</span>
                  <span className="font-bold text-foreground">{user.ticketsAttempted}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Preferred Language</span>
                  <Badge variant="secondary">{user.preferredLanguage}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge
                    variant="outline"
                    className={
                      user.difficulty === 'easy'
                        ? 'border-green-500 text-green-500'
                        : user.difficulty === 'medium'
                        ? 'border-yellow-500 text-yellow-500'
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
