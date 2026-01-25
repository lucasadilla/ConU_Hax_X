/**
 * Badge Generation Script
 * Generates all SVG badges for quests
 * Run with: npx ts-node scripts/generate-badges.ts
 */

import * as fs from 'fs';
import * as path from 'path';

type Difficulty = 'easy' | 'medium' | 'hard';
type Theme = 'regression' | 'feature-creation' | 'debugging';

const DIFFICULTY_COLORS = {
  easy: { primary: '#22c55e', secondary: '#15803d', glow: '#4ade80', border: '#16a34a' },
  medium: { primary: '#f97316', secondary: '#c2410c', glow: '#fb923c', border: '#ea580c' },
  hard: { primary: '#ef4444', secondary: '#b91c1c', glow: '#f87171', border: '#dc2626' },
};

const THEME_CONFIG = {
  regression: {
    icon: generateBugIcon,
    hardIcon: generateAngryBugIcon,
  },
  'feature-creation': {
    icon: generateStarIcon,
    hardIcon: generateCrownedStarIcon,
  },
  debugging: {
    icon: generateWrenchIcon,
    hardIcon: generateGoldenWrenchIcon,
  },
};

const QUEST_DECORATIONS = {
  1: { type: 'basic', label: 'I' },
  2: { type: 'double', label: 'II' },
  3: { type: 'triple', label: 'III' },
};

function generateBugIcon(color: string = '#ff6b6b'): string {
  return `
  <g transform="translate(100,95)" fill="${color}">
    <ellipse cx="0" cy="0" rx="20" ry="25" fill="${color}"/>
    <ellipse cx="0" cy="-30" rx="12" ry="12" fill="${color}"/>
    <circle cx="-5" cy="-32" r="4" fill="#1e1e2e"/>
    <circle cx="5" cy="-32" r="4" fill="#1e1e2e"/>
    <line x1="-20" y1="-10" x2="-35" y2="-20" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="20" y1="-10" x2="35" y2="-20" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-20" y1="5" x2="-38" y2="5" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="20" y1="5" x2="38" y2="5" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-18" y1="18" x2="-32" y2="28" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="18" y1="18" x2="32" y2="28" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-8" y1="-40" x2="-15" y2="-55" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <line x1="8" y1="-40" x2="15" y2="-55" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="-15" cy="-55" r="3" fill="${color}"/>
    <circle cx="15" cy="-55" r="3" fill="${color}"/>
  </g>`;
}

function generateAngryBugIcon(color: string = '#ff6b6b'): string {
  return `
  <g transform="translate(100,95)" fill="${color}">
    <path d="M-25,-20 Q-20,-40 -15,-25 Q-10,-45 0,-30 Q10,-45 15,-25 Q20,-40 25,-20 Q20,-10 0,-15 Q-20,-10 -25,-20" fill="#f97316" opacity="0.7"/>
    <ellipse cx="0" cy="0" rx="20" ry="25" fill="${color}"/>
    <ellipse cx="0" cy="-30" rx="12" ry="12" fill="${color}"/>
    <ellipse cx="-5" cy="-32" rx="5" ry="4" fill="#1e1e2e"/>
    <ellipse cx="5" cy="-32" rx="5" ry="4" fill="#1e1e2e"/>
    <line x1="-10" y1="-38" x2="-2" y2="-36" stroke="#1e1e2e" stroke-width="2"/>
    <line x1="10" y1="-38" x2="2" y2="-36" stroke="#1e1e2e" stroke-width="2"/>
    <line x1="-20" y1="-10" x2="-35" y2="-20" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="20" y1="-10" x2="35" y2="-20" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-20" y1="5" x2="-38" y2="5" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="20" y1="5" x2="38" y2="5" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-18" y1="18" x2="-32" y2="28" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="18" y1="18" x2="32" y2="28" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-8" y1="-40" x2="-15" y2="-55" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <line x1="8" y1="-40" x2="15" y2="-55" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="-15" cy="-55" r="3" fill="${color}"/>
    <circle cx="15" cy="-55" r="3" fill="${color}"/>
  </g>`;
}

function generateStarIcon(): string {
  return `
  <g transform="translate(100,95)">
    <polygon points="0,-45 12,-15 45,-15 18,5 28,40 0,18 -28,40 -18,5 -45,-15 -12,-15" 
             fill="url(#star-grad)" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="-35" cy="-35" r="3" fill="#fde047"/>
    <circle cx="35" cy="-35" r="3" fill="#fde047"/>
    <circle cx="-40" cy="15" r="2" fill="#fde047"/>
    <circle cx="40" cy="15" r="2" fill="#fde047"/>
  </g>`;
}

function generateCrownedStarIcon(): string {
  return `
  <g transform="translate(100,95)">
    <path d="M-20,-55 L-15,-45 L-5,-52 L0,-42 L5,-52 L15,-45 L20,-55 L20,-62 L-20,-62 Z" fill="#fde047" stroke="#ca8a04" stroke-width="1"/>
    <polygon points="0,-40 10,-15 40,-15 16,3 25,35 0,16 -25,35 -16,3 -40,-15 -10,-15" 
             fill="url(#star-grad)" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="-35" cy="-30" r="4" fill="#fde047"/>
    <circle cx="35" cy="-30" r="4" fill="#fde047"/>
    <circle cx="-40" cy="15" r="3" fill="#fde047"/>
    <circle cx="40" cy="15" r="3" fill="#fde047"/>
    <circle cx="0" cy="45" r="3" fill="#fde047"/>
  </g>`;
}

