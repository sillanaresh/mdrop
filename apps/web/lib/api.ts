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
  constructor(detail: ApiError) {
    super(detail.message)
    this.code = detail.error
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
  const res = await fetch(`${API_URL}/convert`, {
    method: "POST",
    body: form,
  })

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
    const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) })
    return res.ok
  } catch {
    return false
  }
}
