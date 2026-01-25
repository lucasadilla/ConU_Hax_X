'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { 
  Clock, 
  Zap, 
  ExternalLink, 
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TicketExample {
  input: string
  output: string
  explanation?: string
}

export interface TicketData {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  tags: string[]
  points: number
  timeLimit?: number // in minutes
  examples: TicketExample[]
  constraints: string[]
  hints: string[]
  docsLinks?: { title: string; url: string }[]
  language?: string
  testCases?: {
    input: string
    expectedOutput: string
    isHidden?: boolean
  }[]
  codeFiles?: {
    filename: string
    language: string
    content: string
    isReadOnly?: boolean
  }[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  // Stats
  attemptCount?: number
  successRate?: number
}

interface TicketViewProps {
  ticket: TicketData
  className?: string
}

const getDifficultyConfig = (difficulty: TicketData['difficulty']) => {
  const config = {
    easy: {
      label: 'Easy',
      color: 'bg-[hsl(var(--easy))]/20 text-[hsl(var(--easy))] border-[hsl(var(--easy))]/30',
    },
    medium: {
      label: 'Medium',
      color: 'bg-[hsl(var(--medium))]/20 text-[hsl(var(--medium))] border-[hsl(var(--medium))]/30',
    },
    hard: {
      label: 'Hard',
      color: 'bg-[hsl(var(--hard))]/20 text-[hsl(var(--hard))] border-[hsl(var(--hard))]/30',
    },
  }
  return config[difficulty]
}

export default function TicketView({ ticket, className }: TicketViewProps) {
  const difficultyConfig = getDifficultyConfig(ticket.difficulty)

  return (
    <div className={cn('flex flex-col h-full bg-card rounded-lg overflow-hidden border border-border', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        {/* Title */}
        <h1 className="text-xl font-bold text-foreground mb-3">
          {ticket.title}
        </h1>
        
        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Badge */}
          <Badge 
            variant="outline" 
            className={cn('font-medium', difficultyConfig.color)}
          >
            {difficultyConfig.label}
          </Badge>
          
          {/* Category */}
          <Badge variant="secondary">
            {ticket.category}
          </Badge>
          
          {/* Points */}
          <div className="flex items-center gap-1 text-sm text-primary">
            <Zap className="size-4" />
            <span>{ticket.points} XP</span>
          </div>
          
          {/* Time Limit */}
          {ticket.timeLimit && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span>{ticket.timeLimit} min</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {ticket.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="px-2 py-0.5 text-xs bg-secondary text-muted-foreground rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="flex-1 flex flex-col min-h-0">
        <TabsList className="bg-muted/50 border-b border-border rounded-none h-10 px-4 justify-start">
          <TabsTrigger 
            value="description"
            className="text-sm data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <BookOpen className="size-4 mr-1.5" />
            Description
          </TabsTrigger>
          <TabsTrigger 
            value="solutions"
            className="text-sm data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <CheckCircle2 className="size-4 mr-1.5" />
            Solutions
          </TabsTrigger>
          <TabsTrigger 
            value="hints"
            className="text-sm data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <Lightbulb className="size-4 mr-1.5" />
            Hints
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
             
              {/* Description */}
              <div>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              {/* Examples */}
              {ticket.examples.length > 0 && (
                <div>
                  <h3 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="size-4 text-accent" />
                    Examples
                  </h3>
                  <div className="space-y-4">
                    {ticket.examples.map((example, index) => (
                      <div
                        key={index}
                        className="bg-muted/50 rounded-lg p-4 border border-border"
                      >
                        <div className="text-xs text-muted-foreground mb-2">
                          Example {index + 1}
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-muted-foreground text-sm">Input: </span>
                            <code className="text-[hsl(var(--easy))] bg-background px-2 py-0.5 rounded text-sm font-mono">
                              {example.input}
                            </code>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Output: </span>
                            <code className="text-primary bg-background px-2 py-0.5 rounded text-sm font-mono">
                              {example.output}
                            </code>
                          </div>
                          {example.explanation && (
                            <div className="text-muted-foreground text-sm mt-2 pt-2 border-t border-border">
                              <span className="text-muted-foreground/70">Explanation: </span>
                              {example.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Constraints */}
              {ticket.constraints.length > 0 && (
                <div>
                  <h3 className="text-foreground font-semibold mb-3">Constraints</h3>
                  <ul className="space-y-1">
                    {ticket.constraints.map((constraint, index) => (
                      <li
                        key={index}
                        className="text-muted-foreground text-sm flex items-start gap-2"
                      >
                        <span className="text-muted-foreground/50">•</span>
                        <code className="text-foreground/80">{constraint}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Docs Links */}
              {ticket.docsLinks && ticket.docsLinks.length > 0 && (
                <div>
                  <h3 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                    <ExternalLink className="size-4 text-accent" />
                    Documentation
                  </h3>
                  <div className="space-y-2">
                    {ticket.docsLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors"
                      >
                        <ExternalLink className="size-3" />
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="solutions" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <CheckCircle2 className="size-12 mb-4 text-muted-foreground/50" />
                <p className="text-center">
                  Les solutions seront disponibles après avoir résolu le problème.
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="hints" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              {ticket.hints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Lightbulb className="size-12 mb-4 text-muted-foreground/50" />
                  <p className="text-center">
                    Aucun indice disponible pour ce problème.
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {ticket.hints.map((hint, index) => (
                    <AccordionItem
                      key={index}
                      value={`hint-${index}`}
                      className="bg-muted/50 rounded-lg border border-border px-4"
                    >
                      <AccordionTrigger className="text-sm text-foreground/80 hover:text-foreground py-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="size-4 text-primary" />
                          Hint {index + 1}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm pb-3">
                        {hint}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Stats Footer */}
      {(ticket.attemptCount !== undefined || ticket.successRate !== undefined) && (
        <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
          {ticket.attemptCount !== undefined && (
            <span>{ticket.attemptCount.toLocaleString()} tentatives</span>
          )}
          {ticket.successRate !== undefined && (
            <span className="text-[hsl(var(--easy))]">{ticket.successRate}% de réussite</span>
          )}
        </div>
      )}
    </div>
  )
}
