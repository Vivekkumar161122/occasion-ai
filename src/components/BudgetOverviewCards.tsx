import React from 'react'
import { AlertTriangle, CheckCircle, Wallet } from 'lucide-react'
import { BudgetSummary, formatCurrency } from '../services/budgetCalculator'
import { CurrencyCode } from '../types'

interface BudgetOverviewCardsProps {
  summary: BudgetSummary
  currency: CurrencyCode
  itemCount: number
}

/**
 * Renders high-level budget metrics, variance alerts, and category progress distribution.
 */
export const BudgetOverviewCards: React.FC<BudgetOverviewCardsProps> = ({
  summary,
  currency,
  itemCount,
}) => {
  return (
    <>
      {/* Top Banner Alert if Over Budget */}
      {summary.status === 'danger' && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#f87171',
          }}
          role="alert"
        >
          <AlertTriangle size={20} aria-hidden="true" />
          <div style={{ fontSize: '0.92rem' }}>
            <strong>Budget Alert:</strong> You have exceeded your target budget by{' '}
            {formatCurrency(Math.abs(summary.variance), currency)} ({summary.percentSpent}% allocated).
            Check the cost-saving recommendations in the AI Assistant tab to optimize allocations!
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Target Budget */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Target Budget</span>
            <Wallet size={18} color="var(--primary-500)" aria-hidden="true" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {formatCurrency(summary.targetBudget, currency)}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Baseline allocation cap
          </p>
        </div>

        {/* Card 2: Total Estimated */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Total Estimated</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{itemCount} items</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {formatCurrency(summary.totalEstimated, currency)}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Planned projections
          </p>
        </div>

        {/* Card 3: Total Actual / Committed */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Total Actual / Committed</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: '0.85rem',
                color: summary.status === 'danger' ? 'var(--status-danger)' : 'var(--status-safe)',
              }}
            >
              {summary.percentSpent}%
            </span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {formatCurrency(summary.totalActual, currency)}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Total confirmed spend
          </p>
        </div>

        {/* Card 4: Remaining Balance */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Remaining Balance</span>
            {summary.remainingTarget >= 0 ? (
              <CheckCircle size={18} color="var(--status-safe)" aria-hidden="true" />
            ) : (
              <AlertTriangle size={18} color="var(--status-danger)" aria-hidden="true" />
            )}
          </div>
          <div
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              marginTop: '8px',
              color: summary.remainingTarget >= 0 ? 'var(--status-safe)' : 'var(--status-danger)',
            }}
          >
            {formatCurrency(Math.abs(summary.remainingTarget), currency)}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {summary.remainingTarget >= 0 ? 'Available surplus' : 'Deficit over limit'}
          </p>
        </div>
      </div>

      {/* Category Breakdown Progress */}
      <section className="glass-card" style={{ padding: '24px' }} aria-labelledby="cat-breakdown-heading">
        <h2 id="cat-breakdown-heading" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
          Category Spending Allocations
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {summary.categories.map((cat) => {
            const spent = cat.actual > 0 ? cat.actual : cat.estimated
            return (
              <div
                key={cat.category}
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }} aria-hidden="true" />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.label}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatCurrency(spent, currency)}
                  </span>
                </div>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.min(100, cat.percentageOfBudget)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{cat.itemCount} items</span>
                  <span>{cat.percentageOfBudget}% of target</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
