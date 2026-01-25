import { NextRequest, NextResponse } from 'next/server';
import LeaderboardService from '@/services/leaderboardService';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await params;

    const ranks = await LeaderboardService.getUserRank(userId);

    return NextResponse.json({
      success: true,
      ranks,
    });
  } catch (error) {
    console.error('Failed to get user rank:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get user rank',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
