/**
 * Tests for workoutSessionUtils.ts — DB-dependent functions, mocked.
 */
jest.mock('../../index', () => ({
  database: {
    get: jest.fn(),
    write: jest.fn(),
  },
}))

import {
  createWorkoutHistory,
  completeWorkoutHistory,
  updateHistoryNote,
  getLastSessionVolume,
} from '../workoutSessionUtils'
import { database } from '../../index'

const mockGet = database.get as jest.Mock
const mockWrite = database.write as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  mockWrite.mockImplementation((cb: () => Promise<unknown>) => cb())
})

// ─── createWorkoutHistory ─────────────────────────────────────────────────────

describe('createWorkoutHistory', () => {
  it('creates a history record inside database.write', async () => {
    const mockSession = { id: 'sess1' }
    const mockHistory = { id: 'h1' }
    const mockCreate = jest.fn().mockImplementation((cb: (r: Record<string, unknown>) => void) => {
      const record: Record<string, unknown> = { session: { set: jest.fn() }, startTime: null }
      cb(record)
      return mockHistory
    })
    const mockFind = jest.fn().mockResolvedValue(mockSession)

    mockGet.mockImplementation((collection: string) => {
      if (collection === 'sessions') return { find: mockFind }
      if (collection === 'histories') return { create: mockCreate }
      return {}
    })

    const result = await createWorkoutHistory('sess1', Date.now())
    expect(mockWrite).toHaveBeenCalled()
    expect(result).toBe(mockHistory)
  })

  it('uses Date.now() as default startTime', async () => {
    const mockSession = { id: 'sess1' }
    const capturedRecord: Record<string, unknown> = {}
    const mockCreate = jest.fn().mockImplementation((cb: (r: Record<string, unknown>) => void) => {
      const record: Record<string, unknown> = { session: { set: jest.fn() }, startTime: null }
      cb(record)
      Object.assign(capturedRecord, record)
      return record
    })
    mockGet.mockImplementation((collection: string) => {
      if (collection === 'sessions') return { find: jest.fn().mockResolvedValue(mockSession) }
      if (collection === 'histories') return { create: mockCreate }
      return {}
    })

    const before = Date.now()
    await createWorkoutHistory('sess1')
    const after = Date.now()

    const startTime = capturedRecord.startTime as Date
    expect(startTime.getTime()).toBeGreaterThanOrEqual(before)
    expect(startTime.getTime()).toBeLessThanOrEqual(after)
  })
})

// ─── completeWorkoutHistory ───────────────────────────────────────────────────

describe('completeWorkoutHistory', () => {
  it('updates endTime via database.write', async () => {
    const capturedUpdate: Record<string, unknown> = {}
    const mockUpdate = jest.fn().mockImplementation((cb: (h: Record<string, unknown>) => void) => {
      const record: Record<string, unknown> = { endTime: null }
      cb(record)
      Object.assign(capturedUpdate, record)
    })
    mockGet.mockReturnValue({ find: jest.fn().mockResolvedValue({ update: mockUpdate }) })

    const endTime = Date.now()
    await completeWorkoutHistory('h1', endTime)

    expect(mockWrite).toHaveBeenCalled()
    expect((capturedUpdate.endTime as Date).getTime()).toBe(endTime)
  })
})

// ─── updateHistoryNote ────────────────────────────────────────────────────────

describe('updateHistoryNote', () => {
  it('updates note via database.write', async () => {
    const capturedUpdate: Record<string, unknown> = {}
    const mockUpdate = jest.fn().mockImplementation((cb: (h: Record<string, unknown>) => void) => {
      const record: Record<string, unknown> = { note: null }
      cb(record)
      Object.assign(capturedUpdate, record)
    })
    mockGet.mockReturnValue({ find: jest.fn().mockResolvedValue({ update: mockUpdate }) })

    await updateHistoryNote('h1', 'Super séance !')
    expect(capturedUpdate.note).toBe('Super séance !')
  })
})

// ─── getLastSessionVolume ─────────────────────────────────────────────────────

describe('getLastSessionVolume', () => {
  it('returns null when no completed histories found', async () => {
    mockGet.mockReturnValue({ query: jest.fn().mockReturnValue({ fetch: jest.fn().mockResolvedValue([]) }) })
    expect(await getLastSessionVolume('sess1', 'h-current')).toBeNull()
  })

  it('returns null when histories exist but none are completed (endTime null)', async () => {
    const history = { id: 'h1', startTime: new Date(), endTime: null }
    mockGet.mockReturnValue({ query: jest.fn().mockReturnValue({ fetch: jest.fn().mockResolvedValue([history]) }) })
    expect(await getLastSessionVolume('sess1', 'h-current')).toBeNull()
  })

  it('returns volume for the most recent completed session', async () => {
    const history = {
      id: 'h1',
      startTime: new Date(2026, 0, 1),
      endTime: new Date(2026, 0, 1, 1),
    }
    const sets = [
      { weight: 100, reps: 10 }, // 1000
      { weight: 50, reps: 5 },   // 250
    ]

    let callCount = 0
    mockGet.mockImplementation((collection: string) => {
      if (collection === 'histories') {
        return { query: jest.fn().mockReturnValue({ fetch: jest.fn().mockResolvedValue([history]) }) }
      }
      if (collection === 'sets') {
        return { query: jest.fn().mockReturnValue({ fetch: jest.fn().mockResolvedValue(sets) }) }
      }
      return {}
    })

    const result = await getLastSessionVolume('sess1', 'h-other')
    expect(result).toBe(1250)
  })
})
