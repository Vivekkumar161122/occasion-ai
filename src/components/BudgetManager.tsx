import React, { useState } from 'react'
import {
  Download,
  Filter,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { BudgetOverviewCards } from './BudgetOverviewCards'
import {
  calculateBudgetSummary,
  CATEGORY_METADATA,
  formatCurrency,
} from '../services/budgetCalculator'
import { sanitizeInput, sanitizeNumber } from '../services/sanitizer'
import { BudgetCategory, BudgetItem, OccasionEvent } from '../types'

interface BudgetManagerProps {
  event: OccasionEvent
  items: BudgetItem[]
  onAddItem: (item: Omit<BudgetItem, 'id' | 'eventId'>) => void
  onUpdateItem: (id: string, updates: Partial<BudgetItem>) => void
  onDeleteItem: (id: string) => void
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  event,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [category, setCategory] = useState<BudgetCategory>('venue')
  const [estimatedCost, setEstimatedCost] = useState('')
  const [actualCost, setActualCost] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [notes, setNotes] = useState('')

  const summary = calculateBudgetSummary(event.targetBudget, items)

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAddItem({
      name: sanitizeInput(name, 100),
      category,
      estimatedCost: sanitizeNumber(estimatedCost, 0),
      actualCost: sanitizeNumber(actualCost, 0),
      isPaid,
      notes: sanitizeInput(notes, 300),
    })

    // Reset
    setName('')
    setEstimatedCost('')
    setActualCost('')
    setIsPaid(false)
    setNotes('')
    setIsModalOpen(false)
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Category', 'Estimated Cost', 'Actual Cost', 'Paid', 'Notes']
    const rows = items.map((i) => [
      `"${i.name.replace(/"/g, '""')}"`,
      CATEGORY_METADATA[i.category]?.label || i.category,
      i.estimatedCost,
      i.actualCost,
      i.isPaid ? 'Yes' : 'No',
      `"${(i.notes || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${event.title.replace(/\s+/g, '_')}_Budget.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="budget-manager" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* High-level KPI and Category Cards */}
      <BudgetOverviewCards
        summary={summary}
        currency={event.currency}
        itemCount={items.length}
      />

      {/* Expense Management Table */}
      <section className="glass-card" style={{ padding: '24px' }} aria-labelledby="expense-list-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 id="expense-list-heading" style={{ fontSize: '1.25rem' }}>
              Itemized Expenses ({filteredItems.length})
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Track quotes, confirmed receipts, and payment status
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0 10px',
            }}>
              <Search size={16} color="var(--text-muted)" aria-hidden="true" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search expense..."
                aria-label="Search expense"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  width: '140px',
                }}
              />
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="budget-filter-select" className="sr-only">Filter by category</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0 10px',
              }}>
                <Filter size={14} color="var(--text-muted)" style={{ marginRight: '6px' }} aria-hidden="true" />
                <select
                  id="budget-filter-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 0',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all" style={{ background: '#1e293b' }}>All Categories</option>
                  {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
                    <option key={key} value={key} style={{ background: '#1e293b' }}>
                      {meta.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.88rem' }}
              title="Export expenses to CSV"
            >
              <Download size={15} aria-hidden="true" />
              <span>CSV</span>
            </button>

            {/* Add Expense Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.88rem' }}
            >
              <Plus size={16} aria-hidden="true" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 14px' }}>Paid</th>
                <th style={{ padding: '12px 14px' }}>Item Name</th>
                <th style={{ padding: '12px 14px' }}>Category</th>
                <th style={{ padding: '12px 14px' }}>Estimated</th>
                <th style={{ padding: '12px 14px' }}>Actual</th>
                <th style={{ padding: '12px 14px' }}>Notes</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No expenses match your search or filter. Click &ldquo;Add Expense&rdquo; to log your first cost!
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background var(--transition-fast)',
                    }}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <input
                        type="checkbox"
                        checked={item.isPaid}
                        onChange={(e) => onUpdateItem(item.id, { isPaid: e.target.checked })}
                        aria-label={`Mark ${item.name} as ${item.isPaid ? 'unpaid' : 'paid'}`}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.name}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: CATEGORY_METADATA[item.category]?.color || '#999',
                        }} />
                        {CATEGORY_METADATA[item.category]?.label || item.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      {formatCurrency(item.estimatedCost, event.currency)}
                    </td>
                    <td style={{
                      padding: '12px 14px',
                      fontWeight: 700,
                      color: item.actualCost > item.estimatedCost ? 'var(--status-danger)' : 'var(--text-primary)',
                    }}>
                      {formatCurrency(item.actualCost, event.currency)}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '200px' }}>
                      {item.notes || '—'}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="btn-ghost"
                        style={{ padding: '6px 8px', color: 'var(--status-danger)' }}
                        title="Delete expense"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-expense-title">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 id="add-expense-title" style={{ fontSize: '1.25rem' }}>Add Expense Item</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-ghost"
                style={{ fontSize: '1.2rem', padding: '4px 8px' }}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="expense-name">Item Name *</label>
                  <input
                    id="expense-name"
                    type="text"
                    required
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wedding Cake, Sound System Rental"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="expense-category">Category</label>
                  <select
                    id="expense-category"
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BudgetCategory)}
                  >
                    {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
                      <option key={key} value={key} style={{ background: '#1e293b' }}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="expense-est">Estimated Cost ({event.currency})</label>
                    <input
                      id="expense-est"
                      type="number"
                      min="0"
                      step="any"
                      className="form-control"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="expense-act">Actual Cost ({event.currency})</label>
                    <input
                      id="expense-act"
                      type="number"
                      min="0"
                      step="any"
                      className="form-control"
                      value={actualCost}
                      onChange={(e) => setActualCost(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input
                    id="expense-paid"
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                  />
                  <label htmlFor="expense-paid" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                    Has this payment already been made?
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="expense-notes">Notes & Receipt Info</label>
                  <textarea
                    id="expense-notes"
                    className="form-control"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Payment terms, invoice number, vendor link..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
