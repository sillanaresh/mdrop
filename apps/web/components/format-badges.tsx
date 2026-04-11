"use client"

const FORMATS = [
  "PDF", "Word", "PowerPoint", "Excel", "CSV", "Images", "Web pages", "YouTube"
]

export function FormatBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {FORMATS.map((f) => (
        <span
          key={f}
          className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600 shadow-sm"
        >
          {f}
        </span>
      ))}
    </div>
  )
}
