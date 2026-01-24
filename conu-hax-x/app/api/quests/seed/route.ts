import { NextRequest, NextResponse } from 'next/server';
import QuestService from '@/services/questService';
import { QuestTheme } from '@/models/Quest';

/**
 * Seed endpoint to generate all 9 quests
 * GET /api/quests/seed
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🌱 Starting quest seeding process...');
    
    const themes: QuestTheme[] = ['regression', 'feature-creation', 'debugging'];
    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const theme of themes) {
      console.log(`\n📦 Generating ${theme} quests...`);
      
      for (let questNumber = 1; questNumber <= 3; questNumber++) {
        try {
          console.log(`  ⏳ Generating ${theme} quest ${questNumber}/3...`);
          
          const quest = await QuestService.generateQuest({ theme, questNumber });
          
          results.push({
            success: true,
            theme,
            questNumber,
            questId: quest._id,
            title: quest.title,
            stages: quest.stages.length,
          });
          
          successCount++;
          console.log(`  ✅ Generated: ${quest.title}`);
          
          // Delay to avoid Gemini rate limiting (15 requests/min)
          if (successCount < 9) {
            console.log(`  ⏸️  Waiting 5 seconds to avoid rate limit...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        } catch (error) {
          console.error(`  ❌ Failed to generate ${theme} quest ${questNumber}:`, error);
          
          results.push({
            success: false,
            theme,
            questNumber,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          
          failCount++;
        }
      }
    }

    console.log(`\n🎉 Seeding complete! Success: ${successCount}, Failed: ${failCount}`);

    return NextResponse.json({
      success: true,
      message: `Generated ${successCount} out of 9 quests`,
      summary: {
        total: 9,
        successful: successCount,
        failed: failCount,
      },
      results,
    });
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed quests',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
