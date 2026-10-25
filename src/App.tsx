import React, { useEffect, useState } from 'react'
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Palette,
  Sparkles,
  Users,
} from 'lucide-react'
import { AIAssistant } from './components/AIAssistant'
import { BudgetManager } from './components/BudgetManager'
import { EventHeader } from './components/EventHeader'
import { EventModal } from './components/EventModal'
import { Navbar } from './components/Navbar'
import { SettingsModal } from './components/SettingsModal'
import { TimelineManager } from './components/TimelineManager'
import { VendorManager } from './components/VendorManager'
import {
  exportAppStateAsJSON,
  getInitialAppState,
  loadAppState,
  saveAppState,
} from './services/storage'
import {
  AISettings,
  AppState,
  BudgetItem,
  CurrencyCode,
  EventType,
  OccasionEvent,
  TimelineItem,
  VendorItem,
} from './types'

type ActiveTab = 'ai' | 'budget' | 'timeline' | 'vendors'

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => loadAppState())
  const [activeTab, setActiveTab] = useState<ActiveTab>('ai')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<OccasionEvent | null>(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Save state on change
  useEffect(() => {
    saveAppState(state)
  }, [state])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  // Active event resolution
  const activeEvent =
    state.events.find((e) => e.id === state.activeEventId) || state.events[0] || null

  const activeBudgetItems = state.budgetItems.filter(
    (b) => b.eventId === activeEvent?.id
  )
  const activeTimelineItems = state.timelineItems.filter(
    (t) => t.eventId === activeEvent?.id
  )
  const activeVendors = state.vendors.filter(
    (v) => v.eventId === activeEvent?.id
  )

  // Handlers for Events
  const handleSelectEvent = (eventId: string) => {
    setState((prev) => ({ ...prev, activeEventId: eventId }))
  }

  const handleCreateOrUpdateEvent = (
    eventData: Omit<OccasionEvent, 'id' | 'createdAt' | 'updatedAt'>,
    _templateChoice?: EventType
  ) => {
    if (editingEvent) {
      // Update
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e.id === editingEvent.id
            ? { ...e, ...eventData, updatedAt: new Date().toISOString() }
            : e
        ),
      }))
      showNotification('Event details updated successfully!')
      setEditingEvent(null)
    } else {
      // Create new
      const newEventId = `evt-${Date.now()}`
      const newEvent: OccasionEvent = {
        id: newEventId,
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Pre-populate sensible baseline tasks based on template
      const starterMilestones: TimelineItem[] = [
        {
          id: `t-${Date.now()}-1`,
          eventId: newEventId,
          title: 'Finalize venue and deposit contract',
          phase: 'pre_planning',
          dueDate: eventData.date,
          completed: false,
          priority: 'high',
        },
        {
          id: `t-${Date.now()}-2`,
          eventId: newEventId,
          title: 'Send invitations and confirm RSVP deadline',
          phase: 'middle_planning',
          completed: false,
          priority: 'high',
        },
        {
          id: `t-${Date.now()}-3`,
          eventId: newEventId,
          title: 'Final walkthrough with venue and vendor team',
          phase: 'week_of',
          completed: false,
          priority: 'medium',
        },
        {
          id: `t-${Date.now()}-4`,
          eventId: newEventId,
          title: 'Day-of site arrival and equipment load-in',
          phase: 'day_of',
          time: '10:00',
          completed: false,
          priority: 'high',
        },
      ]

      setState((prev) => ({
        ...prev,
        events: [newEvent, ...prev.events],
        activeEventId: newEventId,
        timelineItems: [...starterMilestones, ...prev.timelineItems],
      }))
      showNotification(`🎉 Created "${newEvent.title}"!`)
    }
  }

  const handleChangeCurrency = (newCurrency: CurrencyCode) => {
    if (!activeEvent) return
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === activeEvent.id ? { ...e, currency: newCurrency } : e
      ),
    }))
    showNotification(`Currency updated to ${newCurrency}`)
  }

  // Budget Handlers
  const handleAddBudgetItem = (item: Omit<BudgetItem, 'id' | 'eventId'>) => {
    if (!activeEvent) return
    const newItem: BudgetItem = {
      id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventId: activeEvent.id,
      ...item,
    }
    setState((prev) => ({
      ...prev,
      budgetItems: [newItem, ...prev.budgetItems],
    }))
    showNotification(`Added expense: ${item.name}`)
  }

  const handleUpdateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setState((prev) => ({
      ...prev,
      budgetItems: prev.budgetItems.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }))
  }

  const handleDeleteBudgetItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      budgetItems: prev.budgetItems.filter((b) => b.id !== id),
    }))
  }

  // Timeline Handlers
  const handleAddTimelineItem = (item: Omit<TimelineItem, 'id' | 'eventId'>) => {
    if (!activeEvent) return
    const newItem: TimelineItem = {
      id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventId: activeEvent.id,
      ...item,
    }
    setState((prev) => ({
      ...prev,
      timelineItems: [newItem, ...prev.timelineItems],
    }))
    showNotification(`Added milestone: ${item.title}`)
  }

  const handleToggleTimelineComplete = (id: string, completed: boolean) => {
    setState((prev) => ({
      ...prev,
      timelineItems: prev.timelineItems.map((t) => (t.id === id ? { ...t, completed } : t)),
    }))
  }

  const handleDeleteTimelineItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      timelineItems: prev.timelineItems.filter((t) => t.id !== id),
    }))
  }

  // Vendor Handlers
  const handleAddVendor = (vendor: Omit<VendorItem, 'id' | 'eventId'>) => {
    if (!activeEvent) return
    const newVendor: VendorItem = {
      id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventId: activeEvent.id,
      ...vendor,
    }
    setState((prev) => ({
      ...prev,
      vendors: [newVendor, ...prev.vendors],
    }))
    showNotification(`Added vendor: ${vendor.name}`)
  }

  const handleUpdateVendor = (id: string, updates: Partial<VendorItem>) => {
    setState((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }))
  }

  const handleDeleteVendor = (id: string) => {
    setState((prev) => ({
      ...prev,
      vendors: prev.vendors.filter((v) => v.id !== id),
    }))
  }

  // AI 1-Click Batch Injectors
  const handleApplyAIBudgetItems = (newItems: Omit<BudgetItem, 'id' | 'eventId'>[]) => {
    if (!activeEvent) return
    const mapped: BudgetItem[] = newItems.map((item) => ({
      id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventId: activeEvent.id,
      ...item,
    }))
    setState((prev) => ({
      ...prev,
      budgetItems: [...mapped, ...prev.budgetItems],
    }))
  }

  const handleApplyAITimelineItems = (newItems: Omit<TimelineItem, 'id' | 'eventId'>[]) => {
    if (!activeEvent) return
    const mapped: TimelineItem[] = newItems.map((item) => ({
      id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventId: activeEvent.id,
      ...item,
    }))
    setState((prev) => ({
      ...prev,
      timelineItems: [...mapped, ...prev.timelineItems],
    }))
  }

  const handleApplyAIVendors = (newVendors: Omit<VendorItem, 'id' | 'eventId'>[]) => {
    if (!activeEvent) return
    const mapped: VendorItem[] = newVendors.map((item) => ({
      id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventId: activeEvent.id,
      ...item,
    }))
    setState((prev) => ({
      ...prev,
      vendors: [...mapped, ...prev.vendors],
    }))
  }

  // Backup & Import
  const handleExportData = () => {
    const jsonStr = exportAppStateAsJSON(state)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `OccasionAI_Backup_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    showNotification('Backup downloaded successfully!')
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const parsed = JSON.parse(content)
        if (Array.isArray(parsed.events)) {
          localStorage.setItem('occasionai_state_v1', content)
          setState(loadAppState())
          showNotification('Events restored from backup!')
        } else {
          alert('Invalid backup file format.')
        }
      } catch {
        alert('Could not parse backup file.')
      }
    }
    reader.readAsText(file)
  }

  const handleResetData = () => {
    localStorage.removeItem('occasionai_state_v1')
    setState(getInitialAppState())
    showNotification('Reset to demo events!')
  }

  const handleSaveAISettings = (newSettings: AISettings) => {
    setState((prev) => ({ ...prev, aiSettings: newSettings }))
    showNotification('AI Settings updated!')
  }

  return (
    <div className="app-container">
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <Navbar
        events={state.events}
        activeEvent={activeEvent}
        onSelectEvent={handleSelectEvent}
        onNewEvent={() => {
          setEditingEvent(null)
          setIsEventModalOpen(true)
        }}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onExport={handleExportData}
        onImport={handleImportData}
        onChangeCurrency={handleChangeCurrency}
      />

      {/* Main Content Area */}
      <main id="main-content" className="main-content" role="main">
        {activeEvent ? (
          <>
            {/* Event Header & Countdown */}
            <EventHeader
              event={activeEvent}
              budgetItems={activeBudgetItems}
              timelineItems={activeTimelineItems}
              vendors={activeVendors}
              onEditEvent={() => {
                setEditingEvent(activeEvent)
                setIsEventModalOpen(true)
              }}
            />

            {/* Core Feature Tabs Navigation */}
            <nav className="tabs-nav" aria-label="Event Planning Sections">
              <button
                role="tab"
                aria-selected={activeTab === 'ai'}
                onClick={() => setActiveTab('ai')}
                className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
              >
                <Sparkles size={16} aria-hidden="true" />
                <span>AI Studio & Ideas</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === 'budget'}
                onClick={() => setActiveTab('budget')}
                className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
              >
                <DollarSign size={16} aria-hidden="true" />
                <span>Budget Tracker ({activeBudgetItems.length})</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === 'timeline'}
                onClick={() => setActiveTab('timeline')}
                className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              >
                <Calendar size={16} aria-hidden="true" />
                <span>Timeline & Run-of-Show ({activeTimelineItems.length})</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === 'vendors'}
                onClick={() => setActiveTab('vendors')}
                className={`tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
              >
                <Users size={16} aria-hidden="true" />
                <span>Vendors Checklist ({activeVendors.length})</span>
              </button>
            </nav>

            {/* Active Tab View */}
            <div role="region" aria-live="polite">
              {activeTab === 'ai' && (
                <AIAssistant
                  event={activeEvent}
                  aiSettings={state.aiSettings}
                  onApplyBudgetItems={handleApplyAIBudgetItems}
                  onApplyTimelineItems={handleApplyAITimelineItems}
                  onApplyVendors={handleApplyAIVendors}
                />
              )}

              {activeTab === 'budget' && (
                <BudgetManager
                  event={activeEvent}
                  items={activeBudgetItems}
                  onAddItem={handleAddBudgetItem}
                  onUpdateItem={handleUpdateBudgetItem}
                  onDeleteItem={handleDeleteBudgetItem}
                />
              )}

              {activeTab === 'timeline' && (
                <TimelineManager
                  event={activeEvent}
                  items={activeTimelineItems}
                  onAddItem={handleAddTimelineItem}
                  onToggleComplete={handleToggleTimelineComplete}
                  onDeleteItem={handleDeleteTimelineItem}
                />
              )}

              {activeTab === 'vendors' && (
                <VendorManager
                  event={activeEvent}
                  vendors={activeVendors}
                  onAddVendor={handleAddVendor}
                  onUpdateVendor={handleUpdateVendor}
                  onDeleteVendor={handleDeleteVendor}
                />
              )}
            </div>
          </>
        ) : (
          <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Palette size={48} color="var(--primary-500)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No Events Planned Yet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Create your first wedding, birthday, or community gathering with OccasionAI!
            </p>
            <button
              onClick={() => {
                setEditingEvent(null)
                setIsEventModalOpen(true)
              }}
              className="btn-primary"
            >
              Plan Your First Event
            </button>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {notification && (
        <aside
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--bg-card)',
            backdropFilter: 'blur(16px)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            zIndex: 2000,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <CheckCircle size={18} color="var(--status-safe)" aria-hidden="true" />
          <span>{notification}</span>
        </aside>
      )}

      {/* Modals */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false)
          setEditingEvent(null)
        }}
        onSave={handleCreateOrUpdateEvent}
        initialEvent={editingEvent}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={state.aiSettings}
        onSaveSettings={handleSaveAISettings}
        onExportData={handleExportData}
        onResetData={handleResetData}
      />
    </div>
  )
}

export default App
