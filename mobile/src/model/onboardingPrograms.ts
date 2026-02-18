/**
 * Programmes pré-configurés pour l'onboarding.
 *
 * Les exerciseName doivent correspondre EXACTEMENT aux noms dans BASIC_EXERCISES (seed.ts).
 * Vérification effectuée lors de la création de ce fichier.
 */

export interface PresetSessionExercise {
  exerciseName: string
  setsTarget: number
  repsTarget: string
  weightTarget: number
}

export interface PresetSession {
  name: string
  exercises: PresetSessionExercise[]
}

export interface PresetProgram {
  name: string
  description: string
  sessions: PresetSession[]
}

export const PRESET_PROGRAMS: PresetProgram[] = [
  {
    name: 'PPL 3 jours',
    description: 'Push / Pull / Legs — Pecs, Dos, Cuisses',
    sessions: [
      {
        name: 'Push',
        exercises: [
          { exerciseName: 'Développé Couché Barre', setsTarget: 4, repsTarget: '8-10', weightTarget: 60 },
          { exerciseName: 'Développé Incliné Haltères', setsTarget: 3, repsTarget: '10-12', weightTarget: 20 },
          { exerciseName: 'Développé Militaire', setsTarget: 3, repsTarget: '8-10', weightTarget: 40 },
          { exerciseName: 'Élévations Latérales', setsTarget: 3, repsTarget: '12-15', weightTarget: 8 },
          { exerciseName: 'Extensions Poulie Haute', setsTarget: 3, repsTarget: '12-15', weightTarget: 20 },
          { exerciseName: 'Dips (Triceps focus)', setsTarget: 3, repsTarget: '10-12', weightTarget: 0 },
        ],
      },
      {
        name: 'Pull',
        exercises: [
          { exerciseName: 'Tractions', setsTarget: 4, repsTarget: '6-8', weightTarget: 0 },
          { exerciseName: 'Rowing Barre', setsTarget: 4, repsTarget: '8-10', weightTarget: 60 },
          { exerciseName: 'Tirage Poitrine', setsTarget: 3, repsTarget: '10-12', weightTarget: 50 },
          { exerciseName: 'Rowing Haltère Unilatéral', setsTarget: 3, repsTarget: '10-12', weightTarget: 25 },
          { exerciseName: 'Curl Haltères', setsTarget: 3, repsTarget: '10-12', weightTarget: 14 },
          { exerciseName: 'Curl Barre EZ', setsTarget: 3, repsTarget: '8-10', weightTarget: 30 },
        ],
      },
      {
        name: 'Legs',
        exercises: [
          { exerciseName: 'Squat Arrière', setsTarget: 4, repsTarget: '8-10', weightTarget: 80 },
          { exerciseName: 'Presse à Cuisses', setsTarget: 3, repsTarget: '10-12', weightTarget: 120 },
          { exerciseName: 'Leg Extension', setsTarget: 3, repsTarget: '12-15', weightTarget: 40 },
          { exerciseName: 'Soulevé de Terre Roumain', setsTarget: 3, repsTarget: '10-12', weightTarget: 60 },
          { exerciseName: 'Leg Curl Allongé', setsTarget: 3, repsTarget: '12-15', weightTarget: 35 },
          { exerciseName: 'Extensions Mollets Debout', setsTarget: 4, repsTarget: '15-20', weightTarget: 60 },
        ],
      },
    ],
  },
  {
    name: 'Full Body 3 jours',
    description: 'Corps entier — Polyvalent pour débutants',
    sessions: [
      {
        name: 'Full Body A',
        exercises: [
          { exerciseName: 'Squat Arrière', setsTarget: 3, repsTarget: '8-10', weightTarget: 60 },
          { exerciseName: 'Développé Couché Barre', setsTarget: 3, repsTarget: '8-10', weightTarget: 50 },
          { exerciseName: 'Rowing Barre', setsTarget: 3, repsTarget: '8-10', weightTarget: 50 },
          { exerciseName: 'Développé Militaire', setsTarget: 3, repsTarget: '10-12', weightTarget: 30 },
          { exerciseName: 'Curl Haltères', setsTarget: 2, repsTarget: '12', weightTarget: 12 },
          { exerciseName: 'Extensions Poulie Haute', setsTarget: 2, repsTarget: '12', weightTarget: 15 },
        ],
      },
      {
        name: 'Full Body B',
        exercises: [
          { exerciseName: 'Soulevé de Terre Roumain', setsTarget: 3, repsTarget: '8-10', weightTarget: 60 },
          { exerciseName: 'Développé Incliné Haltères', setsTarget: 3, repsTarget: '10-12', weightTarget: 16 },
          { exerciseName: 'Tirage Poitrine', setsTarget: 3, repsTarget: '10-12', weightTarget: 45 },
          { exerciseName: 'Élévations Latérales', setsTarget: 3, repsTarget: '12-15', weightTarget: 7 },
          { exerciseName: 'Curl Barre EZ', setsTarget: 2, repsTarget: '10-12', weightTarget: 25 },
          { exerciseName: 'Barre au front', setsTarget: 2, repsTarget: '12', weightTarget: 20 },
        ],
      },
      {
        name: 'Full Body C',
        exercises: [
          { exerciseName: 'Hack Squat', setsTarget: 3, repsTarget: '10-12', weightTarget: 80 },
          { exerciseName: 'Dips (Bas des pecs)', setsTarget: 3, repsTarget: '10-12', weightTarget: 0 },
          { exerciseName: 'Tractions', setsTarget: 3, repsTarget: '6-8', weightTarget: 0 },
          { exerciseName: 'Développé Haltères Assis', setsTarget: 3, repsTarget: '10-12', weightTarget: 16 },
          { exerciseName: 'Curl Marteau', setsTarget: 2, repsTarget: '12', weightTarget: 12 },
          { exerciseName: 'Extensions Nuque Haltère', setsTarget: 2, repsTarget: '12', weightTarget: 14 },
        ],
      },
    ],
  },
  {
    name: 'Push Pull 4 jours',
    description: 'Push x2 / Pull x2 — Volume intermédiaire',
    sessions: [
      {
        name: 'Push A',
        exercises: [
          { exerciseName: 'Développé Couché Barre', setsTarget: 4, repsTarget: '6-8', weightTarget: 70 },
          { exerciseName: 'Développé Incliné Haltères', setsTarget: 3, repsTarget: '10-12', weightTarget: 22 },
          { exerciseName: 'Développé Militaire', setsTarget: 3, repsTarget: '8-10', weightTarget: 45 },
          { exerciseName: 'Élévations Latérales', setsTarget: 4, repsTarget: '12-15', weightTarget: 9 },
          { exerciseName: 'Extensions Poulie Haute', setsTarget: 3, repsTarget: '12-15', weightTarget: 22 },
        ],
      },
      {
        name: 'Pull A',
        exercises: [
          { exerciseName: 'Tractions', setsTarget: 4, repsTarget: '6-8', weightTarget: 0 },
          { exerciseName: 'Rowing Barre', setsTarget: 4, repsTarget: '8-10', weightTarget: 65 },
          { exerciseName: 'Tirage Horizontal', setsTarget: 3, repsTarget: '10-12', weightTarget: 55 },
          { exerciseName: 'Face Pull', setsTarget: 3, repsTarget: '15', weightTarget: 20 },
          { exerciseName: 'Curl Haltères', setsTarget: 3, repsTarget: '10-12', weightTarget: 14 },
        ],
      },
      {
        name: 'Push B',
        exercises: [
          { exerciseName: 'Développé Couché Haltères', setsTarget: 4, repsTarget: '8-10', weightTarget: 28 },
          { exerciseName: 'Pec Deck (Machine)', setsTarget: 3, repsTarget: '12-15', weightTarget: 40 },
          { exerciseName: 'Développé Haltères Assis', setsTarget: 3, repsTarget: '10-12', weightTarget: 18 },
          { exerciseName: 'Dips (Triceps focus)', setsTarget: 3, repsTarget: '10-12', weightTarget: 0 },
          { exerciseName: 'Barre au front', setsTarget: 3, repsTarget: '10-12', weightTarget: 25 },
        ],
      },
      {
        name: 'Pull B',
        exercises: [
          { exerciseName: 'Tirage Poitrine', setsTarget: 4, repsTarget: '8-10', weightTarget: 55 },
          { exerciseName: 'Rowing Haltère Unilatéral', setsTarget: 3, repsTarget: '10-12', weightTarget: 28 },
          { exerciseName: 'Pull Over Poulie', setsTarget: 3, repsTarget: '12-15', weightTarget: 25 },
          { exerciseName: 'Shrugs Haltères', setsTarget: 3, repsTarget: '12-15', weightTarget: 30 },
          { exerciseName: 'Curl Barre EZ', setsTarget: 3, repsTarget: '8-10', weightTarget: 35 },
        ],
      },
    ],
  },
]
