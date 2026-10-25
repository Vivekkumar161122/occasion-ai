# 🌟 occasion-ai: GenAI-Powered Event Planning Assistant

[![OccasionAI CI](https://github.com/Vivekkumar161122/OccasionAI/actions/workflows/ci.yml/badge.svg)](https://github.com/Vivekkumar161122/OccasionAI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

OccasionAI is an intelligent, creative, and privacy-focused event planning assistant designed to organize **Weddings**, **Birthdays**, and **Community Events** with budgets, timelines, vendor checklists, and personalized GenAI ideas.

---

## ✨ Key Features

### 1. 🎨 GenAI Planning Studio
- **Curated Theme & Moodboard Generator**: Generates bespoke palettes, decor concepts, culinary menus, and lighting setups tailored to the celebration vibe.
- **Smart Budget Allocation Advisor**: Recommends optimized percentage allocations and dollar amounts across venues, catering, entertainment, and decor, along with event-type-specific cost-saving tactics.
- **Run-of-Show & Hourly Schedule Builder**: Formulates timed day-of execution timelines to ensure zero delays during key moments.
- **Vendor Negotiation Playbook**: Outlines critical contract questions, pricing benchmarks, and negotiation tips before booking.
- **1-Click "Apply to Event"**: Automatically injects AI-generated budget items, timeline milestones, and vendor checklists directly into your active event with a single click.
- **Hybrid AI Engine**: Supports both **Google Gemini 2.5 API** (BYO key) and a **Built-in Offline Creative Engine** that generates high-fidelity event blueprints with zero external dependencies and zero API keys needed.

### 2. 💰 Intelligent Budget Tracker
- Target budget vs itemized actual spend tracking with real-time variance calculations.
- Category spending progress meters (Venue, Catering, Decor, Entertainment, Photo/Video, Permits, etc.).
- Visual budget health indicators (`Safe`, `Warning`, and `Over Budget Alert`).
- Multi-currency support (`$ USD`, `€ EUR`, `£ GBP`, `₹ INR`, `C$ CAD`, `A$ AUD`, `¥ JPY`).
- 1-Click CSV Export for financial auditing.

### 3. ⏱️ Timeline & Run-of-Show Planner
- Phase-by-phase planning milestones:
  - **Phase 1**: 6+ Months Out (Pre-Planning)
  - **Phase 2**: 2-3 Months Out (Booking & Details)
  - **Phase 3**: 2-4 Weeks Out (Final Prep)
  - **Countdown**: Week of Event
  - **Live Execution**: Day-of Run of Show (Hourly schedule slots e.g. `16:00 Ceremony`)
- Interactive completion tracking with celebratory confetti burst on 100% readiness.
- Priority tags (`High`, `Medium`, `Low`), assigned coordinators, and due dates.

### 4. 🤝 Vendor Directory & Checklist
- Service directory organized by category and status (`Researching`, `Inquired`, `Quoted`, `Contract Signed`, `Deposit Paid`, `Fully Paid`, `Declined`).
- One-click contact action triggers (`tel:` call, `mailto:` email, and sanitized external website links).
- Deposit tracking, contract notes, and quoted vs agreed rates.

### 5. 🔒 Security & Privacy (100% Client-Side)
- **Zero Data Leakage**: All event plans, budgets, and guest information remain strictly on your local browser.
- **API Key Safety**: User-supplied Gemini keys are never sent to third-party tracking servers; they communicate solely with official Google API endpoints.
- **Strict Input Sanitization**: Custom XSS sanitization engine strips malicious script tags, iframes, inline handlers, and invalid protocols.
- **Sanitized Backup & Restore**: Export and import full event states as JSON with sensitive keys automatically redacted.

### 6. ♿ Accessibility (WCAG 2.1 AA Compliant)
- Semantic HTML5 structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<dialog>`).
- Visible `:focus-visible` focus rings across all interactive controls.
- ARIA live announcements for real-time status updates and notifications.
- Accessible skip link (`Skip to main content`).
- Full keyboard navigation support (modal focus traps and `Escape` key dismissals).

---

## 🚀 Quick Start

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/occasionai.git
cd occasionai

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Testing

OccasionAI includes a comprehensive Vitest unit and integration test suite:

```bash
# Run all tests
npm run test
```

Test coverage includes:
- **`budgetCalculator.test.ts`**: Pure mathematical calculations for totals, remaining balances, percentage allocations, and multi-currency formats.
- **`sanitizer.test.ts`**: Verification of XSS prevention, HTML entity escaping, number bounding, and URL protocol validation.
- **`aiPlanner.test.ts`**: Local idea generation for weddings, birthdays, community gatherings, and budget scaling.
- **`storage.test.ts`**: Schema validation, state migrations, and sensitive credential redactions during export.
- **`components.test.tsx`**: Accessibility, semantic heading hierarchy, tab switching, and modal interactions.

---

## ⚡ Deployment (Vercel-Friendly)

OccasionAI is 100% platform-independent and pre-configured for Vercel deployment with `vercel.json`:

```bash
# Production build
npm run build
```

Simply connect this repository to Vercel or run `vercel deploy`.
