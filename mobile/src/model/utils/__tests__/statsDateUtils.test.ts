/**
 * Tests for statsDateUtils.ts — pure functions, no mocks needed.
 */
import { toDateKey, labelToPeriod, getPeriodStart } from '../statsDateUtils'

// ─── toDateKey ────────────────────────────────────────────────────────────────

describe('toDateKey', () => {
  it('formats date as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 1, 22))).toBe('2026-02-22')
  })

  it('pads single-digit month and day with leading zeros', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('handles December correctly (month index 11)', () => {
    expect(toDateKey(new Date(2026, 11, 31))).toBe('2026-12-31')
  })

  it('handles first day of year', () => {
    expect(toDateKey(new Date(2025, 0, 1))).toBe('2025-01-01')
  })

  it('handles middle of year', () => {
    expect(toDateKey(new Date(2024, 6, 4))).toBe('2024-07-04')
  })
})

// ─── labelToPeriod ────────────────────────────────────────────────────────────

describe('labelToPeriod', () => {
  it('returns "1m" by default for unrecognised label', () => {
    expect(labelToPeriod('unknown')).toBe('1m')
  })

  it('returns "1m" for null', () => {
    expect(labelToPeriod(null)).toBe('1m')
  })

  it('returns "3m" for "3 mois"', () => {
    expect(labelToPeriod('3 mois')).toBe('3m')
  })

  it('returns "all" for "Tout"', () => {
    expect(labelToPeriod('Tout')).toBe('all')
  })

  it('returns "1m" for empty string', () => {
    expect(labelToPeriod('')).toBe('1m')
  })
})

// ─── getPeriodStart ───────────────────────────────────────────────────────────

describe('getPeriodStart', () => {
  it('returns 0 for "all" period', () => {
    expect(getPeriodStart('all')).toBe(0)
  })

  it('returns approximately 30 days ago for "1m"', () => {
    const before = Date.now()
    const result = getPeriodStart('1m')
    const after = Date.now()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    expect(result).toBeGreaterThanOrEqual(before - thirtyDaysMs - 100)
    expect(result).toBeLessThanOrEqual(after - thirtyDaysMs + 100)
  })

  it('returns approximately 90 days ago for "3m"', () => {
    const before = Date.now()
    const result = getPeriodStart('3m')
    const after = Date.now()
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000
    expect(result).toBeGreaterThanOrEqual(before - ninetyDaysMs - 100)
    expect(result).toBeLessThanOrEqual(after - ninetyDaysMs + 100)
  })

  it('"3m" period start is earlier than "1m" period start', () => {
    expect(getPeriodStart('3m')).toBeLessThan(getPeriodStart('1m'))
  })
})
