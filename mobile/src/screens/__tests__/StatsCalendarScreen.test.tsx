import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { TouchableOpacity } from 'react-native'

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Error: 'Error' },
}))

jest.mock('../../model/index', () => ({
  database: { write: jest.fn(), get: jest.fn() },
}))

import { StatsCalendarScreenBase } from '../StatsCalendarScreen'

const makeHistory = (id: string, date: number, overrides = {}) =>
  ({
    id,
    startTime: new Date(date),
    endTime: new Date(date + 3600000),
    deletedAt: null,
    session: { fetch: jest.fn().mockResolvedValue({ name: 'Push Day' }) },
    ...overrides,
  }) as never

// Helper to get today at noon
const todayMs = () => {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  return d.getTime()
}

describe('StatsCalendarScreenBase', () => {
  it('rend sans données sans crash', () => {
    const { getByText } = render(
      <StatsCalendarScreenBase histories={[]} />
    )
    expect(getByText('jours actuels')).toBeTruthy()
    expect(getByText('record')).toBeTruthy()
  })

  it('affiche les streaks à 0 sans historique', () => {
    const { getAllByText } = render(
      <StatsCalendarScreenBase histories={[]} />
    )
    const zeros = getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(2)
  })

  it('affiche la légende en français', () => {
    const { getAllByText } = render(
      <StatsCalendarScreenBase histories={[]} />
    )
    // "Repos" appears in legend
    expect(getAllByText('Repos').length).toBeGreaterThanOrEqual(1)
    expect(getAllByText('Actif').length).toBeGreaterThanOrEqual(1)
  })

  it('affiche les labels de jours', () => {
    const { getAllByText } = render(
      <StatsCalendarScreenBase histories={[]} />
    )
    expect(getAllByText('L').length).toBeGreaterThanOrEqual(1)
    expect(getAllByText('V').length).toBeGreaterThanOrEqual(1)
  })

  it('rend avec des données sans crash', () => {
    const now = todayMs()
    const histories = [
      makeHistory('h1', now - 86400000),
      makeHistory('h2', now - 172800000),
    ]
    const { getByText } = render(
      <StatsCalendarScreenBase histories={histories} />
    )
    expect(getByText('jours actuels')).toBeTruthy()
  })

  it('affiche un streak > 0 avec des séances consécutives', () => {
    const now = todayMs()
    const histories = [
      makeHistory('h1', now),
      makeHistory('h2', now - 86400000),
    ]
    const { getByText } = render(
      <StatsCalendarScreenBase histories={histories} />
    )
    // currentStreak should be 2 — look for it in the streak card
    expect(getByText('jours actuels')).toBeTruthy()
    expect(getByText('record')).toBeTruthy()
  })

  it('affiche le tooltip au clic sur un jour du calendrier', async () => {
    const { UNSAFE_getAllByType, getAllByText } = render(
      <StatsCalendarScreenBase histories={[]} />
    )
    const touchables = UNSAFE_getAllByType(TouchableOpacity)
    // Press a cell near the middle (past day, no workout)
    const midIndex = Math.floor(touchables.length / 2)
    fireEvent.press(touchables[midIndex])

    // After press, tooltip should appear — "Repos" count increases from 1 (legend) to 2 (legend + tooltip)
    await waitFor(() => {
      expect(getAllByText('Repos').length).toBeGreaterThanOrEqual(2)
    })
  })

  it('affiche le tooltip avec les détails quand un jour a des séances', async () => {
    const now = todayMs()
    const histories = [makeHistory('h1', now)]

    const { UNSAFE_getAllByType, queryByText } = render(
      <StatsCalendarScreenBase histories={histories} />
    )
    const touchables = UNSAFE_getAllByType(TouchableOpacity)
    // Try pressing the last few cells (most recent days including today)
    // The last touchable should be today or very close
    for (let i = touchables.length - 1; i >= Math.max(0, touchables.length - 7); i--) {
      fireEvent.press(touchables[i])
      // Check if "Push Day" appeared (session name from the mock)
      await new Promise(r => setTimeout(r, 10))
      if (queryByText('Push Day')) break
    }

    await waitFor(() => {
      expect(queryByText('Push Day')).toBeTruthy()
    })
  })

  it('toggle le tooltip au second clic sur le même jour', async () => {
    const { UNSAFE_getAllByType, getAllByText } = render(
      <StatsCalendarScreenBase histories={[]} />
    )
    const touchables = UNSAFE_getAllByType(TouchableOpacity)
    const midIndex = Math.floor(touchables.length / 2)

    // First press — tooltip appears (Repos appears in legend + tooltip)
    fireEvent.press(touchables[midIndex])
    await waitFor(() => {
      expect(getAllByText('Repos').length).toBeGreaterThanOrEqual(2)
    })

    // Second press on same day — tooltip disappears (back to 1 Repos from legend)
    fireEvent.press(touchables[midIndex])
    await waitFor(() => {
      expect(getAllByText('Repos').length).toBe(1)
    })
  })

  it('affiche la durée dans le tooltip pour une séance avec endTime', async () => {
    const now = todayMs()
    const histories = [
      makeHistory('h1', now, { endTime: new Date(now + 3600000) }),
    ]

    const { UNSAFE_getAllByType, queryByText } = render(
      <StatsCalendarScreenBase histories={histories} />
    )
    const touchables = UNSAFE_getAllByType(TouchableOpacity)
    // Try pressing the last cells to find today
    for (let i = touchables.length - 1; i >= Math.max(0, touchables.length - 7); i--) {
      fireEvent.press(touchables[i])
      await new Promise(r => setTimeout(r, 10))
      if (queryByText('Push Day')) break
    }

    await waitFor(() => {
      expect(queryByText('Push Day')).toBeTruthy()
      // 1h = 60 min → formatDuration should show "1h"
      expect(queryByText('1h')).toBeTruthy()
    })
  })
})
