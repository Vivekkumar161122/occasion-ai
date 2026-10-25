import { BudgetCategory, BudgetItem, CURRENCIES, CurrencyCode } from '../types'

/**
 * Aggregated metrics and budget consumption for an individual category.
 */
export interface CategorySummary {
  /** Category key identifier */
  category: BudgetCategory
  /** Human-readable display label */
  label: string
  /** Sum of estimated expenses for this category */
  estimated: number
  /** Sum of actual/confirmed expenses for this category */
  actual: number
  /** Total count of line items registered in this category */
  itemCount: number
  /** Percentage of overall target budget consumed by this category */
  percentageOfBudget: number
  /** Hex color token assigned to this category for charts and badges */
  color: string
}

/**
 * Top-level event budget health overview and financial summary.
 */
export interface BudgetSummary {
  /** Total targeted/allocated budget cap for the event */
  targetBudget: number
  /** Sum of all estimated item costs */
  totalEstimated: number
  /** Sum of all actual confirmed item costs */
  totalActual: number
  /** Total amount already marked as paid to vendors/suppliers */
  totalPaid: number
  /** Remaining budget headroom before exceeding target */
  remainingTarget: number
  /** Variance against target (positive indicates surplus, negative indicates deficit) */
  variance: number
  /** Percentage of target budget currently committed or spent */
  percentSpent: number
  /** Overall financial health status flag */
  status: 'safe' | 'warning' | 'danger'
  /** Detailed breakdown sorted by highest expenditure */
  categories: CategorySummary[]
}

/**
 * Visual design system mapping and labels for each budget category.
 */
export const CATEGORY_METADATA: Record<BudgetCategory, { label: string; color: string }> = {
  venue: { label: 'Venue & Facilities', color: '#6366f1' },
  catering: { label: 'Catering & Beverages', color: '#f59e0b' },
  decor: { label: 'Decor, Floral & Lighting', color: '#ec4899' },
  entertainment: { label: 'Music & Entertainment', color: '#8b5cf6' },
  photo_video: { label: 'Photography & Videography', color: '#06b6d4' },
  attire_beauty: { label: 'Attire & Styling', color: '#10b981' },
  invitations_marketing: { label: 'Invitations & Marketing', color: '#3b82f6' },
  favors_gifts: { label: 'Favors, Swag & Gifts', color: '#14b8a6' },
  permits_safety: { label: 'Permits, Insurance & Safety', color: '#ef4444' },
  miscellaneous: { label: 'Emergency Fund & Misc', color: '#64748b' },
}

/**
 * Formats a numeric monetary quantity with the corresponding currency symbol and locale grouping.
 *
 * @param amount - The numerical amount to format.
 * @param currency - ISO currency code (defaults to 'USD').
 * @returns Formatted currency string (e.g. "$12,500" or "€450.50").
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${config.symbol}${formatted}`
}

/**
 * Calculates comprehensive financial summaries, category distribution, and risk alerts
 * based on target budget and line items.
 *
 * @param targetBudget - Overall budget target set for the event.
 * @param items - List of budget line items belonging to the event.
 * @returns Complete BudgetSummary object containing totals, variances, and category metrics.
 */
export function calculateBudgetSummary(
  targetBudget: number,
  items: BudgetItem[]
): BudgetSummary {
  const safeTarget = Math.max(0, targetBudget)

  let totalEstimated = 0
  let totalActual = 0
  let totalPaid = 0

  const catMap: Record<BudgetCategory, { estimated: number; actual: number; count: number }> = {
    venue: { estimated: 0, actual: 0, count: 0 },
    catering: { estimated: 0, actual: 0, count: 0 },
    decor: { estimated: 0, actual: 0, count: 0 },
    entertainment: { estimated: 0, actual: 0, count: 0 },
    photo_video: { estimated: 0, actual: 0, count: 0 },
    attire_beauty: { estimated: 0, actual: 0, count: 0 },
    invitations_marketing: { estimated: 0, actual: 0, count: 0 },
    favors_gifts: { estimated: 0, actual: 0, count: 0 },
    permits_safety: { estimated: 0, actual: 0, count: 0 },
    miscellaneous: { estimated: 0, actual: 0, count: 0 },
  }

  for (const item of items) {
    const est = Math.max(0, item.estimatedCost || 0)
    const act = Math.max(0, item.actualCost || 0)
    totalEstimated += est
    totalActual += act
    if (item.isPaid) {
      totalPaid += act > 0 ? act : est
    }

    if (catMap[item.category]) {
      catMap[item.category].estimated += est
      catMap[item.category].actual += act
      catMap[item.category].count += 1
    }
  }

  const effectiveSpent = totalActual > 0 ? totalActual : totalEstimated
  const remainingTarget = safeTarget - effectiveSpent
  const variance = safeTarget - effectiveSpent
  const percentSpent = safeTarget > 0 ? Math.round((effectiveSpent / safeTarget) * 100) : 0

  let status: 'safe' | 'warning' | 'danger' = 'safe'
  if (percentSpent > 100) {
    status = 'danger'
  } else if (percentSpent >= 85) {
    status = 'warning'
  }

  const categories: CategorySummary[] = (Object.keys(catMap) as BudgetCategory[])
    .map((catKey) => {
      const data = catMap[catKey]
      const catSpent = data.actual > 0 ? data.actual : data.estimated
      const pct = safeTarget > 0 ? Math.round((catSpent / safeTarget) * 100) : 0
      return {
        category: catKey,
        label: CATEGORY_METADATA[catKey].label,
        estimated: data.estimated,
        actual: data.actual,
        itemCount: data.count,
        percentageOfBudget: pct,
        color: CATEGORY_METADATA[catKey].color,
      }
    })
    .filter((c) => c.itemCount > 0 || c.estimated > 0 || c.actual > 0)
    .sort((a, b) => (b.actual || b.estimated) - (a.actual || a.estimated))

  return {
    targetBudget: safeTarget,
    totalEstimated,
    totalActual,
    totalPaid,
    remainingTarget,
    variance,
    percentSpent,
    status,
    categories,
  }
}
