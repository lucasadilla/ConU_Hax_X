// Gemini API integration for ticket generation and evaluation
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

// Initialize the Gemini API client with v1 API (not v1beta)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model configuration
// Use latest available Gemini 2.5 Flash model
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Get the Gemini model instance
 * @param model - Optional model name (defaults to gemini-2.5-flash)
 */
export function getModel(model: string = MODEL_NAME) {
  // Use v1 API version for stable models
  return genAI.getGenerativeModel({ 
    model,
    // Use v1 instead of v1beta for stable models
  });
}

/**
 * Generate content using Gemini AI
 * @param prompt - The prompt to send to Gemini
 * @param model - Optional model name
 * @returns Generated text response
 */
export async function generateContent(
  prompt: string,
  model: string = MODEL_NAME
): Promise<string> {
  // Try multiple models as fallback (using available Gemini 2.x/3.x models)
  const modelsToTry = [
    model,
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.5-pro',
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const geminiModel = getModel(modelName);
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      lastError = error;
      // Continue to next model
    }
  }

  console.error('Error generating content with Gemini:', lastError);
  throw new Error(`Failed to generate content: ${lastError?.message || 'Unknown'}`);
}

/**
 * Generate content with structured output using chat
 * @param systemPrompt - System instructions for the model
 * @param userPrompt - User message
 * @param model - Optional model name
 * @returns Generated text response
 */
export async function generateWithContext(
  systemPrompt: string,
  userPrompt: string,
  model: string = MODEL_NAME
): Promise<string> {
  // Try multiple models as fallback (using available Gemini 2.x/3.x models)
  const modelsToTry = [
    model,
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.5-pro',
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}`);
      const geminiModel = getModel(modelName);
      const chat = geminiModel.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }],
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I will follow these instructions.' }],
          },
        ],
      });

      const result = await chat.sendMessage(userPrompt);
      const response = await result.response;
      console.log(`✅ Success with model: ${modelName}`);
      return response.text();
    } catch (error: any) {
      console.error(`❌ Failed with model ${modelName}:`, error.message);
      lastError = error;
      // Continue to next model
    }
  }

  // If all models failed, throw the last error with details
  console.error('All models failed. Last error:', lastError);
  throw new Error(`Failed to generate content with context. Last error: ${lastError?.message || 'Unknown'}`);
}

/**
 * Generate streaming content
 * @param prompt - The prompt to send to Gemini
 * @param model - Optional model name
 * @returns Async generator for streaming response
 */
export async function* generateStreamingContent(
  prompt: string,
  model: string = MODEL_NAME
): AsyncGenerator<string, void, unknown> {
  try {
    const geminiModel = getModel(model);
    const result = await geminiModel.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  } catch (error) {
    console.error('Error generating streaming content:', error);
    throw new Error('Failed to generate streaming content');
  }
}

/**
 * Validate code using Gemini AI
 * @param code - The code to validate
 * @param language - Programming language
 * @returns Validation result and feedback
 */
export async function validateCode(
  code: string,
  language: string
): Promise<{
  isValid: boolean;
  feedback: string;
  suggestions: string[];
}> {
  try {
    const prompt = `
You are a code reviewer. Analyze the following ${language} code and provide feedback.

Code:
\`\`\`${language}
${code}
\`\`\`

Provide your response in the following JSON format:
{
  "isValid": true/false,
  "feedback": "Overall feedback",
  "suggestions": ["suggestion 1", "suggestion 2"]
}
`;

    const response = await generateContent(prompt);
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
    const jsonText = jsonMatch ? jsonMatch[1] : response;
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error validating code:', error);
    return {
      isValid: false,
      feedback: 'Failed to validate code',
      suggestions: [],
    };
  }
}

/**
 * Evaluate a coding solution
 * @param problem - The problem statement
 * @param solution - The user's solution
 * @param language - Programming language
 * @returns Evaluation result with score and feedback
 */
export async function evaluateSolution(
  problem: string,
  solution: string,
  language: string
): Promise<{
  score: number;
  passed: boolean;
  feedback: string;
  strengths: string[];
  improvements: string[];
}> {
  try {
    const prompt = `
You are a coding challenge evaluator. Evaluate the following solution.

Problem:
${problem}

Solution (${language}):
\`\`\`${language}
${solution}
\`\`\`

Provide your evaluation in the following JSON format:
{
  "score": 0-100,
  "passed": true/false,
  "feedback": "Overall feedback",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}
`;

    const response = await generateContent(prompt);
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
    const jsonText = jsonMatch ? jsonMatch[1] : response;
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error evaluating solution:', error);
    return {
      score: 0,
      passed: false,
      feedback: 'Failed to evaluate solution',
      strengths: [],
      improvements: [],
    };
  }
}

export default {
  getModel,
  generateContent,
  generateWithContext,
  generateStreamingContent,
  validateCode,
  evaluateSolution,
};
