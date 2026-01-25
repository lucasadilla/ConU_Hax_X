import { NextRequest, NextResponse } from 'next/server';
import TicketService from '@/services/ticketService';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Ticket id is required' },
        { status: 400 }
      );
    }

    const ticket = await TicketService.getTicketById(id);

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

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
        category: raw.category ?? 'General',
        tags: Array.isArray(raw.tags) ? raw.tags : [],
        points: typeof raw.points === 'number' ? raw.points : 0,
        timeLimit: typeof raw.timeLimit === 'number' ? raw.timeLimit : undefined,
        examples: Array.isArray(raw.examples) ? raw.examples : [],
        constraints: Array.isArray(raw.constraints) ? raw.constraints : [],
        hints: Array.isArray(raw.hints) ? raw.hints : [],
        testCases: Array.isArray(raw.testCases) ? raw.testCases : [],
        codeFiles: Array.isArray(raw.codeFiles) ? raw.codeFiles : [],
        docsLinks: Array.isArray(raw.docsLinks) ? raw.docsLinks : [],
        attemptCount: typeof raw.attemptCount === 'number' ? raw.attemptCount : undefined,
        successRate: typeof raw.successRate === 'number' ? raw.successRate : undefined,
      },
    });
  } catch (error) {
    console.error('Failed to fetch ticket:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ticket',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
