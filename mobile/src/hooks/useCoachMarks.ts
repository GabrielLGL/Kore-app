import { useCallback } from 'react'
import { database } from '../model'
import User from '../model/models/User'

interface UseCoachMarksReturn {
  shouldShow: boolean
  markCompleted: () => Promise<void>
}

export function useCoachMarks(user: User | null): UseCoachMarksReturn {
  const shouldShow = Boolean(
    user && user.onboardingCompleted && !user.tutorialCompleted,
  )

  const markCompleted = useCallback(async () => {
    if (!user) return
    await database.write(async () => {
      await user.update(u => {
        u.tutorialCompleted = true
      })
    })
  }, [user])

  return { shouldShow, markCompleted }
}
