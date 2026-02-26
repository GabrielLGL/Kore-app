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

  describe('clamping des valeurs', () => {
    it('clamp les séries à 10 si la valeur dépasse le max', () => {
      const onSetsChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onSetsChange={onSetsChange} />
      )

      fireEvent.changeText(getByDisplayValue('3'), '99')

      expect(onSetsChange).toHaveBeenCalledWith('10')
    })

    it('clamp les séries à 1 si la valeur est inférieure au min', () => {
      const onSetsChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onSetsChange={onSetsChange} />
      )

      fireEvent.changeText(getByDisplayValue('3'), '-5')

      expect(onSetsChange).toHaveBeenCalledWith('1')
    })

    it('clamp les reps à 99 si la valeur dépasse le max', () => {
      const onRepsChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onRepsChange={onRepsChange} />
      )

      fireEvent.changeText(getByDisplayValue('10'), '200')

      expect(onRepsChange).toHaveBeenCalledWith('99')
    })

    it('clamp le poids à 999 si la valeur dépasse le max', () => {
      const onWeightChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onWeightChange={onWeightChange} />
      )

      fireEvent.changeText(getByDisplayValue('60'), '1500')

      expect(onWeightChange).toHaveBeenCalledWith('999')
    })

    it('clamp le poids à 0 si la valeur est négative', () => {
      const onWeightChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onWeightChange={onWeightChange} />
      )

      fireEvent.changeText(getByDisplayValue('60'), '-10')

      expect(onWeightChange).toHaveBeenCalledWith('0')
    })

    it('passe les valeurs vides sans modification', () => {
      const onSetsChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onSetsChange={onSetsChange} />
      )

      fireEvent.changeText(getByDisplayValue('3'), '')

      expect(onSetsChange).toHaveBeenCalledWith('')
    })

    it('préserve la chaîne originale pour le poids si dans les limites', () => {
      const onWeightChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onWeightChange={onWeightChange} />
      )

      fireEvent.changeText(getByDisplayValue('60'), '85.5')

      expect(onWeightChange).toHaveBeenCalledWith('85.5')
    })
  })

  describe('mode range séries', () => {
    const rangeProps = {
      ...defaultProps,
      setsMax: '5',
      onSetsMaxChange: jest.fn(),
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('affiche un seul input séries si onSetsMaxChange est absent', () => {
      // mode simple : sets='3', reps='10', weight='60' → 3 valeurs distinctes
      const { queryByPlaceholderText } = render(<ExerciseTargetInputs {...defaultProps} />)
      expect(queryByPlaceholderText('min')).toBeNull()
      expect(queryByPlaceholderText('max')).toBeNull()
    })

    it('affiche deux inputs séries si onSetsMaxChange est fourni', () => {
      const { getByPlaceholderText } = render(<ExerciseTargetInputs {...rangeProps} />)
      expect(getByPlaceholderText('min')).toBeTruthy()
      expect(getByPlaceholderText('max')).toBeTruthy()
    })

    it('affiche la valeur setsMax dans le second input', () => {
      const { getByDisplayValue } = render(<ExerciseTargetInputs {...rangeProps} />)
      expect(getByDisplayValue('5')).toBeTruthy()
    })

    it('appelle onSetsMaxChange quand le champ setsMax change', () => {
      const onSetsMaxChange = jest.fn()
      const { getByPlaceholderText } = render(
        <ExerciseTargetInputs {...defaultProps} setsMax="5" onSetsMaxChange={onSetsMaxChange} />
      )
      fireEvent.changeText(getByPlaceholderText('max'), '4')
      expect(onSetsMaxChange).toHaveBeenCalledWith('4')
    })

    it('clamp setsMax à 10 si la valeur dépasse le max', () => {
      const onSetsMaxChange = jest.fn()
      const { getByPlaceholderText } = render(
        <ExerciseTargetInputs {...defaultProps} setsMax="5" onSetsMaxChange={onSetsMaxChange} />
      )
      fireEvent.changeText(getByPlaceholderText('max'), '99')
      expect(onSetsMaxChange).toHaveBeenCalledWith('10')
    })

    it('passe la valeur vide sans modification pour setsMax', () => {
      const onSetsMaxChange = jest.fn()
      const { getByPlaceholderText } = render(
        <ExerciseTargetInputs {...defaultProps} setsMax="5" onSetsMaxChange={onSetsMaxChange} />
      )
      fireEvent.changeText(getByPlaceholderText('max'), '')
      expect(onSetsMaxChange).toHaveBeenCalledWith('')
    })

    it('onSetsChange et onSetsMaxChange ne sont pas croisés', () => {
      const onSetsChange = jest.fn()
      const onSetsMaxChange = jest.fn()
      const { getByPlaceholderText } = render(
        <ExerciseTargetInputs
          {...defaultProps}
          sets="3"
          setsMax="5"
          onSetsChange={onSetsChange}
          onSetsMaxChange={onSetsMaxChange}
        />
      )
      fireEvent.changeText(getByPlaceholderText('max'), '6')
      expect(onSetsMaxChange).toHaveBeenCalledTimes(1)
      expect(onSetsChange).not.toHaveBeenCalled()
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
