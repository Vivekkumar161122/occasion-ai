import React, { useState } from 'react'
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Palette,
  Sparkles,
  Users,
} from 'lucide-react'
import { AIChatPanel } from './AIChatPanel'
import { generateLocalIdeas } from '../services/aiPlanner'
import { formatCurrency } from '../services/budgetCalculator'
import {
  AISettings,
  BudgetItem,
  GenAIRecommendation,
  OccasionEvent,
  TimelineItem,
  VendorItem,
} from '../types'

interface AIAssistantProps {
  event: OccasionEvent
  aiSettings: AISettings
  onApplyBudgetItems: (items: Omit<BudgetItem, 'id' | 'eventId'>[]) => void
  onApplyTimelineItems: (items: Omit<TimelineItem, 'id' | 'eventId'>[]) => void
  onApplyVendors: (items: Omit<VendorItem, 'id' | 'eventId'>[]) => void
}

type AIModuleTab = 'concept' | 'budget' | 'schedule' | 'vendors' | 'chat'

export const AIAssistant: React.FC<AIAssistantProps> = ({
  event,
  aiSettings,
  onApplyBudgetItems,
  onApplyTimelineItems,
  onApplyVendors,
}) => {
  const [activeTab, setActiveTab] = useState<AIModuleTab>('concept')
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null)

  // Generate current recommendation based on active event
  const currentRec: GenAIRecommendation = React.useMemo(() => {
    return generateLocalIdeas(event)
  }, [event])

  const handleApplyMilestones = () => {
    const newItems = currentRec.recommendedMilestones.map((m) => ({
      title: m.title,
      phase: m.phase,
      priority: m.priority,
      completed: false,
    }))
    onApplyTimelineItems(newItems)
    showNotice(`Applied ${newItems.length} AI milestones to your Timeline!`)
  }

  const handleApplyDayOfSchedule = () => {
    const newSchedule = currentRec.entertainmentSchedule.map((s) => ({
      title: s.activity,
      description: s.description,
      phase: 'day_of' as const,
      time: s.time,
      priority: 'high' as const,
      completed: false,
    }))
    onApplyTimelineItems(newSchedule)
    showNotice(`Applied ${newSchedule.length} hourly schedule slots to Day-of Run of Show!`)
  }

  const handleApplyVendors = () => {
    const newVendors = currentRec.recommendedVendors.map((v) => ({
      name: v.role,
      category: v.category,
      quotedAmount: v.estimate,
      status: 'researching' as const,
      notes: v.tips,
      deliverables: [],
    }))
    onApplyVendors(newVendors)
    showNotice(`Imported ${newVendors.length} recommended vendors to your Vendor Directory!`)
  }

  const handleApplyBudgetRecommendations = () => {
    const newBudget = currentRec.recommendedVendors.map((v) => ({
      name: v.role,
      category: v.category,
      estimatedCost: v.estimate,
      actualCost: 0,
      isPaid: false,
      notes: v.tips,
    }))
    onApplyBudgetItems(newBudget)
    showNotice(`Injected ${newBudget.length} strategic allocations into your Budget!`)
  }

  const showNotice = (msg: string) => {
    setAppliedNotice(msg)
    setTimeout(() => setAppliedNotice(null), 3500)
  }

  const hasApiKey = Boolean(
    (aiSettings.useCustomKey && aiSettings.apiKey.trim()) ||
    import.meta.env.VITE_GEMINI_API_KEY
  )

  return (
    <div className="ai-assistant-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* AI Header Card */}
      <section className="glass-card pulse-glow" style={{ padding: '24px' }} aria-labelledby="ai-hub-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}>
                <Sparkles size={20} aria-hidden="true" />
              </div>
              <h2 id="ai-hub-heading" style={{ fontSize: '1.4rem' }}>
                OccasionAI GenAI Studio
              </h2>
              <span className={`badge ${hasApiKey ? 'badge-community' : 'badge-custom'}`} style={{ textTransform: 'none' }}>
                {hasApiKey ? '⚡ Gemini API Active' : '✨ Built-in Creative Engine'}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Synthesizing tailored ideas, palettes, budget allocations, and day-of schedules for {event.title}
            </p>
          </div>
        </div>

        {/* 1-Click Applied Banner */}
        {appliedNotice && (
          <div style={{
            marginTop: '16px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            animation: 'fadeIn 0.2s',
          }}>
            <CheckCircle2 size={18} aria-hidden="true" />
            <span>{appliedNotice}</span>
          </div>
        )}

        {/* Module Subtabs */}
        <div className="tabs-nav" style={{ marginTop: '20px', marginBottom: 0 }} role="tablist" aria-label="AI Studio Modules">
          <button
            role="tab"
            aria-selected={activeTab === 'concept'}
            onClick={() => setActiveTab('concept')}
            className={`tab-btn ${activeTab === 'concept' ? 'active' : ''}`}
          >
            <Palette size={16} aria-hidden="true" />
            <span>Theme & Moodboard</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'budget'}
            onClick={() => setActiveTab('budget')}
            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
          >
            <DollarSign size={16} aria-hidden="true" />
            <span>Smart Budget Advisor</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'schedule'}
            onClick={() => setActiveTab('schedule')}
            className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          >
            <Clock size={16} aria-hidden="true" />
            <span>Run-of-Show Builder</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'vendors'}
            onClick={() => setActiveTab('vendors')}
            className={`tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
          >
            <Users size={16} aria-hidden="true" />
            <span>Vendor Checklist</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          >
            <Bot size={16} aria-hidden="true" />
            <span>Ask OccasionAI</span>
          </button>
        </div>
      </section>

      {/* Tab 1: Theme & Moodboard */}
      {activeTab === 'concept' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge badge-wedding" style={{ textTransform: 'none', marginBottom: '8px' }}>
                  Recommended Aesthetic Concept
                </span>
                <h3 style={{ fontSize: '1.45rem', marginTop: '4px' }}>{currentRec.themeName}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '2px', fontStyle: 'italic' }}>
                  &ldquo;{currentRec.tagline}&rdquo;
                </p>
              </div>
            </div>

            {/* Color Palette */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Curated Color Palette
              </h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {currentRec.colorPalette.map((color) => (
                  <div
                    key={color.hex}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'var(--bg-secondary)',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: color.hex,
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{color.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decor & Atmosphere Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
              {/* Decor Concepts */}
              <div style={{ background: 'var(--bg-secondary)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Palette size={18} color="#ec4899" aria-hidden="true" />
                  Decor & Lighting Vision
                </h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {currentRec.decorConcepts.map((decor, i) => (
                    <li key={i}>{decor}</li>
                  ))}
                </ul>
              </div>

              {/* Culinary & Drink Curation */}
              <div style={{ background: 'var(--bg-secondary)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#f59e0b" aria-hidden="true" />
                  Curated Culinary & Drink Ideas
                </h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {currentRec.menuIdeas.map((menu, i) => (
                    <li key={i}>{menu}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Smart Budget Advisor */}
      {activeTab === 'budget' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem' }}>AI Budget Allocation Model</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Optimized allocation for {formatCurrency(event.targetBudget, event.currency)} across high-impact vendor categories
                </p>
              </div>

              <button
                onClick={handleApplyBudgetRecommendations}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.88rem' }}
              >
                <ArrowRight size={16} aria-hidden="true" />
                <span>Inject Allocations into Budget</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {currentRec.recommendedVendors.map((vendor, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{vendor.role}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-500)', fontSize: '1rem' }}>
                      {formatCurrency(vendor.estimate, event.currency)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{vendor.tips}</p>
                </div>
              ))}
            </div>

            {/* Cost Saving Secrets */}
            <div style={{ marginTop: '24px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <h4 style={{ fontSize: '1rem', color: '#fbbf24', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} aria-hidden="true" />
                Proven Cost-Saving Tactics for {event.type.toUpperCase()}
              </h4>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {currentRec.costSavingTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Run-of-Show Builder */}
      {activeTab === 'schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem' }}>Automated Day-of Run of Show</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Timed execution schedule calibrated to keep guests engaged from start to finale
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleApplyMilestones}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <Check size={16} aria-hidden="true" />
                  <span>Apply Milestones</span>
                </button>
                <button
                  onClick={handleApplyDayOfSchedule}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <ArrowRight size={16} aria-hidden="true" />
                  <span>Apply Hourly Schedule</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              {currentRec.entertainmentSchedule.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    background: 'var(--bg-secondary)',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{
                    minWidth: '70px',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: 'var(--primary-500)',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {item.time}
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.activity}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Vendor Checklist */}
      {activeTab === 'vendors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem' }}>AI Vendor Checklist & Negotiation Playbook</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Key contracts and negotiating tips before signing your quotes
                </p>
              </div>

              <button
                onClick={handleApplyVendors}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.88rem' }}
              >
                <ArrowRight size={16} aria-hidden="true" />
                <span>Import to Vendor List</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {currentRec.recommendedVendors.map((v, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{v.role}</span>
                    <span className="badge badge-custom">{v.category}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Target Budget: <strong>{formatCurrency(v.estimate, event.currency)}</strong>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    💡 <strong>Negotiation Tip:</strong> {v.tips}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Ask OccasionAI (Interactive Chat) */}
      {activeTab === 'chat' && (
        <AIChatPanel event={event} aiSettings={aiSettings} />
      )}
    </div>
  )
}
