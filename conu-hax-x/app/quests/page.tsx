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
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge 
            className="mb-4"
            style={{
              backgroundColor: 'rgba(253, 224, 71, 0.2)',
              color: '#1e1e2e',
              border: '2px solid #fde047',
            }}
          >
            🗺️ Quest System
          </Badge>
          <h1 
            className="font-display text-3xl md:text-4xl mb-4"
            style={{ 
              color: '#1e1e2e',
              textShadow: '2px 2px 0 #fde047',
            }}
          >
            Choose Your Quest
          </h1>
          <p className="text-slate-700 font-medium max-w-2xl mx-auto">
            Complete 3 progressive challenges (Easy → Medium → Hard) to earn exclusive badges.
            Each quest focuses on real-world Next.js, TypeScript, and MongoDB scenarios.
          </p>
        </div>

        {/* Quest Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
          <div 
            className="rounded-lg p-4 text-center"
            style={{
              backgroundColor: 'rgba(30, 30, 46, 0.9)',
              border: '3px solid #fde047',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            <div className="text-2xl font-bold text-yellow-400">{quests.length}</div>
            <div className="text-sm text-slate-400">Total Quests</div>
          </div>
          <div 
            className="rounded-lg p-4 text-center"
            style={{
              backgroundColor: 'rgba(30, 30, 46, 0.9)',
              border: '3px solid #22c55e',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            <div className="text-2xl font-bold text-green-400">{quests.length * 3}</div>
            <div className="text-sm text-slate-400">Total Challenges</div>
          </div>
          <div 
            className="rounded-lg p-4 text-center"
            style={{
              backgroundColor: 'rgba(30, 30, 46, 0.9)',
              border: '3px solid #f97316',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            <div className="text-2xl font-bold text-orange-400">{quests.length}</div>
            <div className="text-sm text-slate-400">Badges Available</div>
          </div>
        </div>

        {/* Quest Tabs by Theme */}
        <Tabs defaultValue="all" className="max-w-6xl mx-auto">
          <TabsList 
            className="grid w-full grid-cols-4 mb-8 p-1 rounded-xl"
            style={{
              backgroundColor: 'rgba(30, 30, 46, 0.9)',
              border: '3px solid #1e1e2e',
            }}
          >
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-slate-900 text-slate-300"
            >
              All ({quests.length})
            </TabsTrigger>
            <TabsTrigger 
              value="regression"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-slate-300"
            >
              🐛 ({questsByTheme.regression.length})
            </TabsTrigger>
            <TabsTrigger 
              value="feature-creation"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-slate-300"
            >
              ✨ ({questsByTheme['feature-creation'].length})
            </TabsTrigger>
            <TabsTrigger 
              value="debugging"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-300"
            >
              🔧 ({questsByTheme.debugging.length})
            </TabsTrigger>
          </TabsList>

          {/* All Quests */}
          <TabsContent value="all">
            {quests.length === 0 ? (
              <div 
                className="text-center py-12 rounded-xl"
                style={{
                  backgroundColor: 'rgba(30, 30, 46, 0.9)',
                  border: '3px solid #1e1e2e',
                }}
              >
                <p className="text-slate-400 mb-4">No quests available yet.</p>
                <p className="text-sm text-slate-500">
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
