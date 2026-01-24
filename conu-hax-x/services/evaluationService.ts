// Service for evaluating code solutions
import { connectToDatabase } from '@/lib/mongodb';
import Attempt, { IAttempt, ITestResult } from '@/models/Attempt';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import { generateWithContext } from '@/lib/gemini';
import {
  EVALUATE_SOLUTION_SYSTEM_PROMPT,
  evaluateSolutionPrompt,
  getBadgeLevel,
} from '@/prompts/evaluateSolution';
import BadgeService from './badgeService';
import TicketService from './ticketService';
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
      code,
      language,
      timeSpent,
      status: 'pending',
    });

    try {
      // Run test cases (simplified - in production, use sandbox)
      const testResults = await this.runTestCases(code, ticket.testCases, language);
      attempt.testResults = testResults;

      // Calculate basic score from tests
      const passedTests = testResults.filter(r => r.passed).length;
      const totalTests = testResults.length;
      const testScore = (passedTests / totalTests) * 100;

      // Get AI evaluation
      const testResultsData = {
        passed: passedTests,
        failed: totalTests - passedTests,
        total: totalTests,
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
      attempt.passed = evaluation.passed;
      attempt.status = 'completed';

      await attempt.save();

      // Update ticket stats
      await TicketService.updateTicketStats(ticketId, evaluation.score, evaluation.passed);

      // Update user stats if passed
      if (evaluation.passed) {
        const user = await User.findById(userId);
        if (user) {
          user.completeTicket(ticket.points);
          await user.save();

          // Award badge
          const badgeLevel = getBadgeLevel(evaluation.score);
          if (badgeLevel !== 'none') {
            await BadgeService.awardCompletionBadge(
              userId,
              ticketId,
              evaluation.score,
              ticket.title
            );
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
    language: string
  ): Promise<ITestResult[]> {
    // This is a simplified version
    // In production, use a secure sandbox environment
    const results: ITestResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        // Simplified test execution
        // In production, use docker/vm sandbox
        const passed = Math.random() > 0.3; // Simulate test results
        
        results.push({
          testCaseIndex: i,
          passed,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: passed ? testCase.expectedOutput : 'Different output',
        });
      } catch (error) {
        results.push({
          testCaseIndex: i,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
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
