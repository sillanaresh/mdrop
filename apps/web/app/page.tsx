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
import { useHistory } from "@/hooks/use-history"
import { ConvertResult, ConvertError } from "@/lib/api"
import { detectUrlFormat } from "@/lib/file-detection"

type AppState =
  | { status: "idle" }
  | { status: "converting"; filename: string; format: string }
  | { status: "success"; result: ConvertResult }
  | { status: "error"; message: string; code: string }

export default function Home() {
  const [state, setState] = useState<AppState>({ status: "idle" })
  const { addToHistory } = useHistory()
  useWarmup()

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
      setState({ status: "converting", filename: file.name, format })
      convert({ file })
    },
    [convert]
  )

  const handleUrlSubmit = useCallback(
    (url: string) => {
      const format = detectUrlFormat(url)
      setState({ status: "converting", filename: url, format })
      convert({ url })
    },
    [convert]
  )

  const handleError = useCallback((message: string) => {
    setState({ status: "error", message, code: "client_error" })
  }, [])

  const handleReset = useCallback(() => {
    setState({ status: "idle" })
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f5f0" }}>
      <Header />
      <main className="flex-1 flex flex-col">
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
                onFileSelect={handleFileSelect}
                onUrlSubmit={handleUrlSubmit}
                onError={handleError}
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
              <ConvertingState filename={state.filename} format={state.format} />
            </motion.div>
          )}

          {state.status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <ResultPanel result={state.result} onReset={handleReset} />
            </motion.div>
          )}

          {state.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex items-center justify-center p-8"
              style={{ background: "#f5f5f0" }}
            >
              <ErrorState message={state.message} code={state.code} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
