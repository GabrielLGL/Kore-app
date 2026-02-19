// Mocks AVANT les imports
jest.mock('@nozbe/with-observables', () => (
  (_keys: string[], _fn: () => object) =>
    (Component: React.ComponentType<object>) => Component
))

jest.mock('../../model/index', () => ({
  database: {
    get: jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        observe: jest.fn().mockReturnValue({ pipe: jest.fn(), subscribe: jest.fn() }),
        fetch: jest.fn().mockResolvedValue([]),
      }),
    }),
  },
}))

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { SessionExerciseItem } from '../SessionExerciseItem'
import type SessionExercise from '../../model/models/SessionExercise'
import type Exercise from '../../model/models/Exercise'
import type PerformanceLog from '../../model/models/PerformanceLog'

const makeSessionExercise = (overrides: Partial<SessionExercise> = {}): SessionExercise => ({
  id: 'se-1',
  setsTarget: 3,
  repsTarget: '10',
  weightTarget: 60,
  position: 0,
  exercise: {
    observe: jest.fn(),
    fetch: jest.fn().mockResolvedValue({ id: 'ex-1', name: 'Squat' }),
    id: 'ex-1',
  },
  observe: jest.fn(),
  ...overrides,
} as unknown as SessionExercise)

const makeExercise = (overrides: Partial<Exercise> = {}): Exercise => ({
  id: 'ex-1',
  name: 'Développé couché',
  isCustom: false,
  _muscles: '["Pecs","Triceps"]',
  muscles: ['Pecs', 'Triceps'],
  equipment: 'Poids libre',
  observe: jest.fn(),
  ...overrides,
} as unknown as Exercise)

const makePerformanceLog = (overrides: Partial<PerformanceLog> = {}): PerformanceLog => ({
  id: 'log-1',
  weight: 80,
  reps: 10,
  sets: 3,
  observe: jest.fn(),
  exercise: { observe: jest.fn(), fetch: jest.fn(), id: 'ex-1' },
  ...overrides,
} as unknown as PerformanceLog)

describe('SessionExerciseItem', () => {
  describe('rendu des données', () => {
    it('affiche le nom de l\'exercice', () => {
      const { getByText } = render(
        <SessionExerciseItem
          item={makeSessionExercise()}
          exercise={makeExercise({ name: 'Squat Arrière' })}
          history={[]}
          onEditTargets={jest.fn()}
          onRemove={jest.fn()}
        />
      )

      expect(getByText('Squat Arrière')).toBeTruthy()
    })

    it('affiche les muscles et l\'équipement', () => {
      const { getByText } = render(
        <SessionExerciseItem
          item={makeSessionExercise()}
          exercise={makeExercise({ muscles: ['Pecs', 'Triceps'], equipment: 'Barre' })}
          history={[]}
          onEditTargets={jest.fn()}
          onRemove={jest.fn()}
        />
      )

      expect(getByText(/Pecs.*Triceps/)).toBeTruthy()
      expect(getByText(/Barre/)).toBeTruthy()
    })

    it('affiche les objectifs de séries', () => {
      const { getByText } = render(
        <SessionExerciseItem
          item={makeSessionExercise({ setsTarget: 4 })}
          exercise={makeExercise()}
          history={[]}
          onEditTargets={jest.fn()}
          onRemove={jest.fn()}
        />
      )

      expect(getByText('4')).toBeTruthy()
    })

    it('affiche les objectifs de reps', () => {
      const { getByText } = render(
        <SessionExerciseItem
          item={makeSessionExercise({ repsTarget: '12' })}
          exercise={makeExercise()}
          history={[]}
          onEditTargets={jest.fn()}
          onRemove={jest.fn()}
        />
      )

      expect(getByText('12')).toBeTruthy()
    })

    it('affiche les objectifs de poids', () => {
      const { getByText } = render(
        <SessionExerciseItem
          item={makeSessionExercise({ weightTarget: 100 })}
          exercise={makeExercise()}
          history={[]}
          onEditTargets={jest.fn()}
          onRemove={jest.fn()}
        />
      )

      expect(getByText('100')).toBeTruthy()
    })

    it('retourne null si exercise est null', () => {
      const { toJSON } = render(
        <SessionExerciseItem
          item={makeSessionExercise()}
          exercise={null as unknown as Exercise}
          history={[]}
          onEditTargets={jest.fn()}
          onRemove={jest.fn()}
        />
      )

      expect(toJSON()).toBeNull()
    })
  })

  describe('record personnel', () => {
    it('n\'affiche pas le badge PR sans historique', () => {
      const { queryByText } = render(
        <SessionExerciseItem
          item={makeSessionExercise()}
          exercise={makeExercise()}
          history={[]}
          onEditTargets={jest.fn()}
          onRemove={jest.fn()}
        />
      )

      expect(queryByText(/PR:/)).toBeNull()
    })

    it('affiche le badge PR avec la valeur max de l\'historique', () => {
      const history = [
        makePerformanceLog({ weight: 70 }),
        makePerformanceLog({ weight: 85, id: 'log-2' }),
        makePerformanceLog({ weight: 60, id: 'log-3' }),
      ]

      const { getByText } = render(
        <SessionExerciseItem
          item={makeSessionExercise()}
          exercise={makeExercise()}
          history={history}
          onEditTargets={jest.fn()}
          onRemove={jest.fn()}
        />
      )

      expect(getByText('PR: 85')).toBeTruthy()
    })

    it('n\'affiche pas le badge PR si tous les poids sont à 0', () => {
      const history = [makePerformanceLog({ weight: 0 })]

      const { queryByText } = render(
        <SessionExerciseItem
          item={makeSessionExercise()}
          exercise={makeExercise()}
          history={history}
          onEditTargets={jest.fn()}
          onRemove={jest.fn()}
        />
      )

      expect(queryByText(/PR:/)).toBeNull()
    })
  })

  describe('interactions', () => {
    it('appelle onEditTargets quand on appuie sur la zone des objectifs', () => {
      const onEditTargets = jest.fn()
      const se = makeSessionExercise()

      const { getByText } = render(
        <SessionExerciseItem
          item={se}
          exercise={makeExercise()}
          history={[]}
          onEditTargets={onEditTargets}
          onRemove={jest.fn()}
        />
      )

      fireEvent.press(getByText('Séries'))

      expect(onEditTargets).toHaveBeenCalledTimes(1)
      expect(onEditTargets).toHaveBeenCalledWith(se)
    })

    it('appelle onRemove avec l\'item et le nom de l\'exercice', () => {
      const onRemove = jest.fn()
      const se = makeSessionExercise()

      const { getByText } = render(
        <SessionExerciseItem
          item={se}
          exercise={makeExercise({ name: 'Curl biceps' })}
          history={[]}
          onEditTargets={jest.fn()}
          onRemove={onRemove}
        />
      )

      fireEvent.press(getByText('🗑️'))

      expect(onRemove).toHaveBeenCalledTimes(1)
      expect(onRemove).toHaveBeenCalledWith(se, 'Curl biceps')
    })
  })
})
