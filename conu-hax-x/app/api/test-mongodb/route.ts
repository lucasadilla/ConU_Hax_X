import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getConnectionStatus } from '@/lib/mongodb';
import User from '@/models/User';
import Ticket from '@/models/Ticket';
import Attempt from '@/models/Attempt';
import Badge from '@/models/Badge';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    const status = getConnectionStatus();

    // Get collection stats
    const userCount = await User.countDocuments();
    const ticketCount = await Ticket.countDocuments();
    const attemptCount = await Attempt.countDocuments();
    const badgeCount = await Badge.countDocuments();

    return NextResponse.json({
      success: true,
      message: 'MongoDB connected successfully!',
      connection: {
        status,
        database: 'conuhacks',
        uri: process.env.MONGODB_URI?.split('@')[1] || 'connected',
      },
      collections: {
        users: userCount,
        tickets: ticketCount,
        attempts: attemptCount,
        badges: badgeCount,
      },
      models: {
        User: 'Ready',
        Ticket: 'Ready',
        Attempt: 'Ready',
        Badge: 'Ready',
      },
    });
  } catch (error) {
    console.error('MongoDB test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to connect to MongoDB',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    await connectToDatabase();

    if (action === 'create-test-user') {
      // Create a test user
      const testUser = await User.create({
        username: `testuser_${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        displayName: 'Test User',
        preferredLanguage: 'javascript',
      });

      return NextResponse.json({
        success: true,
        message: 'Test user created',
        user: {
          id: testUser._id,
          username: testUser.username,
          email: testUser.email,
        },
      });
    }

    if (action === 'create-test-ticket') {
      // Create a test ticket
      const testTicket = await Ticket.create({
        title: 'Sum of Array Elements',
        description: 'Write a function that calculates the sum of all elements in an array.',
        difficulty: 'easy',
        language: 'javascript',
        category: 'arrays',
        points: 100,
        examples: [
          {
            input: '[1, 2, 3, 4, 5]',
            output: '15',
            explanation: 'The sum of all numbers is 15',
          },
        ],
        constraints: ['Array length >= 1', 'All elements are integers'],
        hints: ['Use a loop', 'Consider using reduce()'],
        testCases: [
          {
            input: '[1, 2, 3]',
            expectedOutput: '6',
            isHidden: false,
          },
          {
            input: '[10, 20, 30]',
            expectedOutput: '60',
            isHidden: false,
          },
          {
            input: '[-5, 5]',
            expectedOutput: '0',
            isHidden: true,
          },
        ],
        tags: ['array', 'basics', 'iteration'],
      });

      return NextResponse.json({
        success: true,
        message: 'Test ticket created',
        ticket: {
          id: testTicket._id,
          title: testTicket.title,
          difficulty: testTicket.difficulty,
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });
  } catch (error) {
    console.error('MongoDB operation failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform MongoDB operation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
