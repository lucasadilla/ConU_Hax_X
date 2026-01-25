import { NextResponse } from 'next/server';
import StreakService from '@/services/streakService';

export async function GET() {
  try {
    const milestones = StreakService.getStreakMilestones();

    return NextResponse.json({
      success: true,
      milestones,
    });
  } catch (error) {
    console.error('Failed to get milestones:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get milestones',
      },
      { status: 500 }
    );
  }
}
