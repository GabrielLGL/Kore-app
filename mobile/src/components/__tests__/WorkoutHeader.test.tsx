import React from 'react'
import { render } from '@testing-library/react-native'
import { WorkoutHeader } from '../WorkoutHeader'

describe('WorkoutHeader', () => {
  describe('rendu du timer', () => {
    it('affiche le temps formaté', () => {
      const { getByText } = render(
        <WorkoutHeader formattedTime="01:30" totalVolume={0} />
      )

      expect(getByText('01:30')).toBeTruthy()
    })

    it('affiche "00:00" comme timer initial', () => {
      const { getByText } = render(
        <WorkoutHeader formattedTime="00:00" totalVolume={0} />
      )

      expect(getByText('00:00')).toBeTruthy()
    })

    it('affiche un timer de grande valeur correctement', () => {
      const { getByText } = render(
        <WorkoutHeader formattedTime="1:23:45" totalVolume={0} />
      )

      expect(getByText('1:23:45')).toBeTruthy()
    })
  })

  describe('rendu du volume total', () => {
    it('affiche le volume total avec une décimale', () => {
      const { getByText } = render(
        <WorkoutHeader formattedTime="00:00" totalVolume={1250} />
      )

      expect(getByText('Volume total : 1250.0 kg')).toBeTruthy()
    })

    it('affiche zéro kg quand aucun volume', () => {
      const { getByText } = render(
        <WorkoutHeader formattedTime="00:00" totalVolume={0} />
      )

      expect(getByText('Volume total : 0.0 kg')).toBeTruthy()
    })

    it('affiche un volume décimal correctement', () => {
      const { getByText } = render(
        <WorkoutHeader formattedTime="00:00" totalVolume={87.5} />
      )

      expect(getByText('Volume total : 87.5 kg')).toBeTruthy()
    })

    it('affiche le volume en kg (avec unité)', () => {
      const { getByText } = render(
        <WorkoutHeader formattedTime="05:00" totalVolume={300} />
      )

      const volumeText = getByText('Volume total : 300.0 kg')
      expect(volumeText).toBeTruthy()
    })
  })

  describe('rendu combiné', () => {
    it('affiche timer et volume simultanément', () => {
      const { getByText } = render(
        <WorkoutHeader formattedTime="10:42" totalVolume={450.5} />
      )

      expect(getByText('10:42')).toBeTruthy()
      expect(getByText('Volume total : 450.5 kg')).toBeTruthy()
    })

    it('se rend sans crash avec des valeurs extrêmes', () => {
      expect(() =>
        render(<WorkoutHeader formattedTime="99:59:59" totalVolume={99999.9} />)
      ).not.toThrow()
    })
  })
})
