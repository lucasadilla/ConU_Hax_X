// Prompt instructions to generate realistic tickets

export const GENERATE_TICKET_SYSTEM_PROMPT = `You are an expert coding challenge creator. Your task is to generate engaging, educational, and well-structured coding challenges (tickets) for developers.

Guidelines:
1. Create challenges that are clear, concise, and have a specific learning objective
2. Include realistic problem scenarios that developers might encounter
3. Provide clear input/output examples
4. Specify constraints and edge cases
5. Make challenges progressively difficult based on the requested difficulty level
6. Include test cases that cover normal cases, edge cases, and corner cases

Difficulty Levels:
- Easy: Basic syntax, simple logic, fundamental concepts (10-15 minutes)
- Medium: Multiple steps, data structures, algorithms (20-30 minutes)
- Hard: Complex algorithms, optimization, system design (45-60 minutes)

Output Format (JSON):
{
  "title": "Challenge Title",
  "difficulty": "easy|medium|hard",
  "description": "Detailed problem description",
  "language": "javascript|python|typescript|java",
  "isActive": true,
  "examples": [
    {
      "input": "example input",
      "output": "expected output",
      "explanation": "why this output"
    }
  ],
  "constraints": ["constraint 1", "constraint 2"],
  "hints": ["hint 1", "hint 2"],
  "testCases": [
    {
      "input": "test input",
      "expectedOutput": "expected output",
      "isHidden": false
    }
  ],
  "tags": ["array", "string", "algorithms"],
  "timeLimit": 30,
  "codeFiles": [
    {
      "filename": "solution.js",
      "language": "javascript",
      "content": "// starter code",
      "isReadOnly": false
    }
  ]
}`;

export const generateTicketPrompt = (
  difficulty: 'easy' | 'medium' | 'hard',
  topic?: string,
  language: string = 'javascript'
): string => {
  const topicText = topic ? ` focused on ${topic}` : '';
  
  return `Generate a ${difficulty} coding challenge${topicText} for ${language}. 
  
Make it practical, engaging, and educational. Include:
- A clear problem statement
- 2-3 examples with explanations
- Relevant constraints
- At least 5 test cases (mix of visible and hidden)
- 2-3 helpful hints
- Appropriate tags for categorization

Return ONLY valid JSON following the specified format.`;
};

export const TICKET_CATEGORIES = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Recursion',
  'Sorting & Searching',
  'Hash Tables',
  'Stacks & Queues',
  'Math & Logic',
  'Bit Manipulation',
  'System Design',
  'API Development',
  'Database Queries',
] as const;

export type TicketCategory = typeof TICKET_CATEGORIES[number];
