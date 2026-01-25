'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import TicketView, { TicketData } from '@/components/TicketView'
import CodeEditor, { EditorFile, ConsoleOutput } from '@/components/CodeEditor'
import { Header } from '@/components/header'

const DEFAULT_FILE_CONTENT = `// Write your solution here
`

const LANGUAGE_EXTENSION_MAP: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
}

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

  const editorFiles = useMemo<EditorFile[]>(() => {
    if (!ticket?.codeFiles || ticket.codeFiles.length === 0) {
      const language = ticket?.language || 'javascript'
      const extension = LANGUAGE_EXTENSION_MAP[language] || 'txt'
      return [
        {
          id: 'solution',
          name: `solution.${extension}`,
          language,
          content: DEFAULT_FILE_CONTENT,
          readOnly: false,
        },
      ]
    }

    return ticket.codeFiles.map((file, index) => {
      const baseName = file.filename || file.name || `file-${index + 1}`
      return {
        id: baseName,
        name: baseName,
        language: file.language || ticket.language || 'javascript',
        content: file.content || DEFAULT_FILE_CONTENT,
        readOnly: file.isReadOnly ?? file.readOnly,
      }
    })
  }, [ticket])

  const visibleTestCases = useMemo(() => {
    const testCases = ticket?.testCases || []
    return testCases.filter((testCase) => !testCase.isHidden)
  }, [ticket])

  const allTestCases = useMemo(() => ticket?.testCases || [], [ticket])

  // Handle Run (visible tests only)
  const handleRun = useCallback(async (files: EditorFile[]) => {
    setIsRunning(true)
    setConsoleOutputs([{ type: 'info', message: 'Running visible tests...' }])

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (visibleTestCases.length === 0) {
      setConsoleOutputs([
        { type: 'info', message: 'Running tests...' },
        { type: 'error', message: 'No visible test cases available.' },
      ])
      setIsRunning(false)
      return
    }

    const outputs: ConsoleOutput[] = [{ type: 'info', message: 'Running visible tests...' }]

    // Find the primary code file (assuming first non-readonly or specifically named one)
    const primaryFile = files.find(f => !f.readOnly) || files[0]
    if (!primaryFile) {
      outputs.push({ type: 'error', message: 'Error: No code files found to run.' })
      setConsoleOutputs(outputs)
      setIsRunning(false)
      return
    }

    try {
      // Simple client-side runner
      // We wrap the code in a function to isolate it slightly and avoid global pollution
      // This is a naive implementation for the prototype
      const userCode = primaryFile.content

      // Extract function name if possible or assume default exported function
      // For these simple challenges, we'll try to find a function declaration
      const functionMatch = userCode.match(/function\s+(\w+)/)
      const functionName = functionMatch ? functionMatch[1] : null

      if (!functionName) {
        throw new Error('Could not find a function to test. Please ensure you defined a function.')
      }

      // Prepare execution context
      // We'll use Function constructor for a bit better isolation than eval
      const runTest = new Function('input', `
            ${userCode}
            try {
                const args = JSON.parse(input);
                return ${functionName}(...args);
            } catch (e) {
                throw new Error('Execution error: ' + e.message);
            }
        `)

      let passed = 0
      visibleTestCases.forEach((testCase, index) => {
        outputs.push({ type: 'log', message: `> Test Case ${index + 1}: input = ${testCase.input}` })

        try {
          const result = runTest(testCase.input)
          const actual = JSON.stringify(result)
          const expected = testCase.expectedOutput

          if (actual === expected || result.toString() === expected) {
            outputs.push({ type: 'success', message: `  ✓ Passed (Result: ${actual})` })
            passed++
          } else {
            outputs.push({ type: 'error', message: `  ✗ Failed (Expected: ${expected}, Got: ${actual})` })
          }
        } catch (err: any) {
          outputs.push({ type: 'error', message: `  ⚠ ${err.message}` })
        }
      })

      outputs.push({ type: 'log', message: '' })
      outputs.push({
        type: passed === visibleTestCases.length ? 'success' : 'error',
        message: `${passed}/${visibleTestCases.length} visible test cases passed`,
      })

    } catch (err: any) {
      outputs.push({ type: 'error', message: `Runtime Error: ${err.message}` })
    }

    setConsoleOutputs(outputs)
    setIsRunning(false)
  }, [visibleTestCases])

  // Handle Submit (all tests + evaluation)
  const handleSubmit = useCallback(async (files: EditorFile[]) => {
    setIsSubmitting(true)
    setConsoleOutputs([{ type: 'info', message: 'Submitting solution...' }])

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (allTestCases.length === 0) {
      setConsoleOutputs([
        { type: 'info', message: 'Submitting solution...' },
        { type: 'error', message: 'No test cases available for submission.' },
      ])
      setIsSubmitting(false)
      return
    }

    const outputs: ConsoleOutput[] = [{ type: 'info', message: 'Running all test cases (including hidden)...' }]

    const primaryFile = files.find(f => !f.readOnly) || files[0]
    if (!primaryFile) {
      outputs.push({ type: 'error', message: 'Error: No code files found.' })
      setConsoleOutputs(outputs)
      setIsSubmitting(false)
      return
    }

    try {
      const userCode = primaryFile.content
      const functionMatch = userCode.match(/function\s+(\w+)/)
      const functionName = functionMatch ? functionMatch[1] : null

      if (!functionName) throw new Error('Could not find a function to test.')

      const runTest = new Function('input', `
            ${userCode}
            try {
                const args = JSON.parse(input);
                return ${functionName}(...args);
            } catch (e) {
                throw new Error('Execution error: ' + e.message);
            }
        `)

      let passed = 0
      allTestCases.forEach((testCase, index) => {
        const isHidden = testCase.isHidden
        if (!isHidden) {
          outputs.push({ type: 'log', message: `> Test Case ${index + 1}: input = ${testCase.input}` })
        }

        try {
          const result = runTest(testCase.input)
          const actual = JSON.stringify(result)
          const expected = testCase.expectedOutput

          if (actual === expected || result.toString() === expected) {
            if (!isHidden) outputs.push({ type: 'success', message: `  ✓ Passed` })
            passed++
          } else {
            if (!isHidden) outputs.push({ type: 'error', message: `  ✗ Failed` })
          }
        } catch (err: any) {
          if (!isHidden) outputs.push({ type: 'error', message: `  ⚠ ${err.message}` })
        }
      })

      outputs.push({ type: 'log', message: '' })
      const allPassed = passed === allTestCases.length
      outputs.push({
        type: allPassed ? 'success' : 'error',
        message: `Final Result: ${passed}/${allTestCases.length} tests passed`,
      })

      if (allPassed) {
        outputs.push({ type: 'success', message: '✨ Solution Accepted! Awarding points...' })
        // TODO: Call API to mark ticket as completed and add points/NFT
      } else {
        outputs.push({ type: 'error', message: 'Solution rejected. Please fix the bugs and try again.' })
      }

    } catch (err: any) {
      outputs.push({ type: 'error', message: `Runtime Error: ${err.message}` })
    }

    setConsoleOutputs(outputs)
    setIsSubmitting(false)
  }, [allTestCases])

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
              files={editorFiles}
              defaultActiveFileId={editorFiles[0]?.id}
              storageKey={ticketId ? `ticket:${ticketId}` : undefined}
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