"use client"

import { useState, useCallback } from "react"
import { ConvertResult } from "@/lib/api"

export interface HistoryEntry {
  id: string
  filename: string
  title: string | null
  format: string
  word_count: number
  char_count: number
  processing_time_ms: number
  markdown: string
  convertedAt: number
}

const STORAGE_KEY = "mdrop_history"
const MAX_ENTRIES = 10

function load(): HistoryEntry[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
  } catch {
    return []
  }
}

function save(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(load)

  const addToHistory = useCallback((result: ConvertResult) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      filename: result.filename,
      title: result.title,
      format: result.format,
      word_count: result.word_count,
      char_count: result.char_count,
      processing_time_ms: result.processing_time_ms,
      markdown: result.markdown,
      convertedAt: Date.now(),
    }
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES)
      save(next)
      return next
    })
  }, [])

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id)
      save(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { history, addToHistory, removeFromHistory, clearHistory }
}
