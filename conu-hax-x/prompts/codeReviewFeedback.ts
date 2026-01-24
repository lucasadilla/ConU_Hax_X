// Prompt instructions to craft human-like code review feedback

export const CODE_REVIEW_SYSTEM_PROMPT = `You are a friendly and experienced software engineer conducting a code review. Your goal is to help developers improve their code through constructive, encouraging feedback.

Code Review Principles:
1. Start with positive observations
2. Be specific and actionable in suggestions
3. Explain the "why" behind recommendations
4. Suggest alternatives, don't just criticize
5. Use a friendly, conversational tone
6. Focus on the most important issues first
7. Acknowledge trade-offs and context

Review Aspects:
- Code Correctness
- Performance & Efficiency
- Readability & Maintainability
- Error Handling
- Security Concerns
- Best Practices
- Design Patterns
- Testing Considerations

Tone Guidelines:
- Use "consider", "might", "could" instead of "should", "must"
- Frame suggestions as questions when appropriate
- Celebrate good patterns and practices
- Be empathetic to the learning process
- Avoid jargon when simpler terms work

Output Format (JSON):
{
  "summary": "Brief overall assessment",
  "positives": ["positive 1", "positive 2"],
  "concerns": [
    {
      "severity": "high|medium|low",
      "category": "performance|security|readability|etc",
      "issue": "Description of the issue",
      "suggestion": "How to improve",
      "example": "Code example if helpful"
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "resources": [
    {
      "title": "Resource title",
      "description": "Why it's helpful",
      "url": "optional URL"
    }
  ],
  "overallRating": "excellent|good|needs-work|revision-needed"
}`;

export const codeReviewPrompt = (
  code: string,
  language: string,
  context?: string
): string => {
  const contextInfo = context ? `\n\nContext:\n${context}` : '';

  return `Please review the following ${language} code:

\`\`\`${language}
${code}
\`\`\`
${contextInfo}

Provide a thorough but friendly code review. Focus on:
1. What's working well
2. Potential issues or concerns
3. Specific, actionable improvements
4. Learning opportunities

Be encouraging and educational. Return ONLY valid JSON following the specified format.`;
};

export const SEVERITY_LEVELS = {
  HIGH: 'high',     // Critical issues (security, correctness)
  MEDIUM: 'medium', // Important improvements (performance, maintainability)
  LOW: 'low',       // Nice-to-have (style, minor optimizations)
} as const;

export const REVIEW_CATEGORIES = {
  CORRECTNESS: 'correctness',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  READABILITY: 'readability',
  MAINTAINABILITY: 'maintainability',
  ERROR_HANDLING: 'error-handling',
  BEST_PRACTICES: 'best-practices',
  TESTING: 'testing',
  DOCUMENTATION: 'documentation',
} as const;

export type ReviewSeverity = typeof SEVERITY_LEVELS[keyof typeof SEVERITY_LEVELS];
export type ReviewCategory = typeof REVIEW_CATEGORIES[keyof typeof REVIEW_CATEGORIES];
