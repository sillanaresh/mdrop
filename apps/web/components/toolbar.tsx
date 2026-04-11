"use client"

import { useState } from "react"
import { ConvertResult } from "@/lib/api"
import { formatWords } from "@/lib/utils"
import { cn } from "@/lib/utils"

export type ViewMode = "split" | "source" | "preview"

interface ToolbarProps {
  result: ConvertResult
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onReset: () => void
}

export function Toolbar({ result, viewMode, onViewModeChange, onReset }: ToolbarProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
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
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] flex-shrink-0 gap-3">
      {/* Left: back + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          New
        </button>
        <div className="w-px h-4 bg-zinc-800" />
        <span className="text-sm text-zinc-300 truncate">
          {result.title ?? result.filename}
        </span>
        <span className="text-xs text-zinc-600 flex-shrink-0 hidden sm:block">
          {formatWords(result.word_count)}
        </span>
      </div>

      {/* Center: view mode */}
      <div className="flex items-center rounded-lg border border-zinc-800 overflow-hidden flex-shrink-0">
        {(["split", "source", "preview"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={cn(
              "px-2.5 py-1 text-xs font-medium transition-colors capitalize",
              viewMode === mode
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
            copied
              ? "border-green-500/40 bg-green-500/10 text-green-400"
              : "border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white"
          )}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              Copy
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download .md
        </button>
      </div>
    </div>
  )
}
