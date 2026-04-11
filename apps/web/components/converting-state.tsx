"use client"

import { motion } from "framer-motion"
import { FORMAT_CONFIG } from "@/lib/format-config"

interface ConvertingStateProps {
  filename: string
  format: string
}

export function ConvertingState({ filename, format }: ConvertingStateProps) {
  const config = FORMAT_CONFIG[format]
  const message = config?.convertingMessage ?? "Converting your file…"

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* File card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{filename}</p>
              {config && (
                <p className="text-xs text-indigo-600 font-medium mt-0.5">{config.label}</p>
              )}
            </div>
          </div>

          {/* Shimmer bar */}
          <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center">{message}</p>
      </motion.div>
    </div>
  )
}
