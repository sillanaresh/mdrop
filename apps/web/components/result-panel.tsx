"use client"

import { useState } from "react"
import MarkdownEditor from "./markdown-editor"
import { MarkdownPreview } from "./markdown-preview"
import { ConvertResult } from "@/lib/api"
import { FORMAT_CONFIG } from "@/lib/format-config"
import { cn, formatDuration, formatWords } from "@/lib/utils"

type ViewMode = "split" | "preview" | "source"

interface ResultPanelProps {
  result: ConvertResult
  onReset: () => void
}

function downloadName(result: ConvertResult): string {
  return (result.title ?? result.filename ?? "converted")
    .replace(/\.[^.]+$/, "")
    .replace(/[/\\?%*:|"<>]/g, "-")
}

export function ResultPanel({ result, onReset }: ResultPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("preview")
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")
  const format = FORMAT_CONFIG[result.format]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.markdown)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
    setTimeout(() => setCopyState("idle"), 1800)
  }

  const handleDownload = () => {
    const blob = new Blob([result.markdown], { type: "text/markdown; charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${downloadName(result)}.md`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const showPreview = viewMode === "preview" || viewMode === "split"
  const showSource = viewMode === "source" || viewMode === "split"

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="border-b border-[var(--color-border)] bg-[rgb(255_253_248_/_0.9)] px-4 py-4 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <button
                onClick={onReset}
                className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
                aria-label="Convert another source"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
              </button>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-subtle)]">Markdown ready</p>
                <h1 className="mt-1 truncate text-xl font-semibold text-[var(--color-ink)] md:text-2xl">
                  {result.title ?? result.filename}
                </h1>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-[var(--color-ink-muted)]">
                  <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1">{format?.label ?? "Markdown"}</span>
                  <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1">{formatWords(result.word_count)}</span>
                  <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1">{result.char_count.toLocaleString()} chars</span>
                  <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1">{formatDuration(result.processing_time_ms)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="grid grid-cols-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
                {(["preview", "source", "split"] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "h-9 rounded-lg px-3 text-xs font-semibold capitalize transition-colors",
                      viewMode === mode
                        ? "bg-[var(--color-accent)] text-white"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex">
                <button
                  onClick={handleCopy}
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors",
                    copyState === "copied"
                      ? "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success)]"
                      : copyState === "failed"
                        ? "border-[var(--color-warn)] bg-[var(--color-warn-soft)] text-[var(--color-warn)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-border-strong)]"
                  )}
                  aria-live="polite"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    {copyState === "copied" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    )}
                  </svg>
                  {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy"}
                </button>

                <button
                  onClick={handleDownload}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 py-5 md:px-6">
        <div
          className={cn(
            "mx-auto grid h-full max-w-7xl gap-4",
            viewMode === "split" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
          )}
        >
          {showPreview && (
            <section className="min-h-[32rem] overflow-auto rounded-[1.35rem] border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-tight)]">
              <div className="border-b border-[var(--color-border)] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Preview</p>
              </div>
              <div className="px-5 py-5 md:px-8 md:py-7">
                {result.markdown.trim() ? (
                  <MarkdownPreview content={result.markdown} />
                ) : (
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5 text-sm text-[var(--color-ink-muted)]">
                    The converter returned an empty Markdown document. Try another source or re-export the file.
                  </div>
                )}
              </div>
            </section>
          )}

          {showSource && (
            <section className="min-h-[32rem] overflow-hidden rounded-[1.35rem] border border-[var(--color-border)] bg-[#171612] shadow-[var(--shadow-tight)]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/56">Markdown source</p>
                <button onClick={handleCopy} className="text-xs font-semibold text-[#dbece6] hover:text-white">
                  {copyState === "copied" ? "Copied" : "Copy all"}
                </button>
              </div>
              <div className="h-[calc(100%-45px)] min-h-[29rem]">
                <MarkdownEditor content={result.markdown} />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
