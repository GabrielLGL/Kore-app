/**
 * workoutSetUtils.ts — Opérations sur les séries (save, delete, max poids)
 */

import { Q } from '@nozbe/watermelondb'
import { database } from '../index'
import Exercise from '../models/Exercise'
import History from '../models/History'
import WorkoutSet from '../models/Set'

/**
 * Retourne le poids maximum jamais enregistre pour un exercice,
 * en excluant la seance en cours pour ne comparer qu'avec les seances passees.
 *
 * @param exerciseId - ID de l'exercice
 * @param excludeHistoryId - ID de la History en cours (a exclure)
 * @returns Le max poids, ou 0 si aucun historique precedent
 */
export async function getMaxWeightForExercise(
  exerciseId: string,
  excludeHistoryId: string
): Promise<number> {
  const sets = await database
    .get<WorkoutSet>('sets')
    .query(
      Q.where('exercise_id', exerciseId),
      Q.where('history_id', Q.notEq(excludeHistoryId))
    )
    .fetch()

  if (sets.length === 0) return 0
  return Math.max(...sets.map(s => s.weight))
}

/**
 * Sauvegarde une serie reelle effectuee pendant une seance en direct.
 *
 * @param params - Donnees de la serie (historyId, exerciseId, weight, reps, setOrder, isPr)
 * @returns L'instance Set créée
 */
export async function saveWorkoutSet(params: {
  historyId: string
  exerciseId: string
  weight: number
  reps: number
  setOrder: number
  isPr: boolean
}): Promise<WorkoutSet> {
  return await database.write(async () => {
    const history = await database.get<History>('histories').find(params.historyId)
    const exercise = await database.get<Exercise>('exercises').find(params.exerciseId)
    return await database.get<WorkoutSet>('sets').create(record => {
      record.history.set(history)
      record.exercise.set(exercise)
      record.weight = params.weight
      record.reps = params.reps
      record.setOrder = params.setOrder
      record.isPr = params.isPr
    })
  })
}

/**
 * Supprime une serie enregistree pendant une seance en direct.
 *
 * Utile pour devalider une serie si l'utilisateur s'est trompe.
 *
 * @param historyId - ID de la History en cours
 * @param exerciseId - ID de l'exercice
 * @param setOrder - Ordre de la serie (1-based)
 */
export async function deleteWorkoutSet(
  historyId: string,
  exerciseId: string,
  setOrder: number
): Promise<void> {
  await database.write(async () => {
    const sets = await database
      .get<WorkoutSet>('sets')
      .query(
        Q.where('history_id', historyId),
        Q.where('exercise_id', exerciseId),
        Q.where('set_order', setOrder)
      )
      .fetch()

    if (sets.length === 0) return

    await sets[0].destroyPermanently()
  })
}
