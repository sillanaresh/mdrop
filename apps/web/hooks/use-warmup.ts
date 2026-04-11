"use client"

import { useEffect, useState } from "react"
import { warmup } from "@/lib/api"

export function useWarmup() {
  const [isWarming, setIsWarming] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsWarming(true)
    warmup().then((ok) => {
      setIsReady(ok)
      setIsWarming(false)
    })
  }, [])

  return { isWarming, isReady }
}
