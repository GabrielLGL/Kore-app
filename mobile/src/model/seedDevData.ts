import { database } from './index'
import type { Model } from '@nozbe/watermelondb'
import type Program from './models/Program'
import type Session from './models/Session'
import type SessionExercise from './models/SessionExercise'
import type Exercise from './models/Exercise'
import type History from './models/History'
import type SetRecord from './models/Set'
import type PerformanceLog from './models/PerformanceLog'
import type BodyMeasurement from './models/BodyMeasurement'
import type User from './models/User'

// --- Types ---
type SetTuple = [weight: number, reps: number]

interface ExerciseDef {
  name: string
  setsTarget: number
  repsTarget: string
  weightTarget?: number
}

interface SessionDef {
  name: string
  position: number
  exercises: ExerciseDef[]
}

interface ProgramDef {
  name: string
  position: number
  sessions: SessionDef[]
}

interface WorkoutExercise {
  name: string
  sets: SetTuple[]
}

interface WorkoutDef {
  sessionName: string
  daysAgo: number
  durationMin: number
  note: string | null
  exercises: WorkoutExercise[]
}

interface MeasurementDef {
  daysAgo: number
  weight: number
  waist: number
  hips: number
  chest: number
  arms: number
}

// --- Programmes ---
const PROGRAMS: ProgramDef[] = [
  {
    name: 'Push Pull Legs',
    position: 0,
    sessions: [
      {
        name: 'Push', position: 0,
        exercises: [
          { name: 'Développé Couché Barre', setsTarget: 4, repsTarget: '10', weightTarget: 80 },
          { name: 'Développé Incliné Haltères', setsTarget: 3, repsTarget: '12', weightTarget: 30 },
          { name: 'Écartés Poulie', setsTarget: 3, repsTarget: '15' },
          { name: 'Développé Militaire', setsTarget: 4, repsTarget: '8', weightTarget: 50 },
          { name: 'Élévations Latérales', setsTarget: 3, repsTarget: '15', weightTarget: 12 },
          { name: 'Extensions Poulie Haute', setsTarget: 3, repsTarget: '12', weightTarget: 25 },
        ],
      },
      {
        name: 'Pull', position: 1,
        exercises: [
          { name: 'Tractions', setsTarget: 4, repsTarget: '8' },
          { name: 'Rowing Barre', setsTarget: 4, repsTarget: '10', weightTarget: 70 },
          { name: 'Tirage Poitrine', setsTarget: 3, repsTarget: '12', weightTarget: 55 },
          { name: 'Face Pull', setsTarget: 3, repsTarget: '15', weightTarget: 20 },
          { name: 'Curl Barre EZ', setsTarget: 3, repsTarget: '12', weightTarget: 30 },
          { name: 'Curl Marteau', setsTarget: 3, repsTarget: '10', weightTarget: 14 },
        ],
      },
      {
        name: 'Legs', position: 2,
        exercises: [
          { name: 'Squat Arrière', setsTarget: 5, repsTarget: '5', weightTarget: 100 },
          { name: 'Presse à Cuisses', setsTarget: 4, repsTarget: '12', weightTarget: 180 },
          { name: 'Leg Extension', setsTarget: 3, repsTarget: '15', weightTarget: 40 },
          { name: 'Soulevé de Terre Roumain', setsTarget: 4, repsTarget: '10', weightTarget: 80 },
          { name: 'Leg Curl Allongé', setsTarget: 3, repsTarget: '12', weightTarget: 35 },
          { name: 'Extensions Mollets Debout', setsTarget: 4, repsTarget: '15', weightTarget: 60 },
        ],
      },
    ],
  },
  {
    name: 'Full Body',
    position: 1,
    sessions: [
      {
        name: 'Full Body A', position: 0,
        exercises: [
          { name: 'Squat Arrière', setsTarget: 4, repsTarget: '8', weightTarget: 90 },
          { name: 'Développé Couché Barre', setsTarget: 4, repsTarget: '8', weightTarget: 75 },
          { name: 'Rowing Barre', setsTarget: 4, repsTarget: '8', weightTarget: 65 },
          { name: 'Développé Militaire', setsTarget: 3, repsTarget: '10', weightTarget: 40 },
          { name: 'Curl Haltères', setsTarget: 3, repsTarget: '12', weightTarget: 14 },
        ],
      },
      {
        name: 'Full Body B', position: 1,
        exercises: [
          { name: 'Soulevé de Terre', setsTarget: 4, repsTarget: '5', weightTarget: 120 },
          { name: 'Développé Incliné Haltères', setsTarget: 4, repsTarget: '10', weightTarget: 28 },
          { name: 'Tractions', setsTarget: 4, repsTarget: '8' },
          { name: 'Élévations Latérales', setsTarget: 3, repsTarget: '15', weightTarget: 10 },
          { name: 'Dips (Triceps focus)', setsTarget: 3, repsTarget: '10' },
        ],
      },
    ],
  },
  {
    name: 'Cardio & Abdos',
    position: 2,
    sessions: [
      {
        name: 'HIIT', position: 0,
        exercises: [
          { name: 'Tapis de Course', setsTarget: 1, repsTarget: '1' },
          { name: 'Burpees', setsTarget: 3, repsTarget: '15' },
          { name: 'Mountain Climbers', setsTarget: 3, repsTarget: '20' },
          { name: 'Corde à sauter', setsTarget: 3, repsTarget: '1' },
        ],
      },
      {
        name: 'Core', position: 1,
        exercises: [
          { name: 'Crunch', setsTarget: 4, repsTarget: '20' },
          { name: 'Relevé de jambes', setsTarget: 3, repsTarget: '15' },
          { name: 'Planche', setsTarget: 3, repsTarget: '1' },
          { name: 'Russian Twist', setsTarget: 3, repsTarget: '20', weightTarget: 10 },
          { name: 'Gainage Latéral', setsTarget: 3, repsTarget: '1' },
        ],
      },
    ],
  },
]

