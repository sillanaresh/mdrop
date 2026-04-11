"use client"

import { useState } from "react"
import { MarkdownPreview } from "./markdown-preview"
import { ConvertResult } from "@/lib/api"
import { formatWords } from "@/lib/utils"
import { cn } from "@/lib/utils"

type Tab = "preview" | "source"

interface ResultPanelProps {
  result: ConvertResult
  onReset: () => void
}

export function ResultPanel({ result, onReset }: ResultPanelProps) {
  const [tab, setTab] = useState<Tab>("preview")
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const handleDownload = () => {
    const name = (result.title ?? result.filename ?? "converted")
      .replace(/\.[^.]+$/, "")
      .replace(/[/\\?%*:|"<>]/g, "-")
    const blob = new Blob([result.markdown], { type: "text/markdown; charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${name}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">

      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        {/* Back */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          New
        </button>

        <div className="w-px h-4 bg-gray-200" />

        {/* Document title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {result.title ?? result.filename}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatWords(result.word_count)} · {result.processing_time_ms < 1000
              ? `${result.processing_time_ms}ms`
              : `${(result.processing_time_ms / 1000).toFixed(1)}s`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm font-medium transition-all",
              copied
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900 shadow-sm"
            )}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                Copy
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download .md
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 pt-3 pb-0 bg-white border-b border-gray-200 flex-shrink-0">
        {([
          { id: "preview", label: "Preview" },
          { id: "source", label: "Markdown source" },
        ] as { id: Tab; label: string }[]).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors -mb-px",
              tab === id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {tab === "preview" ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 my-6 px-10 py-8">
            {result.title && (
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-4">
                {result.filename}
              </p>
            )}
            <MarkdownPreview content={result.markdown} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto my-6 px-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-xs font-mono text-gray-500">markdown</span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  {copied ? "Copied!" : "Copy all"}
                </button>
              </div>
              <pre className="p-5 text-sm font-mono text-gray-700 overflow-auto leading-relaxed whitespace-pre-wrap break-words"
                style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
              >
                {result.markdown}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
