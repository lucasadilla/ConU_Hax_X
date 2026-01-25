import { NextResponse } from 'next/server';
import StatsService from '@/services/statsService';

export async function GET() {
    try {
        const stats = await StatsService.getGlobalStats();

        return NextResponse.json({
            success: true,
            stats,
        });
    } catch (error) {
        console.error('Failed to get global stats:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to get global stats',
            },
            { status: 500 }
        );
    }
}
