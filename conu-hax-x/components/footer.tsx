import React from "react"
import { Sword, Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer 
      className="py-8"
      style={{
        backgroundColor: 'rgba(30, 30, 46, 0.95)',
        borderTop: '4px solid #fde047',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Sword className="h-6 w-6 text-yellow-400 transition-transform group-hover:rotate-12" />
            <span className="font-[family-name:var(--font-display)] text-yellow-400">
              CodeQuest
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/quests" className="text-slate-400 hover:text-yellow-400 transition-colors">
              Quests
            </Link>
            <Link href="/badges" className="text-slate-400 hover:text-yellow-400 transition-colors">
              Badges
            </Link>
            <Link href="/#streak" className="text-slate-400 hover:text-yellow-400 transition-colors">
              Daily Streak
            </Link>
          </nav>

          {/* Divider */}
          <div className="w-16 h-1 bg-yellow-400/30 rounded" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for ConUHacks X
            </span>
            <span className="hidden sm:inline">•</span>
            <span>&copy; 2026 CodeQuest</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
