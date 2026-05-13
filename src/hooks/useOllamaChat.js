import { useState, useCallback, useRef } from 'react'
import { streamChat } from '@/services/ollama'

/**
 * Custom hook for managing an AI chat session backed by Ollama.
 *
 * @param {string} systemPrompt  - injected as the first user message context
 * @returns {{ messages, isLoading, error, send, clear, abort }}
 */
export function useOllamaChat(systemPrompt) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const send = useCallback(async (userText) => {
    if (!userText.trim() || isLoading) return
    setError(null)

    const userMsg = { role: 'user', content: userText }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    // Placeholder for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }])

    const controller = new AbortController()
    abortRef.current = controller

    // Build message list, injecting system context into first message
    const history = [...messages, userMsg]
    const apiMessages = history.map((m, i) => {
      if (i === 0 && systemPrompt) {
        return { role: 'user', content: `[Context for this session — not the user's question]\n${systemPrompt}\n\n[User's first message]\n${m.content}` }
      }
      return { role: m.role, content: m.content }
    })

    try {
      await streamChat({
        messages: apiMessages,
        signal: controller.signal,
        onChunk: (partial) => {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'assistant', content: partial, streaming: true }
            return updated
          })
        },
      })
      // Mark streaming done
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { ...updated[updated.length - 1], streaming: false }
        return updated
      })
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: '_(generation stopped)_', streaming: false }
          return updated
        })
      } else {
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: `⚠️ ${err.message}`, streaming: false }
          return updated
        })
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [messages, isLoading, systemPrompt])

  const abort = useCallback(() => { abortRef.current?.abort() }, [])

  const clear = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    setIsLoading(false)
  }, [])

  return { messages, isLoading, error, send, clear, abort }
}
