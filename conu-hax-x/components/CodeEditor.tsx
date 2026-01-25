'use client'

import React, { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { FileCode, Lock, Play, Send, Loader2, Terminal, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export interface EditorFile {
  id: string
  name: string
  content: string
  language: string
  readOnly?: boolean
}

export interface ConsoleOutput {
  type: 'log' | 'error' | 'info' | 'success'
  message: string
}

interface CodeEditorProps {
  files: EditorFile[]
  defaultActiveFileId?: string
  onChange?: (fileId: string, content: string) => void
  onRun?: (files: EditorFile[]) => void
  onSubmit?: (files: EditorFile[]) => void
  isRunning?: boolean
  isSubmitting?: boolean
  consoleOutputs?: ConsoleOutput[]
  className?: string
}

const LANGUAGE_COLORS: Record<string, string> = {
  typescript: 'text-blue-400',
  javascript: 'text-yellow-400',
  python: 'text-green-400',
  java: 'text-orange-400',
}

const OUTPUT_COLORS: Record<string, string> = {
  log: 'text-foreground/70',
  error: 'text-red-400',
  info: 'text-blue-400',
  success: 'text-green-400',
}

export default function CodeEditor({
  files: initialFiles,
  defaultActiveFileId,
  onChange,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
  consoleOutputs = [],
  className,
}: CodeEditorProps) {
  // State
  const [allFiles, setAllFiles] = useState<EditorFile[]>(initialFiles)
  const [activeFileId, setActiveFileId] = useState(defaultActiveFileId || initialFiles[0]?.id || '')
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [isConsoleOpen, setIsConsoleOpen] = useState(true)

  // Derived
  const activeFile = allFiles.find((f) => f.id === activeFileId)
  const isDisabled = isRunning || isSubmitting

  // Handlers
  const handleTabClick = useCallback((fileId: string) => {
    setActiveFileId(fileId)
  }, [])

  const handleContentChange = useCallback((value: string | undefined) => {
    if (!activeFile || activeFile.readOnly) return
    
    setAllFiles((prev) =>
      prev.map((f) => f.id === activeFileId ? { ...f, content: value || '' } : f)
    )
    onChange?.(activeFileId, value || '')
  }, [activeFileId, activeFile, onChange])

  const handleEditorMount = useCallback((editor: any) => {
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({ line: e.position.lineNumber, column: e.position.column })
    })
  }, [])

  // Empty state
  if (allFiles.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-full bg-card text-muted-foreground', className)}>
        Aucun fichier ouvert
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-full bg-card rounded-lg overflow-hidden border border-border', className)}>
      
      {/* FILE TABS */}
      <div className="bg-muted/50 border-b border-border">
        <ScrollArea className="w-full">
          <div className="flex">
            {allFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => handleTabClick(file.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm border-r border-border transition-colors',
                  file.id === activeFileId
                    ? 'bg-card text-foreground border-t-2 border-t-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                )}
              >
                <FileCode className={cn('size-4', LANGUAGE_COLORS[file.language] || 'text-gray-400')} />
                <span>{file.name}</span>
                {file.readOnly && <Lock className="size-3 text-muted-foreground" />}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* MONACO EDITOR */}
      <div className="flex-1 min-h-0">
        {activeFile && (
          <Editor
            key={activeFile.id}
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            onChange={handleContentChange}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              readOnly: activeFile.readOnly,
              minimap: { enabled: false },
              fontSize: 14,
              tabSize: 2,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
            }}
          />
        )}
      </div>

      {/* CONSOLE */}
      <div className="border-t border-border">
        <div 
          className="flex items-center justify-between px-4 py-2 bg-muted/50 cursor-pointer hover:bg-muted"
          onClick={() => setIsConsoleOpen(!isConsoleOpen)}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Terminal className="size-4" />
            <span>Console</span>
            {consoleOutputs.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-secondary rounded">{consoleOutputs.length}</span>
            )}
          </div>
          {isConsoleOpen ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronUp className="size-4 text-muted-foreground" />}
        </div>

        {isConsoleOpen && (
          <ScrollArea className="h-[150px] bg-card p-3">
            {consoleOutputs.length === 0 ? (
              <p className="text-muted-foreground text-sm">Clique sur Run pour exécuter ton code...</p>
            ) : (
              <div className="space-y-1 font-mono text-sm">
                {consoleOutputs.map((output, i) => (
                  <div key={i} className={OUTPUT_COLORS[output.type] || 'text-foreground'}>
                    {output.type === 'error' && '[ERROR] '}
                    {output.type === 'success' && '[SUCCESS] '}
                    {output.message}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </div>

      {/* STATUS BAR */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium capitalize">{activeFile?.language}</span>
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
          {activeFile?.readOnly && (
            <span className="flex items-center gap-1 text-primary">
              <Lock className="size-3" /> Read-Only
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onRun?.(allFiles)} disabled={isDisabled} className="h-8">
            {isRunning ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            <span className="ml-1">Run</span>
          </Button>

          <Button size="sm" onClick={() => onSubmit?.(allFiles)} disabled={isDisabled} className="h-8">
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            <span className="ml-1">Submit</span>
          </Button>
        </div>
      </div>
    </div>
  )
}