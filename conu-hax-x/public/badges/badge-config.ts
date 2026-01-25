// Badge Configuration for Quest System
// Matches ConUHacks fantasy/RPG gaming aesthetic

export const DIFFICULTY_COLORS = {
  easy: {
    primary: '#22c55e',    // Green
    secondary: '#16a34a',
    glow: '#4ade80',
    border: '#15803d',
  },
  medium: {
    primary: '#f97316',    // Orange
    secondary: '#ea580c',
    glow: '#fb923c',
    border: '#c2410c',
  },
  hard: {
    primary: '#ef4444',    // Red
    secondary: '#dc2626',
    glow: '#f87171',
    border: '#b91c1c',
  },
} as const;

export const THEME_BADGES = {
  regression: {
    icon: '🐛',
    name: 'Bug Slayer',
    symbol: 'bug',
    baseColor: '#ff6b6b',
    quests: [
      {
        questNumber: 1,
        name: 'Code Guardian',
        description: 'Defended the codebase from regressions',
      },
      {
        questNumber: 2,
        name: 'Tech Debt Hunter',
        description: 'Eliminated technical debt like a pro',
      },
      {
        questNumber: 3,
        name: 'Legacy Slayer',
        description: 'Conquered legacy code challenges',
      },
    ],
  },
  'feature-creation': {
    icon: '✨',
    name: 'Feature Forger',
    symbol: 'star',
    baseColor: '#4ade80',
    quests: [
      {
        questNumber: 1,
        name: 'Builder Initiate',
        description: 'Built your first feature from scratch',
      },
      {
        questNumber: 2,
        name: 'Feature Architect',
        description: 'Designed and implemented complex features',
      },
      {
        questNumber: 3,
        name: 'Creation Master',
        description: 'Mastered the art of feature creation',
      },
    ],
  },
  debugging: {
    icon: '🔧',
    name: 'Debug Detective',
    symbol: 'wrench',
    baseColor: '#f7c948',
    quests: [
      {
        questNumber: 1,
        name: 'Bug Tracker',
        description: 'Found and squashed your first bugs',
      },
      {
        questNumber: 2,
        name: 'Issue Hunter',
        description: 'Hunted down complex issues',
      },
      {
        questNumber: 3,
        name: 'Debug Grandmaster',
        description: 'Achieved debugging mastery',
      },
    ],
  },
} as const;

export type QuestTheme = keyof typeof THEME_BADGES;
export type Difficulty = keyof typeof DIFFICULTY_COLORS;

export function getBadgePath(theme: QuestTheme, questNumber: number, difficulty: Difficulty): string {
  return `/badges/${theme}-quest${questNumber}-${difficulty}.svg`;
}

export function getBadgeInfo(theme: QuestTheme, questNumber: number) {
  return THEME_BADGES[theme].quests[questNumber - 1];
}
