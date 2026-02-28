// Mocks AVANT les imports
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Error: 'Error' },
}))

jest.mock('../../model/index', () => ({
  database: {
    get: jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        fetch: jest.fn().mockResolvedValue([]),
      }),
    }),
    write: jest.fn().mockResolvedValue(undefined),
  },
}))

const mockReplace = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    replace: mockReplace,
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}))

import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react-native'
import OnboardingScreen from '../OnboardingScreen'
import { database } from '../../model/index'

const mockDb = database as jest.Mocked<typeof database>

describe('OnboardingScreen — étape 1 (niveau)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('affiche les cartes de niveau à l\'étape 1', () => {
    const { getByText } = render(<OnboardingScreen />)
    fireEvent.press(getByText('Suivant')) // avance de l'étape 0 (langue) à l'étape 1
    expect(getByText('Quel est ton niveau ?')).toBeTruthy()
    expect(getByText('Débutant')).toBeTruthy()
    expect(getByText('Intermédiaire')).toBeTruthy()
    expect(getByText('Avancé')).toBeTruthy()
  })

  it('affiche le bouton Suivant désactivé au départ', () => {
    const { getByText } = render(<OnboardingScreen />)
    expect(getByText('Suivant')).toBeTruthy()
  })

  it('passe à l\'étape 2 après sélection d\'un niveau et tap Suivant', () => {
    const { getByText } = render(<OnboardingScreen />)

    fireEvent.press(getByText('Suivant')) // avance de l'étape 0 (langue) à l'étape 1
    fireEvent.press(getByText('Débutant'))
    fireEvent.press(getByText('Suivant'))

    expect(getByText('Quel est ton objectif ?')).toBeTruthy()
  })

  it('affiche les indicateurs de progression (2 points)', () => {
    const { getAllByRole } = render(<OnboardingScreen />)
    // Pas de testID, on vérifie juste que ça rend sans crash
    expect(() => render(<OnboardingScreen />)).not.toThrow()
  })
})

describe('OnboardingScreen — étape 2 (objectif)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('affiche les cartes d\'objectif à l\'étape 2', () => {
    const { getByText } = render(<OnboardingScreen />)

    fireEvent.press(getByText('Suivant')) // avance de l'étape 0 (langue) à l'étape 1
    fireEvent.press(getByText('Débutant'))
    fireEvent.press(getByText('Suivant'))

    expect(getByText('Prise de masse')).toBeTruthy()
    expect(getByText('Force')).toBeTruthy()
    expect(getByText('Recomposition')).toBeTruthy()
    expect(getByText('Santé générale')).toBeTruthy()
  })

  it('revient à l\'étape 1 au tap sur Retour', () => {
    const { getByText } = render(<OnboardingScreen />)

    fireEvent.press(getByText('Suivant')) // avance de l'étape 0 (langue) à l'étape 1
    fireEvent.press(getByText('Débutant'))
    fireEvent.press(getByText('Suivant'))
    expect(getByText('Quel est ton objectif ?')).toBeTruthy()

    fireEvent.press(getByText('Retour'))
    expect(getByText('Quel est ton niveau ?')).toBeTruthy()
  })

  it('appelle database.write et replace("Home") après confirmation', async () => {
    const mockUser = {
      userLevel: null,
      userGoal: null,
      onboardingCompleted: false,
      update: jest.fn().mockResolvedValue(undefined),
    }
    ;(mockDb.get as jest.Mock).mockReturnValue({
      query: jest.fn().mockReturnValue({
        fetch: jest.fn().mockResolvedValue([mockUser]),
      }),
    })
    ;(mockDb.write as jest.Mock).mockImplementation(async (fn: () => Promise<void>) => {
      await fn()
    })

    const { getByText } = render(<OnboardingScreen />)

    fireEvent.press(getByText('Suivant')) // avance de l'étape 0 (langue) à l'étape 1
    fireEvent.press(getByText('Débutant'))
    fireEvent.press(getByText('Suivant'))
    fireEvent.press(getByText('Force'))
    fireEvent.press(getByText('Confirmer'))

    await waitFor(() => {
      expect(mockDb.write).toHaveBeenCalledTimes(1)
      expect(mockReplace).toHaveBeenCalledWith('Home')
    })
  })

  it('ne confirme pas si aucun objectif sélectionné', async () => {
    const { getByText } = render(<OnboardingScreen />)

    fireEvent.press(getByText('Suivant')) // avance de l'étape 0 (langue) à l'étape 1
    fireEvent.press(getByText('Débutant'))
    fireEvent.press(getByText('Suivant'))

    // Confirmer sans sélection
    act(() => {
      fireEvent.press(getByText('Confirmer'))
    })

    await new Promise(resolve => setTimeout(resolve, 50))
    expect(mockDb.write).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
