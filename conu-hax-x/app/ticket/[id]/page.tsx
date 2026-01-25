'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import TicketView, { TicketData } from '@/components/TicketView'
import CodeEditor, { EditorFile, ConsoleOutput } from '@/components/CodeEditor'
import { Header } from '@/components/header'
import { toast } from 'sonner'

const DEFAULT_FILE_CONTENT = `// Write your solution here
`

const LANGUAGE_EXTENSION_MAP: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
}

/**
 * Strips 'export' keywords and basic TypeScript type annotations
 * to allow code to run in a simple 'new Function' sandbox.
 */
function preprocessCode(code: string): string {
  try {
    let result = code
      // 1. Remove comments
      .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
      // 2. Remove imports/exports
      .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+/g, '')
      // 3. Remove modifiers
      .replace(/\b(public|private|protected|readonly)\b/g, '')

    // 4. Remove interface/type blocks with bracket awareness
    const stripDef = (keyword: string) => {
      let start = 0;
      while ((start = result.indexOf(keyword, start)) !== -1) {
        let braceCount = 0;
        let i = start;
        let foundBrace = false;
        for (; i < result.length; i++) {
          if (result[i] === '{') { braceCount++; foundBrace = true; }
          else if (result[i] === '}') braceCount--;
          if (foundBrace && braceCount === 0) { i++; break; }
          if (!foundBrace && result[i] === ';') { i++; break; }
        }
        result = result.substring(0, start) + result.substring(i);
      }
    };
    stripDef('interface ');
    stripDef('type ');

    // 5. Position-aware type stripping
    // Function return types: ): Type {
    result = result.replace(/(\))\s*:\s*[\w\s\|\[\]\<\>\:\?\.\{\}]+(?=\{)/g, '$1');
    // Var declarations: const x: Type =
    result = result.replace(/\b(const|let|var)\s+(\w+)\s*:\s*[\w\s\|\[\]\<\>\:\?\.]+(?==)/g, '$1 $2');
    // Function params: (x: Type, y: Type)
    result = result.replace(/(\(|,)\s*(\w+)\s*:\s*[\w\s\|\[\]\<\>\:\?\.]+(?=[,)=])/g, '$1$2');

    // 6. Assertions and Generics
    result = result.replace(/\s+as\s+[\w\s\|\[\]\<\>\{\}\:\?\.]+(?=[;,\)\n]|$)/g, '');
    result = result.replace(/(\w|\))!(?=[.?;,)\s]|$)/g, '$1');
    for (let k = 0; k < 2; k++) {
      result = result.replace(/<[\w\s\|\[\]\:\?\.\{\},<>]+>/g, '');
    }

    return result.trim();
  } catch (e) {
    console.error('Preprocessing failed:', e);
    return code;
  }
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
  const [showSuccess, setShowSuccess] = useState(false)
  const [questResult, setQuestResult] = useState<any>(null)

  const router = useRouter()

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

    let userCode = ''
    try {
      // Simple client-side runner
      // We wrap the code in a function to isolate it slightly and avoid global pollution
      // This is a naive implementation for the prototype
      const rawCode = primaryFile.content
      userCode = preprocessCode(rawCode)

      // Extract function name if possible or assume default exported function
      // For these simple challenges, we'll try to find a function declaration
      const functionMatch = userCode.match(/function\s+(\w+)/)
      const functionName = functionMatch ? functionMatch[1] : null

      if (!functionName) {
        throw new Error('Could not find a function to test. Please ensure you defined a function.')
      }

      // Prepare execution context
      // We provide a mock environment for full-stack tasks
      const mockEnv = {
        process: {
          env: {
            MONGODB_URI: 'mongodb://mock-uri-for-testing'
          }
        },
        NextResponse: {
          json: (data: any, init?: any) => {
            return {
              json: async () => data,
              status: init?.status || 200,
              _data: data // Helper for testing
            }
          }
        },
        mongoose: {
          connect: async () => ({ id: 'mock-db-conn' }),
          Schema: class { },
          model: (name: string) => ({
            create: async (data: any) => ({ ...data, _id: 'mock-id' }),
            find: () => ({ sort: () => ({ lean: async () => [] }) }),
            findByIdAndDelete: async () => ({ ok: true })
          }),
          models: {}
        }
      }

      const runTest = new Function('input', 'NextResponse', 'mongoose', 'process', `
            ${userCode}
            return (async () => {
                try {
                    const args = JSON.parse(input);
                    const result = await ${functionName}(...args);
                    
                    // If it's a mock NextResponse, extract the JSON data
                    if (result && typeof result.json === 'function' && result._data) {
                        return result._data;
                    }
                    
                    return result;
                } catch (e) {
                    throw new Error('Execution error: ' + e.message);
                }
            })();
        `)

      let passed = 0
      const testResults = await Promise.all(visibleTestCases.map(async (testCase, index) => {
        try {
          const result = await runTest(testCase.input, mockEnv.NextResponse, mockEnv.mongoose, mockEnv.process)
          const actual = JSON.stringify(result === undefined ? null : result)
          const expected = testCase.expectedOutput

          if (actual === expected || (result !== undefined && result?.toString() === expected)) {
            passed++
            return { index, input: testCase.input, actual, expected, success: true }
          } else {
            return { index, input: testCase.input, actual, expected, success: false }
          }
        } catch (err: any) {
          return { index, input: testCase.input, error: err.message, success: false }
        }
      }))

      testResults.forEach(res => {
        outputs.push({ type: 'log', message: `> Test Case ${res.index + 1}: input = ${res.input}` })
        if (res.success) {
          outputs.push({ type: 'success', message: `  ✓ Passed (Result: ${res.actual})` })
        } else if (res.error) {
          outputs.push({ type: 'error', message: `  ⚠ ${res.error}` })
        } else {
          outputs.push({ type: 'error', message: `  ✗ Failed (Expected: ${res.expected}, Got: ${res.actual})` })
        }
      })

      outputs.push({ type: 'log', message: '' })
      outputs.push({
        type: passed === visibleTestCases.length ? 'success' : 'error',
        message: `${passed}/${visibleTestCases.length} visible test cases passed`,
      })

    } catch (err: any) {
      console.error('TRANSPILED CODE ON ERROR:\n', userCode);
      outputs.push({ type: 'error', message: `Runtime Error: ${err.message}` });
      outputs.push({ type: 'info', message: 'Check the browser console (F12) for the transpiled source code.' });
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

    let userCode = ''
    try {
      const rawCode = primaryFile.content
      userCode = preprocessCode(rawCode)

      const functionMatch = userCode.match(/function\s+(\w+)/)
      const functionName = functionMatch ? functionMatch[1] : null

      if (!functionName) throw new Error('Could not find a function to test.')

      const mockEnv = {
        process: {
          env: {
            MONGODB_URI: 'mongodb://mock-uri-for-testing'
          }
        },
        NextResponse: {
          json: (data: any, init?: any) => ({ json: async () => data, status: init?.status || 200, _data: data })
        },
        mongoose: {
          connect: async () => ({ id: 'mock-db-conn' }),
          Schema: class { },
          model: (name: string) => ({
            create: async (data: any) => ({ ...data, _id: 'mock-id' }),
            find: () => ({ sort: () => ({ lean: async () => [] }) }),
            findByIdAndDelete: async () => ({ ok: true })
          }),
          models: {}
        }
      }

      const runTest = new Function('input', 'NextResponse', 'mongoose', 'process', `
            ${userCode}
            return (async () => {
                try {
                    const args = JSON.parse(input);
                    const result = await ${functionName}(...args);
                    if (result && typeof result.json === 'function' && result._data) return result._data;
                    return result;
                } catch (e) {
                    throw new Error('Execution error: ' + e.message);
                }
            })();
        `)

      let passed = 0
      const testResults = await Promise.all(allTestCases.map(async (testCase, index) => {
        try {
          const result = await runTest(testCase.input, mockEnv.NextResponse, mockEnv.mongoose, mockEnv.process)
          const actual = JSON.stringify(result === undefined ? null : result)
          const expected = testCase.expectedOutput
          if (actual === expected || (result !== undefined && result?.toString() === expected)) {
            passed++
            return { index, input: testCase.input, actual, expected, success: true, isHidden: testCase.isHidden }
          }
          return { index, input: testCase.input, actual, expected, success: false, isHidden: testCase.isHidden }
        } catch (err: any) {
          return { index, input: testCase.input, error: err.message, success: false, isHidden: testCase.isHidden }
        }
      }))

      testResults.forEach(res => {
        if (!res.isHidden) {
          outputs.push({ type: 'log', message: `> Test Case ${res.index + 1}: input = ${res.input}` })
          if (res.success) outputs.push({ type: 'success', message: `  ✓ Passed` })
          else if (res.error) outputs.push({ type: 'error', message: `  ⚠ ${res.error}` })
          else outputs.push({ type: 'error', message: `  ✗ Failed` })
        }
      })

      outputs.push({ type: 'log', message: '' })
      const allPassed = passed === allTestCases.length
      outputs.push({
        type: allPassed ? 'success' : 'error',
        message: `Final Result: ${passed}/${allTestCases.length} tests passed`,
      })

      if (allPassed) {
        outputs.push({ type: 'success', message: '✨ Solution Accepted! Saving progress...' })

        try {
          const response = await fetch(`/api/tickets/${ticketId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              solution: primaryFile.content,
              timeSpent: 0 // Could add a timer later
            }),
          });

          const result = await response.json();

          if (result.success) {
            toast.success(`Ticket Completed! +${result.pointsAwarded} XP`, {
              description: `Total XP: ${result.newExperience} | Level: ${result.newLevel}`,
              duration: 5000,
            });
            outputs.push({ type: 'success', message: `🚀 Progress saved! New XP: ${result.newTotalPoints}` });

            setQuestResult(result);
            setShowSuccess(true);
          } else {
            console.error('Failed to save progress:', result.error);
            outputs.push({ type: 'error', message: `⚠ Failed to save progress: ${result.error}` });
          }
        } catch (apiErr: any) {
          console.error('API Error:', apiErr);
          outputs.push({ type: 'error', message: `⚠ Connection error: ${apiErr.message}` });
        }
      } else {
        outputs.push({ type: 'error', message: 'Solution rejected. Please fix the bugs and try again.' })
      }

    } catch (err: any) {
      console.error('TRANSPILED CODE ON ERROR (SUBMIT):\n', userCode);
      outputs.push({ type: 'error', message: `Runtime Error: ${err.message}` });
      outputs.push({ type: 'info', message: 'Check the browser console (F12) for the transpiled source code.' });
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

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="max-w-md w-full p-8 rounded-2xl text-center shadow-2xl border-4 border-primary bg-card animate-in zoom-in-95 duration-300"
            style={{
              boxShadow: '8px 8px 0 rgba(0,0,0,0.4)',
            }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-display text-primary mb-2">
              {questResult?.reSolved ? 'Ticket Re-solved!' : 'Ticket Solved!'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {questResult?.reSolved
                ? "You've successfully solved this challenge again. Keep up the practice!"
                : <>Excellent work. You've earned <strong>+{questResult?.pointsAwarded || 20} XP</strong> and advanced in your quest.</>
              }
            </p>

            <div className="flex flex-col gap-3">
              {questResult?.nextTicketId && (
                <Button
                  size="lg"
                  className="font-bold py-6 text-lg"
                  style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}
                  onClick={() => {
                    setShowSuccess(false);
                    router.push(`/ticket/${questResult.nextTicketId}`);
                  }}
                >
                  Next Challenge
                </Button>
              )}

              {!questResult?.nextTicketId && questResult?.questProgress && !questResult.questProgress.isCompleted && (
                <Button
                  size="lg"
                  className="font-bold py-6 text-lg"
                  style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}
                  onClick={() => {
                    setShowSuccess(false);
                    router.push(`/quest/${questResult.questProgress.questId}`);
                  }}
                >
                  Continue Quest
                </Button>
              )}

              {questResult?.questProgress?.isCompleted && (
                <div className="p-4 bg-yellow-400/10 border-2 border-yellow-400/50 rounded-xl mb-4">
                  <p className="text-yellow-600 font-bold mb-1">Quest Fully Completed!</p>
                  <p className="text-xs text-muted-foreground">You've unlocked a unique achievement NFT!</p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => router.push(questResult?.questProgress ? `/quest/${questResult.questProgress.questId}` : '/quests')}
              >
                Back to Map
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}