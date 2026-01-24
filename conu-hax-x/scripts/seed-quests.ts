// Script to seed all 9 quests into the database
// Run with: npx tsx scripts/seed-quests.ts

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

import { connectToDatabase } from '../lib/mongodb';
import QuestService from '../services/questService';
import { QuestTheme } from '../models/Quest';

async function seedQuests() {
  console.log('🌱 Starting quest seeding...\n');

  try {
    await connectToDatabase();
    console.log('✅ Connected to MongoDB\n');

    const themes: QuestTheme[] = ['regression', 'feature-creation', 'debugging'];
    const results = [];
    let successCount = 0;

    for (const theme of themes) {
      console.log(`\n📦 Generating ${theme} quests...`);
      
      for (let questNumber = 1; questNumber <= 3; questNumber++) {
        try {
          console.log(`  ⏳ Generating ${theme} quest ${questNumber}/3...`);
          
          const quest = await QuestService.generateQuest({ theme, questNumber });
          
          console.log(`  ✅ Generated: ${quest.title}`);
          console.log(`     - ${quest.stages.length} stages created`);
          console.log(`     - Badge: ${quest.badgeName}`);
          
          results.push({
            theme,
            questNumber,
            title: quest.title,
            id: quest._id.toString(),
          });
          
          successCount++;
          
          // Delay to avoid rate limiting
          if (successCount < 9) {
            console.log(`  ⏸️  Waiting 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        } catch (error) {
          console.error(`  ❌ Failed:`, error);
        }
      }
    }

    console.log(`\n\n🎉 Seeding complete!`);
    console.log(`✅ Successfully generated: ${successCount}/9 quests`);
    console.log(`\n📋 Generated Quests:`);
    results.forEach((r, i) => {
      console.log(`${i + 1}. [${r.theme}] ${r.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedQuests();
