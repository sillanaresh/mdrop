const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export interface ConvertResult {
  markdown: string
  title: string | null
  filename: string
  format: string
  char_count: number
  word_count: number
  processing_time_ms: number
}

export interface ApiError {
  error: string
  message: string
  max_bytes?: number
  retry_after?: number
}

export class ConvertError extends Error {
  code: string
  maxBytes?: number
  retryAfter?: number

  constructor(detail: ApiError) {
    super(detail.message)
    this.code = detail.error
    this.maxBytes = detail.max_bytes
    this.retryAfter = detail.retry_after
  }
}

export async function convertFile(file: File): Promise<ConvertResult> {
  const form = new FormData()
  form.append("file", file)
  return _post(form)
}

export async function convertUrl(url: string): Promise<ConvertResult> {
  const form = new FormData()
  form.append("url", url)
  return _post(form)
}

async function _post(form: FormData): Promise<ConvertResult> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 90000)

  let res: Response
  try {
    res = await fetch(`${API_URL}/convert`, {
      method: "POST",
      body: form,
      signal: controller.signal,
    })
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "Conversion timed out. Try a smaller file or a simpler URL."
        : "Connection failed. Check your internet and try again."
    throw new ConvertError({ error: "network_error", message })
  } finally {
    window.clearTimeout(timeout)
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({
      error: "network_error",
      message: "Could not reach the server. Please try again.",
    }))
    throw new ConvertError(body.detail ?? body)
  }

  return res.json()
}

export async function warmup(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(7000) })
    return res.ok
  } catch {
    return false
  }
}
