import { OLLAMA_CONFIG } from '@/config/env'

/**
 * Ollama API service.
 * All AI calls go through this module — never call fetch() directly in components.
 */

export class OllamaError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'OllamaError'
    this.status = status
  }
}

/**
 * Health check — resolves true if Ollama is reachable, false otherwise.
 */
export async function checkOllamaHealth(baseUrl = OLLAMA_CONFIG.baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * List locally available models.
 * @returns {Promise<string[]>} array of model names
 */
export async function listModels(baseUrl = OLLAMA_CONFIG.baseUrl) {
  const res = await fetch(`${baseUrl}/api/tags`, {
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new OllamaError('Failed to list models', res.status)
  const data = await res.json()
  return (data.models || []).map(m => m.name)
}

/**
 * Streaming chat completion.
 *
 * @param {object} params
 * @param {Array<{role: string, content: string}>} params.messages
 * @param {string}   [params.model]        - override default model
 * @param {string}   [params.baseUrl]      - override default base URL
 * @param {Function} [params.onChunk]      - called with the full accumulated text on each token
 * @param {AbortSignal} [params.signal]    - external abort signal
 * @returns {Promise<string>}              - full response text
 */
export async function streamChat({ messages, model, baseUrl, onChunk, signal }) {
  const url = `${baseUrl ?? OLLAMA_CONFIG.baseUrl}/api/chat`
  const modelName = model ?? OLLAMA_CONFIG.model

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_CONFIG.timeout)
  const combinedSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal

  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: modelName, messages, stream: true }),
      signal: combinedSignal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') throw err
    throw new OllamaError(
      `Cannot reach Ollama at ${url}. Make sure it is running with:\n  OLLAMA_ORIGINS="*" ollama serve`,
      0
    )
  }

  clearTimeout(timeoutId)

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new OllamaError(
      `Ollama returned ${response.status}: ${body || response.statusText}`,
      response.status
    )
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let accumulated = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = decoder.decode(value, { stream: true }).split('\n').filter(Boolean)
      for (const line of lines) {
        try {
          const json = JSON.parse(line)
          const token = json.message?.content ?? ''
          if (token) {
            accumulated += token
            onChunk?.(accumulated)
          }
        } catch {
          // malformed JSON line — skip
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  return accumulated
}
