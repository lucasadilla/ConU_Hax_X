'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { FileCode, Lock, Play, Send, Loader2, Terminal, ChevronDown, ChevronUp, Folder, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  storageKey?: string
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
  storageKey,
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
  const editorRef = useRef<any>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Derived
  const activeFile = allFiles.find((f) => f.id === activeFileId)
  const isDisabled = isRunning || isSubmitting

  useEffect(() => {
    const applyFiles = (files: EditorFile[]) => {
      setAllFiles(files)
      setActiveFileId((current) => {
        if (current && files.some((file) => file.id === current)) {
          return current
        }
        return defaultActiveFileId || files[0]?.id || ''
      })
    }

    if (!storageKey) {
      applyFiles(initialFiles)
      setIsHydrated(true)
      return
    }

    try {
      const storageId = `code-editor:${storageKey}`
      const savedRaw = localStorage.getItem(storageId) || sessionStorage.getItem(storageId)
      if (!savedRaw) {
        applyFiles(initialFiles)
        setIsHydrated(true)
        return
      }

      const savedFiles: EditorFile[] = JSON.parse(savedRaw)
      const merged = initialFiles.map((file) => {
        const match = savedFiles.find((saved) => saved.id === file.id) ||
          savedFiles.find((saved) => saved.name === file.name)
        return match ? { ...file, content: match.content } : file
      })

      applyFiles(merged)
      setIsHydrated(true)
    } catch {
      applyFiles(initialFiles)
      setIsHydrated(true)
    }
  }, [initialFiles, defaultActiveFileId, storageKey])

  useEffect(() => {
    if (!storageKey || !isHydrated) return
    const payload = allFiles.map((file) => ({
      id: file.id,
      name: file.name,
      language: file.language,
      content: file.content,
      readOnly: file.readOnly,
    }))
    const storageId = `code-editor:${storageKey}`
    localStorage.setItem(storageId, JSON.stringify(payload))
    sessionStorage.setItem(storageId, JSON.stringify(payload))
  }, [allFiles, isHydrated, storageKey])

  const persistFiles = useCallback((files: EditorFile[]) => {
    if (!storageKey) return
    const payload = files.map((file) => ({
      id: file.id,
      name: file.name,
      language: file.language,
      content: file.content,
      readOnly: file.readOnly,
    }))
    const storageId = `code-editor:${storageKey}`
    localStorage.setItem(storageId, JSON.stringify(payload))
    sessionStorage.setItem(storageId, JSON.stringify(payload))
  }, [storageKey])

  // Handlers
  const handleTabClick = useCallback((fileId: string) => {
    setActiveFileId(fileId)
  }, [])


  const handleContentChange = useCallback((value: string | undefined) => {
    if (!activeFile || activeFile.readOnly) return

    const nextValue = value || ''
    setAllFiles((prev) => {
      const updated = prev.map((f) => f.id === activeFileId ? { ...f, content: nextValue } : f)
      persistFiles(updated)
      return updated
    })
    onChange?.(activeFileId, nextValue)
  }, [activeFileId, activeFile, onChange, persistFiles])

  const handleBeforeMount = useCallback((monaco: any) => {
    if (!monaco?.languages?.typescript) return
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    })
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    })
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      allowNonTsExtensions: true,
      allowJs: true,
    })
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      allowNonTsExtensions: true,
      allowJs: true,
    })
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
  }, [])

  const handleEditorMount = useCallback((editor: any) => {
    editorRef.current = editor
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({ line: e.position.lineNumber, column: e.position.column })
    })
  }, [])

  const formatWithPrettier = useCallback(async (content: string, language: string) => {
    const raw = (language || '').toLowerCase()
    const normalized = raw === 'js' ? 'javascript' : raw === 'ts' ? 'typescript' : raw
    const supported = ['javascript', 'typescript', 'jsx', 'tsx']
    if (!supported.includes(normalized)) return content

    try {
      const prettierModule = await import('prettier/standalone')
      const parserBabelModule = await import('prettier/plugins/babel')
      const parserTypescriptModule = await import('prettier/plugins/typescript')
      const parserEstreeModule = await import('prettier/plugins/estree')
      const formatFn = (prettierModule as any).format || (prettierModule as any).default?.format
      const parserBabel = (parserBabelModule as any).default || parserBabelModule
      const parserTypescript = (parserTypescriptModule as any).default || parserTypescriptModule
      const parserEstree = (parserEstreeModule as any).default || parserEstreeModule
      if (!formatFn) return content
      const parser = normalized === 'typescript' || normalized === 'tsx' ? 'typescript' : 'babel'

      return formatFn(content, {
        parser,
        plugins: [parserBabel, parserTypescript, parserEstree],
        singleQuote: true,
        semi: true,
      })
    } catch {
      return content
    }
  }, [])

  const handleFormat = useCallback(async () => {
    if (!activeFile || activeFile.readOnly) return
    const source = editorRef.current?.getValue?.() ?? activeFile.content
    const formatted = await formatWithPrettier(source, activeFile.language)
    if (formatted === source) return

    editorRef.current?.setValue?.(formatted)
    setAllFiles((prev) => {
      const updated = prev.map((file) => (file.id === activeFile.id ? { ...file, content: formatted } : file))
      persistFiles(updated)
      return updated
    })
    onChange?.(activeFile.id, formatted)
  }, [activeFile, formatWithPrettier, onChange, persistFiles])

  // Empty state
  if (allFiles.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-full bg-card text-muted-foreground', className)}>
        No file open
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-full bg-card rounded-lg overflow-hidden border border-border', className)}>
      
      {/* FILE TABS */}
      <div className="bg-muted/50 border-b border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Folder className="size-4" />
            <span>Files</span>
          </div>
          <Select value={activeFileId} onValueChange={handleTabClick}>
            <SelectTrigger className="h-8 w-[260px] bg-background">
              <SelectValue placeholder="Select a file" />
            </SelectTrigger>
            <SelectContent>
              {allFiles.map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  <span className="inline-flex items-center gap-2">
                    <FileCode className={cn('size-3', LANGUAGE_COLORS[file.language] || 'text-gray-400')} />
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    {file.readOnly && <Lock className="size-3 text-muted-foreground" />}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MONACO EDITOR */}
      <div className="flex-1 min-h-0">
        {activeFile && (
          <Editor
            height="100%"
            path={`file:///${activeFile.name || activeFile.id}`}
            language={activeFile.language}
            value={activeFile.content}
            onChange={handleContentChange}
            onMount={handleEditorMount}
            beforeMount={handleBeforeMount}
            theme="vs-dark"
            keepCurrentModel
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
              <p className="text-muted-foreground text-sm">Click Run to execute your code...</p>
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleFormat}
            disabled={isDisabled || !activeFile || activeFile.readOnly}
            className="h-8"
          >
            <Wand2 className="size-4" />
            <span className="ml-1">Format</span>
          </Button>
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