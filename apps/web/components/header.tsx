"use client"

interface HeaderProps {
  apiReady?: boolean
  apiChecking?: boolean
}

export function Header({ apiReady, apiChecking }: HeaderProps) {
  const statusLabel = apiChecking
    ? "Warming converter"
    : apiReady
      ? "Converter online"
      : "Converter may be sleeping"

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[rgb(255_253_248_/_0.86)] px-4 backdrop-blur md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] shadow-[var(--shadow-tight)]">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M9 1.75 15.75 5.8v6.4L9 16.25 2.25 12.2V5.8L9 1.75Z"
              stroke="white"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M9 1.75v14.5M2.25 5.8 9 9.85l6.75-4.05"
              stroke="white"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-[var(--color-ink)]">MDrop</p>
          <p className="hidden truncate text-xs text-[var(--color-ink-muted)] sm:block">
            Convert files and URLs into clean Markdown
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-muted)]">
        <span
          className={`h-2 w-2 rounded-full ${
            apiChecking ? "bg-amber-500" : apiReady ? "bg-[var(--color-success)]" : "bg-[var(--color-ink-subtle)]"
          }`}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">{statusLabel}</span>
        <span className="sm:hidden">{apiReady ? "Online" : apiChecking ? "Warming" : "Sleep"}</span>
      </div>
    </header>
  )
}
