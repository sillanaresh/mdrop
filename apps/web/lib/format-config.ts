export interface FormatConfig {
  label: string
  color: string
  bgColor: string
  extensions: string[]
  mimeTypes: string[]
  convertingMessage: string
  description: string
}

export const FORMAT_CONFIG: Record<string, FormatConfig> = {
  pdf: {
    label: "PDF",
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20",
    extensions: [".pdf"],
    mimeTypes: ["application/pdf"],
    convertingMessage: "Extracting text and structure from your PDF...",
    description: "Text, headings, tables",
  },
  docx: {
    label: "Word",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    extensions: [".docx"],
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    convertingMessage: "Parsing your Word document...",
    description: "Headings, lists, formatting",
  },
  pptx: {
    label: "PowerPoint",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10 border-orange-500/20",
    extensions: [".pptx"],
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    convertingMessage: "Extracting slides and speaker notes...",
    description: "Slides, notes, structure",
  },
  xlsx: {
    label: "Excel",
    color: "text-green-400",
    bgColor: "bg-green-500/10 border-green-500/20",
    extensions: [".xlsx"],
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    convertingMessage: "Converting spreadsheet to Markdown tables...",
    description: "Spreadsheets, tables",
  },
  csv: {
    label: "CSV",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
    extensions: [".csv"],
    mimeTypes: ["text/csv", "text/plain"],
    convertingMessage: "Converting CSV to a Markdown table...",
    description: "Structured data",
  },
  image: {
    label: "Image",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
    extensions: [".png", ".jpg", ".jpeg", ".webp"],
    mimeTypes: ["image/png", "image/jpeg", "image/webp"],
    convertingMessage: "Analyzing image and extracting metadata...",
    description: "EXIF metadata, image info",
  },
  url: {
    label: "Web / YouTube",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10 border-cyan-500/20",
    extensions: [],
    mimeTypes: [],
    convertingMessage: "Fetching and converting content...",
    description: "Web pages, YouTube transcripts",
  },
  youtube: {
    label: "YouTube",
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20",
    extensions: [],
    mimeTypes: [],
    convertingMessage: "Fetching YouTube transcript...",
    description: "Video transcript",
  },
  wikipedia: {
    label: "Wikipedia",
    color: "text-zinc-400",
    bgColor: "bg-zinc-500/10 border-zinc-500/20",
    extensions: [],
    mimeTypes: [],
    convertingMessage: "Fetching Wikipedia article...",
    description: "Article content",
  },
}

export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "text/csv": [".csv"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export const ALL_FORMATS = [
  "pdf", "docx", "pptx", "xlsx", "csv", "image", "url",
] as const
