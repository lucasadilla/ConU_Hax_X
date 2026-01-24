import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Clock, Target } from "lucide-react"
import Link from "next/link"
import QuestService from "@/services/questService"
import TicketService from "@/services/ticketService"

interface QuestStagePageProps {
  params: Promise<{ id: string; stageIndex: string }>
}

export default async function QuestStagePage({ params }: QuestStagePageProps) {
  const { id, stageIndex } = await params
  const stageIdx = parseInt(stageIndex)
  
  let quest = null
  let ticket = null
  let error = null
  
  try {
    quest = await QuestService.getQuestById(id)
    
    if (quest && quest.stages[stageIdx]) {
      ticket = await TicketService.getTicketById(quest.stages[stageIdx].ticketId)
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load quest stage'
  }

  if (error || !quest || !ticket) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-display text-primary mb-4">Stage Not Found</h1>
            <Link href="/quests">
              <Button>Back to Quests</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const stage = quest.stages[stageIdx]
  const difficultyColors = {
    easy: 'border-green-500 bg-green-500/10 text-green-400',
    medium: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    hard: 'border-red-500 bg-red-500/10 text-red-400',
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Link href="/quests" className="hover:text-primary transition-colors">
            Quests
          </Link>
          <span>/</span>
          <Link href={`/quest/${id}`} className="hover:text-primary transition-colors">
            {quest.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">Stage {stage.order}</span>
        </div>

        {/* Stage Header */}
        <Card className={`p-8 mb-8 border-2 ${difficultyColors[stage.difficulty]}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className="mb-2" variant="outline">
                Stage {stage.order} of 3
              </Badge>
              <h1 className="font-display text-2xl md:text-3xl text-primary mb-2">
                {ticket.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <Badge className={difficultyColors[stage.difficulty]}>
                  {stage.difficulty.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{ticket.timeLimit} min</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>{ticket.points} points</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-foreground whitespace-pre-wrap">
            {ticket.description}
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Examples */}
            {ticket.examples && ticket.examples.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-display text-primary mb-4">Examples</h2>
                {ticket.examples.map((example, idx) => (
                  <div key={idx} className="mb-4 last:mb-0">
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm mb-2">
                      <div className="text-muted-foreground mb-1">Input:</div>
                      <div className="text-foreground">{example.input}</div>
                      <div className="text-muted-foreground mt-2 mb-1">Output:</div>
                      <div className="text-primary">{example.output}</div>
                    </div>
                    {example.explanation && (
                      <p className="text-sm text-muted-foreground">{example.explanation}</p>
                    )}
                  </div>
                ))}
              </Card>
            )}

            {/* Code Editor Placeholder */}
            <Card className="p-6">
              <h2 className="text-xl font-display text-primary mb-4">Your Solution</h2>
              <div className="bg-muted rounded-lg p-8 text-center border-2 border-dashed border-border">
                <p className="text-muted-foreground mb-4">Code editor will appear here</p>
                <p className="text-sm text-muted-foreground">
                  Integrate with Monaco Editor or your code submission system
                </p>
              </div>
              <div className="mt-4 flex gap-4">
                <Button className="flex-1">Run Tests</Button>
                <Button variant="outline" className="flex-1">Submit Solution</Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Constraints */}
            {ticket.constraints && ticket.constraints.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-display text-primary mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {ticket.constraints.map((constraint, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{constraint}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Hints */}
            {ticket.hints && ticket.hints.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-display text-primary mb-3">Hints</h3>
                <ul className="space-y-2">
                  {ticket.hints.map((hint, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary">💡</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Test Cases */}
            <Card className="p-6">
              <h3 className="text-lg font-display text-primary mb-3">Test Cases</h3>
              <div className="space-y-3">
                {ticket.testCases
                  .filter((tc) => !tc.isHidden)
                  .map((testCase, idx) => (
                    <div key={idx} className="bg-muted rounded-lg p-3">
                      <div className="text-xs font-mono">
                        <div className="text-muted-foreground mb-1">Input:</div>
                        <div className="text-foreground mb-2">{testCase.input}</div>
                        <div className="text-muted-foreground mb-1">Expected:</div>
                        <div className="text-primary">{testCase.expectedOutput}</div>
                      </div>
                    </div>
                  ))}
                <p className="text-xs text-muted-foreground">
                  + {ticket.testCases.filter((tc) => tc.isHidden).length} hidden test cases
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Link href={`/quest/${id}`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quest Map
            </Button>
          </Link>
          
          {stageIdx < 2 && (
            <Link href={`/quest/${id}/stage/${stageIdx + 1}`}>
              <Button disabled>
                Next Stage
                <Lock className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}
