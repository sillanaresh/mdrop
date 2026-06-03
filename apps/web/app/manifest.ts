import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MDrop",
    short_name: "MDrop",
    description: "Convert files and URLs into clean Markdown.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F1E8",
    theme_color: "#245C52",
    icons: [
      {
        src: "/brand/mdrop-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/brand/mdrop-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/mdrop-icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  }
}
