import React from "react"
import { Sword, Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t-4 border-primary bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Sword className="h-8 w-8 text-primary" />
              <span className="font-[family-name:var(--font-display)] text-lg text-primary">
                CodeQuest
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Level up your coding skills through gamified challenges and epic quests.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Quests</h4>
            <ul className="space-y-2">
              <FooterLink href="/quests">All Quests</FooterLink>
              <FooterLink href="/leaderboard">Leaderboard</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t-2 border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-accent fill-accent" /> by CodeQuest Team
          </div>

          <div className="text-sm text-muted-foreground">
            &copy; 2026 CodeQuest. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}
