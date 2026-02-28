/**
 * Tests for parseUtils.ts — pure functions, no mocks needed.
 */
import { parseNumericInput, parseIntegerInput, formatRelativeDate } from '../parseUtils'

// ─── parseNumericInput ────────────────────────────────────────────────────────

describe('parseNumericInput', () => {
  it('parses a valid integer string', () => {
    expect(parseNumericInput('10')).toBe(10)
  })

  it('parses a valid float string', () => {
    expect(parseNumericInput('3.5')).toBe(3.5)
  })

  it('parses "0" to 0', () => {
    expect(parseNumericInput('0')).toBe(0)
  })

  it('parses negative numbers', () => {
    expect(parseNumericInput('-5')).toBe(-5)
  })

  it('returns default fallback (0) for non-numeric string', () => {
    expect(parseNumericInput('abc')).toBe(0)
  })

  it('returns default fallback (0) for empty string', () => {
    expect(parseNumericInput('')).toBe(0)
  })

  it('returns custom fallback for invalid input', () => {
    expect(parseNumericInput('bad', 99)).toBe(99)
  })

  it('uses fallback 0 when not specified', () => {
    expect(parseNumericInput('nope')).toBe(0)
  })
})

// ─── parseIntegerInput ────────────────────────────────────────────────────────

describe('parseIntegerInput', () => {
  it('parses a valid integer string', () => {
    expect(parseIntegerInput('5')).toBe(5)
  })

  it('truncates float strings to integer', () => {
    expect(parseIntegerInput('3.9')).toBe(3)
  })

  it('parses "0" to 0', () => {
    expect(parseIntegerInput('0')).toBe(0)
  })

  it('returns default fallback (0) for non-numeric string', () => {
    expect(parseIntegerInput('abc')).toBe(0)
  })

  it('returns default fallback (0) for empty string', () => {
    expect(parseIntegerInput('')).toBe(0)
  })

  it('returns custom fallback for invalid input', () => {
    expect(parseIntegerInput('bad', 1)).toBe(1)
  })

  it('parses negative integers', () => {
    expect(parseIntegerInput('-3')).toBe(-3)
  })
})

// ─── formatRelativeDate ───────────────────────────────────────────────────────

describe('formatRelativeDate', () => {
  it('returns "aujourd\'hui" for a date less than 24h ago', () => {
    const now = new Date()
    expect(formatRelativeDate(now)).toBe("aujourd'hui")
  })

  it('returns "hier" for a date exactly 24h ago', () => {
    const yesterday = new Date(Date.now() - 24 * 3600 * 1000 - 1)
    expect(formatRelativeDate(yesterday)).toBe('hier')
  })

  it('returns "il y a N jours" for older dates', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 3600 * 1000 - 1)
    expect(formatRelativeDate(threeDaysAgo)).toBe('il y a 3 jours')
  })

  it('returns "il y a 7 jours" for a week ago', () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000 - 1)
    expect(formatRelativeDate(weekAgo)).toBe('il y a 7 jours')
  })

  it('returns "aujourd\'hui" for dates a few minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeDate(fiveMinutesAgo)).toBe("aujourd'hui")
  })
})
