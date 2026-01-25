'use client'

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()
  const ticketId = Array.isArray(params?.id) ? params?.id[0] : params?.id
  const questId = searchParams.get('questId')
  const stageIndex = searchParams.get('stageIndex')
  const [ticket, setTicket] = useState<TicketData | null>(null)
  const [ticketError, setTicketError] = useState<string | null>(null)
  const [isTicketLoading, setIsTicketLoading] = useState(true)
  const [consoleOutputs, setConsoleOutputs] = useState<ConsoleOutput[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const startTimeRef = useRef<number>(Date.now())

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

  useEffect(() => {
    startTimeRef.current = Date.now()
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

  const executeTests = useCallback((files: EditorFile[], testCases: typeof allTestCases) => {
    const outputs: ConsoleOutput[] = []

    const primaryFile = files.find((f) => !f.readOnly) || files[0]
    if (!primaryFile) {
      outputs.push({ type: 'error', message: 'Error: No code files found to run.' })
      return { outputs, passed: 0, total: 0 }
    }

    const userCode = primaryFile.content
    const functionMatch = userCode.match(/function\s+(\w+)/) || userCode.match(/const\s+(\w+)\s*=\s*\(?/)
    const functionName = functionMatch ? functionMatch[1] : null

    if (!functionName) {
      outputs.push({
        type: 'error',
        message: 'Could not find a function to test. Please ensure you defined a named function.',
      })
      return { outputs, passed: 0, total: testCases.length }
    }

    const runTest = new Function('input', `
      ${userCode}
      try {
        const args = JSON.parse(input);
        return ${functionName}(...(Array.isArray(args) ? args : [args]));
      } catch (e) {
        return ${functionName}(input);
      }
    `)

    let passed = 0
    testCases.forEach((testCase, index) => {
      const isHidden = testCase.isHidden
      if (!isHidden) {
        outputs.push({ type: 'log', message: `> Test Case ${index + 1}: input = ${testCase.input}` })
      }

      try {
        const result = runTest(testCase.input)
        const actual = JSON.stringify(result)
        const expected = testCase.expectedOutput

        if (actual === expected || result?.toString?.() === expected) {
          if (!isHidden) outputs.push({ type: 'success', message: `  ✓ Passed` })
          passed++
        } else {
          if (!isHidden) outputs.push({ type: 'error', message: `  ✗ Failed` })
        }
      } catch (err: any) {
        if (!isHidden) outputs.push({ type: 'error', message: `  ⚠ ${err.message}` })
      }
    })

    return { outputs, passed, total: testCases.length }
  }, [])

  const buildSubmitOutputs = useCallback((results: any[], testCases: typeof allTestCases) => {
    const outputs: ConsoleOutput[] = [{ type: 'info', message: 'Running all test cases (including hidden)...' }]
    let passed = 0

    results.forEach((result) => {
      if (result.passed) passed++
      const testCase = testCases[result.testCaseIndex]
      if (testCase?.isHidden) return

      outputs.push({ type: 'log', message: `> Test Case ${result.testCaseIndex + 1}: input = ${result.input}` })
      if (result.passed) {
        outputs.push({ type: 'success', message: `  ✓ Passed` })
      } else {
        outputs.push({ type: 'error', message: `  ✗ Failed` })
        if (result.error) {
          outputs.push({ type: 'error', message: `  ⚠ ${result.error}` })
        }
      }
    })

    outputs.push({ type: 'log', message: '' })
    outputs.push({
      type: passed === results.length ? 'success' : 'error',
      message: `Final Result: ${passed}/${results.length} tests passed`,
    })

    return { outputs, passed, total: results.length }
  }, [])

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

    const primaryFile = files.find((f) => !f.readOnly) || files[0]
    if (!primaryFile) {
      setConsoleOutputs([
        { type: 'info', message: 'Running tests...' },
        { type: 'error', message: 'No code files found to run.' },
      ])
      setIsRunning(false)
      return
    }

    let outputs: ConsoleOutput[] = []

    try {
      const response = await fetch('/api/run-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: primaryFile.content,
          language: primaryFile.language,
          testCases: visibleTestCases,
          ticketId,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to run tests')
      }

      outputs = [{ type: 'info', message: 'Running visible tests...' }]
      data.results.forEach((result: any, index: number) => {
        outputs.push({ type: 'log', message: `> Test Case ${index + 1}: input = ${result.input}` })
        if (result.passed) {
          outputs.push({ type: 'success', message: `  ✓ Passed` })
        } else {
          outputs.push({ type: 'error', message: `  ✗ Failed` })
          if (result.error) {
            outputs.push({ type: 'error', message: `  ⚠ ${result.error}` })
          }
        }
      })

      outputs.push({ type: 'log', message: '' })
      outputs.push({
        type: data.summary.passed === data.summary.total ? 'success' : 'error',
        message: `${data.summary.passed}/${data.summary.total} visible test cases passed`,
      })

      setConsoleOutputs(outputs)
    } catch (err: any) {
      setConsoleOutputs([
        { type: 'info', message: 'Running tests...' },
        { type: 'error', message: `Runtime Error: ${err.message}` },
      ])
    }

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

    const primaryFile = files.find(f => !f.readOnly) || files[0]
    if (!primaryFile) {
      setConsoleOutputs([{ type: 'error', message: 'Error: No code files found.' }])
      setIsSubmitting(false)
      return
    }

    let outputs: ConsoleOutput[] = []

    try {
      const userId = session?.user?.id
      if (!userId) {
        setConsoleOutputs([{ type: 'error', message: 'You must be logged in to submit.' }])
        setIsSubmitting(false)
        return
      }

      const timeSpent = Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000))
      const response = await fetch('/api/submit-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ticketId,
          code: primaryFile.content,
          language: primaryFile.language,
          timeSpent,
          questId: questId || undefined,
          stageIndex: stageIndex ? Number(stageIndex) : undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to submit solution')
      }

      const results = Array.isArray(data?.attempt?.testResults) ? data.attempt.testResults : []
      outputs = buildSubmitOutputs(results, allTestCases).outputs

      const attempt = data.attempt
      if (attempt?.passed) {
        outputs.push({ type: 'success', message: '✨ Solution Accepted! Points and badge awarded.' })
        if (data.nextStage?.url) {
          outputs.push({ type: 'info', message: 'Next stage unlocked. Redirecting...' })
          setConsoleOutputs(outputs)
          updateSession?.()
          router.push(data.nextStage.url)
          return
        }
      } else {
        outputs.push({ type: 'error', message: 'Solution rejected. Please fix the bugs and try again.' })
      }

      updateSession?.()
    } catch (err: any) {
      setConsoleOutputs([{ type: 'error', message: `Runtime Error: ${err.message}` }])
      setIsSubmitting(false)
      return
    }

    setConsoleOutputs(outputs)
    setIsSubmitting(false)
  }, [allTestCases, buildSubmitOutputs, questId, router, session?.user?.id, stageIndex, ticketId, updateSession])

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