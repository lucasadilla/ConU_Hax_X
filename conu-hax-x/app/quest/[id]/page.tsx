import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { QuestMap } from "@/components/quest-map"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Clock, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"
import QuestService from "@/services/questService"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth"
import { UserQuestProgress } from "@/models/Quest"

interface QuestPageProps {
  params: Promise<{ id: string }>
}

export default async function QuestPage({ params }: QuestPageProps) {
  const { id } = await params

  let quest = null
  let progress = null
  let error = null

  try {
    const session = await getServerSession(authOptions)
    quest = await QuestService.getQuestById(id)

    if (session?.user?.id && quest) {
      progress = await UserQuestProgress.findOne({
        userId: session.user.id,
        questId: quest._id
      })
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load quest'
  }

  if (error || !quest) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div
            className="text-center p-8 rounded-xl max-w-md mx-auto"
            style={{
              backgroundColor: 'rgba(30, 30, 46, 0.9)',
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
              Quest Not Found
            </h1>
            <p className="text-slate-400 mb-6">The quest you're looking for doesn't exist.</p>
            <Link href="/quests">
              <Button
                style={{
                  backgroundColor: '#fde047',
                  color: '#1e1e2e',
                  border: '2px solid #1e1e2e',
                  boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quests
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const themeStyles = {
    regression: {
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    'feature-creation': {
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
    },
    debugging: {
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.15)',
    },
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/quests" className="inline-block mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: 'rgba(30, 30, 46, 0.7)',
              color: '#fde047',
              border: '2px solid #1e1e2e',
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quests
          </Button>
        </Link>

        {/* Quest Header */}
        <div
          className="rounded-xl p-8 mb-8"
          style={{
            backgroundColor: themeStyles[quest.theme].backgroundColor,
            border: `3px solid ${themeStyles[quest.theme].borderColor}`,
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <span className="text-6xl">{quest.iconEmoji}</span>
            <div className="flex-1">
              <h1
                className="font-display text-2xl md:text-3xl mb-2"
                style={{
                  color: '#fde047',
                  textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                }}
              >
                {quest.title}
              </h1>
              <p className="text-white mb-4">
                {quest.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quest.techStack.map((tech) => (
                  <Badge
                    key={tech}
                    className="font-mono text-xs"
                    style={{
                      backgroundColor: 'rgba(30, 30, 46, 0.7)',
                      color: '#fde047',
                      border: '1px solid #1e1e2e',
                    }}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Quest Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4" />
                  <span>{quest.estimatedTime} minutes total</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Target className="w-4 h-4" />
                  <span>3 Stages</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Trophy className="w-4 h-4" />
                  <span>{quest.badgePoints} points</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quest Map with Stages */}
        <Card
          className="p-8 mb-8"
          style={{
            backgroundColor: 'rgba(253, 224, 71, 0.1)',
            border: '3px solid #1e1e2e',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          }}
        >
          <QuestMap
            questId={quest._id.toString()}
            questTitle={quest.title}
            userProgress={progress ? {
              currentStage: progress.currentStage,
              completedStages: progress.completedStages,
              stageScores: progress.stageScores.map((s: any) => ({
                stageIndex: s.stageIndex,
                score: s.score
              }))
            } : undefined}
            stages={quest.stages.map((stage, index) => {
              const rawTicketId: any = stage.ticketId
              const resolvedTicketId =
                typeof rawTicketId === 'string'
                  ? rawTicketId
                  : rawTicketId?._id?.toString?.() ?? rawTicketId?.id?.toString?.()

              const isAlreadyCompleted = progress?.completedStages?.includes(index) || false;
              const isFirstUnsolved = index === (progress?.completedStages?.length || 0);
              const isUnlocked = isAlreadyCompleted || isFirstUnsolved;

              return {
                difficulty: stage.difficulty,
                ticketId: resolvedTicketId || '',
                order: stage.order,
                unlocked: isUnlocked,
              }
            })}
          />
        </Card>

        {/* Badge Reward */}
        <Card
          className="p-8"
          style={{
            backgroundColor: 'rgba(253, 224, 71, 0.15)',
            border: '3px solid #fde047',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(253, 224, 71, 0.2)',
                border: '3px solid #fde047',
              }}
            >
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3
                className="text-xl font-display mb-1"
                style={{
                  color: '#fde047',
                  textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                }}
              >
                {quest.badgeName}
              </h3>
              <p className="text-slate-700 font-medium">
                {quest.badgeDescription}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">
                {quest.badgePoints}
              </div>
              <div className="text-xs text-slate-600">Points</div>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
