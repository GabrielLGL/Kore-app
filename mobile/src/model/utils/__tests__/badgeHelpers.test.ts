import { checkBadges, type CheckBadgesParams } from '../badgeHelpers'

const baseUser = {
  totalTonnage: 0,
  bestStreak: 0,
  level: 1,
  totalPrs: 0,
}

const baseParams: CheckBadgesParams = {
  user: baseUser,
  existingBadgeIds: [],
  sessionCount: 0,
  sessionVolume: 0,
  distinctExerciseCount: 0,
}

describe('checkBadges', () => {
  it('retourne [] si aucun seuil atteint', () => {
    const result = checkBadges(baseParams)
    expect(result).toHaveLength(0)
  })

  it('retourne [] si tous les badges sont déjà débloqués', () => {
    const allIds = ['sessions_1', 'sessions_5', 'sessions_10', 'tonnage_1', 'streak_2', 'level_2', 'pr_1', 'session_vol_200', 'exercises_5']
    const result = checkBadges({ ...baseParams, existingBadgeIds: allIds, sessionCount: 10, user: { totalTonnage: 5000, bestStreak: 4, level: 2, totalPrs: 1 }, sessionVolume: 200, distinctExerciseCount: 5 })
    const returnedIds = result.map(b => b.id)
    for (const id of allIds) {
      expect(returnedIds).not.toContain(id)
    }
  })

  describe('catégorie sessions', () => {
    it('débloque sessions_1 à 1 séance', () => {
      const result = checkBadges({ ...baseParams, sessionCount: 1 })
      expect(result.map(b => b.id)).toContain('sessions_1')
    })

    it('débloque sessions_10 à 10 séances', () => {
      const result = checkBadges({ ...baseParams, sessionCount: 10 })
      expect(result.map(b => b.id)).toContain('sessions_10')
    })

    it('ne débloque pas sessions_25 à 10 séances', () => {
      const result = checkBadges({ ...baseParams, sessionCount: 10 })
      expect(result.map(b => b.id)).not.toContain('sessions_25')
    })

    it('ne re-débloque pas sessions_1 si déjà dans existingBadgeIds', () => {
      const result = checkBadges({ ...baseParams, sessionCount: 5, existingBadgeIds: ['sessions_1'] })
      expect(result.map(b => b.id)).not.toContain('sessions_1')
    })
  })

  describe('catégorie tonnage', () => {
    it('débloque tonnage_1 à 1000 kg', () => {
      const result = checkBadges({ ...baseParams, user: { ...baseUser, totalTonnage: 1000 } })
      expect(result.map(b => b.id)).toContain('tonnage_1')
    })

    it('ne débloque pas tonnage_5 à 1000 kg', () => {
      const result = checkBadges({ ...baseParams, user: { ...baseUser, totalTonnage: 1000 } })
      expect(result.map(b => b.id)).not.toContain('tonnage_5')
    })
  })

  describe('catégorie streak (vérifie best_streak)', () => {
    it('débloque streak_4 avec bestStreak = 4', () => {
      const result = checkBadges({ ...baseParams, user: { ...baseUser, bestStreak: 4 } })
      expect(result.map(b => b.id)).toContain('streak_4')
    })

    it('ne débloque pas streak_8 avec bestStreak = 4', () => {
      const result = checkBadges({ ...baseParams, user: { ...baseUser, bestStreak: 4 } })
      expect(result.map(b => b.id)).not.toContain('streak_8')
    })
  })

  describe('catégorie level', () => {
    it('débloque level_2 au niveau 2', () => {
      const result = checkBadges({ ...baseParams, user: { ...baseUser, level: 2 } })
      expect(result.map(b => b.id)).toContain('level_2')
    })

    it('débloque level_5 et level_2 au niveau 5', () => {
      const result = checkBadges({ ...baseParams, user: { ...baseUser, level: 5 } })
      const ids = result.map(b => b.id)
      expect(ids).toContain('level_2')
      expect(ids).toContain('level_5')
    })
  })

  describe('catégorie pr', () => {
    it('débloque pr_1 avec totalPrs = 1', () => {
      const result = checkBadges({ ...baseParams, user: { ...baseUser, totalPrs: 1 } })
      expect(result.map(b => b.id)).toContain('pr_1')
    })

    it('débloque pr_5 avec totalPrs = 5', () => {
      const result = checkBadges({ ...baseParams, user: { ...baseUser, totalPrs: 5 } })
      const ids = result.map(b => b.id)
      expect(ids).toContain('pr_1')
      expect(ids).toContain('pr_5')
    })
  })

  describe('catégorie session_volume', () => {
    it('débloque session_vol_200 avec sessionVolume = 200', () => {
      const result = checkBadges({ ...baseParams, sessionVolume: 200 })
      expect(result.map(b => b.id)).toContain('session_vol_200')
    })

    it('ne débloque pas session_vol_500 avec sessionVolume = 200', () => {
      const result = checkBadges({ ...baseParams, sessionVolume: 200 })
      expect(result.map(b => b.id)).not.toContain('session_vol_500')
    })
  })

  describe('catégorie exercises', () => {
    it('débloque exercises_5 avec distinctExerciseCount = 5', () => {
      const result = checkBadges({ ...baseParams, distinctExerciseCount: 5 })
      expect(result.map(b => b.id)).toContain('exercises_5')
    })

    it('ne débloque pas exercises_10 avec distinctExerciseCount = 5', () => {
      const result = checkBadges({ ...baseParams, distinctExerciseCount: 5 })
      expect(result.map(b => b.id)).not.toContain('exercises_10')
    })
  })

  it('retourne plusieurs badges si plusieurs seuils franchis simultanément', () => {
    const result = checkBadges({
      ...baseParams,
      sessionCount: 1,
      user: { totalTonnage: 1000, bestStreak: 2, level: 2, totalPrs: 1 },
      sessionVolume: 200,
      distinctExerciseCount: 5,
    })
    expect(result.length).toBeGreaterThan(4)
  })
})
