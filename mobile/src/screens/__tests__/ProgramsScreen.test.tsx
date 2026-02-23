import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Error: 'Error' },
}))

jest.mock('../../model/index', () => ({
  database: {
    write: jest.fn().mockImplementation(async (fn: () => Promise<void>) => fn()),
    get: jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        fetch: jest.fn().mockResolvedValue([]),
      }),
    }),
    batch: jest.fn().mockResolvedValue(undefined),
  },
}))

jest.mock('react-native-draggable-flatlist', () => {
  const { FlatList } = require('react-native')
  return {
    __esModule: true,
    default: FlatList,
    ScaleDecorator: ({ children }: { children: React.ReactNode }) => children,
  }
})

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('@gorhom/portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => children,
  PortalProvider: ({ children }: { children: React.ReactNode }) => children,
  PortalHost: () => null,
}))

jest.mock('../../hooks/useProgramManager', () => ({
  useProgramManager: () => ({
    programNameInput: '',
    setProgramNameInput: jest.fn(),
    isRenamingProgram: false,
    setIsRenamingProgram: jest.fn(),
    selectedProgram: null,
    setSelectedProgram: jest.fn(),
    sessionNameInput: '',
    setSessionNameInput: jest.fn(),
    isRenamingSession: false,
    setIsRenamingSession: jest.fn(),
    selectedSession: null,
    setSelectedSession: jest.fn(),
    targetProgram: null,
    setTargetProgram: jest.fn(),
    saveProgram: jest.fn().mockResolvedValue(true),
    duplicateProgram: jest.fn().mockResolvedValue(undefined),
    deleteProgram: jest.fn().mockResolvedValue(undefined),
    saveSession: jest.fn().mockResolvedValue(true),
    duplicateSession: jest.fn().mockResolvedValue(undefined),
    deleteSession: jest.fn().mockResolvedValue(undefined),
    moveSession: jest.fn().mockResolvedValue(undefined),
    prepareRenameProgram: jest.fn(),
    prepareRenameSession: jest.fn(),
  }),
}))

jest.mock('../../hooks/useKeyboardAnimation', () => ({
  useKeyboardAnimation: () => ({ _value: 0 }),
}))

jest.mock('../../components/OnboardingSheet', () => ({
  OnboardingSheet: () => null,
}))

jest.mock('../../components/ProgramSection', () => {
  const { Text } = require('react-native')
  return function MockProgramSection({ program }: { program: { name: string } }) {
    return <Text>{program.name}</Text>
  }
})

jest.mock('../../components/ProgramDetailBottomSheet', () => () => null)

jest.mock('../../components/BottomSheet', () => ({
  BottomSheet: ({ visible, children, title }: { visible: boolean; children: React.ReactNode; title?: string }) => {
    if (!visible) return null
    const { View, Text } = require('react-native')
    return <View>{title && <Text>{title}</Text>}{children}</View>
  },
}))

jest.mock('../../model/utils/databaseHelpers', () => ({
  importPresetProgram: jest.fn().mockResolvedValue(undefined),
  markOnboardingCompleted: jest.fn().mockResolvedValue(undefined),
}))

import { ProgramsContent } from '../ProgramsScreen'

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn().mockReturnValue(jest.fn()),
} as never

const mockProgram = (id: string, name: string, position: number) =>
  ({
    id,
    name,
    position,
    prepareUpdate: jest.fn(),
    sessions: { observe: () => ({ subscribe: (cb: (val: never[]) => void) => { cb([]); return { unsubscribe: jest.fn() } } }) },
  }) as never

const mockUser = (overrides = {}) =>
  ({
    id: 'u1',
    name: 'Test',
    onboardingCompleted: true,
    aiProvider: 'offline',
    ...overrides,
  }) as never

describe('ProgramsContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rend sans programmes sans crash', () => {
    const { getByText } = render(
      <ProgramsContent programs={[]} user={mockUser()} navigation={mockNavigation} />
    )
    expect(getByText(/Créer un Programme/)).toBeTruthy()
  })

  it('rend avec user null sans crash', () => {
    expect(() =>
      render(<ProgramsContent programs={[]} user={null} navigation={mockNavigation} />)
    ).not.toThrow()
  })

  it('affiche le bouton "Créer un Programme"', () => {
    const { getByText } = render(
      <ProgramsContent programs={[]} user={mockUser()} navigation={mockNavigation} />
    )
    expect(getByText(/Créer un Programme/)).toBeTruthy()
  })

  it('rend avec des programmes sans crash', () => {
    const programs = [
      mockProgram('p1', 'PPL 3j', 0),
      mockProgram('p2', 'Upper Lower', 1),
    ]
    const { getByText } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    expect(getByText('PPL 3j')).toBeTruthy()
    expect(getByText('Upper Lower')).toBeTruthy()
  })

  it('le bouton Créer ouvre le BottomSheet de choix', () => {
    const { getByText } = render(
      <ProgramsContent programs={[]} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByText(/Créer un Programme/))
    // Le BottomSheet "Créer un programme" devrait s'afficher
    expect(getByText('Soi-même')).toBeTruthy()
    expect(getByText('Automatique')).toBeTruthy()
  })
})
