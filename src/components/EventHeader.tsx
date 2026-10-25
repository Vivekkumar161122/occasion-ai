import React, { useMemo, useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { formatCurrency } from '../services/budgetCalculator'
import { BudgetItem, OccasionEvent, TimelineItem, VendorItem } from '../types'

interface EventHeaderProps {
  event: OccasionEvent
  budgetItems: BudgetItem[]
  timelineItems: TimelineItem[]
  vendors: VendorItem[]
  onEditEvent: () => void
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  budgetItems,
  timelineItems,
  vendors,
  onEditEvent,
}) => {
  // Compute countdown
  const [currentTimestamp] = useState(() => Date.now())
  const diffDays = useMemo(() => {
    const targetDate = new Date(event.date + 'T00:00:00')
    const diffTime = targetDate.getTime() - currentTimestamp
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }, [event.date, currentTimestamp])

  // Budget calculations
  const totalActual = budgetItems.reduce((acc, b) => acc + (b.actualCost || 0), 0)
  const totalEstimated = budgetItems.reduce((acc, b) => acc + (b.estimatedCost || 0), 0)
  const effectiveSpent = totalActual > 0 ? totalActual : totalEstimated
  const budgetPct = event.targetBudget > 0 ? Math.round((effectiveSpent / event.targetBudget) * 100) : 0
  const remainingBudget = event.targetBudget - effectiveSpent

  // Timeline progress
  const totalMilestones = timelineItems.length
  const completedMilestones = timelineItems.filter((t) => t.completed).length
  const timelinePct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  // Vendor stats
  const totalVendors = vendors.length
  const confirmedVendors = vendors.filter((v) => ['booked', 'deposit_paid', 'completed'].includes(v.status)).length
  const vendorPct = totalVendors > 0 ? Math.round((confirmedVendors / totalVendors) * 100) : 0

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'wedding':
        return 'badge-wedding'
      case 'birthday':
        return 'badge-birthday'
      case 'community':
        return 'badge-community'
      default:
        return 'badge-custom'
    }
  }

  return (
    <section aria-labelledby="event-title" className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        {/* Main Details */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span className={`badge ${getBadgeClass(event.type)}`}>
              {event.type}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <Calendar size={15} color="var(--primary-500)" aria-hidden="true" />
              <span>
                {new Date(event.date + 'T00:00:00').toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <MapPin size={15} color="#ec4899" aria-hidden="true" />
              <span>{event.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <Users size={15} color="#06b6d4" aria-hidden="true" />
              <span>{event.guestCount} Guests</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 id="event-title" style={{ fontSize: '1.9rem', lineHeight: 1.2 }}>
              {event.title}
            </h1>
            <button
              onClick={onEditEvent}
              className="btn-ghost"
              style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)' }}
              title="Edit event details"
              aria-label="Edit event details"
            >
              <Edit3 size={18} aria-hidden="true" />
            </button>
          </div>

          {event.vibe && (
            <p style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#fbbf24" style={{ flexShrink: 0 }} aria-hidden="true" />
              <span>{event.vibe}</span>
            </p>
          )}
        </div>

        {/* Countdown Pill Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          textAlign: 'center',
          minWidth: '180px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Clock size={14} aria-hidden="true" />
            <span>Event Countdown</span>
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            marginTop: '4px',
            color: diffDays < 0 ? 'var(--text-muted)' : diffDays <= 7 ? '#f43f5e' : 'var(--text-primary)',
          }}>
            {diffDays < 0 ? 'Event Concluded' : diffDays === 0 ? 'Today! 🎉' : `${diffDays} Days`}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {diffDays > 0 ? 'Until Celebration' : 'Memory Saved'}
          </p>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div style={{
        marginTop: '24px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        {/* Metric 1: Budget */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wallet size={16} color="#6366f1" aria-hidden="true" />
              Budget Health
            </span>
            <span style={{
              fontWeight: 700,
              fontSize: '0.85rem',
              color: budgetPct > 100 ? 'var(--status-danger)' : budgetPct >= 85 ? 'var(--status-warning)' : 'var(--status-safe)',
            }}>
              {budgetPct}%
            </span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(100, budgetPct)}%`,
                backgroundColor: budgetPct > 100 ? 'var(--status-danger)' : budgetPct >= 85 ? 'var(--status-warning)' : '#6366f1',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Spent: {formatCurrency(effectiveSpent, event.currency)}</span>
            <span>Target: {formatCurrency(event.targetBudget, event.currency)}</span>
          </div>
          <div style={{ fontSize: '0.78rem', marginTop: '2px', color: remainingBudget >= 0 ? 'var(--status-safe)' : 'var(--status-danger)' }}>
            {remainingBudget >= 0
              ? `${formatCurrency(remainingBudget, event.currency)} remaining`
              : `${formatCurrency(Math.abs(remainingBudget), event.currency)} OVER budget`}
          </div>
        </div>

        {/* Metric 2: Timeline */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" aria-hidden="true" />
              Milestones Done
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#10b981' }}>
              {timelinePct}%
            </span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(100, timelinePct)}%`,
                backgroundColor: '#10b981',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>{completedMilestones} completed</span>
            <span>{totalMilestones - completedMilestones} tasks remaining</span>
          </div>
        </div>

        {/* Metric 3: Vendors */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} color="#06b6d4" aria-hidden="true" />
              Vendors Booked
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#06b6d4' }}>
              {confirmedVendors} of {totalVendors}
            </span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(100, vendorPct)}%`,
                backgroundColor: '#06b6d4',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>{confirmedVendors} secured</span>
            <span>{totalVendors - confirmedVendors} in progress</span>
          </div>
        </div>
      </div>
    </section>
  )
}
