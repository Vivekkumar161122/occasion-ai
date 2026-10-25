import React, { useEffect, useState } from 'react'
import {
  Download,
  Key,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { sanitizeInput } from '../services/sanitizer'
import { AISettings } from '../types'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: AISettings
  onSaveSettings: (settings: AISettings) => void
  onExportData: () => void
  onResetData: () => void
}

const SettingsDialogContent: React.FC<Omit<SettingsModalProps, 'isOpen'>> = ({
  onClose,
  settings,
  onSaveSettings,
  onExportData,
  onResetData,
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey || '')
  const [useCustomKey, setUseCustomKey] = useState(settings.useCustomKey || false)
  const [model, setModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro'>(settings.model || 'gemini-2.5-flash')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveSettings({
      apiKey: sanitizeInput(apiKey, 128),
      useCustomKey,
      model,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
      <div className="modal-dialog">
        <div className="modal-header">
          <div>
            <h3 id="settings-modal-title" style={{ fontSize: '1.25rem' }}>OccasionAI Settings & AI Config</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Configure GenAI engine, credentials, and data backups
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ fontSize: '1.2rem', padding: '4px 8px' }}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            {/* Security Notice */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <ShieldCheck size={20} color="var(--status-safe)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--text-primary)' }}>100% Client-Side Privacy:</strong> Your data and API keys stay exclusively on your browser&apos;s local machine. No tracking, zero third-party telemetry, and 100% platform-independent zero dependency deployment.
              </div>
            </div>

            {/* AI Mode Options */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--primary-500)" aria-hidden="true" />
                <span>GenAI Planning Engine</span>
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <input
                    type="radio"
                    name="ai-mode"
                    checked={!useCustomKey}
                    onChange={() => setUseCustomKey(false)}
                    style={{ marginTop: '3px', accentColor: 'var(--primary-600)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Built-in Creative AI Engine (Offline & Fast)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Zero configuration, works anywhere without any API keys. Rich curated blueprints for weddings, birthdays, and community festivals.
                    </div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <input
                    type="radio"
                    name="ai-mode"
                    checked={useCustomKey}
                    onChange={() => setUseCustomKey(true)}
                    style={{ marginTop: '3px', accentColor: 'var(--primary-600)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Live Google Gemini API (BYO Key)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Connect directly to Gemini 2.5 Flash for unbounded custom reasoning, streaming responses, and niche advice.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Gemini API Key input if BYO key selected */}
            {useCustomKey && (
              <div className="form-group" style={{ marginTop: '14px', animation: 'fadeIn 0.2s' }}>
                <label className="form-label" htmlFor="api-key-input" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={14} color="var(--primary-500)" aria-hidden="true" />
                  <span>Google Gemini API Key</span>
                </label>
                <input
                  id="api-key-input"
                  type="password"
                  className="form-control"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Keys are saved solely in your browser&apos;s localStorage and sent only to official Google APIs.
                </p>

                <div style={{ marginTop: '12px' }}>
                  <label className="form-label" htmlFor="gemini-model-select">Model Version</label>
                  <select
                    id="gemini-model-select"
                    className="form-control"
                    value={model}
                    onChange={(e) => setModel(e.target.value as any)}
                  >
                    <option value="gemini-2.5-flash" style={{ background: '#1e293b' }}>
                      Gemini 2.5 Flash (Ultra-fast, Recommended)
                    </option>
                    <option value="gemini-2.5-pro" style={{ background: '#1e293b' }}>
                      Gemini 2.5 Pro (Deep Reasoning)
                    </option>
                  </select>
                </div>
              </div>
            )}

            {/* Data Management Section */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
              <span className="form-label" style={{ display: 'block', marginBottom: '10px' }}>
                Data Storage & Backups
              </span>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={onExportData}
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  <Download size={15} aria-hidden="true" />
                  <span>Download Backup JSON</span>
                </button>

                {!showResetConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="btn-ghost"
                    style={{ fontSize: '0.85rem', color: 'var(--status-danger)' }}
                  >
                    <RotateCcw size={15} aria-hidden="true" />
                    <span>Reset to Demo Data</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--status-danger)' }}>Are you sure?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onResetData()
                        setShowResetConfirm(false)
                        onClose()
                      }}
                      className="btn-primary"
                      style={{ background: 'var(--status-danger)', fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      Yes, Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="btn-ghost"
                      style={{ fontSize: '0.78rem', padding: '6px' }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  if (!props.isOpen) return null
  return <SettingsDialogContent {...props} />
}

