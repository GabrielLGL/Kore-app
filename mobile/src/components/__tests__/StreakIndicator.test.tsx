import React from 'react'
import { render } from '@testing-library/react-native'
import { StreakIndicator } from '../StreakIndicator'

describe('StreakIndicator', () => {
  it('affiche le message inactif quand streak = 0', () => {
    const { getByText } = render(
      <StreakIndicator currentStreak={0} streakTarget={3} />
    )
    expect(getByText('Pas encore de streak')).toBeTruthy()
  })

  it('affiche le message inactif quand streak < 0', () => {
    const { getByText } = render(
      <StreakIndicator currentStreak={-1} streakTarget={3} />
    )
    expect(getByText('Pas encore de streak')).toBeTruthy()
  })

  it('affiche singulier pour streak = 1', () => {
    const { getByText } = render(
      <StreakIndicator currentStreak={1} streakTarget={3} />
    )
    expect(getByText(/1 semaine \(obj: 3\/sem\)/)).toBeTruthy()
  })

  it('affiche pluriel pour streak > 1', () => {
    const { getByText } = render(
      <StreakIndicator currentStreak={5} streakTarget={3} />
    )
    expect(getByText(/5 semaines \(obj: 3\/sem\)/)).toBeTruthy()
  })

  it('affiche la cible correcte', () => {
    const { getByText } = render(
      <StreakIndicator currentStreak={2} streakTarget={5} />
    )
    expect(getByText(/obj: 5\/sem/)).toBeTruthy()
  })

  it('affiche 2 semaines (pluriel) avec la bonne cible', () => {
    const { getByText } = render(
      <StreakIndicator currentStreak={2} streakTarget={4} />
    )
    expect(getByText(/2 semaines \(obj: 4\/sem\)/)).toBeTruthy()
  })
})
