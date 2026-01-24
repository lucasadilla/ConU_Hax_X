"use client"

import { useState, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Zap, 
  Clock, 
  CheckCircle2,
  XCircle,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Share2,
  ChevronRight,
  ChevronLeft,
  Sword
} from "lucide-react"

// Mock problem data
const problemData = {
  1: {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy" as const,
    xp: 50,
    category: "Arrays",
    acceptance: 49.2,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    hints: [
      "A brute force approach is to loop through each element x and find if there is another element that equals target - x.",
      "Can we optimize the brute force approach? A hash table can improve the lookup time.",
      "While iterating, we can check if target - current element exists in the hash table."
    ]
  }
}

const defaultProblem = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy" as const,
  xp: 50,
  category: "Arrays",
  acceptance: 49.2,
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ],
  constraints: ["2 <= nums.length <= 10^4"],
  hints: ["Use a hash table for O(n) time complexity."]
}

export default function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const problem = problemData[Number(resolvedParams.id) as keyof typeof problemData] || defaultProblem
  const [code, setCode] = useState(`function twoSum(nums, target) {
  // Write your solution here
  
}`)
  const [output, setOutput] = useState<{ status: "idle" | "running" | "success" | "error"; message: string }>({ 
    status: "idle", 
    message: "" 
  })
  const [showHints, setShowHints] = useState(false)

  const difficultyColors = {
    Easy: "text-easy border-easy/50 bg-easy/10",
    Medium: "text-medium border-medium/50 bg-medium/10",
    Hard: "text-hard border-hard/50 bg-hard/10"
  }

  const runCode = () => {
    setOutput({ status: "running", message: "Executing code..." })
    setTimeout(() => {
      setOutput({ 
        status: "success", 
        message: "All test cases passed! +50 XP earned!" 
      })
    }, 1500)
  }

  const resetCode = () => {
    setCode(`function twoSum(nums, target) {
  // Write your solution here
  
}`)
    setOutput({ status: "idle", message: "" })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-primary bg-card/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <Sword className="h-6 w-6 text-primary" />
              <span className="font-[family-name:var(--font-display)] text-sm text-primary hidden sm:inline">
                CodeQuest
              </span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Quest {problem.id}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              onClick={runCode}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              <Play className="h-4 w-4 mr-2" />
              Run Code
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Problem Description */}
        <div className="border-r-0 lg:border-r-2 border-border overflow-auto">
          <div className="p-6">
            {/* Title */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {problem.id}. {problem.title}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge className={`${difficultyColors[problem.difficulty]} border font-medium`}>
                    {problem.difficulty}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-primary" />
                    {problem.xp} XP
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {problem.acceptance}% acceptance
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-muted border-2 border-border">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="solutions">Solutions</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                {/* Description */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {problem.description}
                  </p>
                </div>

                {/* Examples */}
                <div className="mt-8 space-y-4">
                  <h3 className="font-medium text-foreground">Examples:</h3>
                  {problem.examples.map((example, index) => (
                    <div key={index} className="rounded-lg border-2 border-border bg-muted/30 p-4">
                      <div className="font-medium text-muted-foreground mb-2">Example {index + 1}:</div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Input: </span>
                          <code className="text-primary">{example.input}</code>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Output: </span>
                          <code className="text-easy">{example.output}</code>
                        </div>
                        {example.explanation && (
                          <div className="text-muted-foreground">
                            <span>Explanation: </span>
                            {example.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="mt-8">
                  <h3 className="font-medium text-foreground mb-3">Constraints:</h3>
                  <ul className="space-y-1">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <code>{constraint}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hints */}
                <div className="mt-8">
                  <Button 
                    variant="outline" 
                    className="border-2 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                    onClick={() => setShowHints(!showHints)}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {showHints ? "Hide Hints" : "Show Hints"}
                  </Button>
                  
                  {showHints && (
                    <div className="mt-4 space-y-3">
                      {problem.hints.map((hint, index) => (
                        <div key={index} className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
                          <div className="flex items-start gap-3">
                            <span className="font-[family-name:var(--font-display)] text-xs text-primary">
                              {index + 1}
                            </span>
                            <p className="text-sm text-muted-foreground">{hint}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    2.4K
                  </button>
                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    456 discussions
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="solutions" className="mt-6">
                <div className="rounded-lg border-2 border-border bg-muted/30 p-8 text-center">
                  <div className="text-muted-foreground">
                    Complete this quest to unlock community solutions!
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="discussion" className="mt-6">
                <div className="rounded-lg border-2 border-border bg-muted/30 p-8 text-center">
                  <div className="text-muted-foreground">
                    Join 456 warriors discussing this quest
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex flex-col bg-card">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">JavaScript</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={resetCode}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Code Area */}
          <div className="flex-1 p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full min-h-[300px] bg-muted/50 border-2 border-border rounded-lg p-4 font-mono text-sm text-foreground resize-none focus:border-primary focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="border-t-2 border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Output</span>
            </div>
            <div className={`rounded-lg border-2 p-4 min-h-[80px] ${
              output.status === "idle" ? "border-border bg-muted/30" :
              output.status === "running" ? "border-primary/50 bg-primary/5" :
              output.status === "success" ? "border-easy/50 bg-easy/5" :
              "border-hard/50 bg-hard/5"
            }`}>
              {output.status === "idle" ? (
                <span className="text-muted-foreground text-sm">Click "Run Code" to execute your solution</span>
              ) : output.status === "running" ? (
                <div className="flex items-center gap-2 text-primary">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">{output.message}</span>
                </div>
              ) : output.status === "success" ? (
                <div className="flex items-center gap-2 text-easy">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">{output.message}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-hard">
                  <XCircle className="h-5 w-5" />
                  <span className="text-sm">{output.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
