import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Allow loading from the Render backend domain for images if needed
  images: {
    remotePatterns: [],
  },
}

export default nextConfig
