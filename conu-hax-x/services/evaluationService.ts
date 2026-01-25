// Service for evaluating code solutions
import { connectToDatabase } from '@/lib/mongodb';
import Attempt, { IAttempt, ITestResult } from '@/models/Attempt';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import { generateWithContext } from '@/lib/gemini';
import { runTests } from '@/lib/runner';
import {
  EVALUATE_SOLUTION_SYSTEM_PROMPT,
  evaluateSolutionPrompt,
  getBadgeLevel,
} from '@/prompts/evaluateSolution';
import BadgeService from './badgeService';
import TicketService from './ticketService';
import StreakService from './streakService';
import { awardBadge, mintCompletionNFT } from './nftRewardService';
import mongoose from 'mongoose';

export interface SubmitSolutionData {
  userId: string | mongoose.Types.ObjectId;
  ticketId: string | mongoose.Types.ObjectId;
  code: string;
  language: string;
  timeSpent: number;
}

export class EvaluationService {
  /**
   * Submit and evaluate a solution
   */
  static async submitSolution(data: SubmitSolutionData): Promise<IAttempt> {
    await connectToDatabase();

    const { userId, ticketId, code, language, timeSpent } = data;

    // Get ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Create attempt
    const attempt = await Attempt.create({
      userId,
      ticketId,
      solution: code,
      code,
      language,
      timeSpent,
      status: 'pending',
    });

    try {
      // Run test cases (simplified - in production, use sandbox)
      const testResults = await this.runTestCases(
        code,
        ticket.testCases,
        language,
        ticket.solutionCode || undefined,
        ticket.validationCode || undefined
      );
      attempt.testResults = testResults;

      // Calculate basic score from tests
      const passedTests = testResults.filter(r => r.passed).length;
      const totalTests = testResults.length;
      const testScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

      // Get AI evaluation
      const testResultsData = {
        passed: passedTests,
        failed: totalTests - passedTests,
        total: totalTests,
      };

      let evaluation: any = null;

      try {
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

        const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
        const jsonText = jsonMatch ? jsonMatch[1] : response;
        evaluation = JSON.parse(jsonText);
      } catch (error) {
        const passed = totalTests > 0 ? passedTests === totalTests : false;
        evaluation = {
          score: Math.round(testScore),
          passed,
          feedback: 'Auto-evaluated based on tests (AI evaluation unavailable).',
        };
      }

      const testsPassed = totalTests > 0 && passedTests === totalTests;
      const normalizedScore = typeof evaluation?.score === 'number' ? evaluation.score : Math.round(testScore);
      const normalizedPassed = testsPassed || evaluation?.passed === true;

      attempt.evaluation = evaluation;
      attempt.score = normalizedScore;
      attempt.passed = normalizedPassed;
      attempt.status = 'completed';

      await attempt.save();

      // Update ticket stats
      await TicketService.updateTicketStats(ticketId, evaluation.score, evaluation.passed);

      // Update user stats if passed
      const alreadyPassed = await Attempt.findOne({
        userId,
        ticketId,
        passed: true,
        _id: { $ne: attempt._id },
      });

      const alreadyPassed = await Attempt.findOne({
        userId,
        ticketId,
        passed: true,
        _id: { $ne: attempt._id },
      });

      if (attempt.passed && !alreadyPassed) {
        const user = await User.findById(userId);
        if (user) {
          const pointsAwarded = ticket.points && ticket.points > 0 ? ticket.points : 0;
          user.completeTicket(pointsAwarded);
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

          // Award off-chain badge for NFT system
          console.log('🎖️  Awarding badge for quest completion...');
          const badgeAwarded = await awardBadge(
            userId.toString(),
            ticketId.toString()
          );

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
              } else {
                console.log('⚠️  NFT minting failed or skipped (check logs above)');
              }
            } else {
              console.log('💎 No Phantom wallet connected - badge remains off-chain');
              console.log('   User can connect wallet later to claim as NFT');
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
      }

      return attempt;
    } catch (error) {
      attempt.status = 'error';
      await attempt.save();
      throw error;
    }
  }

  /**
   * Run test cases (simplified version)
   * In production, this should use a secure sandbox
   */
  private static async runTestCases(
    code: string,
    testCases: any[],
    language: string,
    referenceCode?: string,
    validationCode?: string
  ): Promise<ITestResult[]> {
    return runTests({ code, language, testCases, referenceCode, validationCode }) as Promise<ITestResult[]>;
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
