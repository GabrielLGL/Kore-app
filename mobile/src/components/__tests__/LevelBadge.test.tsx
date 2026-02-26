import React from 'react'
import { render } from '@testing-library/react-native'
import { LevelBadge } from '../LevelBadge'

describe('LevelBadge', () => {
  it('affiche "Niveau 1"', () => {
    const { getByText } = render(<LevelBadge level={1} />)
    expect(getByText('Niveau 1')).toBeTruthy()
  })

  it('affiche le niveau passé en prop', () => {
    const { getByText } = render(<LevelBadge level={7} />)
    expect(getByText('Niveau 7')).toBeTruthy()
  })

  it('affiche un niveau élevé', () => {
    const { getByText } = render(<LevelBadge level={42} />)
    expect(getByText('Niveau 42')).toBeTruthy()
  })

  it('affiche l\'étoile emoji', () => {
    const { getByText } = render(<LevelBadge level={3} />)
    expect(getByText('⭐')).toBeTruthy()
  })
})
