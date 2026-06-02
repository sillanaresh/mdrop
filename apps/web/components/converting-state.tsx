"use client"

import { motion } from "framer-motion"
import { FORMAT_CONFIG } from "@/lib/format-config"

interface ConvertingStateProps {
  filename: string
  format: string
  source: "file" | "url"
}

const STEPS = [
  "Reading source",
  "Extracting structure",
  "Preparing Markdown",
]

export function ConvertingState({ filename, format, source }: ConvertingStateProps) {
  const config = FORMAT_CONFIG[format]
  const message = config?.convertingMessage ?? "Converting your source..."

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[rgb(255_253_248_/_0.86)] p-4 shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="rounded-[1.35rem] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  {source === "url" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  )}
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">
                  {config?.label ?? "Source"} conversion
                </p>
                <h1 className="mt-2 truncate text-xl font-semibold text-[var(--color-ink)]">{filename}</h1>
                <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">{message}</p>
              </div>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
              <motion.div
                className="h-full rounded-full bg-[var(--color-accent)]"
                animate={{ x: ["-35%", "135%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: "44%" }}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.42 }}
                  animate={{ opacity: [0.42, 1, 0.42] }}
                  transition={{ delay: index * 0.16, duration: 1.35, repeat: Infinity }}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-ink-muted)]"
                >
                  {step}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
