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

      const setsInput = getByDisplayValue('3')
      fireEvent.changeText(setsInput, '99')
      fireEvent(setsInput, 'blur')

      expect(onSetsChange).toHaveBeenLastCalledWith('10')
    })

    it('clamp les séries à 1 si la valeur est inférieure au min', () => {
      const onSetsChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onSetsChange={onSetsChange} />
      )

      const setsInput = getByDisplayValue('3')
      fireEvent.changeText(setsInput, '-5')
      fireEvent(setsInput, 'blur')

      expect(onSetsChange).toHaveBeenLastCalledWith('1')
    })

    it('clamp les reps à 99 si la valeur dépasse le max', () => {
      const onRepsChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onRepsChange={onRepsChange} />
      )

      const repsInput = getByDisplayValue('10')
      fireEvent.changeText(repsInput, '200')
      fireEvent(repsInput, 'blur')

      expect(onRepsChange).toHaveBeenLastCalledWith('99')
    })

    it('clamp le poids à 999 si la valeur dépasse le max', () => {
      const onWeightChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onWeightChange={onWeightChange} />
      )

      const weightInput = getByDisplayValue('60')
      fireEvent.changeText(weightInput, '1500')
      fireEvent(weightInput, 'blur')

      expect(onWeightChange).toHaveBeenLastCalledWith('999')
    })

    it('clamp le poids à 0 si la valeur est négative', () => {
      const onWeightChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onWeightChange={onWeightChange} />
      )

      const weightInput = getByDisplayValue('60')
      fireEvent.changeText(weightInput, '-10')
      fireEvent(weightInput, 'blur')

      expect(onWeightChange).toHaveBeenLastCalledWith('0')
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

    it('fast-typing séries : passe la valeur brute puis clamp au blur', () => {
      const onSetsChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onSetsChange={onSetsChange} />
      )

      const setsInput = getByDisplayValue('3')
      fireEvent.changeText(setsInput, '40')
      expect(onSetsChange).toHaveBeenLastCalledWith('40')

      fireEvent(setsInput, 'blur')
      expect(onSetsChange).toHaveBeenLastCalledWith('10')
    })

    it('fast-typing poids : passe la valeur brute, pas de rappel au blur si valide', () => {
      const onWeightChange = jest.fn()
      const { getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} onWeightChange={onWeightChange} />
      )

      const weightInput = getByDisplayValue('60')
      fireEvent.changeText(weightInput, '40')
      expect(onWeightChange).toHaveBeenLastCalledWith('40')

      const callCountBeforeBlur = onWeightChange.mock.calls.length
      fireEvent(weightInput, 'blur')
      expect(onWeightChange).toHaveBeenCalledTimes(callCountBeforeBlur)
    })
  })

  describe('toggle reps Fixe / Plage', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('démarre en mode Fixe (un seul input reps)', () => {
      const { queryByPlaceholderText, getByDisplayValue } = render(
        <ExerciseTargetInputs {...defaultProps} />
      )
      expect(getByDisplayValue('10')).toBeTruthy()
      expect(queryByPlaceholderText('min')).toBeNull()
      expect(queryByPlaceholderText('max')).toBeNull()
    })

    it('affiche deux inputs après appui sur "Plage"', () => {
      const { getByText, getByPlaceholderText } = render(
        <ExerciseTargetInputs {...defaultProps} />
      )
      fireEvent.press(getByText('Plage'))
      expect(getByPlaceholderText('min')).toBeTruthy()
      expect(getByPlaceholderText('max')).toBeTruthy()
    })

    it('compose "N-M" quand min et max sont saisis en mode Plage', () => {
      const onRepsChange = jest.fn()
      const { getByText, getByDisplayValue, getByPlaceholderText } = render(
        <ExerciseTargetInputs {...defaultProps} onRepsChange={onRepsChange} />
      )
      fireEvent.press(getByText('Plage'))
      fireEvent.changeText(getByDisplayValue('10'), '6')
      fireEvent.changeText(getByPlaceholderText('max'), '10')
      expect(onRepsChange).toHaveBeenLastCalledWith('6-10')
    })

    it('retour en mode Fixe : onRepsChange reçoit repsMin seul', () => {
      const onRepsChange = jest.fn()
      const { getByText } = render(
        <ExerciseTargetInputs {...defaultProps} onRepsChange={onRepsChange} />
      )
      fireEvent.press(getByText('Plage'))
      fireEvent.press(getByText('Fixe'))
      expect(onRepsChange).toHaveBeenLastCalledWith('10')
    })

    it('démarre en mode Plage si reps contient "-"', () => {
      const { getByDisplayValue, getByPlaceholderText } = render(
        <ExerciseTargetInputs {...defaultProps} reps="6-10" />
      )
      expect(getByDisplayValue('6')).toBeTruthy()
      expect(getByPlaceholderText('max')).toBeTruthy()
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
