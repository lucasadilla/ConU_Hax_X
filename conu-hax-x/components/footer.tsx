import React from "react"
import { Sword, Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Sword className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-[family-name:var(--font-display)] text-primary">
              CodeQuest
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/quests" className="text-muted-foreground hover:text-primary transition-colors">
              Quests
            </Link>
            <Link href="/#leaderboard" className="text-muted-foreground hover:text-primary transition-colors">
              Leaderboard
            </Link>
            <Link href="/#streak" className="text-muted-foreground hover:text-primary transition-colors">
              Daily Streak
            </Link>
          </nav>

          {/* Divider */}
          <div className="w-16 h-px bg-border" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-muted-foreground">
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
