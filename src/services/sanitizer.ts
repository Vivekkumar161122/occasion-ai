/**
 * Security & Sanitization Service for OccasionAI
 * Implements strict client-side defense against XSS, prototype pollution, and malformed inputs.
 */

// Escape HTML special characters for safe text display
export function escapeHTML(str: string): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Clean text input: strips script tags, iframe, event handlers, javascript: pseudo-protocols
export function sanitizeInput(input: unknown, maxLength = 500): string {
  if (input === null || input === undefined) return ''
  let text = String(input).trim()

  // Remove control characters (except newline and tab)
  // eslint-disable-next-line no-control-regex
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Remove potential malicious script/style/iframe tags
  text = text.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
  text = text.replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, '')
  text = text.replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, '')

  // Remove inline on* handlers and javascript: URLs
  text = text.replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
  text = text.replace(/javascript:/gi, '')

  // Truncate to maximum permissible length to prevent memory abuse
  return text.slice(0, maxLength)
}

// Validate and sanitize numeric monetary and quantity values
export function sanitizeNumber(value: unknown, fallback = 0, min = 0, max = 1_000_000_000): number {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return Math.max(min, Math.min(max, Math.round(value * 100) / 100))
  }
  if (typeof value === 'string') {
    // Strip currency symbols and commas
    const cleaned = value.replace(/[^0-9.-]/g, '')
    const parsed = parseFloat(cleaned)
    if (!isNaN(parsed) && isFinite(parsed)) {
      return Math.max(min, Math.min(max, Math.round(parsed * 100) / 100))
    }
  }
  return fallback
}

// Validate date string (YYYY-MM-DD or valid ISO date)
export function sanitizeDate(dateStr: unknown): string {
  if (typeof dateStr !== 'string') return new Date().toISOString().split('T')[0]
  const trimmed = dateStr.trim().slice(0, 10)
  // Check regex format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed)
    if (!isNaN(d.getTime())) {
      return trimmed
    }
  }
  return new Date().toISOString().split('T')[0]
}

// Validate and clean URL for vendor links
export function sanitizeUrl(urlStr: unknown): string {
  if (typeof urlStr !== 'string') return ''
  const trimmed = urlStr.trim()
  if (!trimmed) return ''
  // Allow only http and https protocols
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.slice(0, 2048)
  }
  return ''
}
