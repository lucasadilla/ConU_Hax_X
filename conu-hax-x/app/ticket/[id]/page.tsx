'use client'

import React, { useState, useCallback } from 'react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import TicketView, { TicketData } from '@/components/TicketView'
import CodeEditor, { EditorFile, ConsoleOutput } from '@/components/CodeEditor'

// Mock data (à remplacer par fetch API)
const MOCK_TICKET: TicketData = {
  id: '1',
  title: 'Two Sum',
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  difficulty: 'easy',
  category: 'Arrays',
  tags: ['array', 'hash-table', 'two-pointers'],
  points: 100,
  timeLimit: 30,
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
    },
    {
      input: 'nums = [3,3], target = 6',
      output: '[0,1]',
    },
  ],
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists.',
  ],
  hints: [
    'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
    'Try to use a hash map to store the numbers you have seen so far.',
    'For each number, check if target - number exists in the hash map.',
  ],
  docsLinks: [
    { title: 'Array Methods - MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array' },
    { title: 'Map Object - MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map' },
  ],
  attemptCount: 12543,
  successRate: 67,
}

const MOCK_FILES: EditorFile[] = [
  {
    id: 'solution',
    name: 'solution.ts',
    language: 'typescript',
    content: `function twoSum(nums: number[], target: number): number[] {
  // Write your solution here
  
  return [];
}
`,
    readOnly: false,
  },
  {
    id: 'types',
    name: 'types.ts',
    language: 'typescript',
    content: `// Type definitions (read-only)
export type TestCase = {
  nums: number[];
  target: number;
  expected: number[];
};
`,
    readOnly: true,
  },
]

export default function TicketPage({ params }: { params: { id: string } }) {
  // TODO: Use params.id to fetch real ticket data from API
  const _ticketId = params.id
  
  const [consoleOutputs, setConsoleOutputs] = useState<ConsoleOutput[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle Run (visible tests only)
  const handleRun = useCallback(async (files: EditorFile[]) => {
    setIsRunning(true)
    setConsoleOutputs([
      { type: 'info', message: 'Running tests...' },
    ])

    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setConsoleOutputs([
      { type: 'info', message: 'Running tests...' },
      { type: 'log', message: '> Test Case 1: nums = [2,7,11,15], target = 9' },
      { type: 'success', message: '✓ Passed - Output: [0,1]' },
      { type: 'log', message: '> Test Case 2: nums = [3,2,4], target = 6' },
      { type: 'success', message: '✓ Passed - Output: [1,2]' },
      { type: 'log', message: '' },
      { type: 'success', message: '2/2 test cases passed!' },
    ])

    setIsRunning(false)
  }, [])

  // Handle Submit (all tests + evaluation)
  const handleSubmit = useCallback(async (files: EditorFile[]) => {
    setIsSubmitting(true)
    setConsoleOutputs([
      { type: 'info', message: 'Submitting solution...' },
    ])

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setConsoleOutputs([
      { type: 'info', message: 'Submitting solution...' },
      { type: 'log', message: 'Running all test cases (including hidden)...' },
      { type: 'success', message: '✓ 15/15 test cases passed' },
      { type: 'log', message: '' },
      { type: 'success', message: '🎉 Solution accepted!' },
      { type: 'info', message: 'Score: 95/100' },
      { type: 'log', message: 'Time complexity: O(n)' },
      { type: 'log', message: 'Space complexity: O(n)' },
    ])

    setIsSubmitting(false)
  }, [])

  return (
    <div className="h-screen bg-background p-3">
      <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg gap-2">
        <ResizablePanel defaultSize="40%" minSize="25%" maxSize="60%" id="ticket-panel">
          <TicketView ticket={MOCK_TICKET} className="h-full" />
        </ResizablePanel>

        <ResizableHandle withHandle className="w-2 bg-border hover:bg-primary transition-colors rounded" />

        <ResizablePanel defaultSize="60%" minSize="35%" id="editor-panel">
          <CodeEditor
            files={MOCK_FILES}
            defaultActiveFileId="solution"
            onRun={handleRun}
            onSubmit={handleSubmit}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            consoleOutputs={consoleOutputs}
            className="h-full"
          />
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  )
}
