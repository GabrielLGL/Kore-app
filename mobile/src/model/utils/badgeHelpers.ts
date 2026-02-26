import { BADGES_LIST, type BadgeDefinition } from './badgeConstants'

export interface CheckBadgesParams {
  user: {
    totalTonnage: number
    bestStreak: number
    level: number
    totalPrs: number
  }
  existingBadgeIds: string[]
  sessionCount: number
  sessionVolume: number
  distinctExerciseCount: number
}

/**
 * Retourne les badges nouvellement débloqués.
 * Compare l'état actuel du User avec les seuils de BADGES_LIST.
 * Ne retourne pas les badges déjà présents dans existingBadgeIds.
 */
export function checkBadges(params: CheckBadgesParams): BadgeDefinition[] {
  const { user, existingBadgeIds, sessionCount, sessionVolume, distinctExerciseCount } = params
  const existingSet = new Set(existingBadgeIds)
  const newBadges: BadgeDefinition[] = []

  for (const badge of BADGES_LIST) {
    if (existingSet.has(badge.id)) continue

    let unlocked = false

    switch (badge.category) {
      case 'sessions':
        unlocked = sessionCount >= badge.threshold
        break
      case 'tonnage':
        unlocked = user.totalTonnage >= badge.threshold
        break
      case 'streak':
        unlocked = user.bestStreak >= badge.threshold
        break
      case 'level':
        unlocked = user.level >= badge.threshold
        break
      case 'pr':
        unlocked = user.totalPrs >= badge.threshold
        break
      case 'session_volume':
        unlocked = sessionVolume >= badge.threshold
        break
      case 'exercises':
        unlocked = distinctExerciseCount >= badge.threshold
        break
    }

    if (unlocked) {
      newBadges.push(badge)
    }
  }

  return newBadges
}