function generateWrenchIcon(isGolden: boolean = false): string {
  const grad = isGolden ? 'url(#wrench-grad-gold)' : 'url(#wrench-grad)';
  const stroke = isGolden ? '#ca8a04' : '#475569';
  const highlight = isGolden ? '#fef08a' : '#cbd5e1';
  
  return `
  <g transform="translate(100,95) rotate(-45)">
    <rect x="-8" y="-10" width="16" height="70" rx="4" fill="${grad}" stroke="${stroke}" stroke-width="2"/>
    <path d="M-15,-25 L-15,-40 C-15,-50 -5,-55 0,-55 C5,-55 15,-50 15,-40 L15,-25 L8,-25 L8,-35 C8,-42 5,-45 0,-45 C-5,-45 -8,-42 -8,-35 L-8,-25 Z" 
          fill="${grad}" stroke="${stroke}" stroke-width="2"/>
    <rect x="-4" y="0" width="4" height="50" rx="2" fill="${highlight}" opacity="0.5"/>
    ${isGolden ? '<polygon points="0,-50 2,-46 6,-46 3,-44 4,-40 0,-42 -4,-40 -3,-44 -6,-46 -2,-46" fill="white" opacity="0.8"/>' : ''}
  </g>`;
}

function generateGoldenWrenchIcon(): string {
  return generateWrenchIcon(true);
}

function generateBadgeSVG(
  theme: Theme,
  questNumber: 1 | 2 | 3,
  difficulty: Difficulty
): string {
  const colors = DIFFICULTY_COLORS[difficulty];
  const config = THEME_CONFIG[theme];
  const quest = QUEST_DECORATIONS[questNumber];
  
  const isHard = difficulty === 'hard';
  
  let icon = '';
  if (theme === 'regression') {
    icon = isHard ? generateAngryBugIcon() : generateBugIcon();
  } else if (theme === 'feature-creation') {
    icon = isHard ? generateCrownedStarIcon() : generateStarIcon();
  } else if (theme === 'debugging') {
    icon = isHard ? generateGoldenWrenchIcon() : generateWrenchIcon();
  }
  
  // Add roman numeral for quest number
  const questLabel = `
  <text x="100" y="178" text-anchor="middle" fill="${colors.primary}" font-family="serif" font-size="16" font-weight="bold">
    ${quest.label}
  </text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="shield-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.primary}"/>
      <stop offset="100%" style="stop-color:${colors.secondary}"/>
    </linearGradient>
    <linearGradient id="inner-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1e2e"/>
      <stop offset="100%" style="stop-color:#11111b"/>
    </linearGradient>
    <linearGradient id="star-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fde047"/>
      <stop offset="100%" style="stop-color:#eab308"/>
    </linearGradient>
    <linearGradient id="wrench-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#94a3b8"/>
      <stop offset="100%" style="stop-color:#64748b"/>
    </linearGradient>
    <linearGradient id="wrench-grad-gold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fde047"/>
      <stop offset="100%" style="stop-color:#eab308"/>
    </linearGradient>
  </defs>
  
  <!-- Outer glow -->
  <ellipse cx="100" cy="105" rx="70" ry="75" fill="${colors.glow}" opacity="${isHard ? '0.25' : '0.2'}" filter="url(#glow)"/>
  
  <!-- Shield shape -->
  <path d="M100 15 L170 45 L170 100 C170 140 140 170 100 185 C60 170 30 140 30 100 L30 45 Z" 
        fill="url(#shield-grad)" stroke="${colors.border}" stroke-width="4"/>
  
  <!-- Inner shield -->
  <path d="M100 30 L155 55 L155 100 C155 132 130 155 100 168 C70 155 45 132 45 100 L45 55 Z" 
        fill="url(#inner-grad)" stroke="${colors.primary}" stroke-width="2"/>
  
  ${icon}
  
  ${questLabel}
  
  <!-- Stars decoration -->
  <polygon points="40,35 42,40 47,40 43,43 45,48 40,45 35,48 37,43 33,40 38,40" fill="${colors.glow}" opacity="0.8"/>
  <polygon points="160,35 162,40 167,40 163,43 165,48 160,45 155,48 157,43 153,40 158,40" fill="${colors.glow}" opacity="0.8"/>
</svg>`;
}

// Generate all badges
const themes: Theme[] = ['regression', 'feature-creation', 'debugging'];
const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
const questNumbers: (1 | 2 | 3)[] = [1, 2, 3];

const badgesDir = path.join(__dirname, '../public/badges');

// Ensure directory exists
if (!fs.existsSync(badgesDir)) {
  fs.mkdirSync(badgesDir, { recursive: true });
}

let count = 0;
for (const theme of themes) {
  for (const questNumber of questNumbers) {
    for (const difficulty of difficulties) {
      const filename = `${theme}-quest${questNumber}-${difficulty}.svg`;
      const filepath = path.join(badgesDir, filename);
      const svg = generateBadgeSVG(theme, questNumber, difficulty);
      fs.writeFileSync(filepath, svg);
      count++;
      console.log(`Generated: ${filename}`);
    }
  }
}

console.log(`\n✅ Generated ${count} badges!`);
