'use client';

import Image from 'next/image';

const themes = ['regression', 'feature-creation', 'debugging'] as const;
const questNumbers = [1, 2, 3] as const;
const difficulties = ['easy', 'medium', 'hard'] as const;

const themeNames = {
  regression: '🐛 Bug Slayer',
  'feature-creation': '✨ Feature Forger',
  debugging: '🔧 Debug Detective',
};

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-400 border-green-500',
  medium: 'bg-orange-500/20 text-orange-400 border-orange-500',
  hard: 'bg-red-500/20 text-red-400 border-red-500',
};

export default function BadgesPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          🎮 Quest Badges Preview
        </h1>
        <p className="text-slate-400 text-center mb-8">
          ConUHacks X - Fantasy RPG Style Badges
        </p>

        {/* Difficulty Legend */}
        <div className="flex justify-center gap-4 mb-12">
          {difficulties.map((diff) => (
            <div
              key={diff}
              className={`px-4 py-2 rounded-full border ${difficultyColors[diff]} text-sm font-semibold capitalize`}
            >
              {diff}
            </div>
          ))}
        </div>

        {/* Badges Grid by Theme */}
        {themes.map((theme) => (
          <div key={theme} className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-2">
              {themeNames[theme]}
            </h2>

            <div className="grid grid-cols-3 gap-8">
              {questNumbers.map((questNum) => (
                <div key={questNum} className="space-y-4">
                  <h3 className="text-lg text-slate-300 text-center font-semibold">
                    Quest {questNum}
                  </h3>

                  <div className="flex justify-center gap-4">
                    {difficulties.map((diff) => (
                      <div key={diff} className="flex flex-col items-center gap-2">
                        <div className="relative w-24 h-24 hover:scale-110 transition-transform cursor-pointer">
                          <Image
                            src={`/badges/${theme}-quest${questNum}-${diff}.svg`}
                            alt={`${theme} Quest ${questNum} ${diff}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${difficultyColors[diff]} capitalize`}
                        >
                          {diff}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Full Size Preview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-2">
            🔍 Full Size Examples
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4 p-6 bg-slate-800/50 rounded-xl">
              <div className="relative w-48 h-48">
                <Image
                  src="/badges/regression-quest3-hard.svg"
                  alt="Regression Hard Badge"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-white font-bold">Bug Slayer III - Hard</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 bg-slate-800/50 rounded-xl">
              <div className="relative w-48 h-48">
                <Image
                  src="/badges/feature-creation-quest2-medium.svg"
                  alt="Feature Creation Medium Badge"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-white font-bold">Feature Forger II - Medium</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 bg-slate-800/50 rounded-xl">
              <div className="relative w-48 h-48">
                <Image
                  src="/badges/debugging-quest1-easy.svg"
                  alt="Debugging Easy Badge"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-white font-bold">Debug Detective I - Easy</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <p className="text-slate-500">
            Total Badges: <span className="text-white font-bold">27</span> (3 themes × 3 quests × 3 difficulties)
          </p>
        </div>
      </div>
    </div>
  );
}
