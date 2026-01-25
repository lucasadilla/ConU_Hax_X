// Service for managing quest progression and unlocking stages
import { connectToDatabase } from '@/lib/mongodb';
import { Quest, UserQuestProgress, IQuest, IUserQuestProgress } from '@/models/Quest';
import Ticket from '@/models/Ticket';
import mongoose from 'mongoose';

export class QuestProgressService {
  /**
   * Initialize quest progress for a user
   */
  static async initializeQuestProgress(
    userId: string | mongoose.Types.ObjectId,
    questId: string | mongoose.Types.ObjectId
  ): Promise<IUserQuestProgress> {
    await connectToDatabase();

    // Check if progress already exists
    let progress = await UserQuestProgress.findOne({ userId, questId });
    
    if (!progress) {
      // Create new progress with first stage unlocked
      progress = await UserQuestProgress.create({
        userId,
        questId,
        currentStage: 0, // Start at stage 0 (easy)
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
   * Complete a quest stage and unlock the next one
   */
  static async completeStage(
    userId: string | mongoose.Types.ObjectId,
    questId: string | mongoose.Types.ObjectId,
    stageIndex: number,
    score: number,
    attemptId: mongoose.Types.ObjectId,
    timeSpent: number
  ): Promise<{
    progress: IUserQuestProgress;
    questCompleted: boolean;
    nextStageUnlocked: boolean;
    nextStageIndex?: number;
  }> {
    await connectToDatabase();

    // Get or create progress
    let progress = await UserQuestProgress.findOne({ userId, questId });
    
    if (!progress) {
      progress = await this.initializeQuestProgress(userId, questId);
    }

    // Check if stage is already completed
    if (progress.completedStages.includes(stageIndex)) {
      return {
        progress,
        questCompleted: progress.isCompleted,
        nextStageUnlocked: false,
      };
    }

    // Add completed stage
    progress.completedStages.push(stageIndex);
    progress.stageScores.push({ stageIndex, score, attemptId });
    progress.totalTimeSpent += timeSpent;

    let questCompleted = false;
    let nextStageUnlocked = false;
    let nextStageIndex: number | undefined;

    // Check if this is the last stage (stage 2 = hard)
    if (stageIndex === 2) {
      // Quest completed!
      progress.isCompleted = true;
      progress.completedAt = new Date();
      questCompleted = true;

      // Update quest statistics
      const quest = await Quest.findById(questId);
      if (quest) {
        quest.completionCount += 1;
        
        // Update average completion time
        if (quest.completionCount === 1) {
          quest.averageCompletionTime = progress.totalTimeSpent;
        } else {
          quest.averageCompletionTime = 
            (quest.averageCompletionTime * (quest.completionCount - 1) + progress.totalTimeSpent) 
            / quest.completionCount;
        }
        
        await quest.save();
      }
    } else {
      // Unlock next stage
      progress.currentStage = stageIndex + 1;
      nextStageUnlocked = true;
      nextStageIndex = stageIndex + 1;
    }

    await progress.save();

    return {
      progress,
      questCompleted,
      nextStageUnlocked,
      nextStageIndex,
    };
  }

  /**
   * Get user's progress for a quest
   */
  static async getQuestProgress(
    userId: string | mongoose.Types.ObjectId,
    questId: string | mongoose.Types.ObjectId
  ): Promise<IUserQuestProgress | null> {
    await connectToDatabase();
    
    return UserQuestProgress.findOne({ userId, questId })
      .populate('questId')
      .populate('badgeId');
  }

  /**
   * Get all quest progress for a user
   */
  static async getUserQuestProgresses(
    userId: string | mongoose.Types.ObjectId
  ): Promise<IUserQuestProgress[]> {
    await connectToDatabase();
    
    return UserQuestProgress.find({ userId })
      .populate('questId')
      .populate('badgeId')
      .sort({ updatedAt: -1 });
  }

  /**
   * Check if a user can access a specific stage
   */
  static async canAccessStage(
    userId: string | mongoose.Types.ObjectId,
    questId: string | mongoose.Types.ObjectId,
    stageIndex: number
  ): Promise<{ canAccess: boolean; reason?: string }> {
    await connectToDatabase();

    const progress = await this.getQuestProgress(userId, questId);

    // If no progress, can only access stage 0
    if (!progress) {
      if (stageIndex === 0) {
        return { canAccess: true };
      }
      return { 
        canAccess: false, 
        reason: 'Complete previous stages to unlock this stage' 
      };
    }

    // If quest is completed, can access any stage
    if (progress.isCompleted) {
      return { canAccess: true };
    }

    // Can access if stage is current or already completed
    if (stageIndex <= progress.currentStage || progress.completedStages.includes(stageIndex)) {
      return { canAccess: true };
    }

    return { 
      canAccess: false, 
      reason: `Complete Stage ${stageIndex} to unlock this stage` 
    };
  }

  /**
   * Get quest with populated stages
   */
  static async getQuestWithStages(
    questId: string | mongoose.Types.ObjectId
  ): Promise<IQuest | null> {
    await connectToDatabase();
    
    return Quest.findById(questId).populate('stages.ticketId');
  }

  /**
   * Get ticket for a specific quest stage
   */
  static async getStageTicket(
    questId: string | mongoose.Types.ObjectId,
    stageIndex: number
  ): Promise<any> {
    await connectToDatabase();

    const quest = await Quest.findById(questId);
    if (!quest) {
      throw new Error('Quest not found');
    }

    if (stageIndex < 0 || stageIndex >= quest.stages.length) {
      throw new Error('Invalid stage index');
    }

    const stage = quest.stages[stageIndex];
    const ticket = await Ticket.findById(stage.ticketId);

    if (!ticket) {
      throw new Error('Stage ticket not found');
    }

    return ticket;
  }

  /**
   * Get user's quest completion statistics
   */
  static async getUserQuestStats(
    userId: string | mongoose.Types.ObjectId
  ): Promise<{
    totalQuests: number;
    completedQuests: number;
    inProgressQuests: number;
    totalStagesCompleted: number;
    totalTimeSpent: number;
    averageScore: number;
  }> {
    await connectToDatabase();

    const progresses = await UserQuestProgress.find({ userId });

    const completedQuests = progresses.filter(p => p.isCompleted).length;
    const inProgressQuests = progresses.filter(p => !p.isCompleted && p.completedStages.length > 0).length;
    const totalStagesCompleted = progresses.reduce((sum, p) => sum + p.completedStages.length, 0);
    const totalTimeSpent = progresses.reduce((sum, p) => sum + p.totalTimeSpent, 0);

    // Calculate average score across all stages
    let totalScore = 0;
    let scoreCount = 0;
    
    progresses.forEach(p => {
      p.stageScores.forEach(s => {
        totalScore += s.score;
        scoreCount++;
      });
    });

    const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

    return {
      totalQuests: progresses.length,
      completedQuests,
      inProgressQuests,
      totalStagesCompleted,
      totalTimeSpent,
      averageScore,
    };
  }
}

export default QuestProgressService;
