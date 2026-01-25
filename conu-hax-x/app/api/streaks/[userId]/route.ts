import { NextRequest, NextResponse } from 'next/server';
import StreakService from '@/services/streakService';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await params;

    // Get streak info
    const streakInfo = await StreakService.getStreakInfo(userId);
    const nextMilestone = await StreakService.getNextMilestone(userId);
    const needsWarning = await StreakService.needsStreakWarning(userId);

    return NextResponse.json({
      success: true,
      streak: streakInfo,
      nextMilestone,
      needsWarning,
    });
  } catch (error) {
    console.error('Failed to get streak info:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get streak info',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
