import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  try {
    // Test the Gemini API with a simple prompt
    const response = await generateContent(
      'Say "Hello from ConuHacksX! The Gemini API is working correctly." in a friendly way.'
    );

    return NextResponse.json({
      success: true,
      message: 'Gemini API is configured correctly!',
      response: response,
      projectInfo: {
        name: process.env.GEMINI_PROJECT_NAME,
        projectId: process.env.GEMINI_PROJECT_ID,
      },
    });
  } catch (error) {
    console.error('Gemini API test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to connect to Gemini API',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await generateContent(prompt);

    return NextResponse.json({
      success: true,
      response: response,
    });
  } catch (error) {
    console.error('Gemini API request failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
