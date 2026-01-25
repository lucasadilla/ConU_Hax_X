'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import TicketView, { TicketData } from '@/components/TicketView'
import CodeEditor, { EditorFile, ConsoleOutput } from '@/components/CodeEditor'
import { Header } from '@/components/header'

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

export default function TicketPage() {
  const params = useParams<{ id: string | string[] }>()
  const ticketId = Array.isArray(params?.id) ? params?.id[0] : params?.id
  const [ticket, setTicket] = useState<TicketData | null>(null)
  const [ticketError, setTicketError] = useState<string | null>(null)
  const [isTicketLoading, setIsTicketLoading] = useState(true)
  const [consoleOutputs, setConsoleOutputs] = useState<ConsoleOutput[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const loadTicket = async () => {
      if (!ticketId) {
        setTicketError('Ticket id manquant')
        setIsTicketLoading(false)
        return
      }

      setIsTicketLoading(true)
      setTicketError(null)

      try {
        const response = await fetch(`/api/tickets/${ticketId}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to load ticket')
        }

        const data = await response.json()

        if (!data?.success || !data?.ticket) {
          throw new Error(data?.error || 'Failed to load ticket')
        }

        if (isMounted) {
          setTicket(data.ticket)
        }
      } catch (error) {
        if (!isMounted) return
        if ((error as Error).name === 'AbortError') return
        setTicketError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        if (isMounted) {
          setIsTicketLoading(false)
        }
      }
    }

    loadTicket()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [ticketId])

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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="h-[calc(100vh-4rem)] p-3">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg gap-2">
          <ResizablePanel defaultSize="40%" minSize="25%" maxSize="60%" id="ticket-panel">
            {isTicketLoading && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Chargement du ticket...
              </div>
            )}

            {ticketError && !isTicketLoading && (
              <div className="h-full flex items-center justify-center text-destructive">
                {ticketError}
              </div>
            )}

            {!isTicketLoading && !ticketError && ticket && (
              <TicketView ticket={ticket} className="h-full" />
            )}
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
    </div>
  )
}