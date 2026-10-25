import {
  AppState,
  BudgetItem,
  CurrencyCode,
  EventType,
  OccasionEvent,
  TimelineItem,
  VendorItem,
} from '../types'
import { sanitizeDate, sanitizeInput, sanitizeNumber } from './sanitizer'
import {
  DEFAULT_WEDDING_EVENT,
  DEFAULT_WEDDING_BUDGET,
  DEFAULT_WEDDING_TIMELINE,
  DEFAULT_WEDDING_VENDORS,
  DEFAULT_BIRTHDAY_EVENT,
  DEFAULT_BIRTHDAY_BUDGET,
  DEFAULT_COMMUNITY_EVENT,
  DEFAULT_COMMUNITY_BUDGET,
  getInitialAppState,
} from './initialData'

// Re-export seed fixtures for testing and consumer modules
export {
  DEFAULT_WEDDING_EVENT,
  DEFAULT_WEDDING_BUDGET,
  DEFAULT_WEDDING_TIMELINE,
  DEFAULT_WEDDING_VENDORS,
  DEFAULT_BIRTHDAY_EVENT,
  DEFAULT_BIRTHDAY_BUDGET,
  DEFAULT_COMMUNITY_EVENT,
  DEFAULT_COMMUNITY_BUDGET,
  getInitialAppState,
}

const STORAGE_KEY = 'occasionai_state_v1'

const VALID_EVENT_TYPES: readonly EventType[] = ['wedding', 'birthday', 'community', 'custom'] as const
const VALID_CURRENCIES: readonly CurrencyCode[] = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'] as const

/**
 * Validates and casts an event type string to an EventType union.
 * @param type Potential event type string.
 * @returns Validated EventType or defaults to 'custom'.
 */
function normalizeEventType(type: unknown): EventType {
  if (typeof type === 'string' && (VALID_EVENT_TYPES as readonly string[]).includes(type)) {
    return type as EventType
  }
  return 'custom'
}

/**
 * Validates and casts a currency string to a CurrencyCode union.
 * @param currency Potential currency code string.
 * @returns Validated CurrencyCode or defaults to 'USD'.
 */
function normalizeCurrency(currency: unknown): CurrencyCode {
  if (typeof currency === 'string' && (VALID_CURRENCIES as readonly string[]).includes(currency)) {
    return currency as CurrencyCode
  }
  return 'USD'
}

/**
 * Loads and validates application state from the browser's localStorage.
 * If data is absent, corrupted, or structurally invalid, it falls back gracefully to default seed state.
 *
 * @returns Validated AppState instance.
 */
export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getInitialAppState()
    const parsed = JSON.parse(raw) as Partial<AppState>

    // Validate fundamental structure
    if (!Array.isArray(parsed.events) || parsed.events.length === 0) {
      return getInitialAppState()
    }

    const validatedEvents: OccasionEvent[] = parsed.events.map((e) => ({
      id: sanitizeInput(e.id, 64) || `evt-${Date.now()}`,
      title: sanitizeInput(e.title, 120) || 'Untitled Event',
      type: normalizeEventType(e.type),
      date: sanitizeDate(e.date),
      location: sanitizeInput(e.location, 160) || 'TBD',
      guestCount: sanitizeNumber(e.guestCount, 50, 1, 100000),
      vibe: sanitizeInput(e.vibe, 300) || '',
      targetBudget: sanitizeNumber(e.targetBudget, 5000, 0, 100000000),
      currency: normalizeCurrency(e.currency),
      notes: sanitizeInput(e.notes || '', 1000),
      createdAt: e.createdAt || new Date().toISOString(),
      updatedAt: e.updatedAt || new Date().toISOString(),
    }))

    const validatedBudget: BudgetItem[] = Array.isArray(parsed.budgetItems)
      ? parsed.budgetItems.map((b) => ({
          id: sanitizeInput(b.id, 64) || `b-${Date.now()}-${Math.random()}`,
          eventId: sanitizeInput(b.eventId, 64),
          name: sanitizeInput(b.name, 120) || 'Expense',
          category: b.category || 'miscellaneous',
          estimatedCost: sanitizeNumber(b.estimatedCost, 0),
          actualCost: sanitizeNumber(b.actualCost, 0),
          isPaid: Boolean(b.isPaid),
          vendorId: b.vendorId ? sanitizeInput(b.vendorId, 64) : undefined,
          notes: sanitizeInput(b.notes || '', 300),
        }))
      : []

    const validatedTimeline: TimelineItem[] = Array.isArray(parsed.timelineItems)
      ? parsed.timelineItems.map((t) => ({
          id: sanitizeInput(t.id, 64) || `t-${Date.now()}-${Math.random()}`,
          eventId: sanitizeInput(t.eventId, 64),
          title: sanitizeInput(t.title, 150) || 'Task',
          description: sanitizeInput(t.description || '', 400),
          phase: t.phase || 'pre_planning',
          dueDate: t.dueDate ? sanitizeDate(t.dueDate) : undefined,
          time: t.time ? sanitizeInput(t.time, 10) : undefined,
          completed: Boolean(t.completed),
          priority: t.priority || 'medium',
          assignedTo: sanitizeInput(t.assignedTo || '', 80),
        }))
      : []

    const validatedVendors: VendorItem[] = Array.isArray(parsed.vendors)
      ? parsed.vendors.map((v) => ({
          id: sanitizeInput(v.id, 64) || `v-${Date.now()}-${Math.random()}`,
          eventId: sanitizeInput(v.eventId, 64),
          name: sanitizeInput(v.name, 120) || 'Vendor',
          category: v.category || 'venue',
          contactPerson: sanitizeInput(v.contactPerson || '', 80),
          email: sanitizeInput(v.email || '', 120),
          phone: sanitizeInput(v.phone || '', 50),
          website: sanitizeInput(v.website || '', 200),
          status: v.status || 'researching',
          quotedAmount: sanitizeNumber(v.quotedAmount || 0, 0),
          notes: sanitizeInput(v.notes || '', 500),
          deliverables: Array.isArray(v.deliverables) ? v.deliverables.map((d) => sanitizeInput(d, 120)) : [],
        }))
      : []

    const activeEventId =
      parsed.activeEventId && validatedEvents.some((e) => e.id === parsed.activeEventId)
        ? parsed.activeEventId
        : validatedEvents[0].id

    return {
      events: validatedEvents,
      activeEventId,
      budgetItems: validatedBudget,
      timelineItems: validatedTimeline,
      vendors: validatedVendors,
      aiSettings: {
        apiKey: sanitizeInput(parsed.aiSettings?.apiKey || '', 128),
        useCustomKey: Boolean(parsed.aiSettings?.useCustomKey),
        model: parsed.aiSettings?.model === 'gemini-2.5-pro' ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
      },
    }
  } catch (e) {
    console.error('Failed to parse local storage state, loading defaults', e)
    return getInitialAppState()
  }
}

/**
 * Persists the entire application state into localStorage.
 * @param state The current AppState to serialize.
 */
export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save state to localStorage', e)
  }
}

/**
 * Serializes the application state into formatted JSON for backup/export.
 * Safely strips any stored Gemini API credentials to prevent sensitive credential leakage.
 *
 * @param state The AppState to export.
 * @returns Sanitized JSON string suitable for file download.
 */
export function exportAppStateAsJSON(state: AppState): string {
  // Redact API key from export file for absolute security
  const safeState: AppState = {
    ...state,
    aiSettings: {
      ...state.aiSettings,
      apiKey: '',
    },
  }
  return JSON.stringify(safeState, null, 2)
}
