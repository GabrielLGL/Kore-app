/**
 * Tests for statsPRs.ts — pure functions, no mocks needed.
 */
import { computePRsByExercise, computeTopExercisesByFrequency } from '../statsPRs'
import type History from '../../models/History'
import type WorkoutSet from '../../models/Set'
import type Exercise from '../../models/Exercise'

// ─── Mock builders ────────────────────────────────────────────────────────────

function h(id: string, startTime: Date, options: { deletedAt?: Date } = {}): History {
  return { id, startTime, deletedAt: options.deletedAt ?? null } as unknown as History
}

function s(
  id: string,
  historyId: string,
  exerciseId: string,
  weight: number,
  reps: number,
  options: { isPr?: boolean; createdAt?: Date } = {}
): WorkoutSet {
  return {
    id,
    history: { id: historyId },
    exercise: { id: exerciseId },
    weight,
    reps,
    isPr: options.isPr ?? false,
    createdAt: options.createdAt ?? new Date(),
  } as unknown as WorkoutSet
}

function ex(id: string, name: string): Exercise {
  return { id, name } as unknown as Exercise
}

// ─── computePRsByExercise ─────────────────────────────────────────────────────

describe('computePRsByExercise', () => {
  it('returns empty when no PR sets exist', () => {
    const history = h('h1', new Date())
    const sets = [s('s1', 'h1', 'e1', 100, 10)]
    expect(computePRsByExercise(sets, [], [history])).toEqual([])
  })

  it('returns one entry per exercise (best weight wins)', () => {
    const squat = ex('e1', 'Squat')
    const history = h('h1', new Date())
    const sets = [
      s('s1', 'h1', 'e1', 100, 5, { isPr: true }),
      s('s2', 'h1', 'e1', 110, 3, { isPr: true }),
    ]
    const result = computePRsByExercise(sets, [squat], [history])
    expect(result).toHaveLength(1)
    expect(result[0].weight).toBe(110)
    expect(result[0].exerciseName).toBe('Squat')
  })

  it('uses higher reps when weight is equal', () => {
    const squat = ex('e1', 'Squat')
    const history = h('h1', new Date())
    const sets = [
      s('s1', 'h1', 'e1', 100, 5, { isPr: true }),
      s('s2', 'h1', 'e1', 100, 8, { isPr: true }),
    ]
    const result = computePRsByExercise(sets, [squat], [history])
    expect(result[0].reps).toBe(8)
  })

  it('calculates orm1 using Epley formula: weight * (1 + reps/30)', () => {
    const squat = ex('e1', 'Squat')
    const history = h('h1', new Date())
    const sets = [s('s1', 'h1', 'e1', 100, 10, { isPr: true })]
    const result = computePRsByExercise(sets, [squat], [history])
    expect(result[0].orm1).toBe(133) // Math.round(100 * (1 + 10/30))
  })

  it('uses exerciseId as fallback name when exercise not found', () => {
    const history = h('h1', new Date())
    const sets = [s('s1', 'h1', 'unknown-id', 100, 5, { isPr: true })]
    const result = computePRsByExercise(sets, [], [history])
    expect(result[0].exerciseName).toBe('unknown-id')
  })

  it('excludes sets from deleted histories', () => {
    const history = h('h1', new Date(), { deletedAt: new Date() })
    const sets = [s('s1', 'h1', 'e1', 100, 5, { isPr: true })]
    expect(computePRsByExercise(sets, [ex('e1', 'Squat')], [history])).toEqual([])
  })

  it('sorts result by date descending (most recent first)', () => {
    const squat = ex('e1', 'Squat')
    const bench = ex('e2', 'Bench')
    const history = h('h1', new Date())
    const older = new Date(2026, 0, 1)
    const newer = new Date(2026, 0, 5)
    const sets = [
      s('s1', 'h1', 'e1', 100, 5, { isPr: true, createdAt: older }),
      s('s2', 'h1', 'e2', 80, 5, { isPr: true, createdAt: newer }),
    ]
    const result = computePRsByExercise(sets, [squat, bench], [history])
    expect(result[0].exerciseName).toBe('Bench')
  })

  it('includes date field as numeric timestamp', () => {
    const squat = ex('e1', 'Squat')
    const history = h('h1', new Date())
    const createdAt = new Date(2026, 1, 1)
    const sets = [s('s1', 'h1', 'e1', 100, 5, { isPr: true, createdAt })]
    const result = computePRsByExercise(sets, [squat], [history])
    expect(result[0].date).toBe(createdAt.getTime())
  })
})

// ─── computeTopExercisesByFrequency ───────────────────────────────────────────

describe('computeTopExercisesByFrequency', () => {
  it('returns empty for no sets', () => {
    expect(computeTopExercisesByFrequency([], [], [])).toEqual([])
  })

  it('counts unique sessions per exercise (not raw sets)', () => {
    const squat = ex('e1', 'Squat')
    const h1 = h('h1', new Date(2026, 0, 1))
    const h2 = h('h2', new Date(2026, 0, 2))
    const sets = [
      s('s1', 'h1', 'e1', 100, 10),
      s('s2', 'h1', 'e1', 100, 10), // same session — not counted twice
      s('s3', 'h2', 'e1', 100, 10), // different session
    ]
    const result = computeTopExercisesByFrequency(sets, [squat], [h1, h2])
    expect(result[0].count).toBe(2)
    expect(result[0].exerciseName).toBe('Squat')
  })

  it('excludes sets from deleted histories', () => {
    const squat = ex('e1', 'Squat')
    const history = h('h1', new Date(), { deletedAt: new Date() })
    const sets = [s('s1', 'h1', 'e1', 100, 10)]
    expect(computeTopExercisesByFrequency(sets, [squat], [history])).toEqual([])
  })

  it('respects limit parameter', () => {
    const exercises = [ex('e1', 'A'), ex('e2', 'B'), ex('e3', 'C')]
    const history = h('h1', new Date())
    const sets = exercises.map((e, i) => s(`s${i}`, 'h1', e.id, 100, 10))
    expect(computeTopExercisesByFrequency(sets, exercises, [history], 2)).toHaveLength(2)
  })

  it('defaults to limit 5', () => {
    const exercises = Array.from({ length: 7 }, (_, i) => ex(`e${i}`, `Ex${i}`))
    const history = h('h1', new Date())
    const sets = exercises.map((e, i) => s(`s${i}`, 'h1', e.id, 100, 10))
    expect(computeTopExercisesByFrequency(sets, exercises, [history])).toHaveLength(5)
  })

  it('sorts by frequency descending', () => {
    const e1 = ex('e1', 'Squat')
    const e2 = ex('e2', 'Bench')
    const h1 = h('h1', new Date(2026, 0, 1))
    const h2 = h('h2', new Date(2026, 0, 2))
    const h3 = h('h3', new Date(2026, 0, 3))
    const sets = [
      // Squat: 3 sessions
      s('s1', 'h1', 'e1', 100, 10),
      s('s2', 'h2', 'e1', 100, 10),
      s('s3', 'h3', 'e1', 100, 10),
      // Bench: 1 session
      s('s4', 'h1', 'e2', 80, 10),
    ]
    const result = computeTopExercisesByFrequency(sets, [e1, e2], [h1, h2, h3])
    expect(result[0].exerciseName).toBe('Squat')
    expect(result[0].count).toBe(3)
    expect(result[1].exerciseName).toBe('Bench')
    expect(result[1].count).toBe(1)
  })
})
