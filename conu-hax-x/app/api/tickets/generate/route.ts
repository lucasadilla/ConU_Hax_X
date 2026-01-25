import { NextRequest, NextResponse } from 'next/server';
import TicketService from '@/services/ticketService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      difficulty = 'medium', 
      topic, 
      language = 'javascript',
      saveToDatabase = true,
    } = body;

    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { success: false, error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    // Generate and save ticket using service
    const ticket = await TicketService.generateAndSaveTicket({
      difficulty,
      topic,
      language,
    });

    const raw = (ticket as any).toObject ? (ticket as any).toObject() : ticket;

    return NextResponse.json({
      success: true,
      ticket: {
        _id: raw._id?.toString?.() ?? raw.id,
        id: raw._id?.toString?.() ?? raw.id,
        title: raw.title,
        description: raw.description,
        difficulty: raw.difficulty,
        language: raw.language,
        isActive: typeof raw.isActive === 'boolean' ? raw.isActive : true,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        tags: Array.isArray(raw.tags) ? raw.tags : [],
        examples: Array.isArray(raw.examples) ? raw.examples : [],
        constraints: Array.isArray(raw.constraints) ? raw.constraints : [],
        hints: Array.isArray(raw.hints) ? raw.hints : [],
        testCases: Array.isArray(raw.testCases)
          ? raw.testCases.filter((tc: any) => !tc.isHidden)
          : [],
        codeFiles: Array.isArray(raw.codeFiles) ? raw.codeFiles : [],
        points: typeof raw.points === 'number' ? raw.points : 0,
        timeLimit: typeof raw.timeLimit === 'number' ? raw.timeLimit : undefined,
      },
    });
  } catch (error) {
    console.error('Failed to generate ticket:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate ticket',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
