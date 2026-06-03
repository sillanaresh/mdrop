import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  applicationName: "MDrop",
  metadataBase: new URL("https://mdrop-conv.vercel.app"),
  title: "MDrop - Convert files and URLs to Markdown",
  description:
    "Drop PDFs, Word docs, slides, sheets, images, web pages, and YouTube links into MDrop to get clean Markdown. Free, fast, no account required.",
  icons: {
    icon: [
      { url: "/brand/mdrop-icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/brand/mdrop-icon.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "MDrop - Convert files and URLs to Markdown",
    description:
      "Drop PDFs, Word docs, slides, sheets, images, web pages, and YouTube links into MDrop to get clean Markdown.",
    images: [
      {
        url: "/brand/mdrop-wordmark.svg",
        width: 512,
        height: 192,
        alt: "MDrop brand mark",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "MDrop - Convert files and URLs to Markdown",
    description: "Turn source files and URLs into clean Markdown without an account.",
    images: ["/brand/mdrop-icon-512.png"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
