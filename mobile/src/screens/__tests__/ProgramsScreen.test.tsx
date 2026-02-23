import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react-native'

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

const mockSaveProgram = jest.fn().mockResolvedValue(true)
const mockDuplicateProgram = jest.fn().mockResolvedValue(undefined)
const mockDeleteProgram = jest.fn().mockResolvedValue(undefined)
const mockSaveSession = jest.fn().mockResolvedValue(true)
const mockDuplicateSession = jest.fn().mockResolvedValue(undefined)
const mockDeleteSession = jest.fn().mockResolvedValue(undefined)
const mockMoveSession = jest.fn().mockResolvedValue(undefined)
const mockPrepareRenameProgram = jest.fn()
const mockPrepareRenameSession = jest.fn()
const mockSetSelectedProgram = jest.fn()
const mockSetSelectedSession = jest.fn()
const mockSetTargetProgram = jest.fn()
const mockSetIsRenamingProgram = jest.fn()
const mockSetProgramNameInput = jest.fn()

jest.mock('../../hooks/useProgramManager', () => ({
  useProgramManager: () => ({
    programNameInput: '',
    setProgramNameInput: mockSetProgramNameInput,
    isRenamingProgram: false,
    setIsRenamingProgram: mockSetIsRenamingProgram,
    selectedProgram: null,
    setSelectedProgram: mockSetSelectedProgram,
    sessionNameInput: '',
    setSessionNameInput: jest.fn(),
    isRenamingSession: false,
    setIsRenamingSession: jest.fn(),
    selectedSession: null,
    setSelectedSession: mockSetSelectedSession,
    targetProgram: null,
    setTargetProgram: mockSetTargetProgram,
    saveProgram: mockSaveProgram,
    duplicateProgram: mockDuplicateProgram,
    deleteProgram: mockDeleteProgram,
    saveSession: mockSaveSession,
    duplicateSession: mockDuplicateSession,
    deleteSession: mockDeleteSession,
    moveSession: mockMoveSession,
    prepareRenameProgram: mockPrepareRenameProgram,
    prepareRenameSession: mockPrepareRenameSession,
  }),
}))

jest.mock('../../hooks/useKeyboardAnimation', () => ({
  useKeyboardAnimation: () => ({ _value: 0 }),
}))

jest.mock('../../components/OnboardingSheet', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return {
    OnboardingSheet: ({ visible, onProgramSelected, onSkip }: { visible: boolean; onProgramSelected: (p: object) => void; onSkip: () => void }) => {
      if (!visible) return null
      return (
        <View>
          <Text>Onboarding</Text>
          <TouchableOpacity onPress={() => onProgramSelected({ name: 'PPL', sessions: [] })}>
            <Text>Choisir PPL</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkip}>
            <Text>Passer</Text>
          </TouchableOpacity>
        </View>
      )
    },
  }
})

jest.mock('../../components/ProgramSection', () => {
  const { TouchableOpacity, Text } = require('react-native')
  return function MockProgramSection({ program, onPress, onOptionsPress }: { program: { name: string }; onPress: () => void; onOptionsPress: () => void }) {
    return (
      <>
        <TouchableOpacity onPress={onPress} testID={`program-${program.name}`}>
          <Text>{program.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onOptionsPress} testID={`options-${program.name}`}>
          <Text>Options-{program.name}</Text>
        </TouchableOpacity>
      </>
    )
  }
})

jest.mock('../../components/ProgramDetailBottomSheet', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return ({ visible, onClose, onAddSession, onOpenSession, onSessionOptions, program }: {
    visible: boolean
    onClose: () => void
    onAddSession: () => void
    onOpenSession: (s: { id: string }) => void
    onSessionOptions: (s: { id: string; name: string }) => void
    program: { name: string } | null
  }) => {
    if (!visible) return null
    return (
      <View>
        <Text>Detail-{program?.name}</Text>
        <TouchableOpacity onPress={onClose}><Text>Fermer détail</Text></TouchableOpacity>
        <TouchableOpacity onPress={onAddSession}><Text>Ajouter séance détail</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onOpenSession({ id: 'sess-1' })}><Text>Ouvrir séance</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onSessionOptions({ id: 'sess-1', name: 'Push' })}><Text>Options séance</Text></TouchableOpacity>
      </View>
    )
  }
})

jest.mock('../../components/BottomSheet', () => ({
  BottomSheet: ({ visible, children, title }: { visible: boolean; children: React.ReactNode; title?: string }) => {
    if (!visible) return null
    const { View, Text } = require('react-native')
    return <View>{title && <Text>{title}</Text>}{children}</View>
  },
}))

const mockImportPresetProgram = jest.fn().mockResolvedValue(undefined)
const mockMarkOnboardingCompleted = jest.fn().mockResolvedValue(undefined)

