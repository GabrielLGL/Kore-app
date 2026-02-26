/**
 * programImportUtils.ts — Import de programmes preset + onboarding
 */

import { Q } from '@nozbe/watermelondb'
import { database } from '../index'
import Exercise from '../models/Exercise'
import Program from '../models/Program'
import Session from '../models/Session'
import SessionExercise from '../models/SessionExercise'
import User from '../models/User'
import type { PresetProgram } from '../onboardingPrograms'

/**
 * Importe un programme pre-configure en base en une seule transaction atomique.
 *
 * Cree le Programme, ses Seances, et les SessionExercises en un seul database.batch().
 * Les exercices introuvables sont ignores silencieusement (console.warn).
 *
 * @param preset - Structure PresetProgram depuis onboardingPrograms.ts
 */
export async function importPresetProgram(preset: PresetProgram): Promise<void> {
  // Lectures hors transaction — on filtre par les noms attendus pour éviter de charger toute la table
  const exerciseNames = preset.sessions.flatMap(s => s.exercises.map(e => e.exerciseName))
  const exercises = exerciseNames.length > 0
    ? await database.get<Exercise>('exercises').query(Q.where('name', Q.oneOf(exerciseNames))).fetch()
    : []
  const programCount = await database.get<Program>('programs').query().fetchCount()

  const exercisesByName = new Map(exercises.map(e => [e.name, e]))

  // Preparation de tous les records
  const batch: (Program | Session | SessionExercise)[] = []

  const newProgram = database.get<Program>('programs').prepareCreate(p => {
    p.name = preset.name
    p.position = programCount
  })
  batch.push(newProgram)

  preset.sessions.forEach((presetSession, si) => {
    const newSession = database.get<Session>('sessions').prepareCreate(s => {
      s.program.set(newProgram)
      s.name = presetSession.name
      s.position = si
    })
    batch.push(newSession)

    presetSession.exercises.forEach((presetEx, ei) => {
      const exercise = exercisesByName.get(presetEx.exerciseName)
      if (!exercise) {
        if (__DEV__) console.warn(`[importPresetProgram] Exercice introuvable : "${presetEx.exerciseName}"`)
        return
      }
      batch.push(
        database.get<SessionExercise>('session_exercises').prepareCreate(se => {
          se.session.set(newSession)
          se.exercise.set(exercise)
          se.setsTarget = presetEx.setsTarget
          se.repsTarget = presetEx.repsTarget
          se.weightTarget = presetEx.weightTarget
          se.position = ei
        })
      )
    })
  })

  await database.write(async () => {
    await database.batch(...batch)
  })
}

/**
 * Marque l'onboarding comme termine pour le premier utilisateur.
 */
export async function markOnboardingCompleted(): Promise<void> {
  await database.write(async () => {
    const users = await database.get<User>('users').query().fetch()
    if (users.length === 0) return
    await users[0].update(u => {
      u.onboardingCompleted = true
    })
  })
}
