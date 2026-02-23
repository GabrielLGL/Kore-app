import React from 'react'
import { render } from '@testing-library/react-native'

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Error: 'Error' },
}))

jest.mock('../../model/index', () => ({
  database: {
    write: jest.fn(),
    get: jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        fetch: jest.fn().mockResolvedValue([]),
        observe: jest.fn(),
      }),
    }),
  },
}))

jest.mock('react-native-chart-kit', () => ({
  LineChart: 'LineChart',
  BarChart: 'BarChart',
}))

jest.mock('@gorhom/portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => children,
  PortalProvider: ({ children }: { children: React.ReactNode }) => children,
  PortalHost: () => null,
}))

import { ChartsContent } from '../ChartsScreen'

const makeExercise = (id: string, name: string, primaryMuscle: string, equipment: string) =>
  ({
    id,
    name,
    primaryMuscle,
    muscles: [primaryMuscle],
    equipment,
  }) as never

describe('ChartsContent', () => {
  it('rend sans exercices sans crash', () => {
    const { getByText } = render(
      <ChartsContent exercises={[]} />
    )
    expect(getByText('Sélectionnez un exercice pour commencer.')).toBeTruthy()
  })

  it('affiche le message vide quand aucun exercice sélectionné', () => {
    const exercises = [makeExercise('e1', 'Développé couché', 'Pecs', 'Poids libre')]
    const { getByText } = render(
      <ChartsContent exercises={exercises} />
    )
    expect(getByText('Sélectionnez un exercice pour commencer.')).toBeTruthy()
  })

  it('affiche les exercices dans la liste horizontale', () => {
    const exercises = [
      makeExercise('e1', 'Développé couché', 'Pecs', 'Poids libre'),
      makeExercise('e2', 'Squat', 'Quadriceps', 'Poids libre'),
    ]
    const { getByText } = render(
      <ChartsContent exercises={exercises} />
    )
    expect(getByText('Développé couché')).toBeTruthy()
    expect(getByText('Squat')).toBeTruthy()
  })
})
