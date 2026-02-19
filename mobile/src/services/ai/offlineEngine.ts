import type { AIProvider, AIFormData, DBContext, GeneratedPlan, GeneratedExercise, GeneratedSession } from './types'

// Séries × reps par objectif
const SETS_REPS: Record<string, { sets: number; reps: string }> = {
  bodybuilding: { sets: 4, reps: '8'  },
  power:        { sets: 5, reps: '5'  },
  renfo:        { sets: 3, reps: '12' },
  cardio:       { sets: 3, reps: '15' },
}

// Nombre d'exercices par séance selon la durée
function exercisesCount(durationMin: number): number {
  if (durationMin <= 30) return 4
  if (durationMin <= 45) return 5
  if (durationMin <= 60) return 6
  return 8
}

// Groupes musculaires par split
const SPLITS: Record<string, string[][]> = {
  fullbody: [['Pecs', 'Dos', 'Quadriceps', 'Epaules', 'Abdos']],
  upperlower: [
    ['Pecs', 'Dos', 'Epaules', 'Biceps', 'Triceps'],
    ['Quadriceps', 'Ischios', 'Mollets', 'Abdos'],
  ],
  ppl: [
    ['Pecs', 'Epaules', 'Triceps'],
    ['Dos', 'Biceps', 'Trapèzes'],
    ['Quadriceps', 'Ischios', 'Mollets', 'Abdos'],
  ],
}

function getSplit(days: number): string[][] {
  if (days <= 3) return SPLITS.fullbody
  if (days <= 4) return SPLITS.upperlower
  return SPLITS.ppl
}

// Noms de séances selon le split
const SESSION_NAMES: Record<string, string[]> = {
  fullbody:   ['Full Body A', 'Full Body B', 'Full Body C', 'Full Body D', 'Full Body E', 'Full Body F'],
  upperlower: ['Upper Body', 'Lower Body', 'Upper Body B', 'Lower Body B', 'Upper Body C', 'Lower Body C'],
  ppl:        ['Push', 'Pull', 'Legs', 'Push B', 'Pull B', 'Legs B'],
}

function getSplitName(days: number): string {
  if (days <= 3) return 'fullbody'
  if (days <= 4) return 'upperlower'
  return 'ppl'
}

// Construit une séance avec N exercices depuis la liste disponible
function buildSession(
  name: string,
  availableExercises: string[],
  count: number,
  goal: string,
  usedExercises: Set<string>
): GeneratedSession {
  const { sets, reps } = SETS_REPS[goal] ?? SETS_REPS.bodybuilding
  const picked: GeneratedExercise[] = []
  const pool = availableExercises.filter(e => !usedExercises.has(e))
  const source = pool.length >= count ? pool : availableExercises

  for (let i = 0; i < count && i < source.length; i++) {
    const name = source[i % source.length]
    usedExercises.add(name)
    picked.push({ exerciseName: name, setsTarget: sets, repsTarget: reps, weightTarget: 0 })
  }

  return { name, exercises: picked }
}

// Génération programme
function generateProgram(form: AIFormData, context: DBContext): GeneratedPlan {
  const days = form.daysPerWeek ?? 3
  const splitName = getSplitName(days)
  const splitGroups = getSplit(days)
  const sessionNames = SESSION_NAMES[splitName]
  const count = exercisesCount(form.durationMin)
  const usedExercises = new Set<string>()

  const sessions: GeneratedSession[] = []
  for (let i = 0; i < days; i++) {
    const groupIndex = i % splitGroups.length
    const sessionName = sessionNames[i] ?? `Séance ${i + 1}`
    // Priorité aux exercices disponibles, sinon tout
    const pool = context.exercises.length > 0 ? context.exercises : splitGroups[groupIndex]
    sessions.push(buildSession(sessionName, pool, count, form.goal, usedExercises))
  }

  const goalLabels: Record<string, string> = {
    bodybuilding: 'Bodybuilding',
    power:        'Power',
    renfo:        'Renfo',
    cardio:       'Cardio',
  }
  const levelLabels: Record<string, string> = {
    'débutant':      'Débutant',
    'intermédiaire': 'Intermédiaire',
    'avancé':        'Avancé',
  }

  return {
    name: `${goalLabels[form.goal] ?? form.goal} ${levelLabels[form.level] ?? form.level} ${days}J`,
    sessions,
  }
}

// Génération séance unique
function generateSession(form: AIFormData, context: DBContext): GeneratedPlan {
  const count = exercisesCount(form.durationMin)
  const usedExercises = new Set<string>()
  const muscle = form.muscleGroup ?? 'Full Body'
  const pool = context.exercises.length > 0 ? context.exercises : [muscle]
  const session = buildSession(`${muscle}`, pool, count, form.goal, usedExercises)

  return {
    name: `Séance ${muscle}`,
    sessions: [session],
  }
}

export const offlineEngine: AIProvider = {
  async generate(form: AIFormData, context: DBContext): Promise<GeneratedPlan> {
    if (form.mode === 'program') {
      return generateProgram(form, context)
    }
    return generateSession(form, context)
  },
}
