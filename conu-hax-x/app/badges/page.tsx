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
  easy: 'bg-green-500/30 text-green-300 border-green-400',
  medium: 'bg-orange-500/30 text-orange-300 border-orange-400',
  hard: 'bg-red-500/30 text-red-300 border-red-400',
};

export default function BadgesPreviewPage() {
  return (
    <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Title with retro styling */}
          <div className="text-center mb-8">
            <h1 
              className="text-5xl font-bold mb-2 drop-shadow-lg"
              style={{ 
                color: '#1e1e2e',
                textShadow: '3px 3px 0 #fde047, 6px 6px 0 rgba(0,0,0,0.2)',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              🎮 Quest Badges
            </h1>
            <p 
              className="text-xl font-semibold"
              style={{ color: '#1e3a5f', textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}
            >
              ConUHacks X - Collect Them All!
            </p>
          </div>

          {/* Difficulty Legend */}
          <div className="flex justify-center gap-4 mb-12">
            {difficulties.map((diff) => (
              <div
                key={diff}
                className={`px-4 py-2 rounded-lg border-2 ${difficultyColors[diff]} text-sm font-bold capitalize backdrop-blur-sm`}
                style={{ 
                  boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                }}
              >
                {diff}
              </div>
            ))}
          </div>

          {/* Badges Grid by Theme */}
          {themes.map((theme) => (
            <div 
              key={theme} 
              className="mb-12 p-6 rounded-2xl backdrop-blur-sm"
              style={{ 
                backgroundColor: 'rgba(30, 30, 46, 0.85)',
                boxShadow: '8px 8px 0 rgba(0,0,0,0.3)',
                border: '4px solid #1e1e2e',
              }}
            >
              <h2 
                className="text-2xl font-bold text-white mb-6 pb-2"
                style={{ 
                  borderBottom: '4px solid',
                  borderImage: 'linear-gradient(90deg, #fde047, #f97316, #ef4444) 1',
                }}
              >
                {themeNames[theme]}
              </h2>

              <div className="grid grid-cols-3 gap-8">
                {questNumbers.map((questNum) => (
                  <div key={questNum} className="space-y-4">
                    <h3 
                      className="text-lg text-center font-bold"
                      style={{ color: '#fde047', textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}
                    >
                      Quest {questNum}
                    </h3>

                    <div className="flex justify-center gap-4">
                      {difficulties.map((diff) => (
                        <div key={diff} className="flex flex-col items-center gap-2">
                          <div 
                            className="relative w-24 h-24 hover:scale-110 transition-transform cursor-pointer hover:-translate-y-2"
                            style={{ 
                              filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.4))',
                            }}
                          >
                            <Image
                              src={`/badges/${theme}-quest${questNum}-${diff}.svg`}
                              alt={`${theme} Quest ${questNum} ${diff}`}
                              fill
                              className="object-contain"
                              style={{ imageRendering: 'pixelated' }}
                            />
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded font-bold ${difficultyColors[diff]} capitalize`}
                            style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}
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
          <div 
            className="mt-12 p-6 rounded-2xl backdrop-blur-sm"
            style={{ 
              backgroundColor: 'rgba(30, 30, 46, 0.85)',
              boxShadow: '8px 8px 0 rgba(0,0,0,0.3)',
              border: '4px solid #1e1e2e',
            }}
          >
            <h2 
              className="text-2xl font-bold text-white mb-6 pb-2"
              style={{ 
                borderBottom: '4px solid',
                borderImage: 'linear-gradient(90deg, #22c55e, #fde047, #ef4444) 1',
              }}
            >
              🔍 Full Size Examples
            </h2>
            <div className="grid grid-cols-3 gap-8">
              <div 
                className="flex flex-col items-center gap-4 p-6 rounded-xl"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  border: '3px solid #ef4444',
                  boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
                }}
              >
                <div 
                  className="relative w-48 h-48"
                  style={{ filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.4))' }}
                >
                  <Image
                    src="/badges/regression-quest3-hard.svg"
                    alt="Regression Hard Badge"
                    fill
                    className="object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <p className="text-white font-bold text-lg">Bug Slayer III - Hard</p>
              </div>
              <div 
                className="flex flex-col items-center gap-4 p-6 rounded-xl"
                style={{ 
                  backgroundColor: 'rgba(249, 115, 22, 0.2)',
                  border: '3px solid #f97316',
                  boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
                }}
              >
                <div 
                  className="relative w-48 h-48"
                  style={{ filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.4))' }}
                >
                  <Image
                    src="/badges/feature-creation-quest2-medium.svg"
                    alt="Feature Creation Medium Badge"
                    fill
                    className="object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <p className="text-white font-bold text-lg">Feature Forger II - Medium</p>
              </div>
              <div 
                className="flex flex-col items-center gap-4 p-6 rounded-xl"
                style={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  border: '3px solid #22c55e',
                  boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
                }}
              >
                <div 
                  className="relative w-48 h-48"
                  style={{ filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.4))' }}
                >
                  <Image
                    src="/badges/debugging-quest1-easy.svg"
                    alt="Debugging Easy Badge"
                    fill
                    className="object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <p className="text-white font-bold text-lg">Debug Detective I - Easy</p>
              </div>
            </div>
          </div>

          {/* Stats with pixel styling */}
          <div 
            className="mt-12 text-center p-4 rounded-xl mx-auto max-w-md"
            style={{ 
              backgroundColor: 'rgba(30, 30, 46, 0.9)',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
              border: '3px solid #fde047',
            }}
          >
            <p className="text-white font-bold">
              Total Badges: <span style={{ color: '#fde047' }}>27</span>
            </p>
            <p className="text-slate-400 text-sm">
              3 themes × 3 quests × 3 difficulties
            </p>
          </div>
        </div>
    </div>
  );
}
