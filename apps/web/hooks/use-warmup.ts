"use client"

import { useEffect, useState } from "react"
import { warmup } from "@/lib/api"

export function useWarmup() {
  const [isWarming, setIsWarming] = useState(true)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let mounted = true
    warmup().then((ok) => {
      if (!mounted) return
      setIsReady(ok)
      setIsWarming(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  return { isWarming, isReady }
}
