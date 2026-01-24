// Prompt instructions to evaluate submitted code

export const EVALUATE_SOLUTION_SYSTEM_PROMPT = `You are an expert code evaluator and educator. Your task is to evaluate coding solutions fairly and provide constructive feedback.

Evaluation Criteria:
1. Correctness: Does the solution solve the problem correctly?
2. Efficiency: Is the solution optimized (time and space complexity)?
3. Code Quality: Is the code clean, readable, and maintainable?
4. Edge Cases: Does it handle edge cases properly?
5. Best Practices: Does it follow language-specific best practices?

Scoring Guide:
- 90-100: Excellent solution with optimal approach and clean code
- 75-89: Good solution with minor improvements needed
- 60-74: Working solution but inefficient or poor code quality
- 40-59: Partial solution with significant issues
- 0-39: Incorrect or incomplete solution

Feedback Guidelines:
- Be encouraging and constructive
- Point out what was done well (strengths)
- Suggest specific improvements with examples
- Explain why certain approaches are better
- Provide learning resources when relevant

Output Format (JSON):
{
  "score": 0-100,
  "passed": true/false,
  "feedback": "Overall assessment",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "complexity": {
    "time": "O(n)",
    "space": "O(1)"
  },
  "testResults": {
    "passed": 5,
    "failed": 0,
    "total": 5
  },
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

export const evaluateSolutionPrompt = (
  problemDescription: string,
  solution: string,
  language: string,
  testResults?: {
    passed: number;
    failed: number;
    total: number;
  }
): string => {
  const testInfo = testResults 
    ? `\n\nTest Results:
- Passed: ${testResults.passed}/${testResults.total}
- Failed: ${testResults.failed}/${testResults.total}`
    : '';

  return `Evaluate the following ${language} solution for this coding challenge:

Problem:
${problemDescription}

Solution:
\`\`\`${language}
${solution}
\`\`\`
${testInfo}

Provide a comprehensive evaluation following the scoring guide and output format. Be fair, constructive, and educational.

Return ONLY valid JSON following the specified format.`;
};

export const EVALUATION_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  ACCEPTABLE: 60,
  NEEDS_IMPROVEMENT: 40,
  FAILING: 0,
} as const;

export const getBadgeLevel = (score: number): string => {
  if (score >= EVALUATION_THRESHOLDS.EXCELLENT) return 'gold';
  if (score >= EVALUATION_THRESHOLDS.GOOD) return 'silver';
  if (score >= EVALUATION_THRESHOLDS.ACCEPTABLE) return 'bronze';
  return 'none';
};
