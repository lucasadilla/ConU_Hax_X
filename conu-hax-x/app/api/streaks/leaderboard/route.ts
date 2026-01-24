import { NextRequest, NextResponse } from 'next/server';
import StreakService from '@/services/streakService';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const leaderboard = await StreakService.getStreakLeaderboard(limit);

    return NextResponse.json({
      success: true,
      leaderboard: leaderboard.map(user => ({
        userId: user._id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalDaysActive: user.totalDaysActive,
      })),
    });
  } catch (error) {
    console.error('Failed to get streak leaderboard:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get leaderboard',
      },
      { status: 500 }
    );
  }
}
