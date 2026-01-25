'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type Difficulty = 'easy' | 'medium' | 'hard';
type QuestTheme = 'regression' | 'feature-creation' | 'debugging';

interface QuestBadgeProps {
  theme: QuestTheme;
  questNumber: 1 | 2 | 3;
  difficulty: Difficulty;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  earned?: boolean;
  showLabel?: boolean;
  className?: string;
}

const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium', 
  hard: 'Hard',
};

const DIFFICULTY_COLORS = {
  easy: 'text-green-500 border-green-500',
  medium: 'text-orange-500 border-orange-500',
  hard: 'text-red-500 border-red-500',
};

const THEME_NAMES = {
  regression: 'Bug Slayer',
  'feature-creation': 'Feature Forger',
  debugging: 'Debug Detective',
};

const SIZE_CLASSES = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

export function QuestBadge({
  theme,
  questNumber,
  difficulty,
  size = 'md',
  earned = false,
  showLabel = false,
  className,
}: QuestBadgeProps) {
  const badgePath = `/badges/${theme}-quest${questNumber}-${difficulty}.svg`;
  
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className={cn(
        'relative transition-all duration-300',
        SIZE_CLASSES[size],
        !earned && 'grayscale opacity-50',
        earned && 'hover:scale-110 hover:drop-shadow-lg'
      )}>
        <Image
          src={badgePath}
          alt={`${THEME_NAMES[theme]} - Quest ${questNumber} - ${DIFFICULTY_LABELS[difficulty]}`}
          fill
          className="object-contain"
        />
        
        {/* Earned sparkle effect */}
        {earned && (
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          </div>
        )}
      </div>
      
      {showLabel && (
        <div className="text-center">
          <p className={cn(
            'text-xs font-bold uppercase tracking-wide',
            DIFFICULTY_COLORS[difficulty]
          )}>
            {DIFFICULTY_LABELS[difficulty]}
          </p>
          <p className="text-xs text-muted-foreground">
            Quest {questNumber}
          </p>
        </div>
      )}
    </div>
  );
}

// Badge collection display for user profile
interface BadgeCollectionProps {
  earnedBadges: Array<{
    theme: QuestTheme;
    questNumber: 1 | 2 | 3;
    difficulty: Difficulty;
    earnedAt: Date;
  }>;
  className?: string;
}

export function BadgeCollection({ earnedBadges, className }: BadgeCollectionProps) {
  const themes: QuestTheme[] = ['regression', 'feature-creation', 'debugging'];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const questNumbers: (1 | 2 | 3)[] = [1, 2, 3];
  
  const hasBadge = (theme: QuestTheme, questNumber: 1 | 2 | 3, difficulty: Difficulty) => {
    return earnedBadges.some(
      b => b.theme === theme && b.questNumber === questNumber && b.difficulty === difficulty
    );
  };
  
  return (
    <div className={cn('space-y-8', className)}>
      {themes.map(theme => (
        <div key={theme} className="space-y-4">
          <h3 className="text-lg font-bold capitalize flex items-center gap-2">
            {theme === 'regression' && '🐛'}
            {theme === 'feature-creation' && '✨'}
            {theme === 'debugging' && '🔧'}
            {THEME_NAMES[theme]}
          </h3>
          
          <div className="grid grid-cols-3 gap-6">
            {questNumbers.map(questNumber => (
              <div key={questNumber} className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  Quest {questNumber}
                </p>
                <div className="flex justify-center gap-2">
                  {difficulties.map(difficulty => (
                    <QuestBadge
                      key={`${theme}-${questNumber}-${difficulty}`}
                      theme={theme}
                      questNumber={questNumber}
                      difficulty={difficulty}
                      size="sm"
                      earned={hasBadge(theme, questNumber, difficulty)}
                      showLabel={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Single large badge display for quest completion
interface QuestCompletionBadgeProps {
  theme: QuestTheme;
  questNumber: 1 | 2 | 3;
  difficulty: Difficulty;
  badgeName: string;
  badgeDescription: string;
}

export function QuestCompletionBadge({
  theme,
  questNumber,
  difficulty,
  badgeName,
  badgeDescription,
}: QuestCompletionBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-800">
      <div className="relative">
        <QuestBadge
          theme={theme}
          questNumber={questNumber}
          difficulty={difficulty}
          size="xl"
          earned={true}
        />
        {/* Glow effect */}
        <div className={cn(
          'absolute inset-0 rounded-full blur-xl opacity-30 -z-10',
          difficulty === 'easy' && 'bg-green-500',
          difficulty === 'medium' && 'bg-orange-500',
          difficulty === 'hard' && 'bg-red-500',
        )} />
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">{badgeName}</h2>
        <p className="text-muted-foreground max-w-md">{badgeDescription}</p>
        <div className={cn(
          'inline-block px-3 py-1 rounded-full text-sm font-semibold',
          difficulty === 'easy' && 'bg-green-500/20 text-green-400',
          difficulty === 'medium' && 'bg-orange-500/20 text-orange-400',
          difficulty === 'hard' && 'bg-red-500/20 text-red-400',
        )}>
          {DIFFICULTY_LABELS[difficulty]} Challenge
        </div>
      </div>
    </div>
  );
}
