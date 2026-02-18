import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { OnboardingSheet } from '../OnboardingSheet'
import { PRESET_PROGRAMS } from '../../model/onboardingPrograms'

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Error: 'Error' },
}))

// Mock @gorhom/portal (BottomSheet utilise Portal)
jest.mock('@gorhom/portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock BottomSheet pour éviter les animations
jest.mock('../BottomSheet', () => ({
  BottomSheet: ({ children, visible }: { children: React.ReactNode; visible: boolean }) =>
    visible ? children : null,
}))

describe('OnboardingSheet', () => {
  const mockOnClose = jest.fn()
  const mockOnSkip = jest.fn()
  const mockOnProgramSelected = jest.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('affiche les 3 cartes de preset quand visible', () => {
    const { getByText } = render(
      <OnboardingSheet
        visible={true}
        onClose={mockOnClose}
        onProgramSelected={mockOnProgramSelected}
        onSkip={mockOnSkip}
      />
    )

    expect(getByText('PPL 3 jours')).toBeTruthy()
    expect(getByText('Full Body 3 jours')).toBeTruthy()
    expect(getByText('Push Pull 4 jours')).toBeTruthy()
  })

  it('affiche la description et le nombre de séances de chaque programme', () => {
    const { getByText, getAllByText } = render(
      <OnboardingSheet
        visible={true}
        onClose={mockOnClose}
        onProgramSelected={mockOnProgramSelected}
        onSkip={mockOnSkip}
      />
    )

    PRESET_PROGRAMS.forEach(preset => {
      expect(getByText(preset.description)).toBeTruthy()
    })

    // PPL (3) et Full Body (3) ont le même nombre → getAllByText
    expect(getAllByText('3 séances').length).toBeGreaterThanOrEqual(1)
    expect(getByText('4 séances')).toBeTruthy()
  })

  it('appelle onProgramSelected avec le bon preset au tap sur une carte', async () => {
    const { getByText } = render(
      <OnboardingSheet
        visible={true}
        onClose={mockOnClose}
        onProgramSelected={mockOnProgramSelected}
        onSkip={mockOnSkip}
      />
    )

    fireEvent.press(getByText('PPL 3 jours'))

    await waitFor(() => {
      expect(mockOnProgramSelected).toHaveBeenCalledTimes(1)
      expect(mockOnProgramSelected).toHaveBeenCalledWith(PRESET_PROGRAMS[0])
    })
  })

  it('appelle onSkip au tap sur "Commencer sans programme"', () => {
    const { getByText } = render(
      <OnboardingSheet
        visible={true}
        onClose={mockOnClose}
        onProgramSelected={mockOnProgramSelected}
        onSkip={mockOnSkip}
      />
    )

    fireEvent.press(getByText('Commencer sans programme'))

    expect(mockOnSkip).toHaveBeenCalledTimes(1)
  })

  it('ne rend rien quand visible=false', () => {
    const { queryByText } = render(
      <OnboardingSheet
        visible={false}
        onClose={mockOnClose}
        onProgramSelected={mockOnProgramSelected}
        onSkip={mockOnSkip}
      />
    )

    expect(queryByText('PPL 3 jours')).toBeNull()
  })

  it('désactive les boutons pendant isImporting', async () => {
    let resolveImport!: () => void
    const slowImport = jest.fn(
      () => new Promise<void>(resolve => { resolveImport = resolve })
    )

    const { getByText } = render(
      <OnboardingSheet
        visible={true}
        onClose={mockOnClose}
        onProgramSelected={slowImport}
        onSkip={mockOnSkip}
      />
    )

    // Déclenche l'import (ne se résout pas encore)
    fireEvent.press(getByText('PPL 3 jours'))

    // Pendant l'import, le bouton skip ne doit pas appeler onSkip
    fireEvent.press(getByText('Commencer sans programme'))
    expect(mockOnSkip).not.toHaveBeenCalled()

    // Résoudre l'import
    resolveImport()
    await waitFor(() => expect(slowImport).toHaveBeenCalledTimes(1))
  })
})
