// Mock databaseHelpers avant tous les imports (évite SQLiteAdapter JSI)
jest.mock('../../model/utils/databaseHelpers', () => ({
  updateHistoryNote: jest.fn().mockResolvedValue(undefined),
}))

// Mock Portal
jest.mock('@gorhom/portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock expo-haptics pour useHaptics dans Button
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Error: 'Error' },
}))

import React from 'react'
import { render, fireEvent, act, waitFor } from '@testing-library/react-native'
import { WorkoutSummarySheet } from '../WorkoutSummarySheet'
import { updateHistoryNote } from '../../model/utils/databaseHelpers'

const mockUpdateHistoryNote = updateHistoryNote as jest.Mock

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  durationSeconds: 3661, // 1h 1min 1sec
  totalVolume: 2500.5,
  totalSets: 12,
  totalPrs: 3,
  historyId: 'hist-test-1',
}

describe('WorkoutSummarySheet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendu des statistiques', () => {
    it('affiche la durée formatée correctement', () => {
      const { getByText } = render(
        <WorkoutSummarySheet {...defaultProps} durationSeconds={3661} />
      )

      // 3661 secondes = 61 minutes 1 seconde → "61:01"
      expect(getByText('61:01')).toBeTruthy()
    })

    it('affiche la durée zéro', () => {
      const { getByText } = render(
        <WorkoutSummarySheet {...defaultProps} durationSeconds={0} />
      )

      expect(getByText('00:00')).toBeTruthy()
    })

    it('affiche le volume total avec décimale', () => {
      const { getByText } = render(
        <WorkoutSummarySheet {...defaultProps} totalVolume={2500.5} />
      )

      expect(getByText('2500.5 kg')).toBeTruthy()
    })

    it('affiche le nombre de séries validées', () => {
      const { getByText } = render(
        <WorkoutSummarySheet {...defaultProps} totalSets={12} />
      )

      expect(getByText('12 validées')).toBeTruthy()
    })

    it('affiche le nombre de PR', () => {
      const { getByText } = render(
        <WorkoutSummarySheet {...defaultProps} totalPrs={3} />
      )

      expect(getByText('3 PR')).toBeTruthy()
    })

    it('affiche les labels des stats (Durée, Volume, Séries, Records)', () => {
      const { getByText } = render(<WorkoutSummarySheet {...defaultProps} />)

      expect(getByText('Durée')).toBeTruthy()
      expect(getByText('Volume')).toBeTruthy()
      expect(getByText('Séries')).toBeTruthy()
      expect(getByText('Records')).toBeTruthy()
    })

    it('affiche le bouton Fermer', () => {
      const { getByText } = render(<WorkoutSummarySheet {...defaultProps} />)

      expect(getByText('Fermer')).toBeTruthy()
    })
  })

  describe('saisie de note', () => {
    it('affiche le champ de note avec placeholder', () => {
      const { getByPlaceholderText } = render(<WorkoutSummarySheet {...defaultProps} />)

      expect(getByPlaceholderText('Ajouter une note (optionnel)...')).toBeTruthy()
    })

    it('met à jour la note quand on tape du texte', () => {
      const { getByPlaceholderText } = render(<WorkoutSummarySheet {...defaultProps} />)

      const noteInput = getByPlaceholderText('Ajouter une note (optionnel)...')
      fireEvent.changeText(noteInput, 'Super séance !')

      expect(noteInput.props.value).toBe('Super séance !')
    })

    it('appelle updateHistoryNote après le délai de debounce', async () => {
      jest.useFakeTimers()

      const { getByPlaceholderText } = render(<WorkoutSummarySheet {...defaultProps} />)
      const noteInput = getByPlaceholderText('Ajouter une note (optionnel)...')

      fireEvent.changeText(noteInput, 'Bonne séance')

      // Avancer le timer de 500ms (délai debounce)
      act(() => {
        jest.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(mockUpdateHistoryNote).toHaveBeenCalledWith('hist-test-1', 'Bonne séance')
      })

      jest.useRealTimers()
    })

    it('ne déclenche pas updateHistoryNote si on tape rapidement (debounce)', async () => {
      jest.useFakeTimers()

      const { getByPlaceholderText } = render(<WorkoutSummarySheet {...defaultProps} />)
      const noteInput = getByPlaceholderText('Ajouter une note (optionnel)...')

      // Taper 3 fois rapidement
      fireEvent.changeText(noteInput, 'A')
      act(() => { jest.advanceTimersByTime(100) })
      fireEvent.changeText(noteInput, 'AB')
      act(() => { jest.advanceTimersByTime(100) })
      fireEvent.changeText(noteInput, 'ABC')

      // Seulement 200ms passées → debounce pas encore déclenché
      expect(mockUpdateHistoryNote).not.toHaveBeenCalled()

      // Après 500ms supplémentaires → debounce déclenché pour le dernier texte
      act(() => {
        jest.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(mockUpdateHistoryNote).toHaveBeenCalledTimes(1)
        expect(mockUpdateHistoryNote).toHaveBeenCalledWith('hist-test-1', 'ABC')
      })

      jest.useRealTimers()
    })
  })

  describe('fermeture', () => {
    it('appelle onClose quand le bouton Fermer est pressé', () => {
      const onClose = jest.fn()
      const { getByText } = render(
        <WorkoutSummarySheet {...defaultProps} onClose={onClose} />
      )

      fireEvent.press(getByText('Fermer'))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('flush la note immédiatement à la fermeture si une note est en cours', async () => {
      jest.useFakeTimers()

      const onClose = jest.fn()
      const { getByPlaceholderText, getByText } = render(
        <WorkoutSummarySheet {...defaultProps} onClose={onClose} />
      )

      // Taper une note sans attendre le debounce
      const noteInput = getByPlaceholderText('Ajouter une note (optionnel)...')
      fireEvent.changeText(noteInput, 'Note à sauvegarder')

      // Fermer avant le délai de debounce
      fireEvent.press(getByText('Fermer'))

      await waitFor(() => {
        expect(mockUpdateHistoryNote).toHaveBeenCalledWith('hist-test-1', 'Note à sauvegarder')
      })

      expect(onClose).toHaveBeenCalled()

      jest.useRealTimers()
    })
  })

  describe('non-rendu', () => {
    it('ne rend rien quand visible est false', () => {
      const { queryByText } = render(
        <WorkoutSummarySheet {...defaultProps} visible={false} />
      )

      // BottomSheet avec visible=false → showContent=false → null
      expect(queryByText('Durée')).toBeNull()
    })
  })
})
