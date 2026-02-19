import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ExerciseTargetInputs } from '../ExerciseTargetInputs'

describe('ExerciseTargetInputs', () => {
  const defaultProps = {
    sets: '3',
    reps: '10',
    weight: '60',
    onSetsChange: jest.fn(),
    onRepsChange: jest.fn(),
    onWeightChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendu initial', () => {
    it('affiche les valeurs initiales dans les inputs', () => {
      const { getByDisplayValue } = render(<ExerciseTargetInputs {...defaultProps} />)

      expect(getByDisplayValue('3')).toBeTruthy()
      expect(getByDisplayValue('10')).toBeTruthy()
      expect(getByDisplayValue('60')).toBeTruthy()
    })

    it('affiche les labels par défaut (showLabels = true)', () => {
      const { getByText } = render(<ExerciseTargetInputs {...defaultProps} />)

      expect(getByText('Séries')).toBeTruthy()
      expect(getByText('Reps')).toBeTruthy()
      expect(getByText('Poids (kg)')).toBeTruthy()
    })

    it('masque les labels quand showLabels est false', () => {
      const { queryByText } = render(
        <ExerciseTargetInputs {...defaultProps} showLabels={false} />
      )

      expect(queryByText('Séries')).toBeNull()
      expect(queryByText('Reps')).toBeNull()
      expect(queryByText('Poids (kg)')).toBeNull()
    })

    it('accepte des valeurs vides dans les inputs', () => {
      const { getAllByDisplayValue } = render(
        <ExerciseTargetInputs
          {...defaultProps}
          sets=""
          reps=""
          weight=""
        />
      )

      // 3 inputs vides
      expect(getAllByDisplayValue('').length).toBe(3)
    })
  })

  describe('interactions', () => {
    it('appelle onSetsChange quand le champ séries change', () => {
      const onSetsChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onSetsChange={onSetsChange} />
      )

      fireEvent.changeText(getByDisplayValue('3'), '5')

      expect(onSetsChange).toHaveBeenCalledWith('5')
    })

    it('appelle onRepsChange quand le champ reps change', () => {
      const onRepsChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onRepsChange={onRepsChange} />
      )

      fireEvent.changeText(getByDisplayValue('10'), '12')

      expect(onRepsChange).toHaveBeenCalledWith('12')
    })

    it('appelle onWeightChange quand le champ poids change', () => {
      const onWeightChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onWeightChange={onWeightChange} />
      )

      fireEvent.changeText(getByDisplayValue('60'), '75.5')

      expect(onWeightChange).toHaveBeenCalledWith('75.5')
    })

    it('les callbacks ne sont pas croisés (chaque input appelle son propre callback)', () => {
      const onSetsChange = jest.fn()
      const onRepsChange = jest.fn()
      const onWeightChange = jest.fn()

      const { getByDisplayValue } = render(
        <ExerciseTargetInputs
          sets="3"
          reps="10"
          weight="60"
          onSetsChange={onSetsChange}
          onRepsChange={onRepsChange}
          onWeightChange={onWeightChange}
        />
      )

      fireEvent.changeText(getByDisplayValue('3'), '4')

      expect(onSetsChange).toHaveBeenCalledTimes(1)
      expect(onRepsChange).not.toHaveBeenCalled()
      expect(onWeightChange).not.toHaveBeenCalled()
    })
  })

  describe('props optionnelles', () => {
    it('se rend sans crash avec autoFocus à true', () => {
      expect(() =>
        render(<ExerciseTargetInputs {...defaultProps} autoFocus={true} />)
      ).not.toThrow()
    })

    it('se rend sans crash avec autoFocus à false (par défaut)', () => {
      expect(() =>
        render(<ExerciseTargetInputs {...defaultProps} autoFocus={false} />)
      ).not.toThrow()
    })

    it('accepte des valeurs décimales dans le champ poids', () => {
      const onWeightChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} weight="82.5" onWeightChange={onWeightChange} />
      )

      expect(getByDisplayValue('82.5')).toBeTruthy()
      fireEvent.changeText(getByDisplayValue('82.5'), '85.0')
      expect(onWeightChange).toHaveBeenCalledWith('85.0')
    })

    it('accepte zéro comme valeur pour tous les champs', () => {
      const { getAllByDisplayValue } = render(
        <ExerciseTargetInputs
          sets="0"
          reps="0"
          weight="0"
          onSetsChange={jest.fn()}
          onRepsChange={jest.fn()}
          onWeightChange={jest.fn()}
        />
      )

      // Les 3 inputs ont la valeur '0'
      expect(getAllByDisplayValue('0').length).toBe(3)
    })
  })
})
