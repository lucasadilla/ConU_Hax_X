// Service for managing quests and quest progression
import { connectToDatabase } from '@/lib/mongodb';
import Quest, { UserQuestProgress, IQuest, IUserQuestProgress, QuestTheme } from '@/models/Quest';
import Ticket from '@/models/Ticket';
import Badge from '@/models/Badge';
import { generateWithContext } from '@/lib/gemini';
import {
  GENERATE_QUEST_SYSTEM_PROMPT,
  generateQuestPrompt,
  QUEST_THEMES,
} from '@/prompts/generateQuest';
import mongoose from 'mongoose';

export interface GenerateQuestData {
  theme: QuestTheme;
  questNumber: number;
}

export class QuestService {
  /**
   * Generate a complete quest with 3 stages using Gemini AI
   */
  static async generateQuest(data: GenerateQuestData): Promise<IQuest> {
    await connectToDatabase();

    const { theme, questNumber } = data;

    // Generate quest using Gemini
    const prompt = generateQuestPrompt(theme, questNumber);
    const response = await generateWithContext(
      GENERATE_QUEST_SYSTEM_PROMPT,
      prompt
    );

    // Parse response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
    const jsonText = jsonMatch ? jsonMatch[1] : response;
    const questData = JSON.parse(jsonText);

    // Create tickets for each stage
    const stageTickets = [];
    for (let i = 0; i < 3; i++) {
      const stageData = questData.stages[i];
      
      const ticket = await Ticket.create({
        title: `${questData.questTitle} - Stage ${i + 1}: ${stageData.title}`,
        description: stageData.description,
        difficulty: stageData.difficulty,
        language: 'typescript',
        category: theme,
        points: stageData.difficulty === 'easy' ? 50 : stageData.difficulty === 'medium' ? 100 : 200,
        examples: [],
        constraints: stageData.requirements || [],
        hints: stageData.hints || [],
        testCases: stageData.testCases || [],
        tags: [...(questData.tags || []), theme, stageData.difficulty],
        generatedBy: 'ai',
        timeLimit: stageData.difficulty === 'easy' ? 30 : stageData.difficulty === 'medium' ? 45 : 60,
      });

      stageTickets.push({
        difficulty: stageData.difficulty,
        ticketId: ticket._id,
        order: i + 1,
        unlocked: i === 0, // Only first stage is unlocked initially
      });
    }

    // Create quest
    const themeData = QUEST_THEMES[theme.toUpperCase().replace('-', '_') as keyof typeof QUEST_THEMES];
    
    const quest = await Quest.create({
      title: questData.questTitle,
      description: questData.questDescription,
      theme,
      iconEmoji: themeData.iconEmoji,
      stages: stageTickets,
      badgeName: questData.badgeName || `${questData.questTitle} Master`,
      badgeDescription: questData.badgeDescription || `Completed all stages of ${questData.questTitle}`,
      badgePoints: 300,
      badgeColor: themeData.color,
      estimatedTime: questData.estimatedTime || 90,
      tags: questData.tags || [],
      techStack: ['Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'MongoDB'],
    });

    return quest;
  }

  /**
   * Get all quests
   */
  static async getAllQuests(): Promise<IQuest[]> {
    await connectToDatabase();
    return Quest.find({ isActive: true })
      .populate('stages.ticketId')
      .sort({ createdAt: 1 });
  }

  /**
   * Get quests by theme
   */
  static async getQuestsByTheme(theme: QuestTheme): Promise<IQuest[]> {
    await connectToDatabase();
    return Quest.find({ theme, isActive: true })
      .populate('stages.ticketId')
      .sort({ createdAt: 1 });
  }

  /**
   * Get quest by ID
   */
  static async getQuestById(questId: string | mongoose.Types.ObjectId): Promise<IQuest | null> {
    await connectToDatabase();
    return Quest.findById(questId).populate('stages.ticketId');
  }

  /**
   * Start a quest for a user
   */
  static async startQuest(
    userId: string | mongoose.Types.ObjectId,
    questId: string | mongoose.Types.ObjectId
  ): Promise<IUserQuestProgress> {
    await connectToDatabase();

    // Check if already started
    let progress = await UserQuestProgress.findOne({ userId, questId });
    
    if (!progress) {
      progress = await UserQuestProgress.create({
        userId,
        questId,
        currentStage: 0,
        completedStages: [],
        isCompleted: false,
        totalTimeSpent: 0,
        badgeAwarded: false,
        stageScores: [],
      });
    }

    return progress;
  }

  /**
   * Complete a quest stage
   */
  static async completeStage(
    userId: string | mongoose.Types.ObjectId,
    questId: string | mongoose.Types.ObjectId,
    stageIndex: number,
    score: number,
    attemptId: mongoose.Types.ObjectId,
    timeSpent: number
  ): Promise<IUserQuestProgress> {
    await connectToDatabase();

    const progress = await UserQuestProgress.findOne({ userId, questId });
    if (!progress) {
      throw new Error('Quest not started');
    }

    // Complete the stage
    progress.completeStage(stageIndex, score, attemptId);
    progress.totalTimeSpent += timeSpent;

    // If quest completed, award badge
    if (progress.isCompleted && !progress.badgeAwarded) {
      const quest = await Quest.findById(questId);
      if (quest) {
        const badge = await Badge.create({
          userId,
          name: quest.badgeName,
          description: quest.badgeDescription,
          type: 'gold',
          category: 'completion',
          achievedFor: `Completed quest: ${quest.title}`,
          color: quest.badgeColor,
          rarity: 'epic',
          pointsAwarded: quest.badgePoints,
        });

        progress.badgeAwarded = true;
        progress.badgeId = badge._id;

        // Update quest stats
        quest.completionCount += 1;
        quest.averageCompletionTime = 
          (quest.averageCompletionTime * (quest.completionCount - 1) + progress.totalTimeSpent) / 
          quest.completionCount;
        await quest.save();
      }
    }

    await progress.save();
    return progress;
  }

  /**
   * Get user's quest progress
   */
  static async getUserQuestProgress(
    userId: string | mongoose.Types.ObjectId,
    questId?: string | mongoose.Types.ObjectId
  ): Promise<IUserQuestProgress[]> {
    await connectToDatabase();

    const query: any = { userId };
    if (questId) query.questId = questId;

    return UserQuestProgress.find(query)
      .populate('questId')
      .populate('badgeId')
      .sort({ updatedAt: -1 });
  }

  /**
   * Get user's completed quests
   */
  static async getUserCompletedQuests(
    userId: string | mongoose.Types.ObjectId
  ): Promise<IUserQuestProgress[]> {
    await connectToDatabase();

    return UserQuestProgress.find({ userId, isCompleted: true })
      .populate('questId')
      .populate('badgeId')
      .sort({ completedAt: -1 });
  }

  /**
   * Check if user can access a stage (previous stage must be completed)
   */
  static async canAccessStage(
    userId: string | mongoose.Types.ObjectId,
    questId: string | mongoose.Types.ObjectId,
    stageIndex: number
  ): Promise<boolean> {
    await connectToDatabase();

    if (stageIndex === 0) return true; // First stage always accessible

    const progress = await UserQuestProgress.findOne({ userId, questId });
    if (!progress) return false;

    // Must have completed previous stage
    return progress.completedStages.includes(stageIndex - 1);
  }

  /**
   * Get quest statistics
   */
  static async getQuestStats(questId: string | mongoose.Types.ObjectId): Promise<{
    attemptCount: number;
    completionCount: number;
    completionRate: number;
    averageTime: number;
  }> {
    await connectToDatabase();

    const quest = await Quest.findById(questId);
    if (!quest) {
      throw new Error('Quest not found');
    }

    return {
      attemptCount: quest.attemptCount,
      completionCount: quest.completionCount,
      completionRate: quest.getCompletionRate(),
      averageTime: quest.averageCompletionTime,
    };
  }
}

export default QuestService;
