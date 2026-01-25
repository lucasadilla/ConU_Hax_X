// Service for evaluating code solutions
import { connectToDatabase } from '@/lib/mongodb';
import Attempt, { IAttempt, ITestResult } from '@/models/Attempt';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import { Quest, UserQuestProgress } from '@/models/Quest';
import { generateWithContext } from '@/lib/gemini';
import {
  EVALUATE_SOLUTION_SYSTEM_PROMPT,
  evaluateSolutionPrompt,
  getBadgeLevel,
} from '@/prompts/evaluateSolution';
import BadgeService from './badgeService';
import TicketService from './ticketService';
import StreakService from './streakService';
import SimpleExecutor from './simpleExecutor';
import QuestProgressService from './questProgressService';
import { awardBadge, mintCompletionNFT } from './nftRewardService';
import mongoose from 'mongoose';

export interface SubmitSolutionData {
  userId: string | mongoose.Types.ObjectId;
  ticketId: string | mongoose.Types.ObjectId;
  questId?: string | mongoose.Types.ObjectId;
  stageIndex?: number;
  code: string;
  language: string;
  timeSpent: number;
}

export interface EvaluationResult {
  attempt: IAttempt;
  questCompleted?: boolean;
  nextStageUnlocked?: boolean;
  nextStageIndex?: number;
  badgeAwarded?: boolean;
  nftMinted?: boolean;
}

