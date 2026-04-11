"use client"

import { useCallback, useState } from "react"
import { useDropzone, FileRejection } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { FormatBadges } from "./format-badges"
import { detectFileFormat, isValidUrl } from "@/lib/file-detection"
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/format-config"
import { formatBytes } from "@/lib/utils"

interface UploadZoneProps {
  onFileSelect: (file: File, format: string) => void
  onUrlSubmit: (url: string) => void
  onError: (message: string) => void
}

export function UploadZone({ onFileSelect, onUrlSubmit, onError }: UploadZoneProps) {
  const [url, setUrl] = useState("")
  const [urlFocused, setUrlFocused] = useState(false)

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        const code = rejected[0].errors[0]?.code
        if (code === "file-too-large") {
          onError(`File too large. Maximum is ${formatBytes(MAX_FILE_SIZE)}.`)
        } else {
          onError("Unsupported format. Try PDF, Word, PowerPoint, Excel, a CSV, or an image.")
        }
        return
      }
      const file = accepted[0]
      if (!file) return
      const format = detectFileFormat(file)
      if (!format) { onError("Unsupported file type."); return }
      onFileSelect(file, format)
    },
    [onFileSelect, onError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
  })

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    if (!isValidUrl(trimmed)) { onError("URL must start with http:// or https://"); return }
    onUrlSubmit(trimmed)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 py-16">

      {/* Headline */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
          Drop any file.<br />Get clean Markdown.
        </h1>
        <p className="text-gray-500 text-lg">
          Free, instant, no account needed.
        </p>
      </div>

      {/* Drop zone card */}
      <div className="w-full max-w-lg">
        <div
          {...getRootProps()}
          className="relative cursor-pointer"
        >
          <motion.div
            animate={{ scale: isDragActive ? 1.015 : 1 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              rounded-2xl border-2 border-dashed p-14 text-center bg-white
              transition-colors duration-150 shadow-sm
              ${isDragActive
                ? "border-indigo-400 bg-indigo-50/60"
                : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50/60"
              }
            `}
            style={{
              boxShadow: isDragActive
                ? "0 0 0 4px rgba(99,102,241,0.12), 0 1px 3px rgba(0,0,0,0.07)"
                : "0 1px 3px rgba(0,0,0,0.07)"
            }}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {isDragActive ? (
                <motion.div key="drag"
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-indigo-600">Release to convert</p>
                </motion.div>
              ) : (
                <motion.div key="idle"
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-700">Drop your file here</p>
                    <p className="text-sm text-gray-400 mt-1">
                      or <span className="text-indigo-600 font-medium underline underline-offset-2 cursor-pointer">browse files</span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">Up to 10 MB</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or paste a URL</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* URL input */}
        <form onSubmit={handleUrlSubmit}>
          <div className={`
            flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5
            shadow-sm transition-all duration-150
            ${urlFocused ? "border-indigo-400 ring-3 ring-indigo-100" : "border-gray-300"}
          `}>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onFocus={() => setUrlFocused(true)}
              onBlur={() => setUrlFocused(false)}
              placeholder="https://youtube.com/watch?v=... or any webpage"
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
            />
            <button
              type="submit"
              disabled={!url.trim()}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors flex-shrink-0"
            >
              Convert
            </button>
          </div>
        </form>
      </div>

      {/* Formats */}
      <div className="mt-12 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Supports</p>
        <FormatBadges />
      </div>
    </div>
  )
}
