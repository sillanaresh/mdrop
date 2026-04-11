"use client"

import { useMutation } from "@tanstack/react-query"
import { convertFile, convertUrl, ConvertResult, ConvertError } from "@/lib/api"

interface UseConvertOptions {
  onSuccess: (result: ConvertResult) => void
  onError: (error: ConvertError) => void
}

export function useConvert({ onSuccess, onError }: UseConvertOptions) {
  return useMutation({
    mutationFn: async ({ file, url }: { file?: File; url?: string }) => {
      if (file) return convertFile(file)
      if (url) return convertUrl(url)
      throw new Error("Either file or url required")
    },
    onSuccess,
    onError: (err) => {
      onError(err instanceof ConvertError ? err : new ConvertError({
        error: "network_error",
        message: "Connection failed. Check your internet and try again.",
      }))
    },
  })
}
