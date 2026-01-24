"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle,
  Flame,
  Star,
  Lock,
  Zap
} from "lucide-react"

type Difficulty = "Easy" | "Medium" | "Hard"

interface Problem {
  id: number
  title: string
  difficulty: Difficulty
  category: string
  acceptance: number
  xp: number
  completed: boolean
  locked: boolean
  isHot?: boolean
  isPremium?: boolean
}

const problems: Problem[] = [
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays", acceptance: 49.2, xp: 50, completed: true, locked: false, isHot: true },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium", category: "Linked Lists", acceptance: 39.8, xp: 100, completed: true, locked: false },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "Strings", acceptance: 33.8, xp: 100, completed: false, locked: false, isHot: true },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Binary Search", acceptance: 35.1, xp: 200, completed: false, locked: false },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", category: "Dynamic Programming", acceptance: 32.4, xp: 100, completed: false, locked: false },
  { id: 6, title: "Zigzag Conversion", difficulty: "Medium", category: "Strings", acceptance: 43.5, xp: 100, completed: false, locked: false },
  { id: 7, title: "Reverse Integer", difficulty: "Medium", category: "Math", acceptance: 27.3, xp: 100, completed: false, locked: false },
  { id: 8, title: "String to Integer (atoi)", difficulty: "Medium", category: "Strings", acceptance: 16.6, xp: 100, completed: false, locked: false },
  { id: 9, title: "Palindrome Number", difficulty: "Easy", category: "Math", acceptance: 52.4, xp: 50, completed: true, locked: false },
  { id: 10, title: "Regular Expression Matching", difficulty: "Hard", category: "Dynamic Programming", acceptance: 27.9, xp: 200, completed: false, locked: false, isPremium: true },
  { id: 11, title: "Container With Most Water", difficulty: "Medium", category: "Two Pointers", acceptance: 54.3, xp: 100, completed: false, locked: false, isHot: true },
  { id: 12, title: "Integer to Roman", difficulty: "Medium", category: "Math", acceptance: 61.2, xp: 100, completed: false, locked: false },
  { id: 13, title: "Roman to Integer", difficulty: "Easy", category: "Math", acceptance: 58.2, xp: 50, completed: false, locked: false },
  { id: 14, title: "Longest Common Prefix", difficulty: "Easy", category: "Strings", acceptance: 41.0, xp: 50, completed: false, locked: false },
  { id: 15, title: "3Sum", difficulty: "Medium", category: "Two Pointers", acceptance: 32.6, xp: 100, completed: false, locked: false, isHot: true },
]

export function ProblemList() {
  const [filter, setFilter] = useState<Difficulty | "All">("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProblems = problems.filter(p => {
    const matchesDifficulty = filter === "All" || p.difficulty === filter
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDifficulty && matchesSearch
  })

  const completedCount = problems.filter(p => p.completed).length

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-primary mb-2">
              Quest Board
            </h2>
            <p className="text-muted-foreground">
              {completedCount}/{problems.length} quests completed
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full md:w-64">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-medium">{Math.round((completedCount / problems.length) * 100)}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted border-2 border-border overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-easy to-primary transition-all duration-500"
                style={{ width: `${(completedCount / problems.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search quests..." 
              className="pl-10 bg-card border-2 border-border focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <FilterButton 
              active={filter === "All"} 
              onClick={() => setFilter("All")}
            >
              <Filter className="h-4 w-4 mr-2" />
              All
            </FilterButton>
            <FilterButton 
              active={filter === "Easy"} 
              onClick={() => setFilter("Easy")}
              className="text-easy border-easy/50 data-[active=true]:bg-easy/20"
            >
              Easy
            </FilterButton>
            <FilterButton 
              active={filter === "Medium"} 
              onClick={() => setFilter("Medium")}
              className="text-medium border-medium/50 data-[active=true]:bg-medium/20"
            >
              Medium
            </FilterButton>
            <FilterButton 
              active={filter === "Hard"} 
              onClick={() => setFilter("Hard")}
              className="text-hard border-hard/50 data-[active=true]:bg-hard/20"
            >
              Hard
            </FilterButton>
          </div>
        </div>

        {/* Problem Table */}
        <div className="rounded-xl border-2 border-border bg-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b-2 border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-1">Status</div>
            <div className="col-span-5">Quest</div>
            <div className="col-span-2 hidden md:block">Category</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-2 text-right">XP Reward</div>
          </div>

          {/* Problem Rows */}
          <div className="divide-y-2 divide-border">
            {filteredProblems.map((problem) => (
              <ProblemRow key={problem.id} problem={problem} />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            Load More Quests
          </Button>
        </div>
      </div>
    </section>
  )
}

function FilterButton({ 
  active, 
  onClick, 
  children,
  className = ""
}: { 
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      data-active={active}
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
        active 
          ? "border-primary bg-primary/10 text-primary" 
          : "border-border text-muted-foreground hover:border-primary/50"
      } ${className}`}
    >
      {children}
    </button>
  )
}

function ProblemRow({ problem }: { problem: Problem }) {
  const difficultyColors = {
    Easy: "text-easy border-easy/50 bg-easy/10",
    Medium: "text-medium border-medium/50 bg-medium/10",
    Hard: "text-hard border-hard/50 bg-hard/10"
  }

  return (
    <Link 
      href={`/problem/${problem.id}`}
      className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-muted/30 transition-colors items-center group"
    >
      {/* Status */}
      <div className="col-span-1">
        {problem.completed ? (
          <CheckCircle2 className="h-5 w-5 text-easy" />
        ) : problem.locked ? (
          <Lock className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </div>

      {/* Title */}
      <div className="col-span-5 flex items-center gap-2">
        <span className="text-muted-foreground font-medium">{problem.id}.</span>
        <span className="text-foreground group-hover:text-primary transition-colors font-medium truncate">
          {problem.title}
        </span>
        {problem.isHot && (
          <Flame className="h-4 w-4 text-accent flex-shrink-0" />
        )}
        {problem.isPremium && (
          <Star className="h-4 w-4 text-primary flex-shrink-0" />
        )}
      </div>

      {/* Category */}
      <div className="col-span-2 hidden md:block">
        <Badge variant="secondary" className="font-normal">
          {problem.category}
        </Badge>
      </div>

      {/* Difficulty */}
      <div className="col-span-2">
        <Badge className={`${difficultyColors[problem.difficulty]} border font-medium`}>
          {problem.difficulty}
        </Badge>
      </div>

      {/* XP */}
      <div className="col-span-2 text-right flex items-center justify-end gap-1">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-primary font-medium">{problem.xp} XP</span>
      </div>
    </Link>
  )
}
