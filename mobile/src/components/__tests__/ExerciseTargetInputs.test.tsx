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
    it('affiche les trois inputs avec les bons testIDs', () => {
      const { getByTestId } = render(<ExerciseTargetInputs {...defaultProps} />)

      expect(getByTestId('input-sets')).toBeTruthy()
      expect(getByTestId('input-reps')).toBeTruthy()
      expect(getByTestId('input-weight')).toBeTruthy()
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

    it('accepte des valeurs vides sans crash', () => {
      expect(() =>
        render(<ExerciseTargetInputs {...defaultProps} sets="" reps="" weight="" />)
      ).not.toThrow()
    })
  })

  describe('interactions', () => {
    it('appelle onSetsChange quand le champ séries change', () => {
      const onSetsChange = jest.fn()
      const { getByTestId } = render(
        <ExerciseTargetInputs {...defaultProps} onSetsChange={onSetsChange} />
      )

      fireEvent.changeText(getByTestId('input-sets'), '5')

      expect(onSetsChange).toHaveBeenCalledWith('5')
    })

    it('appelle onRepsChange quand le champ reps change', () => {
      const onRepsChange = jest.fn()
      const { getByTestId } = render(
        <ExerciseTargetInputs {...defaultProps} onRepsChange={onRepsChange} />
      )

      fireEvent.changeText(getByTestId('input-reps'), '12')

      expect(onRepsChange).toHaveBeenCalledWith('12')
    })

    it('appelle onWeightChange quand le champ poids change', () => {
      const onWeightChange = jest.fn()
      const { getByTestId } = render(
        <ExerciseTargetInputs {...defaultProps} onWeightChange={onWeightChange} />
      )

      fireEvent.changeText(getByTestId('input-weight'), '75.5')

      expect(onWeightChange).toHaveBeenCalledWith('75.5')
    })

    it('les callbacks ne sont pas croisés (chaque input appelle son propre callback)', () => {
      const onSetsChange = jest.fn()
      const onRepsChange = jest.fn()
      const onWeightChange = jest.fn()

      const { getByTestId } = render(
        <ExerciseTargetInputs
          sets="3"
          reps="10"
          weight="60"
          onSetsChange={onSetsChange}
          onRepsChange={onRepsChange}
          onWeightChange={onWeightChange}
        />
      )

      fireEvent.changeText(getByTestId('input-sets'), '4')

      expect(onSetsChange).toHaveBeenCalledTimes(1)
      expect(onRepsChange).not.toHaveBeenCalled()
      expect(onWeightChange).not.toHaveBeenCalled()
    })

    it('fast-typing : passe les valeurs brutes sans modification', () => {
      const onSetsChange = jest.fn()
      const { getByTestId } = render(
        <ExerciseTargetInputs {...defaultProps} onSetsChange={onSetsChange} />
      )

      fireEvent.changeText(getByTestId('input-sets'), '5')
      fireEvent.changeText(getByTestId('input-sets'), '55')
      fireEvent.changeText(getByTestId('input-sets'), '555')

      expect(onSetsChange).toHaveBeenNthCalledWith(1, '5')
      expect(onSetsChange).toHaveBeenNthCalledWith(2, '55')
      expect(onSetsChange).toHaveBeenNthCalledWith(3, '555')
    })
  })

  describe('toggle reps Fixe / Plage', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('démarre en mode Fixe (un seul input reps)', () => {
      const { getByTestId, queryByPlaceholderText } = render(
        <ExerciseTargetInputs {...defaultProps} />
      )
      expect(getByTestId('input-reps')).toBeTruthy()
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
      const { getByText, getByTestId, getByPlaceholderText } = render(
        <ExerciseTargetInputs {...defaultProps} onRepsChange={onRepsChange} />
      )
      fireEvent.press(getByText('Plage'))
      fireEvent.changeText(getByTestId('input-reps-min'), '6')
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
      const { getByTestId, getByPlaceholderText } = render(
        <ExerciseTargetInputs {...defaultProps} reps="6-10" />
      )
      expect(getByTestId('input-reps-min')).toBeTruthy()
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
      const { getByTestId } = render(
        <ExerciseTargetInputs {...defaultProps} weight="82.5" onWeightChange={onWeightChange} />
      )

      expect(getByTestId('input-weight')).toBeTruthy()
      fireEvent.changeText(getByTestId('input-weight'), '85.0')
      expect(onWeightChange).toHaveBeenCalledWith('85.0')
    })

    it('accepte zéro comme valeur pour tous les champs', () => {
      const { getByTestId } = render(
        <ExerciseTargetInputs
          sets="0"
          reps="0"
          weight="0"
          onSetsChange={jest.fn()}
          onRepsChange={jest.fn()}
          onWeightChange={jest.fn()}
        />
      )

      expect(getByTestId('input-sets')).toBeTruthy()
      expect(getByTestId('input-reps')).toBeTruthy()
      expect(getByTestId('input-weight')).toBeTruthy()
    })
  })
})
