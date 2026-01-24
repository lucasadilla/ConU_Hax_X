import { NextRequest, NextResponse } from 'next/server';
import { generateWithContext } from '@/lib/gemini';
import {
  EVALUATE_SOLUTION_SYSTEM_PROMPT,
  evaluateSolutionPrompt,
} from '@/prompts/evaluateSolution';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      problemDescription,
      solution, 
      language = 'javascript',
      testResults 
    } = body;

    // Validate inputs
    if (!problemDescription || !solution) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Problem description and solution are required' 
        },
        { status: 400 }
      );
    }

    // Evaluate the solution using Gemini
    const prompt = evaluateSolutionPrompt(
      problemDescription,
      solution,
      language,
      testResults
    );
    
    const response = await generateWithContext(
      EVALUATE_SOLUTION_SYSTEM_PROMPT,
      prompt
    );

    // Parse the JSON response
    let evaluation;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : response;
      evaluation = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse evaluation JSON:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to parse evaluation',
          rawResponse: response 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      evaluation: evaluation,
    });
  } catch (error) {
    console.error('Failed to evaluate solution:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to evaluate solution',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
