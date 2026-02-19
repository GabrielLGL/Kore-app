import React from 'react'
import { render, act } from '@testing-library/react-native'
import { SettingsContent } from '../SettingsScreen'

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Error: 'Error' },
}))

jest.mock('../../model/index', () => ({
  database: {
    write: jest.fn(),
    get: jest.fn(),
  },
}))

jest.mock('../../services/ai/aiService', () => ({
  testProviderConnection: jest.fn(),
}))

const makeUser = (overrides = {}) => ({
  restDuration: 90,
  timerEnabled: true,
  aiProvider: 'offline',
  aiApiKey: null,
  update: jest.fn(),
  ...overrides,
})

describe('SettingsContent — state sync', () => {
  it('affiche les valeurs initiales du user', () => {
    const user = makeUser({ restDuration: 120, timerEnabled: false })
    const { getByDisplayValue } = render(<SettingsContent user={user as never} />)
    expect(getByDisplayValue('120')).toBeTruthy()
  })

  it('re-synchronise les états locaux quand le prop user change', () => {
    const user1 = makeUser({ restDuration: 90 })
    const { getByDisplayValue, rerender } = render(
      <SettingsContent user={user1 as never} />
    )
    expect(getByDisplayValue('90')).toBeTruthy()

    const user2 = makeUser({ restDuration: 180 })
    act(() => {
      rerender(<SettingsContent user={user2 as never} />)
    })

    expect(getByDisplayValue('180')).toBeTruthy()
  })

  it('gère un user null sans crash', () => {
    expect(() => render(<SettingsContent user={null} />)).not.toThrow()
  })
})
