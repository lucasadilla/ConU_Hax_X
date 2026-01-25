import { NextRequest, NextResponse } from 'next/server';
import LeaderboardService from '@/services/leaderboardService';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || 'xp';
    const limit = parseInt(url.searchParams.get('limit') || '100');

    let leaderboard;

    switch (category) {
      case 'xp':
        leaderboard = await LeaderboardService.getXPLeaderboard(limit);
        break;
      case 'points':
        leaderboard = await LeaderboardService.getPointsLeaderboard(limit);
        break;
      case 'streak':
        leaderboard = await LeaderboardService.getStreakLeaderboard(limit);
        break;
      case 'completed':
        leaderboard = await LeaderboardService.getCompletedLeaderboard(limit);
        break;
      default:
        leaderboard = await LeaderboardService.getXPLeaderboard(limit);
    }

    const stats = await LeaderboardService.getLeaderboardStats();

    return NextResponse.json({
      success: true,
      leaderboard,
      stats,
      category,
    });
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get leaderboard',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
