import React, { useEffect, useState } from 'react'
import { Calendar, DollarSign, MapPin, Sparkles, Users } from 'lucide-react'
import { sanitizeDate, sanitizeInput, sanitizeNumber } from '../services/sanitizer'
import { CURRENCIES, CurrencyCode, EventType, OccasionEvent } from '../types'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (eventData: Omit<OccasionEvent, 'id' | 'createdAt' | 'updatedAt'>, templateChoice?: EventType) => void
  initialEvent?: OccasionEvent | null
}

const EventDialogContent: React.FC<Omit<EventModalProps, 'isOpen'>> = ({
  onClose,
  onSave,
  initialEvent,
}) => {
  const isEditing = Boolean(initialEvent)

  const [title, setTitle] = useState(initialEvent?.title || '')
  const [type, setType] = useState<EventType>(initialEvent?.type || 'wedding')
  const [date, setDate] = useState(() =>
    initialEvent?.date || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )
  const [location, setLocation] = useState(initialEvent?.location || '')
  const [guestCount, setGuestCount] = useState(initialEvent ? String(initialEvent.guestCount) : '100')
  const [targetBudget, setTargetBudget] = useState(initialEvent ? String(initialEvent.targetBudget) : '20000')
  const [currency, setCurrency] = useState<CurrencyCode>(initialEvent?.currency || 'USD')
  const [vibe, setVibe] = useState(initialEvent?.vibe || (initialEvent ? '' : 'Warm, memorable, and celebratory'))
  const [notes, setNotes] = useState(initialEvent?.notes || '')

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

  const handleApplyPreset = (presetType: EventType) => {
    setType(presetType)
    if (presetType === 'wedding') {
      setTitle('Enchanted Garden Wedding Celebration')
      setGuestCount('120')
      setTargetBudget('30000')
      setLocation('Botanical Glasshouse & Pavilion')
      setVibe('Lush greenery, candlelit intimacy, and timeless romantic melodies')
    } else if (presetType === 'birthday') {
      setTitle('Golden Milestone Birthday Party')
      setGuestCount('60')
      setTargetBudget('5000')
      setLocation('Rooftop Lounge & Terrace')
      setVibe('Glamorous cocktail social with dynamic DJ beats and champagne toasts')
    } else if (presetType === 'community') {
      setTitle('Neighborhood Unity Arts & Culture Festival')
      setGuestCount('300')
      setTargetBudget('10000')
      setLocation('Civic Park & Community Esplanade')
      setVibe('Family-friendly artisan market, food trucks, and live local musicians')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave(
      {
        title: sanitizeInput(title, 120),
        type,
        date: sanitizeDate(date),
        location: sanitizeInput(location, 160) || 'TBD',
        guestCount: sanitizeNumber(guestCount, 50, 1, 100000),
        targetBudget: sanitizeNumber(targetBudget, 5000, 0, 100000000),
        currency,
        vibe: sanitizeInput(vibe, 300),
        notes: sanitizeInput(notes, 1000),
      },
      !isEditing ? type : undefined
    )
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
      <div className="modal-dialog large">
        <div className="modal-header">
          <div>
            <h3 id="event-modal-title" style={{ fontSize: '1.3rem' }}>
              {isEditing ? 'Edit Event Details' : 'Create a New Celebration'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {isEditing ? 'Update date, budget, guest count or atmosphere' : 'Choose a preset template or create a custom event'}
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Template Presets for New Event */}
            {!isEditing && (
              <div style={{ marginBottom: '20px' }}>
                <span className="form-label" style={{ display: 'block', marginBottom: '8px' }}>
                  Quick Start Presets
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('wedding')}
                    className={`btn-secondary ${type === 'wedding' ? 'active' : ''}`}
                    style={{
                      padding: '10px',
                      justifyContent: 'flex-start',
                      borderColor: type === 'wedding' ? '#ec4899' : undefined,
                    }}
                  >
                    💍 Dream Wedding
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('birthday')}
                    className={`btn-secondary ${type === 'birthday' ? 'active' : ''}`}
                    style={{
                      padding: '10px',
                      justifyContent: 'flex-start',
                      borderColor: type === 'birthday' ? '#fbbf24' : undefined,
                    }}
                  >
                    🎂 Milestone Birthday
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('community')}
                    className={`btn-secondary ${type === 'community' ? 'active' : ''}`}
                    style={{
                      padding: '10px',
                      justifyContent: 'flex-start',
                      borderColor: type === 'community' ? '#10b981' : undefined,
                    }}
                  >
                    🎪 Community Festival
                  </button>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="event-form-title">Event Title *</label>
              <input
                id="event-form-title"
                type="text"
                required
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Maya & Leo's Vineyard Wedding"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="event-form-type">Event Category</label>
                <select
                  id="event-form-type"
                  className="form-control"
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
                >
                  <option value="wedding" style={{ background: '#1e293b' }}>Wedding</option>
                  <option value="birthday" style={{ background: '#1e293b' }}>Birthday Party</option>
                  <option value="community" style={{ background: '#1e293b' }}>Community Event</option>
                  <option value="custom" style={{ background: '#1e293b' }}>Custom Gathering</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event-form-date">Event Date *</label>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <input
                    id="event-form-date"
                    type="date"
                    required
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <Calendar size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} aria-hidden="true" />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="event-form-location">Location / Venue</label>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <input
                    id="event-form-location"
                    type="text"
                    className="form-control"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kew Gardens, London"
                  />
                  <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} aria-hidden="true" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event-form-guests">Expected Guests</label>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <input
                    id="event-form-guests"
                    type="number"
                    min="1"
                    className="form-control"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                  />
                  <Users size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} aria-hidden="true" />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="event-form-budget">Target Budget</label>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <input
                    id="event-form-budget"
                    type="number"
                    min="0"
                    step="any"
                    className="form-control"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(e.target.value)}
                  />
                  <DollarSign size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} aria-hidden="true" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event-form-currency">Currency</label>
                <select
                  id="event-form-currency"
                  className="form-control"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code} style={{ background: '#1e293b' }}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="event-form-vibe">
                Vibe, Theme & Aesthetic Vision
              </label>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <input
                  id="event-form-vibe"
                  type="text"
                  className="form-control"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  placeholder="e.g. Boho rustic romance, Studio 54 metallic disco, Zero-waste eco fair"
                />
                <Sparkles size={16} color="#fbbf24" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} aria-hidden="true" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="event-form-notes">General Event Notes</label>
              <textarea
                id="event-form-notes"
                className="form-control"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Rain contingencies, special VIP requirements, venue access times..."
              />
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
              {isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const EventModal: React.FC<EventModalProps> = (props) => {
  if (!props.isOpen) return null
  return <EventDialogContent {...props} />
}

