import React from 'react'
import { render } from '@testing-library/react-native'

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Error: 'Error' },
}))

jest.mock('../../model/index', () => ({
  database: { write: jest.fn(), get: jest.fn() },
}))

jest.mock('@gorhom/portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => children,
  PortalProvider: ({ children }: { children: React.ReactNode }) => children,
  PortalHost: () => null,
}))

jest.mock('../../services/ai/aiService', () => ({
  generatePlan: jest.fn().mockResolvedValue({ plan: null, usedFallback: false }),
}))

jest.mock('../../model/utils/databaseHelpers', () => ({
  importGeneratedPlan: jest.fn().mockResolvedValue(undefined),
  importGeneratedSession: jest.fn().mockResolvedValue({ id: 's1' }),
}))

jest.mock('../../components/AssistantPreviewSheet', () => ({
  AssistantPreviewSheet: () => null,
}))

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))

import { AssistantScreenInner } from '../AssistantScreen'

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as never

const mockUser = (overrides = {}) =>
  ({
    id: 'u1',
    name: 'Test',
    aiProvider: 'offline',
    aiApiKey: null,
    ...overrides,
  }) as never

const mockProgram = (id: string, name: string) =>
  ({ id, name }) as never

describe('AssistantScreenInner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rend sans crash avec user et programmes', () => {
    const { getByText } = render(
      <AssistantScreenInner
        programs={[mockProgram('p1', 'PPL')]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )
    expect(getByText(/Que veux-tu générer/)).toBeTruthy()
  })

  it('rend avec user null sans crash', () => {
    expect(() =>
      render(
        <AssistantScreenInner programs={[]} user={null} navigation={mockNavigation} />
      )
    ).not.toThrow()
  })

  it('affiche la première question du wizard', () => {
    const { getByText } = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )
    expect(getByText('Que veux-tu générer ?')).toBeTruthy()
  })

  it('affiche les options Programme complet et Séance du jour', () => {
    const { getByText } = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )
    expect(getByText('Programme complet')).toBeTruthy()
    expect(getByText('Séance du jour')).toBeTruthy()
  })

  it('affiche le badge provider Offline', () => {
    const { getByText } = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )
    expect(getByText(/Offline/)).toBeTruthy()
  })

  it('affiche le compteur d\'étapes', () => {
    const { getByText } = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )
    // Step 1 of total steps
    expect(getByText(/1 \//)).toBeTruthy()
  })
})
