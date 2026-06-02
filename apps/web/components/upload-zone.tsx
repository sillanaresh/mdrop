"use client"

import { useCallback, useState } from "react"
import { useDropzone, FileRejection } from "react-dropzone"
import { AnimatePresence, motion } from "framer-motion"
import { FormatBadges } from "./format-badges"
import { HistoryEntry } from "@/hooks/use-history"
import { detectFileFormat, isValidUrl } from "@/lib/file-detection"
import { ACCEPTED_FILE_TYPES, FORMAT_CONFIG, MAX_FILE_SIZE } from "@/lib/format-config"
import { formatBytes, formatDateTime, formatWords } from "@/lib/utils"

interface UploadZoneProps {
  apiReady: boolean
  apiChecking: boolean
  history: HistoryEntry[]
  onFileSelect: (file: File, format: string) => void
  onUrlSubmit: (url: string) => void
  onError: (message: string, code?: string) => void
  onOpenHistory: (entry: HistoryEntry) => void
  onClearHistory: () => void
}

const TRUST_ITEMS = [
  "No account required",
  "10 MB file limit",
  "Markdown preview and source",
  "Copy or download when done",
]

function getRejectedError(rejected: FileRejection[]): { message: string; code: string } {
  const firstError = rejected[0]?.errors[0]
  if (firstError?.code === "file-too-large") {
    return {
      code: "file_too_large",
      message: `File too large. Maximum is ${formatBytes(MAX_FILE_SIZE)}.`,
    }
  }

  return {
    code: "unsupported_format",
    message: "Unsupported format. Try PDF, Word, PowerPoint, Excel, CSV, PNG/JPG, WebP, or paste a URL.",
  }
}

export function UploadZone({
  apiReady,
  apiChecking,
  history,
  onFileSelect,
  onUrlSubmit,
  onError,
  onOpenHistory,
  onClearHistory,
}: UploadZoneProps) {
  const [url, setUrl] = useState("")
  const [urlFocused, setUrlFocused] = useState(false)

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        const error = getRejectedError(rejected)
        onError(error.message, error.code)
        return
      }

      const file = accepted[0]
      if (!file) return

      const format = detectFileFormat(file)
      if (!format) {
        onError("Unsupported file type. Choose one of the listed formats or paste a public URL.", "unsupported_format")
        return
      }

      if (file.size === 0) {
        onError("The selected file is empty. Choose a file with content to convert.", "empty_file")
        return
      }

      onFileSelect(file, format)
    },
    [onFileSelect, onError]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple: false,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
  })

  const handleUrlSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    if (!isValidUrl(trimmed)) {
      onError("Enter a public URL that starts with http:// or https://.", "invalid_url")
      return
    }
    onUrlSubmit(trimmed)
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 md:px-8 md:py-10">
      <section className="grid min-h-[calc(100vh-8rem)] grid-cols-1 content-center gap-7 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="flex min-w-0 flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-border)] bg-[rgb(255_253_248_/_0.68)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-muted)]">
            <span
              className={`h-2 w-2 rounded-full ${
                apiChecking ? "bg-amber-500" : apiReady ? "bg-[var(--color-success)]" : "bg-[var(--color-ink-subtle)]"
              }`}
            />
            {apiChecking ? "Starting the converter" : apiReady ? "Ready for conversion" : "Converter may need a moment"}
          </div>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-[var(--color-ink)] md:text-6xl">
            Drop source material in. Get usable Markdown out.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-ink-muted)]">
            MDrop turns PDFs, docs, slides, sheets, images, web pages, and YouTube links into Markdown that is ready for LLM context, notes, docs, and search.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="m2.25 6.15 2.25 2.2 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-subtle)]">Supported inputs</p>
            <FormatBadges />
          </div>
        </div>

        <div className="min-w-0">
          <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[rgb(255_253_248_/_0.82)] p-3 shadow-[var(--shadow-soft)] backdrop-blur">
            <div
              {...getRootProps()}
              className="relative cursor-pointer"
              aria-label="Upload a file for conversion"
            >
              <motion.div
                animate={{ scale: isDragActive ? 1.012 : 1 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`rounded-[1.35rem] border border-dashed px-5 py-10 text-center transition-colors duration-150 md:px-8 md:py-12 ${
                  isDragReject
                    ? "border-[var(--color-warn)] bg-[var(--color-warn-soft)]"
                    : isDragActive
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                      : "border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] hover:border-[var(--color-accent)]"
                }`}
              >
                <input {...getInputProps()} />
                <AnimatePresence mode="wait">
                  {isDragActive ? (
                    <motion.div
                      key="drag"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-accent)] shadow-[var(--shadow-tight)]">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-[var(--color-accent-ink)]">Release to start conversion</p>
                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">One file at a time keeps the output easy to verify.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)] text-[var(--color-accent)]">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-[var(--color-ink)]">Drop a file here</p>
                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                          or <span className="font-semibold text-[var(--color-accent)] underline underline-offset-4">browse files</span>
                        </p>
                      </div>
                      <p className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-[var(--color-ink-muted)]">
                        Max {formatBytes(MAX_FILE_SIZE)} per file
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--color-border)]" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-subtle)]">or paste a URL</span>
              <div className="h-px flex-1 bg-[var(--color-border)]" />
            </div>

            <form onSubmit={handleUrlSubmit}>
              <div
                className={`flex flex-col gap-3 rounded-2xl border bg-[var(--color-surface-raised)] p-3 shadow-[var(--shadow-tight)] transition-all duration-150 sm:flex-row sm:items-center ${
                  urlFocused ? "border-[var(--color-accent)]" : "border-[var(--color-border)]"
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-[var(--color-ink-subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                  <input
                    type="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    onFocus={() => setUrlFocused(true)}
                    onBlur={() => setUrlFocused(false)}
                    placeholder="https://example.com/article or YouTube URL"
                    className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-subtle)]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!url.trim()}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Convert URL
                </button>
              </div>
            </form>
          </div>

          {history.length > 0 && (
            <section className="mt-5 rounded-[1.5rem] border border-[var(--color-border)] bg-[rgb(255_253_248_/_0.72)] p-4 shadow-[var(--shadow-tight)]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-[var(--color-ink)]">Recent conversions</h2>
                <button onClick={onClearHistory} className="text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
                  Clear
                </button>
              </div>
              <div className="grid gap-2">
                {history.slice(0, 3).map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => onOpenHistory(entry)}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-left transition-colors hover:border-[var(--color-accent)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--color-ink)]">{entry.title ?? entry.filename}</p>
                      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                        {FORMAT_CONFIG[entry.format]?.label ?? "Markdown"} · {formatWords(entry.word_count)} · {formatDateTime(entry.convertedAt)}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-xs font-semibold text-[var(--color-accent)]">Open</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  )
}
