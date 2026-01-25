"use client"

import React from "react"

import Link from "next/link"
import { Sword, Trophy, Scroll, User, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(30, 30, 46, 0.95)',
        borderBottom: '4px solid #fde047',
        boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
      }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Sword className="h-8 w-8 text-yellow-400 transition-transform group-hover:rotate-12" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
          </div>
          <span 
            className="font-[family-name:var(--font-display)] text-lg tracking-tight"
            style={{ color: '#fde047' }}
          >
            CodeQuest
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/quests" icon={<Scroll className="h-4 w-4" />}>
            Quests
          </NavLink>
          <NavLink href="/badges" icon={<Trophy className="h-4 w-4" />}>
            Badges
          </NavLink>
          <NavLink href="/#streak" icon={<Flame className="h-4 w-4" />}>
            Daily Streak
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div 
            className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5"
            style={{
              backgroundColor: 'rgba(253, 224, 71, 0.2)',
              border: '2px solid #fde047',
            }}
          >
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">2,450 XP</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="font-medium"
            style={{
              backgroundColor: '#fde047',
              color: '#1e1e2e',
              border: '2px solid #1e1e2e',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
            }}
          >
            <User className="h-4 w-4 mr-2" />
            Login
          </Button>
        </div>
      </div>
    </header>
  )
}

function NavLink({ 
  href, 
  children, 
  icon 
}: { 
  href: string
  children: React.ReactNode
  icon: React.ReactNode 
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-yellow-400 rounded-lg hover:bg-white/10"
    >
      {icon}
      {children}
    </Link>
  )
}
