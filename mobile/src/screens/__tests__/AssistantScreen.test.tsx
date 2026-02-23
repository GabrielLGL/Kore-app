import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react-native'

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

const mockGeneratePlan = jest.fn().mockResolvedValue({ plan: null, usedFallback: false })

jest.mock('../../services/ai/aiService', () => ({
  generatePlan: (...args: unknown[]) => mockGeneratePlan(...args),
}))

jest.mock('../../model/utils/databaseHelpers', () => ({
  importGeneratedPlan: jest.fn().mockResolvedValue(undefined),
  importGeneratedSession: jest.fn().mockResolvedValue({ id: 's1' }),
}))

jest.mock('../../components/AssistantPreviewSheet', () => ({
  AssistantPreviewSheet: ({ visible, isLoading, onModify }: { visible: boolean; isLoading: boolean; onModify: () => void }) => {
    if (!visible) return null
    const { View, Text, TouchableOpacity } = require('react-native')
    return (
      <View>
        <Text>{isLoading ? 'Chargement...' : 'Preview'}</Text>
        <TouchableOpacity onPress={onModify}><Text>Modifier</Text></TouchableOpacity>
      </View>
    )
  },
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

// Helper to press an option and flush animation timers
const pressAndFlush = (element: ReturnType<typeof render>, text: string) => {
  fireEvent.press(element.getByText(text))
  act(() => { jest.runAllTimers() })
}

describe('AssistantScreenInner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
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
    expect(getByText(/1 \//)).toBeTruthy()
  })

  it('affiche le badge provider Gemini', () => {
    const { getByText } = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser({ aiProvider: 'gemini' })}
        navigation={mockNavigation}
      />
    )
    expect(getByText(/Gemini/)).toBeTruthy()
  })

  it('navigue à l\'étape suivante en sélectionnant Programme complet', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')

    expect(result.getByText('Quel est ton objectif ?')).toBeTruthy()
  })

  it('navigue à l\'étape objectif et affiche les options', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')

    expect(result.getByText('Bodybuilding')).toBeTruthy()
    expect(result.getByText('Power')).toBeTruthy()
    expect(result.getByText('Renfo')).toBeTruthy()
    expect(result.getByText('Cardio')).toBeTruthy()
  })

  it('passe de objectif à niveau', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')
    pressAndFlush(result, 'Bodybuilding')

    expect(result.getByText('Quel est ton niveau ?')).toBeTruthy()
    expect(result.getByText('Débutant')).toBeTruthy()
    expect(result.getByText('Intermédiaire')).toBeTruthy()
    expect(result.getByText('Avancé')).toBeTruthy()
  })

  it('passe au step équipement (multi-select) avec bouton Suivant', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')
    pressAndFlush(result, 'Bodybuilding')
    pressAndFlush(result, 'Intermédiaire')

    expect(result.getByText('Quel équipement as-tu ?')).toBeTruthy()
    expect(result.getByText('Haltères')).toBeTruthy()
    expect(result.getByText('Machines')).toBeTruthy()
    expect(result.getByText('Suivant →')).toBeTruthy()
  })

  it('toggle un équipement et avance avec Suivant', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')
    pressAndFlush(result, 'Bodybuilding')
    pressAndFlush(result, 'Intermédiaire')
    // Select equipment
    fireEvent.press(result.getByText('Haltères'))
    pressAndFlush(result, 'Suivant →')

    expect(result.getByText('Combien de temps par séance ?')).toBeTruthy()
  })

  it('bouton retour revient à l\'étape précédente', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')
    expect(result.getByText('Quel est ton objectif ?')).toBeTruthy()

    pressAndFlush(result, '←')
    expect(result.getByText('Que veux-tu générer ?')).toBeTruthy()
  })

  it('pas de bouton retour à l\'étape 1', () => {
    const { queryByText } = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    expect(queryByText('←')).toBeNull()
  })

  it('bouton Recommencer visible après step 1', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')
    expect(result.getByText('Recommencer')).toBeTruthy()
  })

  it('bouton Recommencer pas visible à l\'étape 1', () => {
    const { queryByText } = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    expect(queryByText('Recommencer')).toBeNull()
  })

  it('Recommencer reset le wizard si étape <= 2', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')
    fireEvent.press(result.getByText('Recommencer'))
    expect(result.getByText('Que veux-tu générer ?')).toBeTruthy()
  })

  it('Recommencer ouvre AlertDialog si étape > 2', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')
    pressAndFlush(result, 'Bodybuilding')
    pressAndFlush(result, 'Intermédiaire')
    // Now at step 4 (equipment), > 2
    fireEvent.press(result.getByText('Recommencer'))

    expect(result.getByText('Recommencer ?')).toBeTruthy()
    expect(result.getByText('Ta progression actuelle sera perdue.')).toBeTruthy()
  })

  it('confirmer Recommencer reset le wizard', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')
    pressAndFlush(result, 'Bodybuilding')
    pressAndFlush(result, 'Intermédiaire')
    fireEvent.press(result.getByText('Recommencer'))

    // Find the confirm button in AlertDialog
    const recommencerBtns = result.getAllByText('Recommencer')
    fireEvent.press(recommencerBtns[recommencerBtns.length - 1])

    expect(result.getByText('Que veux-tu générer ?')).toBeTruthy()
  })

  it('mode session : affiche les étapes muscle groups', () => {
    const result = render(
      <AssistantScreenInner
        programs={[mockProgram('p1', 'PPL')]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Séance du jour')
    pressAndFlush(result, 'Bodybuilding')
    pressAndFlush(result, 'Intermédiaire')

    // Equipment step
    fireEvent.press(result.getByText('Haltères'))
    pressAndFlush(result, 'Suivant →')

    // Duration
    pressAndFlush(result, '60 min')

    // Should show muscle groups
    expect(result.getByText('Quels groupes musculaires ?')).toBeTruthy()
    expect(result.getByText('Pecs')).toBeTruthy()
    expect(result.getByText('Dos')).toBeTruthy()
  })

  it('mode session : affiche sélection de programme cible', () => {
    const result = render(
      <AssistantScreenInner
        programs={[mockProgram('p1', 'PPL')]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Séance du jour')
    pressAndFlush(result, 'Bodybuilding')
    pressAndFlush(result, 'Intermédiaire')
    fireEvent.press(result.getByText('Haltères'))
    pressAndFlush(result, 'Suivant →')
    pressAndFlush(result, '60 min')
    // Muscle groups
    fireEvent.press(result.getByText('Pecs'))
    pressAndFlush(result, 'Suivant →')

    expect(result.getByText('Dans quel programme ?')).toBeTruthy()
    expect(result.getByText('PPL')).toBeTruthy()
  })

  it('mode session : message quand aucun programme disponible', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Séance du jour')
    pressAndFlush(result, 'Bodybuilding')
    pressAndFlush(result, 'Intermédiaire')
    fireEvent.press(result.getByText('Haltères'))
    pressAndFlush(result, 'Suivant →')
    pressAndFlush(result, '60 min')
    fireEvent.press(result.getByText('Pecs'))
    pressAndFlush(result, 'Suivant →')

    expect(result.getByText(/Aucun programme disponible/)).toBeTruthy()
  })

  it('mode programme : passe par split, phase, recovery, injuries, age, days, focus', () => {
    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')
    pressAndFlush(result, 'Bodybuilding')
    pressAndFlush(result, 'Intermédiaire')
    // Equipment
    fireEvent.press(result.getByText('Haltères'))
    pressAndFlush(result, 'Suivant →')
    // Duration
    pressAndFlush(result, '60 min')
    // Split
    expect(result.getByText('Quel style de programme ?')).toBeTruthy()
    pressAndFlush(result, 'PPL')
    // Phase
    expect(result.getByText('Dans quelle phase es-tu ?')).toBeTruthy()
    pressAndFlush(result, 'Prise de masse 🍖')
    // Recovery
    expect(result.getByText('Comment te récupères-tu ?')).toBeTruthy()
    pressAndFlush(result, 'Normale 😊')
    // Injuries
    expect(result.getByText('As-tu des zones sensibles ?')).toBeTruthy()
    fireEvent.press(result.getByText('Aucune ✅'))
    pressAndFlush(result, 'Suivant →')
    // Age group
    expect(result.getByText(/tranche d'âge/)).toBeTruthy()
    pressAndFlush(result, '26–35 ans 💪')
    // Days per week
    expect(result.getByText('Combien de jours par semaine ?')).toBeTruthy()
  })

  it('sélectionner la dernière étape déclenche la génération', async () => {
    mockGeneratePlan.mockResolvedValueOnce({
      plan: { name: 'PPL Gen', sessions: [] },
      usedFallback: false,
    })

    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    // Go through program mode with Full Body split
    pressAndFlush(result, 'Programme complet')
    pressAndFlush(result, 'Bodybuilding')
    pressAndFlush(result, 'Intermédiaire')
    fireEvent.press(result.getByText('Haltères'))
    pressAndFlush(result, 'Suivant →')
    pressAndFlush(result, '60 min')
    // Split: Full Body
    pressAndFlush(result, 'Full Body')
    // Phase
    pressAndFlush(result, 'Prise de masse 🍖')
    // Recovery
    pressAndFlush(result, 'Normale 😊')
    // Injuries
    fireEvent.press(result.getByText('Aucune ✅'))
    pressAndFlush(result, 'Suivant →')
    // Age
    pressAndFlush(result, '26–35 ans 💪')
    // Days
    pressAndFlush(result, '3j')
    // Muscles focus (last step) → Suivant will trigger generate
    pressAndFlush(result, 'Suivant →')

    await waitFor(() => {
      expect(mockGeneratePlan).toHaveBeenCalled()
    })
  })

  it('erreur de génération affiche une alerte', async () => {
    mockGeneratePlan.mockRejectedValueOnce(new Error('API down'))

    const result = render(
      <AssistantScreenInner
        programs={[]}
        user={mockUser()}
        navigation={mockNavigation}
      />
    )

    pressAndFlush(result, 'Programme complet')
    pressAndFlush(result, 'Bodybuilding')
    pressAndFlush(result, 'Intermédiaire')
    fireEvent.press(result.getByText('Haltères'))
    pressAndFlush(result, 'Suivant →')
    pressAndFlush(result, '60 min')
    pressAndFlush(result, 'Full Body')
    pressAndFlush(result, 'Prise de masse 🍖')
    pressAndFlush(result, 'Normale 😊')
    fireEvent.press(result.getByText('Aucune ✅'))
    pressAndFlush(result, 'Suivant →')
    pressAndFlush(result, '26–35 ans 💪')
    pressAndFlush(result, '3j')
    pressAndFlush(result, 'Suivant →')

    await waitFor(() => {
      expect(result.getByText(/Impossible de générer/)).toBeTruthy()
    })
  })
})
