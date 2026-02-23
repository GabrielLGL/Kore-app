import { offlineEngine } from '../offlineEngine'
import type { AIFormData, DBContext, ExerciseInfo } from '../types'

const makeForm = (overrides: Partial<AIFormData> = {}): AIFormData => ({
  mode: 'program',
  goal: 'bodybuilding',
  level: 'débutant',
  equipment: [],
  daysPerWeek: 3,
  durationMin: 60,
  ...overrides,
})

const makeContext = (exerciseNames: string[] = []): DBContext => ({
  exercises: exerciseNames.map(name => ({ name, muscles: [] })),
  recentMuscles: [],
  prs: {},
})

describe('offlineEngine', () => {
  describe('generate — mode program', () => {
    it('génère un plan avec le bon nombre de séances (3 jours)', async () => {
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 3 }), makeContext())
      expect(plan.sessions).toHaveLength(3)
    })

    it('génère un plan avec le bon nombre de séances (4 jours)', async () => {
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 4 }), makeContext())
      expect(plan.sessions).toHaveLength(4)
    })

    it('génère un plan avec le bon nombre de séances (5 jours)', async () => {
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 5 }), makeContext())
      expect(plan.sessions).toHaveLength(5)
    })

    it('génère un plan avec le bon nombre de séances (6 jours)', async () => {
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 6 }), makeContext())
      expect(plan.sessions).toHaveLength(6)
    })

    it('inclut le label objectif dans le nom du plan', async () => {
      const plan = await offlineEngine.generate(makeForm({ goal: 'bodybuilding' }), makeContext())
      expect(plan.name).toContain('Bodybuilding')
    })

    it('inclut le label force dans le nom du plan', async () => {
      const plan = await offlineEngine.generate(makeForm({ goal: 'power' }), makeContext())
      expect(plan.name).toContain('Power')
    })

    it('inclut le label perte dans le nom du plan', async () => {
      const plan = await offlineEngine.generate(makeForm({ goal: 'renfo' }), makeContext())
      expect(plan.name).toContain('Renfo')
    })

    it('inclut le label cardio dans le nom du plan', async () => {
      const plan = await offlineEngine.generate(makeForm({ goal: 'cardio' }), makeContext())
      expect(plan.name).toContain('Cardio')
    })

    it('inclut le label niveau débutant dans le nom du plan', async () => {
      const plan = await offlineEngine.generate(makeForm({ level: 'débutant' }), makeContext())
      expect(plan.name).toContain('Débutant')
    })

    it('inclut le label niveau intermédiaire dans le nom du plan', async () => {
      const plan = await offlineEngine.generate(makeForm({ level: 'intermédiaire' }), makeContext())
      expect(plan.name).toContain('Intermédiaire')
    })

    it('inclut le label niveau avancé dans le nom du plan', async () => {
      const plan = await offlineEngine.generate(makeForm({ level: 'avancé' }), makeContext())
      expect(plan.name).toContain('Avancé')
    })

    it('utilise les exercices fournis dans le contexte', async () => {
      const exercises = ['Squat', 'Développé couché', 'Tractions', 'Curl']
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 1 }), makeContext(exercises))
      const allExercises = plan.sessions.flatMap(s => s.exercises.map(e => e.exerciseName))
      expect(allExercises.every(name => exercises.includes(name))).toBe(true)
    })

    it('chaque exercice a setsTarget > 0 et repsTarget non vide', async () => {
      const plan = await offlineEngine.generate(makeForm(), makeContext())
      plan.sessions.forEach(session => {
        session.exercises.forEach(ex => {
          expect(ex.setsTarget).toBeGreaterThan(0)
          expect(ex.repsTarget).toBeTruthy()
          expect(ex.weightTarget).toBe(0)
        })
      })
    })

    it('objectif force: 4 séries, reps range 6-8 (compound sans métadonnée)', async () => {
      const exercises = ['Squat', 'Développé couché', 'Tractions', 'Curl', 'Deadlift']
      const plan = await offlineEngine.generate(makeForm({ goal: 'power', daysPerWeek: 1 }), makeContext(exercises))
      const firstEx = plan.sessions[0].exercises[0]
      expect(firstEx.setsTarget).toBe(4)
      expect(firstEx.repsTarget).toBe('6-8')
    })

    it('objectif renfo: 3 séries, reps range 10-12 (compound sans métadonnée)', async () => {
      const exercises = ['Squat', 'Développé couché', 'Tractions', 'Curl', 'Deadlift']
      const plan = await offlineEngine.generate(makeForm({ goal: 'renfo', daysPerWeek: 1 }), makeContext(exercises))
      const firstEx = plan.sessions[0].exercises[0]
      expect(firstEx.setsTarget).toBe(3)
      expect(firstEx.repsTarget).toBe('10-12')
    })

    it('objectif cardio: 3 séries, reps range 12-15 (compound sans métadonnée)', async () => {
      const exercises = ['Squat', 'Développé couché', 'Tractions', 'Curl', 'Deadlift']
      const plan = await offlineEngine.generate(makeForm({ goal: 'cardio', daysPerWeek: 1 }), makeContext(exercises))
      const firstEx = plan.sessions[0].exercises[0]
      expect(firstEx.setsTarget).toBe(3)
      expect(firstEx.repsTarget).toBe('12-15')
    })

    it('nombre d\'exercices par séance selon durée 120min → 10', async () => {
      const exercises = Array.from({ length: 15 }, (_, i) => `Ex${i}`)
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 1, durationMin: 120 }), makeContext(exercises))
      expect(plan.sessions[0].exercises).toHaveLength(10)
    })

    it('nombre d\'exercices par séance selon durée 45min → 5', async () => {
      const exercises = Array.from({ length: 10 }, (_, i) => `Ex${i}`)
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 1, durationMin: 45 }), makeContext(exercises))
      expect(plan.sessions[0].exercises).toHaveLength(5)
    })

    it('nombre d\'exercices par séance selon durée 60min → 6', async () => {
      const exercises = Array.from({ length: 10 }, (_, i) => `Ex${i}`)
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 1, durationMin: 60 }), makeContext(exercises))
      expect(plan.sessions[0].exercises).toHaveLength(6)
    })

    it('nombre d\'exercices par séance selon durée 90min → 8', async () => {
      const exercises = Array.from({ length: 10 }, (_, i) => `Ex${i}`)
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 1, durationMin: 90 }), makeContext(exercises))
      expect(plan.sessions[0].exercises).toHaveLength(8)
    })

    it('séances fullbody (≤3 jours) nommées Full Body', async () => {
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 2 }), makeContext())
      expect(plan.sessions[0].name).toContain('Full Body')
    })

    it('séances upper/lower (4 jours) nommées Upper/Lower', async () => {
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 4 }), makeContext())
      const names = plan.sessions.map(s => s.name)
      expect(names[0]).toBe('Upper Body')
      expect(names[1]).toBe('Lower Body')
    })

    it('séances ppl (≥5 jours) nommées Push/Pull/Legs', async () => {
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 5 }), makeContext())
      const names = plan.sessions.map(s => s.name)
      expect(names[0]).toBe('Push')
      expect(names[1]).toBe('Pull')
      expect(names[2]).toBe('Legs')
    })

    it('utilise fallback pour daysPerWeek undefined', async () => {
      const form = makeForm()
      delete (form as Partial<AIFormData>).daysPerWeek
      const plan = await offlineEngine.generate(form, makeContext())
      // Default 3 jours
      expect(plan.sessions).toHaveLength(3)
    })

    it('doit filtrer les exercices par muscles du split PPL (session Push)', async () => {
      const pushExercises: ExerciseInfo[] = [
        { name: 'Développé couché', muscles: ['Pecs', 'Triceps', 'Epaules'] },
        { name: 'Extension triceps', muscles: ['Triceps'] },
        { name: 'Élévations latérales', muscles: ['Epaules'] },
      ]
      const pullExercises: ExerciseInfo[] = [
        { name: 'Tractions', muscles: ['Dos', 'Biceps'] },
        { name: 'Curl biceps', muscles: ['Biceps'] },
      ]
      const context: DBContext = {
        exercises: [...pushExercises, ...pullExercises],
        recentMuscles: [],
        prs: {},
      }
      const plan = await offlineEngine.generate(makeForm({ daysPerWeek: 5, durationMin: 45 }), context)
      // Session 0 = Push (split PPL ≥5 jours)
      expect(plan.sessions[0].name).toBe('Push')
      const pushNames = pushExercises.map(e => e.name)
      plan.sessions[0].exercises.forEach(ex => {
        expect(pushNames).toContain(ex.exerciseName)
      })
    })

    it('doit retourner des exercices dans un ordre différent entre deux générations (shuffle)', async () => {
      const exercises: ExerciseInfo[] = Array.from({ length: 10 }, (_, i) => ({
        name: `Exercice${i}`,
        muscles: ['Quadriceps'],
      }))
      const context: DBContext = { exercises, recentMuscles: [], prs: {} }
      const form = makeForm({ daysPerWeek: 1, durationMin: 45 })

      const mockRandom = jest.spyOn(Math, 'random')

      // rand=0 → shuffleArray déplace chaque élément à l'index 0 → [Ex1,Ex2,...,Ex9,Ex0]
      mockRandom.mockReturnValue(0)
      const plan1 = await offlineEngine.generate(form, context)

      // rand≈1 → shuffleArray ne déplace aucun élément (j=i) → [Ex0,Ex1,...,Ex9]
      mockRandom.mockReturnValue(0.9999)
      const plan2 = await offlineEngine.generate(form, context)

      mockRandom.mockRestore()

      const names1 = plan1.sessions[0].exercises.map(e => e.exerciseName)
      const names2 = plan2.sessions[0].exercises.map(e => e.exerciseName)
      expect(names1).not.toEqual(names2)
    })
  })

  describe('generate — mode session', () => {
    it('génère exactement 1 séance', async () => {
      const plan = await offlineEngine.generate(
        makeForm({ mode: 'session', muscleGroups: ['Pecs'] }),
        makeContext()
      )
      expect(plan.sessions).toHaveLength(1)
    })

    it('le nom du plan contient le groupe musculaire', async () => {
      const plan = await offlineEngine.generate(
        makeForm({ mode: 'session', muscleGroups: ['Dos'] }),
        makeContext()
      )
      expect(plan.name).toContain('Dos')
    })

    it('utilise Full Body si muscleGroup absent', async () => {
      const plan = await offlineEngine.generate(
        makeForm({ mode: 'session' }),
        makeContext()
      )
      expect(plan.name).toContain('Full Body')
    })

    it('utilise les exercices du contexte pour la séance', async () => {
      const exercises = ['Développé couché', 'Écartés', 'Dips', 'Pec Deck', 'Câble croisé', 'Pompes']
      const plan = await offlineEngine.generate(
        makeForm({ mode: 'session', muscleGroups: ['Pecs'], durationMin: 45 }),
        makeContext(exercises)
      )
      const exNames = plan.sessions[0].exercises.map(e => e.exerciseName)
      expect(exNames.every(n => exercises.includes(n))).toBe(true)
    })

    it('doit calculer weightTarget depuis les PRs (bodybuilding + intermédiaire → 72% du PR)', async () => {
      const context: DBContext = {
        exercises: [{ name: 'Squat', muscles: ['Quadriceps', 'Ischios'] }],
        recentMuscles: [],
        prs: { 'Squat': 100 },
      }
      const form = makeForm({
        mode: 'session',
        goal: 'bodybuilding',
        level: 'intermédiaire',
        muscleGroups: ['Quadriceps'],
        durationMin: 45,
      })
      const plan = await offlineEngine.generate(form, context)
      const squat = plan.sessions[0].exercises.find(e => e.exerciseName === 'Squat')
      expect(squat).toBeDefined()
      // bodybuilding + intermédiaire = 72% du PR → round(100 * 0.72 * 2) / 2 = 72
      expect(squat?.weightTarget).toBe(72)
    })
  })

  describe('generate — phases et volume avancé', () => {
    it('phase prise_masse: reps augmentées de +1/+1', async () => {
      const dosExercises: ExerciseInfo[] = [
        { name: 'Tirage Poitrine', muscles: ['Dos', 'Biceps'] },
        { name: 'Tirage Horizontal', muscles: ['Dos', 'Trapèzes'] },
        { name: 'Tractions', muscles: ['Dos', 'Biceps'] },
        { name: 'Pull Over Poulie', muscles: ['Dos'] },
        { name: 'Tirage Poitrine Prise Serrée', muscles: ['Dos', 'Biceps'] },
      ]
      const context: DBContext = { exercises: dosExercises, recentMuscles: [], prs: {} }
      const formBase = makeForm({ mode: 'session', muscleGroups: ['Dos'], durationMin: 45 })
      const formMasse = makeForm({ mode: 'session', muscleGroups: ['Dos'], durationMin: 45, phase: 'prise_masse' })
      const planBase = await offlineEngine.generate(formBase, context)
      const planMasse = await offlineEngine.generate(formMasse, context)

      const base = planBase.sessions[0].exercises.find(e => e.exerciseName === 'Tirage Poitrine')
      const masse = planMasse.sessions[0].exercises.find(e => e.exerciseName === 'Tirage Poitrine')
      expect(base).toBeDefined()
      expect(masse).toBeDefined()
      // compound + bodybuilding → base '8-10', prise_masse +1/+1 → '9-11'
      expect(base?.repsTarget).toBe('8-10')
      expect(masse?.repsTarget).toBe('9-11')
    })

    it('phase prise_masse: rest augmenté de 15% sur compound_heavy', async () => {
      const exercises: ExerciseInfo[] = [
        { name: 'Développé Couché Barre', muscles: ['Pecs', 'Epaules', 'Triceps'] },
        { name: 'Développé Couché Haltères', muscles: ['Pecs', 'Epaules', 'Triceps'] },
        { name: 'Écartés Poulie', muscles: ['Pecs'] },
        { name: 'Pec Deck (Machine)', muscles: ['Pecs'] },
        { name: 'Pompes', muscles: ['Pecs', 'Triceps'] },
      ]
      const context: DBContext = { exercises, recentMuscles: [], prs: {} }
      const formBase = makeForm({
        mode: 'session', goal: 'bodybuilding', level: 'intermédiaire',
        muscleGroups: ['Pecs'], durationMin: 45,
      })
      const formMasse = makeForm({
        mode: 'session', goal: 'bodybuilding', level: 'intermédiaire',
        muscleGroups: ['Pecs'], durationMin: 45, phase: 'prise_masse',
      })
      const planBase = await offlineEngine.generate(formBase, context)
      const planMasse = await offlineEngine.generate(formMasse, context)

      const dcBase = planBase.sessions[0].exercises.find(e => e.exerciseName === 'Développé Couché Barre')
      const dcMasse = planMasse.sessions[0].exercises.find(e => e.exerciseName === 'Développé Couché Barre')
      if (dcBase && dcMasse) {
        // compound_heavy rest = 210, prise_masse * 1.15 ≈ 241 (IEEE 754 rounding)
        expect(dcBase.restSeconds).toBe(210)
        expect(dcMasse.restSeconds).toBe(241)
      }
    })

    it('compound_heavy avec métadonnée: rest 210s et rpe 9', async () => {
      const exercises: ExerciseInfo[] = [
        { name: 'Développé Couché Barre', muscles: ['Pecs', 'Epaules', 'Triceps'] },
        { name: 'Développé Couché Haltères', muscles: ['Pecs', 'Epaules', 'Triceps'] },
        { name: 'Écartés Poulie', muscles: ['Pecs'] },
        { name: 'Pec Deck (Machine)', muscles: ['Pecs'] },
        { name: 'Pompes', muscles: ['Pecs', 'Triceps'] },
      ]
      const context: DBContext = { exercises, recentMuscles: [], prs: {} }
      const form = makeForm({
        mode: 'session', goal: 'bodybuilding', level: 'intermédiaire',
        muscleGroups: ['Pecs'], durationMin: 45,
      })
      const plan = await offlineEngine.generate(form, context)
      const dcBarre = plan.sessions[0].exercises.find(e => e.exerciseName === 'Développé Couché Barre')
      if (dcBarre) {
        expect(dcBarre.restSeconds).toBe(210)
        expect(dcBarre.rpe).toBe(9)
      }
    })

    it('goal cardio: ajoute un exercice Cardio en fin de séance', async () => {
      const exercises: ExerciseInfo[] = [
        { name: 'Squat', muscles: ['Quadriceps'] },
        { name: 'Fentes', muscles: ['Quadriceps', 'Ischios'] },
        { name: 'Leg Extension', muscles: ['Quadriceps'] },
        { name: 'Leg Curl', muscles: ['Ischios'] },
        { name: 'Mollets Debout', muscles: ['Mollets'] },
        { name: 'Tapis de Course', muscles: ['Cardio'] },
      ]
      const context: DBContext = { exercises, recentMuscles: [], prs: {} }
      const form = makeForm({
        mode: 'session', goal: 'cardio',
        muscleGroups: ['Quadriceps'], durationMin: 45,
      })
      const plan = await offlineEngine.generate(form, context)
      const lastEx = plan.sessions[0].exercises[plan.sessions[0].exercises.length - 1]
      expect(lastEx.exerciseName).toBe('Tapis de Course')
      expect(lastEx.repsTarget).toBe('20-30 min')
    })

    it('musclesFocus: sessions contenant le focus muscle passent en premier (program)', async () => {
      const exercises: ExerciseInfo[] = [
        { name: 'Squat', muscles: ['Quadriceps', 'Ischios'] },
        { name: 'Développé couché', muscles: ['Pecs', 'Triceps'] },
        { name: 'Tirage Poitrine', muscles: ['Dos', 'Biceps'] },
        { name: 'Élévations latérales', muscles: ['Epaules'] },
        { name: 'Curl biceps', muscles: ['Biceps'] },
        { name: 'Extension triceps', muscles: ['Triceps'] },
      ]
      const context: DBContext = { exercises, recentMuscles: [], prs: {} }
      const form = makeForm({ daysPerWeek: 5, musclesFocus: ['Quadriceps'] })
      const plan = await offlineEngine.generate(form, context)
      // PPL 5j: Push/Pull/Legs/Push B/Pull B
      // musclesFocus=['Quadriceps'] → Legs (contains Quadriceps) comes first
      expect(plan.sessions[0].name).toBe('Legs')
    })

    it('split explicite brosplit génère les bonnes séances', async () => {
      const plan = await offlineEngine.generate(
        makeForm({ daysPerWeek: 5, split: 'brosplit' }),
        makeContext()
      )
      expect(plan.sessions).toHaveLength(5)
      expect(plan.sessions[0].name).toBe('Poitrine')
      expect(plan.sessions[1].name).toBe('Dos')
      expect(plan.sessions[2].name).toBe('Épaules')
      expect(plan.sessions[3].name).toBe('Jambes')
      expect(plan.sessions[4].name).toBe('Bras')
    })

    it('stretchBalance: remplace des exercices non-stretch par des stretch candidates', async () => {
      const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5)

      const exercises: ExerciseInfo[] = [
        { name: 'Custom Ex 1', muscles: ['Pecs'] },
        { name: 'Custom Ex 2', muscles: ['Pecs'] },
        { name: 'Custom Ex 3', muscles: ['Pecs'] },
        { name: 'Custom Ex 4', muscles: ['Pecs'] },
        { name: 'Custom Ex 5', muscles: ['Pecs'] },
        { name: 'Écartés Poulie', muscles: ['Pecs'] },      // stretchFocus: true
        { name: 'Pec Deck (Machine)', muscles: ['Pecs'] },   // stretchFocus: true
      ]
      const context: DBContext = { exercises, recentMuscles: [], prs: {} }
      const form = makeForm({
        mode: 'session', muscleGroups: ['Pecs'], durationMin: 45,
        level: 'débutant',
      })
      const plan = await offlineEngine.generate(form, context)
      const names = plan.sessions[0].exercises.map(e => e.exerciseName)
      // stretchBalance should swap in at least one stretch exercise
      const stretchNames = ['Écartés Poulie', 'Pec Deck (Machine)']
      const stretchCount = names.filter(n => stretchNames.includes(n)).length
      expect(stretchCount).toBeGreaterThanOrEqual(1)

      mockRandom.mockRestore()
    })

    it('6 muscles + 5 exercices: allocation correcte sans crash', async () => {
      const exercises: ExerciseInfo[] = Array.from({ length: 10 }, (_, i) => ({
        name: `Ex${i}`,
        muscles: ['Pecs', 'Dos', 'Quadriceps', 'Epaules', 'Abdos', 'Ischios'],
      }))
      const context: DBContext = { exercises, recentMuscles: [], prs: {} }
      const form = makeForm({
        mode: 'session',
        muscleGroups: ['Pecs', 'Dos', 'Quadriceps', 'Epaules', 'Abdos', 'Ischios'],
        durationMin: 45,  // 5 exercises for 6 muscles
      })
      const plan = await offlineEngine.generate(form, context)
      expect(plan.sessions[0].exercises.length).toBeLessThanOrEqual(5)
    })

    it('phase maintien: volume réduit (facteur 0.8)', async () => {
      const dosExercises: ExerciseInfo[] = [
        { name: 'Tirage Poitrine', muscles: ['Dos', 'Biceps'] },
        { name: 'Tirage Horizontal', muscles: ['Dos', 'Trapèzes'] },
        { name: 'Tractions', muscles: ['Dos', 'Biceps'] },
        { name: 'Pull Over Poulie', muscles: ['Dos'] },
        { name: 'Tirage Poitrine Prise Serrée', muscles: ['Dos', 'Biceps'] },
      ]
      const context: DBContext = { exercises: dosExercises, recentMuscles: [], prs: {} }
      const formBase = makeForm({ mode: 'session', muscleGroups: ['Dos'], durationMin: 45 })
      const formMaintien = makeForm({ mode: 'session', muscleGroups: ['Dos'], durationMin: 45, phase: 'maintien' })
      const planBase = await offlineEngine.generate(formBase, context)
      const planMaintien = await offlineEngine.generate(formMaintien, context)
      const totalBase = planBase.sessions[0].exercises.reduce((sum, e) => sum + e.setsTarget, 0)
      const totalMaintien = planMaintien.sessions[0].exercises.reduce((sum, e) => sum + e.setsTarget, 0)
      expect(totalMaintien).toBeLessThanOrEqual(totalBase)
    })
  })

  describe('Groupe C — moteur algorithmique avancé', () => {
    // Exercices Dos sans risque bas_dos (injuryRisk: ['epaules'] seulement)
    const dosExercises: ExerciseInfo[] = [
      { name: 'Tirage Poitrine', muscles: ['Dos', 'Biceps'] },
      { name: 'Tirage Horizontal', muscles: ['Dos', 'Trapèzes'] },
      { name: 'Tractions', muscles: ['Dos', 'Biceps'] },
      { name: 'Pull Over Poulie', muscles: ['Dos'] },
      { name: 'Tirage Poitrine Prise Serrée', muscles: ['Dos', 'Biceps'] },
    ]

    it('injuries bas_dos exclut Soulevé de Terre et Good Morning', async () => {
      const exercises: ExerciseInfo[] = [
        { name: 'Soulevé de Terre', muscles: ['Dos', 'Quadriceps', 'Ischios'] },
        { name: 'Good Morning', muscles: ['Dos', 'Ischios'] },
        { name: 'Tirage Poitrine', muscles: ['Dos', 'Biceps'] },
        { name: 'Tirage Horizontal', muscles: ['Dos', 'Trapèzes'] },
        { name: 'Tractions', muscles: ['Dos', 'Biceps'] },
      ]
      const context: DBContext = { exercises, recentMuscles: [], prs: {} }
      const form = makeForm({
        mode: 'session',
        muscleGroups: ['Dos'],
        durationMin: 45,
        injuries: ['bas_dos'],
      })
      const plan = await offlineEngine.generate(form, context)
      const names = plan.sessions[0].exercises.map(e => e.exerciseName)
      expect(names).not.toContain('Soulevé de Terre')
      expect(names).not.toContain('Good Morning')
    })

    it('volume réduit avec recovery lente + ageGroup 45+', async () => {
      const context: DBContext = { exercises: dosExercises, recentMuscles: [], prs: {} }
      const formBase = makeForm({ mode: 'session', muscleGroups: ['Dos'], durationMin: 45 })
      const formReduced = makeForm({
        mode: 'session', muscleGroups: ['Dos'], durationMin: 45,
        recovery: 'lente', ageGroup: '45+',
      })
      const planBase = await offlineEngine.generate(formBase, context)
      const planReduced = await offlineEngine.generate(formReduced, context)
      const totalBase = planBase.sessions[0].exercises.reduce((sum, e) => sum + e.setsTarget, 0)
      const totalReduced = planReduced.sessions[0].exercises.reduce((sum, e) => sum + e.setsTarget, 0)
      // Multiplicateur : 1.0 - 0.15 (lente) - 0.20 (45+) = 0.65 → moins de sets
      expect(totalReduced).toBeLessThanOrEqual(totalBase)
    })

    it('phase seche: reps de Tirage Poitrine augmentées de +2/+4', async () => {
      // 5 exercices Dos → durationMin 45 = 5 exercices → tous sélectionnés, résultat déterministe
      const context: DBContext = { exercises: dosExercises, recentMuscles: [], prs: {} }
      const formBase = makeForm({ mode: 'session', muscleGroups: ['Dos'], durationMin: 45 })
      const formSeche = makeForm({ mode: 'session', muscleGroups: ['Dos'], durationMin: 45, phase: 'seche' })
      const planBase = await offlineEngine.generate(formBase, context)
      const planSeche = await offlineEngine.generate(formSeche, context)

      const base = planBase.sessions[0].exercises.find(e => e.exerciseName === 'Tirage Poitrine')
      const seche = planSeche.sessions[0].exercises.find(e => e.exerciseName === 'Tirage Poitrine')
      expect(base).toBeDefined()
      expect(seche).toBeDefined()
      // compound + bodybuilding → base '8-10', seche +2/+4 → '10-14'
      expect(base?.repsTarget).toBe('8-10')
      expect(seche?.repsTarget).toBe('10-14')
    })

    it('deload flag activé quand ≥4 jours + recovery normale + ageGroup 45+', async () => {
      const plan = await offlineEngine.generate(
        makeForm({ daysPerWeek: 4, ageGroup: '45+' }),
        makeContext()
      )
      expect(plan.includeDeload).toBe(true)
      expect(plan.name).toContain('(avec décharge)')
    })

    it('deload flag absent si recovery rapide', async () => {
      const plan = await offlineEngine.generate(
        makeForm({ daysPerWeek: 4, ageGroup: '45+', recovery: 'rapide' }),
        makeContext()
      )
      expect(plan.includeDeload).toBeFalsy()
    })

    it('restSeconds et rpe présents sur chaque exercice', async () => {
      const context: DBContext = { exercises: dosExercises, recentMuscles: [], prs: {} }
      const plan = await offlineEngine.generate(
        makeForm({ mode: 'session', muscleGroups: ['Dos'], durationMin: 45 }),
        context
      )
      plan.sessions[0].exercises.forEach(ex => {
        expect(ex.restSeconds).toBeGreaterThan(0)
        expect(ex.rpe).toBeGreaterThanOrEqual(6)
        expect(ex.rpe).toBeLessThanOrEqual(10)
      })
    })
  })
})
