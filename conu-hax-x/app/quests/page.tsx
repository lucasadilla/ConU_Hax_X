import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { QuestCard } from "@/components/quest-card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QuestService from "@/services/questService"

export const dynamic = 'force-dynamic'

export default async function QuestsPage() {
  let quests = []
  
  try {
    quests = await QuestService.getAllQuests()
  } catch (error) {
    console.error('Failed to load quests:', error)
  }

  const questsByTheme = {
    regression: quests.filter(q => q.theme === 'regression'),
    'feature-creation': quests.filter(q => q.theme === 'feature-creation'),
    debugging: quests.filter(q => q.theme === 'debugging'),
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary">
            🗺️ Quest System
          </Badge>
          <h1 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Choose Your Quest
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete 3 progressive challenges (Easy → Medium → Hard) to earn exclusive badges.
            Each quest focuses on real-world Next.js, TypeScript, and MongoDB scenarios.
          </p>
        </div>

        {/* Quest Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
          <div className="bg-card border-2 border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{quests.length}</div>
            <div className="text-sm text-muted-foreground">Total Quests</div>
          </div>
          <div className="bg-card border-2 border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{quests.length * 3}</div>
            <div className="text-sm text-muted-foreground">Total Challenges</div>
          </div>
          <div className="bg-card border-2 border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{quests.length}</div>
            <div className="text-sm text-muted-foreground">Badges Available</div>
          </div>
        </div>

        {/* Quest Tabs by Theme */}
        <Tabs defaultValue="all" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">
              All Quests ({quests.length})
            </TabsTrigger>
            <TabsTrigger value="regression">
              🐛 Regression ({questsByTheme.regression.length})
            </TabsTrigger>
            <TabsTrigger value="feature-creation">
              ✨ Features ({questsByTheme['feature-creation'].length})
            </TabsTrigger>
            <TabsTrigger value="debugging">
              🔧 Debug ({questsByTheme.debugging.length})
            </TabsTrigger>
          </TabsList>

          {/* All Quests */}
          <TabsContent value="all">
            {quests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No quests available yet.</p>
                <p className="text-sm text-muted-foreground">
                  Quests are being generated. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quests.map((quest) => (
                  <QuestCard
                    key={quest._id.toString()}
                    quest={{
                      _id: quest._id.toString(),
                      title: quest.title,
                      description: quest.description,
                      theme: quest.theme,
                      iconEmoji: quest.iconEmoji,
                      estimatedTime: quest.estimatedTime,
                      badgePoints: quest.badgePoints,
                      completionRate: quest.getCompletionRate(),
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Regression Quests */}
          <TabsContent value="regression">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questsByTheme.regression.map((quest) => (
                <QuestCard
                  key={quest._id.toString()}
                  quest={{
                    _id: quest._id.toString(),
                    title: quest.title,
                    description: quest.description,
                    theme: quest.theme,
                    iconEmoji: quest.iconEmoji,
                    estimatedTime: quest.estimatedTime,
                    badgePoints: quest.badgePoints,
                  }}
                />
              ))}
            </div>
          </TabsContent>

          {/* Feature Creation Quests */}
          <TabsContent value="feature-creation">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questsByTheme['feature-creation'].map((quest) => (
                <QuestCard
                  key={quest._id.toString()}
                  quest={{
                    _id: quest._id.toString(),
                    title: quest.title,
                    description: quest.description,
                    theme: quest.theme,
                    iconEmoji: quest.iconEmoji,
                    estimatedTime: quest.estimatedTime,
                    badgePoints: quest.badgePoints,
                  }}
                />
              ))}
            </div>
          </TabsContent>

          {/* Debugging Quests */}
          <TabsContent value="debugging">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questsByTheme.debugging.map((quest) => (
                <QuestCard
                  key={quest._id.toString()}
                  quest={{
                    _id: quest._id.toString(),
                    title: quest.title,
                    description: quest.description,
                    theme: quest.theme,
                    iconEmoji: quest.iconEmoji,
                    estimatedTime: quest.estimatedTime,
                    badgePoints: quest.badgePoints,
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
