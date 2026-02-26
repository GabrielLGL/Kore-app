// Mocks AVANT les imports
jest.mock('@gorhom/portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('../BottomSheet', () => ({
  BottomSheet: ({ children, visible }: { children: React.ReactNode; visible: boolean }) =>
    visible ? children : null,
}))

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Error: 'Error' },
}))

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { MilestoneCelebration } from '../MilestoneCelebration'
import type { MilestoneEvent } from '../../model/utils/gamificationHelpers'

const milestone: MilestoneEvent = {
  type: 'session',
  value: 10,
  emoji: '🎉',
  title: '10 séances !',
  message: 'Tu as complété 10 séances, bravo !',
}

describe('MilestoneCelebration', () => {
  it('ne rend rien si milestone est null', () => {
    const { toJSON } = render(
      <MilestoneCelebration visible={true} milestone={null} onClose={jest.fn()} />
    )
    expect(toJSON()).toBeNull()
  })

  it('affiche le titre et le message du milestone', () => {
    const { getByText } = render(
      <MilestoneCelebration visible={true} milestone={milestone} onClose={jest.fn()} />
    )
    expect(getByText('10 séances !')).toBeTruthy()
    expect(getByText('Tu as complété 10 séances, bravo !')).toBeTruthy()
  })

  it('affiche l\'emoji du milestone', () => {
    const { getByText } = render(
      <MilestoneCelebration visible={true} milestone={milestone} onClose={jest.fn()} />
    )
    expect(getByText('🎉')).toBeTruthy()
  })

  it('affiche le bouton OK', () => {
    const { getByText } = render(
      <MilestoneCelebration visible={true} milestone={milestone} onClose={jest.fn()} />
    )
    expect(getByText('OK')).toBeTruthy()
  })

  it('appelle onClose quand on presse OK', () => {
    const onClose = jest.fn()
    const { getByText } = render(
      <MilestoneCelebration visible={true} milestone={milestone} onClose={onClose} />
    )
    fireEvent.press(getByText('OK'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ne rend pas le contenu quand visible=false', () => {
    const { queryByText } = render(
      <MilestoneCelebration visible={false} milestone={milestone} onClose={jest.fn()} />
    )
    expect(queryByText('10 séances !')).toBeNull()
  })

  it('affiche un milestone de type level_up', () => {
    const levelMilestone: MilestoneEvent = {
      type: 'levelup',
      value: 5,
      emoji: '⭐',
      title: 'Niveau 5 !',
      message: 'Tu passes au niveau 5 !',
    }
    const { getByText } = render(
      <MilestoneCelebration visible={true} milestone={levelMilestone} onClose={jest.fn()} />
    )
    expect(getByText('Niveau 5 !')).toBeTruthy()
    expect(getByText('⭐')).toBeTruthy()
  })
})
