"use client"

import React from "react"

import { 
  Layers, 
  Link2, 
  GitBranch, 
  Hash, 
  Binary, 
  BarChart3,
  Network,
  Boxes,
  Shuffle,
  Search
} from "lucide-react"

const categories = [
  { name: "Arrays", icon: Layers, count: 156, color: "text-chart-1 bg-chart-1/10 border-chart-1/30" },
  { name: "Linked Lists", icon: Link2, count: 42, color: "text-chart-2 bg-chart-2/10 border-chart-2/30" },
  { name: "Trees", icon: GitBranch, count: 89, color: "text-chart-3 bg-chart-3/10 border-chart-3/30" },
  { name: "Hash Tables", icon: Hash, count: 67, color: "text-chart-4 bg-chart-4/10 border-chart-4/30" },
  { name: "Binary Search", icon: Binary, count: 45, color: "text-chart-5 bg-chart-5/10 border-chart-5/30" },
  { name: "Dynamic Programming", icon: BarChart3, count: 78, color: "text-primary bg-primary/10 border-primary/30" },
  { name: "Graphs", icon: Network, count: 53, color: "text-accent bg-accent/10 border-accent/30" },
  { name: "Stacks & Queues", icon: Boxes, count: 38, color: "text-easy bg-easy/10 border-easy/30" },
  { name: "Sorting", icon: Shuffle, count: 29, color: "text-medium bg-medium/10 border-medium/30" },
  { name: "Two Pointers", icon: Search, count: 31, color: "text-chart-1 bg-chart-1/10 border-chart-1/30" },
]

export function Categories() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-primary mb-4">
            Choose Your Realm
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Master different skill trees to become the ultimate coding champion
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ 
  name, 
  icon: Icon, 
  count, 
  color 
}: { 
  name: string
  icon: React.ComponentType<{ className?: string }>
  count: number
  color: string
}) {
  return (
    <button 
      className={`group p-4 rounded-xl border-2 ${color} transition-all hover:scale-105 hover:shadow-lg text-left`}
    >
      <Icon className="h-8 w-8 mb-3" />
      <div className="font-medium text-foreground group-hover:text-current transition-colors">
        {name}
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        {count} quests
      </div>
    </button>
  )
}
