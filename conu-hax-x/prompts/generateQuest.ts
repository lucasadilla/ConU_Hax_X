// Prompt instructions to generate themed quests with 3-stage progression

export const GENERATE_QUEST_SYSTEM_PROMPT = `You are an expert at creating realistic, practical coding challenges that simulate real-world software development scenarios.

Your task is to generate a QUEST - a series of 3 interconnected coding challenges that tell a story and build upon each other.

Tech Stack (MUST USE EXCLUSIVELY):
- Next.js (React framework)
- TypeScript
- Node.js
- TailwindCSS
- MongoDB

Quest Structure:
- Stage 1 (Easy): Foundation/Setup - 20-30 minutes
- Stage 2 (Medium): Implementation/Enhancement - 30-45 minutes  
- Stage 3 (Hard): Advanced/Optimization - 45-60 minutes

Each stage should:
1. Build upon the previous stage's code
2. Present a realistic scenario
3. Have clear acceptance criteria
4. Include test cases
5. Use the specified tech stack exclusively

Output Format (JSON):
{
  "questTitle": "Quest name (max 100 chars)",
  "questDescription": "Overall quest story/goal (max 400 chars - IMPORTANT: Keep this SHORT!)",
  "theme": "regression|feature-creation|debugging",
  "iconEmoji": "🐛|✨|🔧",
  "estimatedTime": 90,
  "stages": [
    {
      "difficulty": "easy",
      "title": "Stage title",
      "description": "What to build/fix",
      "scenario": "Real-world context",
      "startingCode": "Initial code provided",
      "requirements": ["req 1", "req 2"],
      "hints": ["hint 1", "hint 2"],
      "testCases": [
        {
          "input": "test input",
          "expectedOutput": "expected output",
          "isHidden": false
        }
      ],
      "acceptanceCriteria": ["criteria 1", "criteria 2"]
    }
  ],
  "badgeName": "Badge name",
  "badgeDescription": "What this badge represents",
  "tags": ["nextjs", "typescript", "mongodb"]
}`;

export const QUEST_THEMES = {
  REGRESSION: {
    name: 'regression',
    displayName: 'Regression & Technical Debt',
    description: 'Fix bugs, refactor code, and eliminate technical debt',
    iconEmoji: '🐛',
    color: '#ff6b6b',
    scenarios: [
      'A feature that worked is now broken after updates',
      'Legacy code needs refactoring',
      'Performance degradation after new features',
      'Memory leaks and optimization issues',
      'Breaking changes after dependency updates',
    ],
  },
  FEATURE_CREATION: {
    name: 'feature-creation',
    displayName: 'Feature Creation',
    description: 'Build new features from scratch',
    iconEmoji: '✨',
    color: '#4ade80',
    scenarios: [
      'Client requests a new dashboard feature',
      'Add authentication to an app',
      'Build a real-time notification system',
      'Create an admin panel',
      'Implement data visualization',
    ],
  },
  DEBUGGING: {
    name: 'debugging',
    displayName: 'Debugging & Problem Solving',
    description: 'Hunt down bugs and solve complex issues',
    iconEmoji: '🔧',
    color: '#f7c948',
    scenarios: [
      'Users reporting intermittent crashes',
      'Data not saving correctly',
      'UI rendering incorrectly',
      'API calls timing out',
      'Database queries running slowly',
    ],
  },
} as const;

export const generateQuestPrompt = (
  theme: QuestTheme,
  questNumber: number // 1, 2, or 3 for variety
): string => {
  const themeData = QUEST_THEMES[theme.toUpperCase().replace('-', '_') as keyof typeof QUEST_THEMES];
  
  return `Generate a practical ${themeData.displayName} quest for a Next.js + TypeScript + MongoDB application.

CRITICAL: Keep the questDescription under 400 characters (2-3 sentences maximum).

Generate a practical ${themeData.displayName} quest for a Next.js + TypeScript + MongoDB application.

Theme: ${themeData.displayName}
Icon: ${themeData.iconEmoji}
Scenario Type: ${themeData.scenarios[questNumber % themeData.scenarios.length]}

Create 3 progressive stages:

STAGE 1 (EASY) - 20-30 minutes:
- Set up the foundation
- Identify the problem or requirements
- Create basic structure with Next.js components
- Use TypeScript interfaces
- Set up MongoDB schema if needed

STAGE 2 (MEDIUM) - 30-45 minutes:
- Implement core functionality
- Add TailwindCSS styling
- Connect to MongoDB
- Handle edge cases
- Add proper error handling

STAGE 3 (HARD) - 45-60 minutes:
- Optimize and enhance
- Add advanced features
- Performance optimization
- Complete testing
- Production-ready code

Requirements for ALL stages:
- Must use Next.js App Router
- Must use TypeScript (strict typing)
- Must use TailwindCSS for styling
- Must use MongoDB for data persistence
- Must use Node.js APIs
- Must include realistic starting code
- Must have clear test cases
- Must build upon previous stage

Make it feel like a real project task a developer would encounter at a startup or tech company.

Return ONLY valid JSON following the specified format.`;
};

export const QUEST_TEMPLATES = {
  regression: {
    1: 'User Dashboard Performance Regression',
    2: 'Broken Authentication After Update',
    3: 'Memory Leak in Real-time Features',
  },
  'feature-creation': {
    1: 'Build User Profile System',
    2: 'Create Analytics Dashboard',
    3: 'Implement Search & Filter System',
  },
  debugging: {
    1: 'Fix Intermittent Data Loss',
    2: 'Solve UI Rendering Issues',
    3: 'Debug Slow API Responses',
  },
} as const;
