import React from 'react'
import { render } from '@testing-library/react-native'
import { XPProgressBar } from '../XPProgressBar'

describe('XPProgressBar', () => {
  it('affiche les valeurs XP et le pourcentage', () => {
    const { getByText } = render(
      <XPProgressBar currentXP={250} requiredXP={500} percentage={50} />
    )
    expect(getByText('250 / 500 XP (50%)')).toBeTruthy()
  })

  it('affiche 0 XP', () => {
    const { getByText } = render(
      <XPProgressBar currentXP={0} requiredXP={100} percentage={0} />
    )
    expect(getByText('0 / 100 XP (0%)')).toBeTruthy()
  })

  it('affiche 100% XP', () => {
    const { getByText } = render(
      <XPProgressBar currentXP={100} requiredXP={100} percentage={100} />
    )
    expect(getByText('100 / 100 XP (100%)')).toBeTruthy()
  })

  it('affiche les valeurs même en dépassement (bar plafonnée par Math.min)', () => {
    const { getByText } = render(
      <XPProgressBar currentXP={150} requiredXP={100} percentage={150} />
    )
    expect(getByText('150 / 100 XP (150%)')).toBeTruthy()
  })

  it('se rend sans crash avec des valeurs élevées', () => {
    expect(() =>
      render(<XPProgressBar currentXP={9999} requiredXP={10000} percentage={99} />)
    ).not.toThrow()
  })
})
