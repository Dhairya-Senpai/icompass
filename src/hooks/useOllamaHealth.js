import { useState, useEffect } from 'react'
import { checkOllamaHealth, listModels } from '@/services/ollama'
import { OLLAMA_CONFIG } from '@/config/env'

/**
 * Polls Ollama health on mount and when baseUrl changes.
 * Returns { online, models, checking }.
 */
export function useOllamaHealth() {
  const [online, setOnline] = useState(null)   // null = unknown, true/false
  const [models, setModels] = useState([])
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function check() {
      setChecking(true)
      const ok = await checkOllamaHealth(OLLAMA_CONFIG.baseUrl)
      if (cancelled) return
      setOnline(ok)
      if (ok) {
        try {
          const m = await listModels(OLLAMA_CONFIG.baseUrl)
          if (!cancelled) setModels(m)
        } catch {
          // non-fatal
        }
      }
      setChecking(false)
    }
    check()
    return () => { cancelled = true }
  }, [])

  return { online, models, checking }
}
