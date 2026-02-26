/**
 * workoutSessionUtils.ts — Gestion du cycle de vie d'une séance
 * (créer, compléter, noter, volume)
 */

import { Q } from '@nozbe/watermelondb'
import { database } from '../index'
import History from '../models/History'
import Session from '../models/Session'
import WorkoutSet from '../models/Set'

/**
 * Crée une entrée History en base pour démarrer une séance en direct
 *
 * @param sessionId - ID de la session à lancer
 * @param startTime - Timestamp de démarrage (défaut: Date.now())
 * @returns L'instance History créée
 *
 * @example
 * const history = await createWorkoutHistory(session.id, Date.now())
 * historyRef.current = history
 */
export async function createWorkoutHistory(
  sessionId: string,
  startTime: number = Date.now()
): Promise<History> {
  return await database.write(async () => {
    const session = await database.get<Session>('sessions').find(sessionId)
    return await database.get<History>('histories').create(record => {
      record.session.set(session)
      record.startTime = new Date(startTime)
    })
  })
}

/**
 * Cloture une seance en direct en renseignant end_time.
 *
 * @param historyId - ID de la History a clore
 * @param endTime - Timestamp de fin (Date.now())
 */
export async function completeWorkoutHistory(
  historyId: string,
  endTime: number
): Promise<void> {
  await database.write(async () => {
    const history = await database.get<History>('histories').find(historyId)
    await history.update(h => {
      h.endTime = new Date(endTime)
    })
  })
}

/**
 * Met a jour la note libre d'une seance.
 *
 * @param historyId - ID de la History
 * @param note - Texte de la note
 */
export async function updateHistoryNote(
  historyId: string,
  note: string
): Promise<void> {
  await database.write(async () => {
    const history = await database.get<History>('histories').find(historyId)
    await history.update(h => {
      h.note = note
    })
  })
}

/**
 * Retourne le volume total (somme reps × poids) de la dernière séance terminée
 * pour une session donnée, en excluant la séance en cours.
 *
 * @param sessionId - ID de la Session
 * @param excludeHistoryId - ID de la History en cours (à exclure)
 * @returns Volume total en kg, ou null si aucune séance précédente
 */
export async function getLastSessionVolume(
  sessionId: string,
  excludeHistoryId: string
): Promise<number | null> {
  const histories = await database
    .get<History>('histories')
    .query(
      Q.where('session_id', sessionId),
      Q.where('deleted_at', null),
      Q.where('id', Q.notEq(excludeHistoryId))
    )
    .fetch()

  const completed = histories.filter(h => h.endTime != null)
  if (completed.length === 0) return null

  const mostRecent = completed.sort(
    (a, b) => b.startTime.getTime() - a.startTime.getTime()
  )[0]

  const sets = await database
    .get<WorkoutSet>('sets')
    .query(Q.where('history_id', mostRecent.id))
    .fetch()

  return sets.reduce((sum, s) => sum + s.weight * s.reps, 0)
}
