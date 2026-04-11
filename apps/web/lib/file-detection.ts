import { FORMAT_CONFIG } from "./format-config"

export function detectFileFormat(file: File): string | null {
  const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "")

  for (const [formatId, config] of Object.entries(FORMAT_CONFIG)) {
    if (config.extensions.includes(ext)) return formatId
  }

  return null
}

export function detectUrlFormat(url: string): string {
  const lower = url.toLowerCase()
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube"
  if (lower.includes("wikipedia.org")) return "wikipedia"
  return "url"
}

export function isValidUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://")
}
