import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { QuestMap } from "@/components/quest-map"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Clock, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"
import QuestService from "@/services/questService"

interface QuestPageProps {
  params: Promise<{ id: string }>
}

export default async function QuestPage({ params }: QuestPageProps) {
  const { id } = await params
  
  let quest = null
  let error = null
  
  try {
    quest = await QuestService.getQuestById(id)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load quest'
  }

  if (error || !quest) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-display text-primary mb-4">Quest Not Found</h1>
            <p className="text-muted-foreground mb-6">The quest you're looking for doesn't exist.</p>
            <Link href="/quests">
              <Button>
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
    regression: 'border-red-500/50 bg-red-500/10',
    'feature-creation': 'border-green-500/50 bg-green-500/10',
    debugging: 'border-yellow-500/50 bg-yellow-500/10',
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/quests" className="inline-block mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quests
          </Button>
        </Link>

        {/* Quest Header */}
        <div className={`border-2 rounded-xl p-8 mb-8 ${themeStyles[quest.theme]}`}>
          <div className="flex items-start gap-4 mb-4">
            <span className="text-6xl">{quest.iconEmoji}</span>
            <div className="flex-1">
              <h1 className="font-display text-2xl md:text-3xl text-primary mb-2">
                {quest.title}
              </h1>
              <p className="text-foreground mb-4">
                {quest.description}
              </p>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quest.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="font-mono text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Quest Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{quest.estimatedTime} minutes total</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>3 Stages</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  <span>{quest.badgePoints} points</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quest Map with Stages */}
        <Card className="p-8 mb-8">
          <QuestMap
            questId={quest._id.toString()}
            questTitle={quest.title}
            stages={quest.stages.map((stage, index) => ({
              difficulty: stage.difficulty,
              ticketId: stage.ticketId.toString(),
              order: stage.order,
              unlocked: index === 0, // TODO: Check user progress
            }))}
          />
        </Card>

        {/* Badge Reward */}
        <Card className="p-8 border-2 border-primary/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-display text-primary mb-1">
                {quest.badgeName}
              </h3>
              <p className="text-muted-foreground">
                {quest.badgeDescription}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {quest.badgePoints}
              </div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
