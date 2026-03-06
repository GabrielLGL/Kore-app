// ─── Stats — Date Utilities ───────────────────────────────────────────────────

import type { StatsPeriod } from './statsTypes'

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function getPeriodStart(period: StatsPeriod): number {
  if (period === 'all') return 0
  const days = period === '1m' ? 30 : 90
  return Date.now() - days * 24 * 60 * 60 * 1000
}