// --- Historique des séances (30 derniers jours) ---
const WORKOUTS: WorkoutDef[] = [
  {
    sessionName: 'Push', daysAgo: 28, durationMin: 65, note: 'Bonne séance, épaules chaudes',
    exercises: [
      { name: 'Développé Couché Barre', sets: [[75, 10], [75, 10], [80, 8], [80, 8]] },
      { name: 'Développé Incliné Haltères', sets: [[28, 12], [28, 12], [30, 10]] },
      { name: 'Écartés Poulie', sets: [[15, 15], [15, 15], [15, 12]] },
      { name: 'Développé Militaire', sets: [[45, 8], [45, 8], [50, 6], [50, 6]] },
      { name: 'Élévations Latérales', sets: [[10, 15], [10, 15], [12, 12]] },
      { name: 'Extensions Poulie Haute', sets: [[22, 12], [22, 12], [25, 10]] },
    ],
  },
  {
    sessionName: 'Pull', daysAgo: 26, durationMin: 58, note: null,
    exercises: [
      { name: 'Tractions', sets: [[0, 8], [0, 8], [0, 7], [0, 6]] },
      { name: 'Rowing Barre', sets: [[65, 10], [65, 10], [70, 8], [70, 8]] },
      { name: 'Tirage Poitrine', sets: [[50, 12], [50, 12], [55, 10]] },
      { name: 'Face Pull', sets: [[18, 15], [18, 15], [20, 12]] },
      { name: 'Curl Barre EZ', sets: [[25, 12], [25, 12], [30, 10]] },
      { name: 'Curl Marteau', sets: [[12, 10], [12, 10], [14, 8]] },
    ],
  },
  {
    sessionName: 'Legs', daysAgo: 24, durationMin: 72, note: 'PR squat !',
    exercises: [
      { name: 'Squat Arrière', sets: [[90, 5], [95, 5], [100, 5], [100, 4], [100, 3]] },
      { name: 'Presse à Cuisses', sets: [[160, 12], [160, 12], [180, 10], [180, 10]] },
      { name: 'Leg Extension', sets: [[35, 15], [35, 15], [40, 12]] },
      { name: 'Soulevé de Terre Roumain', sets: [[70, 10], [70, 10], [80, 8], [80, 8]] },
      { name: 'Leg Curl Allongé', sets: [[30, 12], [30, 12], [35, 10]] },
      { name: 'Extensions Mollets Debout', sets: [[50, 15], [50, 15], [60, 12], [60, 12]] },
    ],
  },
  {
    sessionName: 'Push', daysAgo: 21, durationMin: 60, note: null,
    exercises: [
      { name: 'Développé Couché Barre', sets: [[77.5, 10], [77.5, 10], [80, 8], [82.5, 6]] },
      { name: 'Développé Incliné Haltères', sets: [[28, 12], [30, 10], [30, 10]] },
      { name: 'Écartés Poulie', sets: [[15, 15], [17.5, 12], [17.5, 12]] },
      { name: 'Développé Militaire', sets: [[45, 8], [47.5, 8], [50, 6], [50, 6]] },
      { name: 'Élévations Latérales', sets: [[10, 15], [12, 12], [12, 12]] },
      { name: 'Extensions Poulie Haute', sets: [[22, 12], [25, 10], [25, 10]] },
    ],
  },
  {
    sessionName: 'Pull', daysAgo: 19, durationMin: 55, note: 'Fatigue dos',
    exercises: [
      { name: 'Tractions', sets: [[0, 8], [0, 7], [0, 6], [0, 6]] },
      { name: 'Rowing Barre', sets: [[65, 10], [70, 8], [70, 8], [70, 7]] },
      { name: 'Tirage Poitrine', sets: [[50, 12], [55, 10], [55, 10]] },
      { name: 'Face Pull', sets: [[18, 15], [20, 12], [20, 12]] },
      { name: 'Curl Barre EZ', sets: [[27.5, 12], [27.5, 12], [30, 10]] },
      { name: 'Curl Marteau', sets: [[12, 10], [14, 8], [14, 8]] },
    ],
  },
  {
    sessionName: 'Legs', daysAgo: 17, durationMin: 70, note: null,
    exercises: [
      { name: 'Squat Arrière', sets: [[95, 5], [100, 5], [100, 4], [102.5, 3], [102.5, 3]] },
      { name: 'Presse à Cuisses', sets: [[170, 12], [180, 10], [180, 10], [190, 8]] },
      { name: 'Leg Extension', sets: [[37.5, 15], [40, 12], [40, 12]] },
      { name: 'Soulevé de Terre Roumain', sets: [[75, 10], [80, 8], [80, 8], [82.5, 6]] },
      { name: 'Leg Curl Allongé', sets: [[30, 12], [35, 10], [35, 10]] },
      { name: 'Extensions Mollets Debout', sets: [[55, 15], [60, 12], [60, 12], [65, 10]] },
    ],
  },
  {
    sessionName: 'Full Body A', daysAgo: 14, durationMin: 50, note: null,
    exercises: [
      { name: 'Squat Arrière', sets: [[85, 8], [85, 8], [90, 6], [90, 6]] },
      { name: 'Développé Couché Barre', sets: [[70, 8], [75, 8], [75, 7], [75, 7]] },
      { name: 'Rowing Barre', sets: [[60, 8], [65, 8], [65, 8], [65, 7]] },
      { name: 'Développé Militaire', sets: [[37.5, 10], [40, 8], [40, 8]] },
      { name: 'Curl Haltères', sets: [[12, 12], [12, 12], [14, 10]] },
    ],
  },
  {
    sessionName: 'Push', daysAgo: 10, durationMin: 63, note: 'Augmenté DC à 85',
    exercises: [
      { name: 'Développé Couché Barre', sets: [[80, 10], [80, 8], [82.5, 6], [85, 4]] },
      { name: 'Développé Incliné Haltères', sets: [[30, 12], [30, 10], [32, 8]] },
      { name: 'Écartés Poulie', sets: [[17.5, 15], [17.5, 12], [20, 10]] },
      { name: 'Développé Militaire', sets: [[47.5, 8], [50, 6], [50, 6], [52.5, 4]] },
      { name: 'Élévations Latérales', sets: [[12, 15], [12, 12], [14, 10]] },
      { name: 'Extensions Poulie Haute', sets: [[25, 12], [25, 10], [27.5, 8]] },
    ],
  },
  {
    sessionName: 'Pull', daysAgo: 7, durationMin: 57, note: null,
    exercises: [
      { name: 'Tractions', sets: [[0, 9], [0, 8], [0, 7], [0, 7]] },
      { name: 'Rowing Barre', sets: [[70, 10], [70, 10], [72.5, 8], [75, 6]] },
      { name: 'Tirage Poitrine', sets: [[55, 12], [55, 10], [57.5, 10]] },
      { name: 'Face Pull', sets: [[20, 15], [20, 12], [22, 10]] },
      { name: 'Curl Barre EZ', sets: [[30, 12], [30, 10], [32.5, 8]] },
      { name: 'Curl Marteau', sets: [[14, 10], [14, 10], [16, 8]] },
    ],
  },
  {
    sessionName: 'Legs', daysAgo: 3, durationMin: 75, note: 'Nouveau PR squat 110',
    exercises: [
      { name: 'Squat Arrière', sets: [[100, 5], [105, 3], [107.5, 2], [110, 1], [100, 5]] },
      { name: 'Presse à Cuisses', sets: [[180, 12], [190, 8], [200, 6], [200, 6]] },
      { name: 'Leg Extension', sets: [[40, 15], [42.5, 12], [45, 10]] },
      { name: 'Soulevé de Terre Roumain', sets: [[80, 10], [85, 6], [85, 6], [85, 5]] },
      { name: 'Leg Curl Allongé', sets: [[35, 12], [37.5, 10], [37.5, 10]] },
      { name: 'Extensions Mollets Debout', sets: [[60, 15], [65, 12], [65, 12], [70, 10]] },
    ],
  },
]

