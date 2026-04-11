"use client"

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 h-14 bg-white border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1L14 5v5l-6.5 4L1 10V5L7.5 1z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            <path d="M7.5 1v13M1 5l6.5 4 6.5-4" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-semibold text-gray-900 tracking-tight">MDrop</span>
      </div>
      <span className="text-sm text-gray-400 hidden sm:block">
        Drop any file → get Markdown
      </span>
    </header>
  )
}
