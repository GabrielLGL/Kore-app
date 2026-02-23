import { calcWeeklyVolumeByMuscle, distributeVolumeToSessions } from '../volumeCalculator'
import { MAX_SETS_PER_MUSCLE_PER_SESSION, MAX_TOTAL_SETS_PER_SESSION } from '../tables'
import type { UserProfile, MuscleGroup } from '../types'

const baseProfile: UserProfile = {
  goal: 'hypertrophy',
  level: 'beginner',
  daysPerWeek: 3,
  minutesPerSession: 60,
  equipment: ['barbell', 'dumbbell'],
  injuries: [],
  posturalIssues: false,
}

describe('calcWeeklyVolumeByMuscle — cas supplémentaires', () => {
  it('advanced hypertrophy → volumes plus élevés que beginner', () => {
    const beginnerVol = calcWeeklyVolumeByMuscle(baseProfile)
    const advancedVol = calcWeeklyVolumeByMuscle({ ...baseProfile, level: 'advanced' })
    expect(advancedVol.chest).toBeGreaterThan(beginnerVol.chest)
    expect(advancedVol.back).toBeGreaterThan(beginnerVol.back)
  })

  it('strength → volumes inférieurs à hypertrophy pour même niveau', () => {
    const hypertrophyVol = calcWeeklyVolumeByMuscle(baseProfile)
    const strengthVol = calcWeeklyVolumeByMuscle({ ...baseProfile, goal: 'strength' })
    expect(strengthVol.chest).toBeLessThan(hypertrophyVol.chest)
  })

  it('petits muscles (biceps, triceps) reçoivent moins de volume', () => {
    const vol = calcWeeklyVolumeByMuscle(baseProfile)
    expect(vol.biceps).toBeLessThan(vol.chest)
    expect(vol.triceps).toBeLessThan(vol.back)
  })

  it('posturalIssues boost core en plus de back et glutes', () => {
    const normal = calcWeeklyVolumeByMuscle(baseProfile)
    const postural = calcWeeklyVolumeByMuscle({ ...baseProfile, posturalIssues: true })
    expect(postural.core).toBeGreaterThan(normal.core)
  })

  it('séance courte (<45min) ne supprime pas les muscles composés', () => {
    const vol = calcWeeklyVolumeByMuscle({ ...baseProfile, minutesPerSession: 40 })
    expect(vol.chest).toBeGreaterThan(0)
    expect(vol.back).toBeGreaterThan(0)
    expect(vol.quads).toBeGreaterThan(0)
  })

  it('fat_loss intermediate → retourne des volumes valides', () => {
    const vol = calcWeeklyVolumeByMuscle({
      ...baseProfile,
      goal: 'fat_loss',
      level: 'intermediate',
    })
    expect(vol.chest).toBeGreaterThan(0)
    expect(vol.back).toBeGreaterThan(0)
  })

  it('general_fitness beginner → retourne des volumes valides', () => {
    const vol = calcWeeklyVolumeByMuscle({
      ...baseProfile,
      goal: 'general_fitness',
      level: 'beginner',
    })
    expect(vol.chest).toBeGreaterThan(0)
  })
})

describe('distributeVolumeToSessions — cas supplémentaires', () => {
  it('respecte MAX_SETS_PER_MUSCLE_PER_SESSION pour chaque muscle', () => {
    const volume: Record<MuscleGroup, number> = {
      chest: 20, back: 20, shoulders: 16, biceps: 12, triceps: 12,
      quads: 20, hamstrings: 16, glutes: 14, calves: 8, core: 10, traps: 8,
    }
    const schedule: MuscleGroup[][] = [
      ['chest', 'shoulders', 'triceps'],
      ['back', 'biceps', 'traps'],
      ['quads', 'hamstrings', 'glutes', 'calves', 'core'],
    ]
    const sessions = distributeVolumeToSessions(volume, schedule)
    for (const session of sessions) {
      for (const muscle of Object.keys(session) as MuscleGroup[]) {
        expect(session[muscle]).toBeLessThanOrEqual(MAX_SETS_PER_MUSCLE_PER_SESSION)
      }
    }
  })

  it('une seule séance → tout le volume concentré', () => {
    const volume = calcWeeklyVolumeByMuscle(baseProfile)
    const allMuscles: MuscleGroup[] = [
      'chest', 'back', 'shoulders', 'biceps', 'triceps',
      'quads', 'hamstrings', 'glutes', 'calves', 'core', 'traps',
    ]
    const schedule: MuscleGroup[][] = [allMuscles]
    const sessions = distributeVolumeToSessions(volume, schedule)
    expect(sessions).toHaveLength(1)
    const totalSets = Object.values(sessions[0]).reduce((a, b) => a + b, 0)
    expect(totalSets).toBeLessThanOrEqual(MAX_TOTAL_SETS_PER_SESSION)
  })

  it('muscles absents du schedule → pas de séries', () => {
    const volume = calcWeeklyVolumeByMuscle(baseProfile)
    const schedule: MuscleGroup[][] = [['chest', 'triceps']]
    const sessions = distributeVolumeToSessions(volume, schedule)
    expect(sessions[0].back).toBeUndefined()
    expect(sessions[0].quads).toBeUndefined()
  })
})
