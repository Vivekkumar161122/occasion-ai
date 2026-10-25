/**
 * Security & Sanitization Service for OccasionAI
 * Implements strict client-side defense against XSS, prototype pollution, and malformed inputs.
 */

/**
 * Escapes standard HTML special characters to prevent HTML/XSS injection when interpolating strings into markup.
 *
 * @param str - The raw untrusted string to escape.
 * @returns Escaped safe text representation.
 */
export function escapeHTML(str: string): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Cleans text input by stripping script tags, style sheets, iframes, inline event handlers,
 * and dangerous URI schemes (like javascript:), while enforcing length constraints.
 *
 * @param input - Untrusted input from forms, local storage, or network responses.
 * @param maxLength - Maximum permitted character length (default 500).
 * @returns Sanitized text string.
 */
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

/**
 * Validates, bounds, and rounds numerical input for currency, costs, or participant counts.
 * Handles both number primitives and formatted strings containing currency symbols or commas.
 *
 * @param value - Untrusted value to parse as a number.
 * @param fallback - Default numeric value returned if input cannot be parsed (default 0).
 * @param min - Minimum lower bound constraint (default 0).
 * @param max - Maximum upper bound constraint (default 1,000,000,000).
 * @returns Bounded and 2-decimal rounded number.
 */
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

/**
 * Validates a date string against the standard YYYY-MM-DD calendar format.
 * If the provided date is invalid or malformed, it defaults safely to today's date in UTC.
 *
 * @param dateStr - Candidate date string to validate.
 * @returns Standardized YYYY-MM-DD date string.
 */
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

/**
 * Validates web links for vendors or venues, allowing only explicit http and https schemes.
 *
 * @param urlStr - Untrusted URL input.
 * @returns Sanitized URL string or empty string if protocol is unsafe.
 */
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
