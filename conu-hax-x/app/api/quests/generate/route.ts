import { NextRequest, NextResponse } from 'next/server';
import QuestService from '@/services/questService';
import { QuestTheme } from '@/models/Quest';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme, questNumber = 1 } = body;

    // Validate theme
    if (!['regression', 'feature-creation', 'debugging'].includes(theme)) {
      return NextResponse.json(
        { success: false, error: 'Invalid theme. Must be: regression, feature-creation, or debugging' },
        { status: 400 }
      );
    }

    // Generate quest
    console.log(`Generating ${theme} quest #${questNumber}...`);
    const quest = await QuestService.generateQuest({
      theme: theme as QuestTheme,
      questNumber,
    });

    return NextResponse.json({
      success: true,
      quest: {
        id: quest._id,
        title: quest.title,
        description: quest.description,
        theme: quest.theme,
        iconEmoji: quest.iconEmoji,
        stages: quest.stages.map(stage => ({
          difficulty: stage.difficulty,
          ticketId: stage.ticketId,
          order: stage.order,
          unlocked: stage.unlocked,
        })),
        badge: {
          name: quest.badgeName,
          description: quest.badgeDescription,
          points: quest.badgePoints,
          color: quest.badgeColor,
        },
        estimatedTime: quest.estimatedTime,
        tags: quest.tags,
      },
    });
  } catch (error) {
    console.error('Failed to generate quest:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate quest',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Generate all 9 quests at once
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'generate-all') {
      console.log('Generating all 9 quests...');
      
      const themes: QuestTheme[] = ['regression', 'feature-creation', 'debugging'];
      const quests = [];

      for (const theme of themes) {
        for (let i = 1; i <= 3; i++) {
          console.log(`Generating ${theme} quest ${i}/3...`);
          
          try {
            const quest = await QuestService.generateQuest({ theme, questNumber: i });
            quests.push({
              id: quest._id,
              title: quest.title,
              theme: quest.theme,
              stages: quest.stages.length,
            });
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (error) {
            console.error(`Failed to generate ${theme} quest ${i}:`, error);
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: `Generated ${quests.length} quests`,
        quests,
      });
    }

    // Get all quests
    const quests = await QuestService.getAllQuests();
    
    return NextResponse.json({
      success: true,
      count: quests.length,
      quests: quests.map(q => ({
        id: q._id,
        title: q.title,
        theme: q.theme,
        iconEmoji: q.iconEmoji,
        stages: q.stages.length,
        completionRate: q.getCompletionRate(),
      })),
    });
  } catch (error) {
    console.error('Failed to handle quest request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
