"use client"

import Editor from "@monaco-editor/react"

interface MarkdownEditorProps {
  content: string
}

export default function MarkdownEditor({ content }: MarkdownEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={content}
      theme="vs-dark"
      options={{
        readOnly: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 13,
        lineHeight: 22,
        fontFamily: "var(--font-geist-mono), 'JetBrains Mono', 'Fira Code', monospace",
        wordWrap: "on",
        lineNumbers: "off",
        folding: false,
        renderLineHighlight: "none",
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        padding: { top: 16, bottom: 16 },
      }}
    />
  )
}
