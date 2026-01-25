"use client"

import React from "react"
import { signIn, signOut, useSession } from "next-auth/react"

import Link from "next/link"
import { Sword, Trophy, Scroll, User, Flame, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const { data: session, status } = useSession()
  const user = session?.user
  const profileHref = user?.id ? `/profile/${user.id}` : null

  return (
    <header className="sticky top-0 z-50 border-b-4 border-primary bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Sword className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent animate-pulse" />
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg text-primary tracking-tight">
            CodeQuest
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/quests" icon={<Scroll className="h-4 w-4" />}>
            Quests
          </NavLink>
          <NavLink href="/#leaderboard" icon={<Trophy className="h-4 w-4" />}>
            Leaderboard
          </NavLink>
          <NavLink href="/#streak" icon={<Flame className="h-4 w-4" />}>
            Daily Streak
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-lg border-2 border-primary/30 bg-muted px-3 py-1.5">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">2,450 XP</span>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              {profileHref ? (
                <Link href={profileHref} className="flex items-center gap-2">
                  <Avatar className="border-2 border-primary/40">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {(user.name || user.email || "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-primary">
                    {user.name || user.email}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar className="border-2 border-primary/40">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {(user.name || user.email || "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-primary">
                    {user.name || user.email}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled={status === "loading"}
              onClick={() => signIn()}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
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
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-muted rounded-lg"
    >
      {icon}
      {children}
    </Link>
  )
}
