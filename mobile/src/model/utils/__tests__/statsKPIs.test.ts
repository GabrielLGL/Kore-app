/**
 * Tests for statsKPIs.ts — pure functions, no mocks needed.
 */
import {
  computeGlobalKPIs,
  computeCurrentStreak,
  computeRecordStreak,
  computeMotivationalPhrase,
} from '../statsKPIs'
import type History from '../../models/History'
import type WorkoutSet from '../../models/Set'

// ─── Mock builders ────────────────────────────────────────────────────────────

function h(
  id: string,
  startTime: Date,
  options: { deletedAt?: Date } = {}
): History {
  return {
    id,
    startTime,
    deletedAt: options.deletedAt ?? null,
  } as unknown as History
}

function s(
  id: string,
  historyId: string,
  weight: number,
  reps: number,
  options: { isPr?: boolean; createdAt?: Date } = {}
): WorkoutSet {
  return {
    id,
    history: { id: historyId },
    weight,
    reps,
    isPr: options.isPr ?? false,
    createdAt: options.createdAt ?? new Date(),
  } as unknown as WorkoutSet
}

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

// ─── computeGlobalKPIs ────────────────────────────────────────────────────────

describe('computeGlobalKPIs', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns zeros for empty inputs', () => {
    expect(computeGlobalKPIs([], [])).toEqual({
      totalSessions: 0,
      totalVolumeKg: 0,
      totalPRs: 0,
    })
  })

  it('counts only non-deleted histories as sessions', () => {
    const histories = [
      h('h1', new Date()),
      h('h2', new Date(), { deletedAt: new Date() }),
    ]
    expect(computeGlobalKPIs(histories, []).totalSessions).toBe(1)
  })

  it('calculates volume as weight × reps sum', () => {
    const histories = [h('h1', new Date())]
    const sets = [
      s('s1', 'h1', 100, 10), // 1000 kg
      s('s2', 'h1', 50, 5),   // 250 kg
    ]
    expect(computeGlobalKPIs(histories, sets).totalVolumeKg).toBe(1250)
  })

  it('excludes sets from deleted histories', () => {
    const histories = [h('h1', new Date(), { deletedAt: new Date() })]
    const sets = [s('s1', 'h1', 100, 10)]
    expect(computeGlobalKPIs(histories, sets).totalVolumeKg).toBe(0)
  })

  it('counts PR sets from active histories', () => {
    const histories = [h('h1', new Date())]
    const sets = [
      s('s1', 'h1', 100, 1, { isPr: true }),
      s('s2', 'h1', 50, 5, { isPr: false }),
    ]
    expect(computeGlobalKPIs(histories, sets).totalPRs).toBe(1)
  })
})

// ─── computeCurrentStreak ─────────────────────────────────────────────────────

describe('computeCurrentStreak', () => {
  it('returns 0 for empty histories', () => {
    expect(computeCurrentStreak([])).toBe(0)
  })

  it('returns 0 for all-deleted histories', () => {
    const histories = [h('h1', new Date(), { deletedAt: new Date() })]
    expect(computeCurrentStreak(histories)).toBe(0)
  })

  it('returns 1 for a session today', () => {
    expect(computeCurrentStreak([h('h1', daysAgo(0))])).toBe(1)
  })

  it('returns 1 for a session yesterday only', () => {
    expect(computeCurrentStreak([h('h1', daysAgo(1))])).toBe(1)
  })

  it('returns 0 if last session was 2+ days ago', () => {
    expect(computeCurrentStreak([h('h1', daysAgo(2))])).toBe(0)
  })

  it('counts consecutive days from today', () => {
    const histories = [h('h1', daysAgo(0)), h('h2', daysAgo(1)), h('h3', daysAgo(2))]
    expect(computeCurrentStreak(histories)).toBe(3)
  })

  it('breaks streak on a gap', () => {
    const histories = [h('h1', daysAgo(0)), h('h2', daysAgo(1)), h('h3', daysAgo(3))]
    expect(computeCurrentStreak(histories)).toBe(2)
  })
})

// ─── computeRecordStreak ──────────────────────────────────────────────────────

describe('computeRecordStreak', () => {
  it('returns 0 for empty histories', () => {
    expect(computeRecordStreak([])).toBe(0)
  })

  it('returns 1 for a single session', () => {
    expect(computeRecordStreak([h('h1', new Date(2026, 0, 1))])).toBe(1)
  })

  it('returns 1 for non-consecutive sessions', () => {
    const histories = [
      h('h1', new Date(2026, 0, 1)),
      h('h2', new Date(2026, 0, 3)),
      h('h3', new Date(2026, 0, 5)),
    ]
    expect(computeRecordStreak(histories)).toBe(1)
  })

  it('finds the longest consecutive streak', () => {
    const histories = [
      h('h1', new Date(2026, 0, 1)),
      h('h2', new Date(2026, 0, 2)),
      h('h3', new Date(2026, 0, 3)),
      h('h4', new Date(2026, 0, 5)), // gap
      h('h5', new Date(2026, 0, 6)),
    ]
    expect(computeRecordStreak(histories)).toBe(3)
  })

  it('handles multiple sessions on the same day (treats as 1)', () => {
    const d = new Date(2026, 0, 1)
    const histories = [h('h1', d), h('h2', d), h('h3', new Date(2026, 0, 2))]
    // Two same-day entries + next day → streak of 2 consecutive days
    expect(computeRecordStreak(histories)).toBe(2)
  })
})

// ─── computeMotivationalPhrase ────────────────────────────────────────────────

describe('computeMotivationalPhrase', () => {
  it('returns a non-empty string for empty data', () => {
    expect(computeMotivationalPhrase([], [])).toBeTruthy()
  })

  it('returns default volume phrase when no conditions apply', () => {
    const twoDaysAgo = daysAgo(2)
    const result = computeMotivationalPhrase([h('h1', twoDaysAgo)], [])
    expect(result).toContain('Ce mois')
  })

  it('returns streak phrase when streak >= 3', () => {
    const histories = [h('h1', daysAgo(0)), h('h2', daysAgo(1)), h('h3', daysAgo(2))]
    const result = computeMotivationalPhrase(histories, [])
    expect(result).toContain('3 jours consécutifs')
  })

  it('returns PR phrase when a PR happened this week (no streak >= 3)', () => {
    const yesterday = daysAgo(1)
    const history = h('h1', yesterday)
    const recentPR = s('s1', 'h1', 100, 5, { isPr: true, createdAt: yesterday })
    const result = computeMotivationalPhrase([history], [recentPR])
    expect(result).toContain('record')
  })

  it('returns comeback phrase when last session was > 4 days ago', () => {
    const result = computeMotivationalPhrase([h('h1', daysAgo(6))], [])
    expect(result).toContain('De retour après')
    expect(result).toContain('6 jours')
  })

  it('ignores deleted histories in streak calculation', () => {
    const histories = [
      h('h1', daysAgo(0), { deletedAt: new Date() }),
      h('h2', daysAgo(1), { deletedAt: new Date() }),
      h('h3', daysAgo(2), { deletedAt: new Date() }),
    ]
    const result = computeMotivationalPhrase(histories, [])
    // Streak should be 0, so no streak phrase
    expect(result).not.toContain('jours consécutifs')
  })
})
