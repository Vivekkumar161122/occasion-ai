import React, { useState } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import { queryGeminiAI } from '../services/aiPlanner'
import { sanitizeInput } from '../services/sanitizer'
import { AISettings, OccasionEvent } from '../types'

interface AIChatPanelProps {
  event: OccasionEvent
  aiSettings: AISettings
}

interface ChatMessage {
  role: 'user' | 'ai'
  text: string
}

const PROMPT_SUGGESTIONS = [
  { label: '🍷 Signature Cocktails', prompt: 'Recommend 3 thematic signature cocktails matching our vibe with recipe names.' },
  { label: '💰 Trim 15% Budget', prompt: 'Where can we safely cut 15% from our current estimated budget without sacrificing guest experience?' },
  { label: '📸 Photo Timeline', prompt: 'How should I structure the day-of photography timeline for portraits and golden hour?' },
  { label: '🏰 Venue Questions', prompt: 'What are critical questions to ask before booking our venue contract?' },
]

/**
 * Interactive multi-turn chat panel powered by Google Gemini API / Local Smart Engine.
 */
export const AIChatPanel: React.FC<AIChatPanelProps> = ({ event, aiSettings }) => {
  const [customPrompt, setCustomPrompt] = useState('')
  const [chatLog, setChatLog] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customPrompt.trim() || isLoading) return

    const userText = sanitizeInput(customPrompt, 500)
    setCustomPrompt('')
    setChatLog((prev) => [...prev, { role: 'user', text: userText }])
    setIsLoading(true)

    try {
      const response = await queryGeminiAI(event, aiSettings, userText)
      setChatLog((prev) => [...prev, { role: 'ai', text: response }])
    } catch {
      setChatLog((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'OccasionAI encountered a temporary connectivity issue. Please verify your network connection or API key settings.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minHeight: '480px',
      }}
    >
      <div>
        <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={22} color="var(--primary-500)" aria-hidden="true" />
          <span>OccasionAI Event Strategist</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Ask real-time advice for seating charts, negotiations, vendor questions, or day-of run-of-show.
        </p>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          minHeight: '260px',
          maxHeight: '400px',
          overflowY: 'auto',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          border: '1px solid var(--border-subtle)',
        }}
        tabIndex={0}
        aria-label="Chat messages history"
      >
        {chatLog.length === 0 ? (
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              color: 'var(--text-muted)',
              maxWidth: '400px',
            }}
          >
            <Sparkles size={32} color="var(--primary-500)" style={{ margin: '0 auto 12px' }} aria-hidden="true" />
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Ask anything about your {event.type}
            </p>
            <p style={{ fontSize: '0.84rem' }}>
              Try one of the curated instant prompts below:
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                justifyContent: 'center',
                marginTop: '16px',
              }}
            >
              {PROMPT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomPrompt(item.prompt)}
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatLog.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}
              >
                {msg.role === 'user' ? 'You' : 'OccasionAI'}
              </div>
              <div
                style={{
                  background: msg.role === 'user' ? 'var(--primary-600)' : 'var(--bg-card)',
                  color: '#ffffff',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border-medium)',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            <Sparkles size={16} className="pulse-glow" color="var(--primary-500)" />
            <span>OccasionAI is synthesizing recommendations...</span>
          </div>
        )}
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Ask anything (e.g. 'Give me budget tips for 100 guests' or 'Music playlist genres')..."
          className="form-control"
          style={{ flex: 1 }}
          aria-label="Ask OccasionAI message prompt"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '10px 20px' }}
          disabled={isLoading || !customPrompt.trim()}
          aria-label="Send query"
        >
          <Send size={16} aria-hidden="true" />
          <span>Send</span>
        </button>
      </form>
    </div>
  )
}