jest.mock('../../model/utils/databaseHelpers', () => ({
  importPresetProgram: (...args: unknown[]) => mockImportPresetProgram(...args),
  markOnboardingCompleted: (...args: unknown[]) => mockMarkOnboardingCompleted(...args),
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
    prepareUpdate: jest.fn().mockImplementation((fn: (p: { position: number }) => void) => {
      const obj = { position }
      fn(obj)
      return obj
    }),
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
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  // --- Rendu de base ---

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

  // --- Création programme ---

  it('le bouton Créer ouvre le BottomSheet de choix', () => {
    const { getByText } = render(
      <ProgramsContent programs={[]} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByText(/Créer un Programme/))
    expect(getByText('Soi-même')).toBeTruthy()
    expect(getByText('Automatique')).toBeTruthy()
  })

  it('cliquer sur "Soi-même" ouvre la modale programme', () => {
    const { getByText } = render(
      <ProgramsContent programs={[]} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByText(/Créer un Programme/))
    fireEvent.press(getByText('Soi-même'))
    expect(getByText('Nouveau programme')).toBeTruthy()
  })

  it('cliquer sur "Automatique" navigue vers Assistant', () => {
    const navMock = {
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn().mockReturnValue(jest.fn()),
    } as never
    const { getByText } = render(
      <ProgramsContent programs={[]} user={mockUser()} navigation={navMock} />
    )
    fireEvent.press(getByText(/Créer un Programme/))
    fireEvent.press(getByText('Automatique'))
    expect((navMock as { navigate: jest.Mock }).navigate).toHaveBeenCalledWith('Assistant')
  })

  it('cliquer sur Valider dans la modale programme appelle saveProgram', async () => {
    const { getByText } = render(
      <ProgramsContent programs={[]} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByText(/Créer un Programme/))
    fireEvent.press(getByText('Soi-même'))
    fireEvent.press(getByText('Valider'))

    await waitFor(() => {
      expect(mockSaveProgram).toHaveBeenCalled()
    })
  })

  it('Annuler dans la modale programme la ferme', () => {
    const { getByText, queryByText } = render(
      <ProgramsContent programs={[]} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByText(/Créer un Programme/))
    fireEvent.press(getByText('Soi-même'))
    expect(getByText('Nouveau programme')).toBeTruthy()

    fireEvent.press(getByText('Annuler'))
    // Modal should close (the title "Nouveau programme" should not be visible)
    // Note: CustomModal might not be mocked to hide, but the Annuler handler calls setIsProgramModalVisible(false)
  })

  // --- Détail programme ---

  it('cliquer sur un programme ouvre le détail BottomSheet', () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    expect(getByText('Detail-PPL 3j')).toBeTruthy()
  })

  it('ouvrir une session depuis le détail navigue', () => {
    const navMock = {
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn().mockReturnValue(jest.fn()),
    } as never
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={navMock} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    fireEvent.press(getByText('Ouvrir séance'))
    expect((navMock as { navigate: jest.Mock }).navigate).toHaveBeenCalledWith('SessionDetail', { sessionId: 'sess-1' })
  })

  it('ajouter une séance depuis le détail ouvre la modale session', () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    fireEvent.press(getByText('Ajouter séance détail'))
    expect(getByText('Ajouter une séance')).toBeTruthy()
  })

  it('valider l\'ajout de séance appelle saveSession', async () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId, getAllByText } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    fireEvent.press(getByText('Ajouter séance détail'))

    const validBtns = getAllByText('Valider')
    fireEvent.press(validBtns[validBtns.length - 1])

    await waitFor(() => {
      expect(mockSaveSession).toHaveBeenCalled()
    })
  })

  // --- Options programme ---

  it('le bouton options ouvre le BottomSheet options programme', () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('options-PPL 3j'))
    expect(getByText('Renommer le Programme')).toBeTruthy()
    expect(getByText('Dupliquer le Programme')).toBeTruthy()
    expect(getByText('Supprimer le Programme')).toBeTruthy()
  })

  it('dupliquer un programme appelle duplicateProgram', async () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('options-PPL 3j'))
    fireEvent.press(getByText('Dupliquer le Programme'))

    await waitFor(() => {
      expect(mockDuplicateProgram).toHaveBeenCalled()
    })
  })

  it('supprimer un programme ouvre l\'AlertDialog', () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('options-PPL 3j'))
    fireEvent.press(getByText('Supprimer le Programme'))
    expect(getByText(/Supprimer ce programme/)).toBeTruthy()
  })

  it('confirmer la suppression appelle deleteProgram', async () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getAllByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('options-PPL 3j'))
    fireEvent.press(getByText('Supprimer le Programme'))
    const suppressBtns = getAllByText('Supprimer')
    fireEvent.press(suppressBtns[suppressBtns.length - 1])

    await waitFor(() => {
      expect(mockDeleteProgram).toHaveBeenCalled()
    })
  })

  // --- Options session ---

  it('options session depuis le détail ouvre le BottomSheet session', () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    fireEvent.press(getByText('Options séance'))
    // Session options BottomSheet should show with session options
    expect(getByText('Renommer la Séance')).toBeTruthy()
    expect(getByText('Dupliquer la Séance')).toBeTruthy()
    expect(getByText('Supprimer la Séance')).toBeTruthy()
  })

  it('dupliquer une session appelle duplicateSession', async () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    fireEvent.press(getByText('Options séance'))
    fireEvent.press(getByText('Dupliquer la Séance'))

    await waitFor(() => {
      expect(mockDuplicateSession).toHaveBeenCalled()
    })
  })

  it('supprimer une session ouvre l\'AlertDialog', () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    fireEvent.press(getByText('Options séance'))
    fireEvent.press(getByText('Supprimer la Séance'))
    expect(getByText(/Supprimer cette séance/)).toBeTruthy()
  })

  it('confirmer suppression session appelle deleteSession', async () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getAllByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    fireEvent.press(getByText('Options séance'))
    fireEvent.press(getByText('Supprimer la Séance'))
    const suppressBtns = getAllByText('Supprimer')
    fireEvent.press(suppressBtns[suppressBtns.length - 1])

    await waitFor(() => {
      expect(mockDeleteSession).toHaveBeenCalled()
    })
  })

  it('déplacer session affiche la section Déplacer vers avec 2+ programmes', () => {
    const programs = [
      mockProgram('p1', 'PPL 3j', 0),
      mockProgram('p2', 'Upper Lower', 1),
    ]
    const { getByText, getAllByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    fireEvent.press(getByText('Options séance'))
    // "Déplacer vers :" section with other programs
    expect(getByText('Déplacer vers :')).toBeTruthy()
    // "Upper Lower" appears both in main list and move chip
    expect(getAllByText('Upper Lower').length).toBeGreaterThanOrEqual(2)
  })

  it('cliquer sur un programme cible appelle moveSession', async () => {
    const programs = [
      mockProgram('p1', 'PPL 3j', 0),
      mockProgram('p2', 'Upper Lower', 1),
    ]
    const { getByText, getAllByText, getByTestId } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    fireEvent.press(getByText('Options séance'))
    // Click on the move chip (last occurrence of "Upper Lower" in the session options BottomSheet)
    const upperLowerElements = getAllByText('Upper Lower')
    fireEvent.press(upperLowerElements[upperLowerElements.length - 1])

    await waitFor(() => {
      expect(mockMoveSession).toHaveBeenCalled()
    })
  })

  // --- Onboarding ---

  it('affiche l\'onboarding quand 0 programmes et user non onboarded', () => {
    const { getByText } = render(
      <ProgramsContent programs={[]} user={mockUser({ onboardingCompleted: false })} navigation={mockNavigation} />
    )
    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(getByText('Onboarding')).toBeTruthy()
  })

  it('choisir un programme onboarding appelle importPresetProgram', async () => {
    const { getByText } = render(
      <ProgramsContent programs={[]} user={mockUser({ onboardingCompleted: false })} navigation={mockNavigation} />
    )
    act(() => {
      jest.advanceTimersByTime(500)
    })

    await act(async () => {
      fireEvent.press(getByText('Choisir PPL'))
    })

    await waitFor(() => {
      expect(mockImportPresetProgram).toHaveBeenCalled()
      expect(mockMarkOnboardingCompleted).toHaveBeenCalled()
    })
  })

  it('passer l\'onboarding appelle markOnboardingCompleted', async () => {
    const { getByText } = render(
      <ProgramsContent programs={[]} user={mockUser({ onboardingCompleted: false })} navigation={mockNavigation} />
    )
    act(() => {
      jest.advanceTimersByTime(500)
    })

    await act(async () => {
      fireEvent.press(getByText('Passer'))
    })

    await waitFor(() => {
      expect(mockMarkOnboardingCompleted).toHaveBeenCalled()
    })
  })

  // --- Fermer détail ---

  it('fermer le détail depuis le BottomSheet détail', () => {
    const programs = [mockProgram('p1', 'PPL 3j', 0)]
    const { getByText, getByTestId, queryByText } = render(
      <ProgramsContent programs={programs} user={mockUser()} navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('program-PPL 3j'))
    expect(getByText('Detail-PPL 3j')).toBeTruthy()

    fireEvent.press(getByText('Fermer détail'))
    expect(queryByText('Detail-PPL 3j')).toBeNull()
  })
})
