"use client"

import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Header } from "@/components/header"
import { UploadZone } from "@/components/upload-zone"
import { ConvertingState } from "@/components/converting-state"
import { ResultPanel } from "@/components/result-panel"
import { ErrorState } from "@/components/error-state"
import { useConvert } from "@/hooks/use-convert"
import { useWarmup } from "@/hooks/use-warmup"
import { HistoryEntry, useHistory } from "@/hooks/use-history"
import { ConvertError, ConvertResult } from "@/lib/api"
import { detectUrlFormat } from "@/lib/file-detection"

type AppState =
  | { status: "idle" }
  | { status: "converting"; filename: string; format: string; source: "file" | "url" }
  | { status: "success"; result: ConvertResult }
  | { status: "error"; message: string; code: string }

function resultFromHistory(entry: HistoryEntry): ConvertResult {
  return {
    markdown: entry.markdown,
    title: entry.title,
    filename: entry.filename,
    format: entry.format,
    char_count: entry.char_count,
    word_count: entry.word_count,
    processing_time_ms: entry.processing_time_ms ?? 0,
  }
}

export default function Home() {
  const [state, setState] = useState<AppState>({ status: "idle" })
  const { history, addToHistory, clearHistory } = useHistory()
  const { isWarming, isReady } = useWarmup()

  const { mutate: convert } = useConvert({
    onSuccess: (result) => {
      addToHistory(result)
      setState({ status: "success", result })
    },
    onError: (err: ConvertError) => {
      setState({ status: "error", message: err.message, code: err.code })
    },
  })

  const handleFileSelect = useCallback(
    (file: File, format: string) => {
      setState({ status: "converting", filename: file.name, format, source: "file" })
      convert({ file })
    },
    [convert]
  )

  const handleUrlSubmit = useCallback(
    (url: string) => {
      const format = detectUrlFormat(url)
      setState({ status: "converting", filename: url, format, source: "url" })
      convert({ url })
    },
    [convert]
  )

  const handleError = useCallback((message: string, code = "client_error") => {
    setState({ status: "error", message, code })
  }, [])

  const handleReset = useCallback(() => {
    setState({ status: "idle" })
  }, [])

  const handleOpenHistory = useCallback((entry: HistoryEntry) => {
    setState({ status: "success", result: resultFromHistory(entry) })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header apiReady={isReady} apiChecking={isWarming} />
      <main className="flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          {state.status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex-1"
            >
              <UploadZone
                apiReady={isReady}
                apiChecking={isWarming}
                history={history}
                onClearHistory={clearHistory}
                onFileSelect={handleFileSelect}
                onUrlSubmit={handleUrlSubmit}
                onError={handleError}
                onOpenHistory={handleOpenHistory}
              />
            </motion.div>
          )}

          {state.status === "converting" && (
            <motion.div
              key="converting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1"
            >
              <ConvertingState filename={state.filename} format={state.format} source={state.source} />
            </motion.div>
          )}

          {state.status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 flex-col"
            >
              <ResultPanel result={state.result} onReset={handleReset} />
            </motion.div>
          )}

          {state.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-1 items-center justify-center px-4 py-10"
            >
              <ErrorState message={state.message} code={state.code} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