// --- Mesures corporelles (progression sur 3 mois) ---
const MEASUREMENTS: MeasurementDef[] = [
  { daysAgo: 90, weight: 82.5, waist: 85, hips: 98, chest: 105, arms: 36 },
  { daysAgo: 60, weight: 81.0, waist: 83, hips: 97, chest: 106, arms: 36.5 },
  { daysAgo: 30, weight: 80.0, waist: 82, hips: 97, chest: 107, arms: 37 },
  { daysAgo: 1, weight: 79.5, waist: 81, hips: 96, chest: 108, arms: 37.5 },
]

const DAY_MS = 24 * 60 * 60 * 1000

/** Accès typé aux colonnes raw pour backdater les timestamps readonly (seed data) */
const raw = (record: Model) =>
  record._raw as unknown as Record<string, number | string | boolean | null>

export const seedDevData = async () => {
  try {
    await database.write(async () => {
      // Guard : ne pas re-seeder si des programmes existent déjà
      const programCount = await database.get<Program>('programs').query().fetchCount()
      if (programCount > 0) return

      // Récupérer tous les exercices existants → Map<nom, Exercise>
      const allExercises = await database.get<Exercise>('exercises').query().fetch()
      const byName = new Map(allExercises.map(e => [e.name, e]))

      const batch: Model[] = []
      const sessionsByName = new Map<string, Session>()

      // === Programmes, Sessions, SessionExercises ===
      for (const progDef of PROGRAMS) {
        const program = database.get<Program>('programs').prepareCreate(p => {
          p.name = progDef.name
          p.position = progDef.position
        })
        batch.push(program)

        for (const sessDef of progDef.sessions) {
          const session = database.get<Session>('sessions').prepareCreate(s => {
            s.name = sessDef.name
            s.position = sessDef.position
            s.program.set(program)
          })
          batch.push(session)
          sessionsByName.set(sessDef.name, session)

          for (let i = 0; i < sessDef.exercises.length; i++) {
            const exoDef = sessDef.exercises[i]
            const exercise = byName.get(exoDef.name)
            if (!exercise) continue

            batch.push(
              database.get<SessionExercise>('session_exercises').prepareCreate(se => {
                se.session.set(session)
                se.exercise.set(exercise)
                se.position = i
                se.setsTarget = exoDef.setsTarget
                se.repsTarget = exoDef.repsTarget
                if (exoDef.weightTarget !== undefined) {
                  se.weightTarget = exoDef.weightTarget
                }
              })
            )
          }
        }
      }

      // === Historiques, Sets, PerformanceLogs ===
      const now = Date.now()
      const prTracker = new Map<string, number>()

      for (const w of WORKOUTS) {
        const session = sessionsByName.get(w.sessionName)
        if (!session) continue

        const startTime = now - w.daysAgo * DAY_MS
        const endTime = startTime + w.durationMin * 60 * 1000

        const history = database.get<History>('histories').prepareCreate(h => {
          h.session.set(session)
          h.startTime = new Date(startTime)
          h.endTime = new Date(endTime)
          if (w.note) h.note = w.note
          raw(h).created_at = startTime
          raw(h).updated_at = startTime
        })
        batch.push(history)

        // Pré-calculer les PRs pour ce workout (un seul PR par exercice)
        const exercisePRWeight = new Map<string, number>()
        for (const exo of w.exercises) {
          const maxW = Math.max(...exo.sets.map(([wt]) => wt))
          const prevMax = prTracker.get(exo.name) ?? 0
          if (maxW > 0 && maxW > prevMax) {
            exercisePRWeight.set(exo.name, maxW)
            prTracker.set(exo.name, maxW)
          }
        }

        for (const exo of w.exercises) {
          const exercise = byName.get(exo.name)
          if (!exercise) continue

          let bestWeight = 0
          let bestReps = 0
          let prMarked = false
          const prWeight = exercisePRWeight.get(exo.name)

          for (let i = 0; i < exo.sets.length; i++) {
            const [weight, reps] = exo.sets[i]
            const isPr = !prMarked && prWeight !== undefined && weight === prWeight
            if (isPr) prMarked = true

            if (weight > bestWeight || (weight === bestWeight && reps > bestReps)) {
              bestWeight = weight
              bestReps = reps
            }

            batch.push(
              database.get<SetRecord>('sets').prepareCreate(s => {
                s.history.set(history)
                s.exercise.set(exercise)
                s.weight = weight
                s.reps = reps
                s.setOrder = i
                s.isPr = isPr
                raw(s).created_at = startTime
                raw(s).updated_at = startTime
              })
            )
          }

          // PerformanceLog — résumé de la séance pour cet exercice
          batch.push(
            database.get<PerformanceLog>('performance_logs').prepareCreate(pl => {
              pl.exercise.set(exercise)
              pl.sets = exo.sets.length
              pl.weight = bestWeight
              pl.reps = bestReps
              raw(pl).created_at = startTime
            })
          )
        }
      }

      // === Mesures corporelles ===
      for (const m of MEASUREMENTS) {
        const ts = now - m.daysAgo * DAY_MS
        batch.push(
          database.get<BodyMeasurement>('body_measurements').prepareCreate(bm => {
            bm.date = ts
            bm.weight = m.weight
            bm.waist = m.waist
            bm.hips = m.hips
            bm.chest = m.chest
            bm.arms = m.arms
            raw(bm).created_at = ts
            raw(bm).updated_at = ts
          })
        )
      }

      // === Mise à jour utilisateur ===
      const users = await database.get<User>('users').query().fetch()
      if (users.length > 0) {
        batch.push(
          users[0].prepareUpdate(u => {
            u.name = 'Gabriel'
            u.onboardingCompleted = true
            u.restDuration = 90
          })
        )
      }

      await database.batch(...batch)
    })
  } catch (error) {
    if (__DEV__) console.error('❌ Erreur seedDevData:', error)
  }
}
