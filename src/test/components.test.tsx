import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../App'

describe('OccasionAI Application Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the brand title, skip link, and default wedding event', () => {
    render(<App />)

    // Check branding
    expect(screen.getByText('OccasionAI')).toBeInTheDocument()

    // Check accessible skip link
    expect(screen.getByText('Skip to main content')).toBeInTheDocument()

    // Check event title in h1 heading
    expect(screen.getByRole('heading', { level: 1, name: /Sophia & Liam’s Botanical Romance Wedding/i })).toBeInTheDocument()
  })

  it('switches between AI Studio, Budget Tracker, Timeline, and Vendors tabs', () => {
    render(<App />)

    // Switch to Budget Tracker
    const budgetTab = screen.getByRole('tab', { name: /Budget Tracker/i })
    fireEvent.click(budgetTab)
    expect(screen.getByRole('heading', { name: /Category Spending Allocations/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Expense/i })).toBeInTheDocument()

    // Switch to Timeline & Run-of-Show
    const timelineTab = screen.getByRole('tab', { name: /Timeline & Run-of-Show/i })
    fireEvent.click(timelineTab)
    expect(screen.getByRole('heading', { name: /Timeline & Run-of-Show Planner/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Milestone \/ Slot/i })).toBeInTheDocument()

    // Switch to Vendors Checklist
    const vendorTab = screen.getByRole('tab', { name: /Vendors Checklist/i })
    fireEvent.click(vendorTab)
    expect(screen.getByRole('heading', { name: /Vendor Checklist & Directory/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Vendor/i })).toBeInTheDocument()
  })

  it('allows opening the settings modal to manage AI API keys and data backups', () => {
    render(<App />)

    const settingsBtn = screen.getByRole('button', { name: /Settings/i })
    fireEvent.click(settingsBtn)

    expect(screen.getByText(/OccasionAI Settings & AI Config/i)).toBeInTheDocument()
    expect(screen.getByText(/100% Client-Side Privacy/i)).toBeInTheDocument()
  })

  it('renders interactive chat in AI Studio tab with prompt suggestions', () => {
    render(<App />)

    // Switch to Ask OccasionAI sub-tab in AI Studio
    const chatTab = screen.getByRole('tab', { name: /Ask OccasionAI/i })
    fireEvent.click(chatTab)

    expect(screen.getByText(/OccasionAI Event Strategist/i)).toBeInTheDocument()
    expect(screen.getByText(/Ask anything about your wedding/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Ask anything/i)).toBeInTheDocument()
  })
})