export class EvaluationService {
  /**
   * Submit and evaluate a solution
   */
  static async submitSolution(data: SubmitSolutionData): Promise<EvaluationResult> {
    await connectToDatabase();

    const { userId, ticketId, questId, stageIndex, code, language, timeSpent } = data;

    // Get ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Validate quest access if this is part of a quest
    if (questId !== undefined && stageIndex !== undefined) {
      const accessCheck = await QuestProgressService.canAccessStage(userId, questId, stageIndex);
      if (!accessCheck.canAccess) {
        throw new Error(accessCheck.reason || 'Cannot access this stage');
      }
    }

    // Create attempt
    const attempt = await Attempt.create({
      userId,
      ticketId,
      code,
      language,
      timeSpent,
      status: 'pending',
    });

    try {
      attempt.status = 'running';
      await attempt.save();

      // Run test cases using SimpleExecutor
      console.log(`🧪 Running test cases for ticket ${ticketId}...`);
      const testExecution = await SimpleExecutor.executeTests(
        code,
        ticket.testCases,
        language
      );
      
      attempt.testResults = testExecution.testResults;
      
      console.log(`✅ Tests completed: ${testExecution.passedCount}/${testExecution.totalCount} passed`);

      // Calculate basic score from tests
      const testScore = testExecution.totalCount > 0 
        ? (testExecution.passedCount / testExecution.totalCount) * 100 
        : 0;

      // Get AI evaluation for code quality
      const testResultsData = {
        passed: testExecution.passedCount,
        failed: testExecution.failedCount,
        total: testExecution.totalCount,
      };

      const prompt = evaluateSolutionPrompt(
        ticket.description,
        code,
        language,
        testResultsData
      );

      const response = await generateWithContext(
        EVALUATE_SOLUTION_SYSTEM_PROMPT,
        prompt
      );

      // Parse evaluation
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : response;
      const evaluation = JSON.parse(jsonText);

      attempt.evaluation = evaluation;
      attempt.score = evaluation.score;
      attempt.passed = evaluation.passed && testExecution.passed; // Must pass both tests and AI evaluation
      attempt.status = 'completed';

      await attempt.save();

      // Update ticket stats
      await TicketService.updateTicketStats(ticketId, evaluation.score, attempt.passed);

      const result: EvaluationResult = { attempt };

      // Update user stats if passed
      if (attempt.passed) {
        const user = await User.findById(userId);
        if (user) {
          user.completeTicket(ticket.points);
          await user.save();

          // Award badge (always, regardless of wallet connection)
          const badgeLevel = getBadgeLevel(evaluation.score);
          if (badgeLevel !== 'none') {
            await BadgeService.awardCompletionBadge(
              userId,
              ticketId,
              evaluation.score,
              ticket.title
            );
          }

          // Handle quest progression if this is part of a quest
          if (questId !== undefined && stageIndex !== undefined) {
            console.log(`🗺️  Updating quest progress for quest ${questId}, stage ${stageIndex}...`);
            
            const progressUpdate = await QuestProgressService.completeStage(
              userId,
              questId,
              stageIndex,
              evaluation.score,
              attempt._id,
              timeSpent
            );

            result.questCompleted = progressUpdate.questCompleted;
            result.nextStageUnlocked = progressUpdate.nextStageUnlocked;
            result.nextStageIndex = progressUpdate.nextStageIndex;

            if (progressUpdate.questCompleted) {
              console.log(`🎉 Quest completed! User ${userId} finished quest ${questId}`);
            } else if (progressUpdate.nextStageUnlocked) {
              console.log(`🔓 Stage ${progressUpdate.nextStageIndex} unlocked for user ${userId}`);
            }
          }

          // Award off-chain badge for NFT system
          console.log('🎖️  Awarding badge for quest completion...');
          const badgeAwarded = await awardBadge(
            userId.toString(),
            ticketId.toString()
          );

          result.badgeAwarded = badgeAwarded;

          if (badgeAwarded) {
            console.log('✅ Badge awarded successfully');

            // If user has connected Phantom wallet, mint NFT
            if (user.phantomWalletAddress) {
              console.log('🎁 User has Phantom wallet, minting NFT...');
              const nftAddress = await mintCompletionNFT(
                userId.toString(),
                ticketId.toString()
              );

              if (nftAddress) {
                console.log(`✅ NFT minted successfully: ${nftAddress}`);
                result.nftMinted = true;
              } else {
                console.log('⚠️  NFT minting failed or skipped (check logs above)');
                result.nftMinted = false;
              }
            } else {
              console.log('💎 No Phantom wallet connected - badge remains off-chain');
              console.log('   User can connect wallet later to claim as NFT');
              result.nftMinted = false;
            }
          }

          // Update daily streak
          const streakUpdate = await StreakService.updateStreak(userId);
          
          // Log streak info
          if (streakUpdate.streakIncreased) {
            console.log(`🔥 User streak increased to ${streakUpdate.currentStreak} days`);
          }
          if (streakUpdate.streakBroken) {
            console.log(`💔 User streak was broken, starting new streak`);
          }
          if (streakUpdate.milestoneReached) {
            console.log(`🎉 Streak milestone reached: ${streakUpdate.milestoneReached.badgeName}`);
          }
        }
      } else {
        console.log(`❌ Solution did not pass: ${testExecution.passedCount}/${testExecution.totalCount} tests passed`);
      }

      return result;
    } catch (error) {
      attempt.status = 'error';
      await attempt.save();
      throw error;
    }
  }

  /**
   * Get user attempts for a ticket
   */
  static async getUserAttempts(
    userId: string | mongoose.Types.ObjectId,
    ticketId?: string | mongoose.Types.ObjectId
  ): Promise<IAttempt[]> {
    await connectToDatabase();

    const query: any = { userId };
    if (ticketId) query.ticketId = ticketId;

    return Attempt.find(query)
      .sort({ createdAt: -1 })
      .populate('ticketId');
  }

  /**
   * Get attempt by ID
   */
  static async getAttemptById(attemptId: string | mongoose.Types.ObjectId): Promise<IAttempt | null> {
    await connectToDatabase();

    return Attempt.findById(attemptId)
      .populate('userId')
      .populate('ticketId');
  }

  /**
   * Get best attempt for a ticket
   */
  static async getBestAttempt(
    userId: string | mongoose.Types.ObjectId,
    ticketId: string | mongoose.Types.ObjectId
  ): Promise<IAttempt | null> {
    await connectToDatabase();

    const attempts = await Attempt.find({ userId, ticketId })
      .sort({ score: -1 })
      .limit(1);

    return attempts[0] || null;
  }
}

export default EvaluationService;
