"use client"

import { motion } from "framer-motion"

const HINTS: Record<string, string> = {
  unsupported_format: "Try PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), CSV, PNG/JPG, or paste a URL.",
  file_too_large: "Compress the file or split it into smaller parts (max 10 MB).",
  conversion_failed: "The file may be corrupted or password-protected. Try re-exporting it.",
  invalid_url: "Make sure the URL starts with https:// and the page is publicly accessible.",
  network_error: "Check your internet connection and try again.",
  client_error: "Try a different file or URL.",
}

interface ErrorStateProps {
  message: string
  code: string
  onReset: () => void
}

export function ErrorState({ message, code, onReset }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
    >
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 text-center">
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-1">{message}</p>
        {HINTS[code] && (
          <p className="text-xs text-gray-500 mb-5">{HINTS[code]}</p>
        )}
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </motion.div>
  )
}
