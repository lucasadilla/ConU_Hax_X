import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not set' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
    ];

    const results = [];

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "Hello" if you can read this.');
        const response = await result.response;
        const text = response.text();
        
        results.push({
          model: modelName,
          success: true,
          response: text,
        });
      } catch (error: any) {
        results.push({
          model: modelName,
          success: false,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      workingModels: results.filter(r => r.success).map(r => r.model),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
