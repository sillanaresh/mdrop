"use client"

import { ALL_FORMATS, FORMAT_CONFIG } from "@/lib/format-config"

export function FormatBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_FORMATS.map((format) => {
        const config = FORMAT_CONFIG[format]
        return (
          <span
            key={format}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)] shadow-[var(--shadow-tight)]"
            title={config.description}
          >
            {config.label}
          </span>
        )
      })}
    </div>
  )
}
