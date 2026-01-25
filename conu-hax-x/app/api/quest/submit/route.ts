// API endpoint for submitting quest stage solutions
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import { EvaluationService } from '@/services/evaluationService';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      ticketId, 
      questId, 
      stageIndex, 
      code, 
      language = 'javascript',
      timeSpent = 0 
    } = body;

    // Validate required fields
    if (!ticketId || !code) {
      return NextResponse.json(
        { error: 'Missing required fields: ticketId, code' },
        { status: 400 }
      );
    }

    if (questId !== undefined && stageIndex === undefined) {
      return NextResponse.json(
        { error: 'stageIndex is required when questId is provided' },
        { status: 400 }
      );
    }

    // Submit solution
    console.log(`📝 Submitting solution for user ${user._id}, ticket ${ticketId}`);
    if (questId) {
      console.log(`🗺️  Quest: ${questId}, Stage: ${stageIndex}`);
    }

    const result = await EvaluationService.submitSolution({
      userId: user._id,
      ticketId,
      questId,
      stageIndex,
      code,
      language,
      timeSpent,
    });

    // Return detailed result
    return NextResponse.json({
      success: true,
      attempt: {
        id: result.attempt._id,
        passed: result.attempt.passed,
        score: result.attempt.score,
        testResults: result.attempt.testResults.map(tr => ({
          ...tr,
          // Hide actual output for hidden test cases if they failed
          actualOutput: tr.isHidden && !tr.passed ? '[Hidden]' : tr.actualOutput,
        })),
        evaluation: result.attempt.evaluation,
      },
      quest: questId ? {
        questCompleted: result.questCompleted,
        nextStageUnlocked: result.nextStageUnlocked,
        nextStageIndex: result.nextStageIndex,
      } : undefined,
      rewards: {
        badgeAwarded: result.badgeAwarded,
        nftMinted: result.nftMinted,
      },
    });

  } catch (error: any) {
    console.error('Error submitting solution:', error);
    
    // Return user-friendly error
    return NextResponse.json(
      { 
        error: error.message || 'Failed to submit solution',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
