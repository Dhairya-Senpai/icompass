import { useState, useEffect, useRef } from 'react'
import { useOllamaChat } from '@/hooks/useOllamaChat'
import { useOllamaHealth } from '@/hooks/useOllamaHealth'
import { OLLAMA_CONFIG } from '@/config/env'
import { Button, Spinner } from '@/components/ui'
import { cn } from '@/utils/cn'

function OllamaStatus() {
  const { online, models, checking } = useOllamaHealth()
  if (checking) return <span className="text-xs text-gray-400 flex items-center gap-1.5"><Spinner className="text-xs" /> Checking Ollama…</span>
  if (!online) return (
    <span className="text-xs text-red-500 flex items-center gap-1.5">
      <i className="ti ti-wifi-off" aria-hidden="true" />
      Ollama offline — run: <code className="bg-red-50 px-1 rounded">OLLAMA_ORIGINS="*" ollama serve</code>
    </span>
  )
  return (
    <span className="text-xs text-teal-600 flex items-center gap-1.5">
      <i className="ti ti-circle-check" aria-hidden="true" />
      {OLLAMA_CONFIG.model}
      {models.length > 0 && <span className="text-gray-400">({models.length} models available)</span>}
    </span>
  )
}

export function AIChatPage({ title, subtitle, systemPrompt }) {
  const { messages, isLoading, send, clear, abort } = useOllamaChat(systemPrompt)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    send(input.trim())
    setInput('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-112px)]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <OllamaStatus />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white border border-gray-100 rounded-xl rounded-b-none p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2">
            <i className="ti ti-brand-openai text-3xl text-gray-200" aria-hidden="true" />
            <p className="text-sm text-gray-400">Powered by local Ollama · {OLLAMA_CONFIG.model}</p>
            <p className="text-xs text-gray-300">Start typing below to begin the conversation</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              'max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
              m.role === 'user'
                ? 'bg-blue-600 text-white self-end ml-auto rounded-br-sm'
                : 'bg-gray-100 text-gray-800 self-start rounded-bl-sm',
            )}
          >
            {m.content === '' && m.streaming
              ? <span className="flex gap-1 py-0.5">{[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}</span>
              : m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 bg-white border border-gray-100 border-t-0 rounded-b-xl">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message… (Enter to send)"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:bg-white transition"
        />
        {isLoading
          ? <Button size="sm" variant="secondary" onClick={abort}><i className="ti ti-player-stop" aria-hidden="true" /> Stop</Button>
          : <Button size="sm" variant="primary" onClick={handleSend} disabled={!input.trim()}><i className="ti ti-send" aria-hidden="true" /></Button>
        }
        <Button size="sm" variant="ghost" onClick={clear} aria-label="Clear chat">
          <i className="ti ti-trash" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
