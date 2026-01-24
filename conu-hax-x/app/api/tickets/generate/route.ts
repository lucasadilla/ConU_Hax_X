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

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket._id,
        title: ticket.title,
        description: ticket.description,
        difficulty: ticket.difficulty,
        language: ticket.language,
        examples: ticket.examples,
        constraints: ticket.constraints,
        hints: ticket.hints,
        testCases: ticket.testCases.filter(tc => !tc.isHidden), // Only visible tests
        tags: ticket.tags,
        points: ticket.points,
        timeLimit: ticket.timeLimit,
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
