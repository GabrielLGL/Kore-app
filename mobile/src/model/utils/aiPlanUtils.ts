/**
 * aiPlanUtils.ts — Import de plans générés par l'IA
 * Fonctions internes non exportées : collectExerciseNames, resolveExercisesForBatch
 */

import { Q } from '@nozbe/watermelondb'
import { database } from '../index'
import Exercise from '../models/Exercise'
import Program from '../models/Program'
import Session from '../models/Session'
import SessionExercise from '../models/SessionExercise'
import type { GeneratedPlan, GeneratedSession } from '../../services/ai/types'

/**
 * Retourne la liste des noms d'exercices uniques présents dans un plan généré.
 */
function collectExerciseNames(sessions: GeneratedPlan['sessions']): string[] {
  const names = new Set<string>()
  sessions.forEach(s => s.exercises.forEach(e => names.add(e.exerciseName)))
  return Array.from(names)
}

/**
 * Résout tous les noms d'exercices générés par l'IA vers des exercices en DB.
 * Les exercices introuvables sont préparés via prepareCreate pour être inclus
 * dans le batch principal — aucune transaction séparée n'est ouverte.
 *
 * @returns Map nom → Exercise (existant ou prepareCreate prêt pour batch)
 */
function resolveExercisesForBatch(
  names: string[],
  exercisesByName: Map<string, Exercise>,
  exercisesByNameLower: Map<string, Exercise>
): { resolved: Map<string, Exercise>; newExercises: Exercise[] } {
  const resolved = new Map<string, Exercise>()
  const newExercises: Exercise[] = []

  for (const name of names) {
    const exact = exercisesByName.get(name)
    if (exact) { resolved.set(name, exact); continue }

    const lower = exercisesByNameLower.get(name.toLowerCase())
    if (lower) { resolved.set(name, lower); continue }

    // Prépare un nouvel exercice custom pour le batch
    const newEx = database.get<Exercise>('exercises').prepareCreate(ex => {
      ex.name = name
      ex.isCustom = true
    })
    newExercises.push(newEx)
    resolved.set(name, newEx)
  }

  return { resolved, newExercises }
}

/**
 * Importe un plan généré par l'IA en tant que Programme complet.
 * Crée Program + Sessions + SessionExercises + éventuels exercices custom
 * en une seule transaction atomique (un seul database.batch).
 *
 * @param plan - Plan généré par l'IA
 * @returns Le Program créé
 */
export async function importGeneratedPlan(plan: GeneratedPlan): Promise<Program> {
  const names = collectExerciseNames(plan.sessions)
  const exercises = names.length > 0
    ? await database.get<Exercise>('exercises').query(Q.where('name', Q.oneOf(names))).fetch()
    : []
  const programCount = await database.get<Program>('programs').query().fetchCount()
  const exercisesByName = new Map(exercises.map(e => [e.name, e]))
  const exercisesByNameLower = new Map(exercises.map(e => [e.name.toLowerCase(), e]))

  const { resolved, newExercises } = resolveExercisesForBatch(names, exercisesByName, exercisesByNameLower)

  const newProgram = database.get<Program>('programs').prepareCreate(p => {
    p.name = plan.name
    p.position = programCount
  })

  const sessionRecords: Session[] = []
  const seRecords: SessionExercise[] = []

  plan.sessions.forEach((genSession, si) => {
    const newSession = database.get<Session>('sessions').prepareCreate(s => {
      s.program.set(newProgram)
      s.name = genSession.name
      s.position = si
    })
    sessionRecords.push(newSession)

    genSession.exercises.forEach((genEx, ei) => {
      const exercise = resolved.get(genEx.exerciseName)
      if (!exercise) return
      seRecords.push(
        database.get<SessionExercise>('session_exercises').prepareCreate(se => {
          se.session.set(newSession)
          se.exercise.set(exercise)
          se.setsTarget = genEx.setsTarget
          se.repsTarget = genEx.repsTarget
          se.weightTarget = genEx.weightTarget
          se.position = ei
        })
      )
    })
  })

  await database.write(async () => {
    await database.batch(newProgram, ...newExercises, ...sessionRecords, ...seRecords)
  })

  return newProgram
}

/**
 * Importe une séance générée par l'IA et la rattache à un programme existant.
 * Crée Session + SessionExercises + éventuels exercices custom en une seule transaction.
 *
 * @param genSession - Séance générée
 * @param programId - ID du programme cible
 * @returns La Session créée
 */
export async function importGeneratedSession(
  genSession: GeneratedSession,
  programId: string
): Promise<Session> {
  const names = genSession.exercises.map(e => e.exerciseName)
  const exercises = names.length > 0
    ? await database.get<Exercise>('exercises').query(Q.where('name', Q.oneOf(names))).fetch()
    : []
  const program = await database.get<Program>('programs').find(programId)
  const sessionCount = await database
    .get<Session>('sessions')
    .query(Q.where('program_id', programId))
    .fetchCount()

  const exercisesByName = new Map(exercises.map(e => [e.name, e]))
  const exercisesByNameLower = new Map(exercises.map(e => [e.name.toLowerCase(), e]))

  const { resolved, newExercises } = resolveExercisesForBatch(names, exercisesByName, exercisesByNameLower)

  const newSession = database.get<Session>('sessions').prepareCreate(s => {
    s.program.set(program)
    s.name = genSession.name
    s.position = sessionCount
  })

  const seBatch = genSession.exercises
    .map((genEx, ei) => {
      const exercise = resolved.get(genEx.exerciseName)
      if (!exercise) return null
      return database.get<SessionExercise>('session_exercises').prepareCreate(se => {
        se.session.set(newSession)
        se.exercise.set(exercise)
        se.setsTarget = genEx.setsTarget
        se.repsTarget = genEx.repsTarget
        se.weightTarget = genEx.weightTarget
        se.position = ei
      })
    })
    .filter((se): se is SessionExercise => se !== null)

  await database.write(async () => {
    await database.batch(newSession, ...newExercises, ...seBatch)
  })

  return newSession
}
