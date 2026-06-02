import { FORMAT_CONFIG } from "./format-config"

export function detectFileFormat(file: File): string | null {
  const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "")

  for (const [formatId, config] of Object.entries(FORMAT_CONFIG)) {
    if (config.extensions.includes(ext)) return formatId
  }

  return null
}

export function detectUrlFormat(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return "url"
  }

  const host = parsed.hostname.toLowerCase()
  if (host === "youtu.be" || host.endsWith(".youtube.com") || host === "youtube.com") return "youtube"
  if (host === "wikipedia.org" || host.endsWith(".wikipedia.org")) return "wikipedia"
  return "url"
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}
