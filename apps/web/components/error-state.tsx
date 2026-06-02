"use client"

import { motion } from "framer-motion"

const HINTS: Record<string, { title: string; hint: string }> = {
  unsupported_format: {
    title: "That format is not supported yet",
    hint: "Use PDF, DOCX, PPTX, XLSX, CSV, PNG/JPG/WebP, or paste a public URL.",
  },
  file_too_large: {
    title: "The file is over the limit",
    hint: "Compress it, split it, or export the pages you need. The current limit is 10 MB.",
  },
  empty_file: {
    title: "The file is empty",
    hint: "Choose a file with readable content, then try again.",
  },
  conversion_failed: {
    title: "Conversion could not finish",
    hint: "The source may be corrupted, password-protected, private, or not readable by the converter.",
  },
  invalid_url: {
    title: "The URL is not valid",
    hint: "Use a public URL that starts with http:// or https://.",
  },
  network_error: {
    title: "The converter could not be reached",
    hint: "Check your connection. If the backend is on a free host, it may need a few seconds to wake up.",
  },
  missing_input: {
    title: "Nothing was sent",
    hint: "Choose one file or paste one URL before converting.",
  },
  ambiguous_input: {
    title: "Choose one source",
    hint: "MDrop converts one file or one URL at a time so the output stays easy to verify.",
  },
  internal_error: {
    title: "Something broke on our side",
    hint: "Try again with a smaller or simpler source. If it keeps happening, the backend logs need attention.",
  },
  client_error: {
    title: "This source needs another try",
    hint: "Try a different file, paste a URL, or re-export the document.",
  },
}

interface ErrorStateProps {
  message: string
  code: string
  onReset: () => void
}

export function ErrorState({ message, code, onReset }: ErrorStateProps) {
  const details = HINTS[code] ?? HINTS.client_error

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg"
    >
      <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[rgb(255_253_248_/_0.86)] p-4 shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="rounded-[1.35rem] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 text-center md:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-warn-soft)] text-[var(--color-warn)]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-warn)]">Conversion stopped</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">{details.title}</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-ink-muted)]">{message}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">{details.hint}</p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={onReset}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Try another source
            </button>
            <a
              href="https://github.com/sillanaresh/mdrop/issues"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-border-strong)]"
            >
              Report issue
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
