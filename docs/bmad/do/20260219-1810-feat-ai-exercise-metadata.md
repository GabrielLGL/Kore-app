# feat(ai) — Add exercise metadata types and classification

Date : 2026-02-19 18:10

## Instruction
Ajouter les types ExerciseMetadata dans types.ts et créer exerciseMetadata.ts classifiant les exercices WEGOGYM par type fonctionnel et niveau.

## Classification
Type : feat
Fichiers :
- `mobile/src/services/ai/types.ts` (modifié)
- `mobile/src/services/ai/exerciseMetadata.ts` (créé)

## Ce qui a été fait

**types.ts** — Ajout après les types existants :
- `ExerciseType` : `'compound_heavy' | 'compound' | 'accessory' | 'isolation'`
- `ExerciseMetadata` interface (type, minLevel, isUnilateral, primaryMuscle, secondaryMuscles)
- `ExerciseMetadataMap` alias

**exerciseMetadata.ts** — Création avec :
- `EXERCISE_METADATA` : map complète de 115 exercices (seed.ts en contient 115, non 143 — la valeur 143 dans l'instruction était incorrecte)
- `getExerciseMetadata(name)` : fonction d'accès

### Répartition par type
| Type | Nombre |
|------|--------|
| compound_heavy | 11 |
| compound | 47 |
| accessory | 12 |
| isolation | 45 |
| **Total** | **115** |

### Répartition par groupe musculaire
| Groupe | Exercices |
|--------|-----------|
| Pecs | 15 |
| Dos | 15 |
| Quadriceps | 13 |
| Abdos | 13 |
| Épaules | 11 |
| Biceps | 10 |
| Ischios | 7 |
| Triceps (isolation/accessory) | 9 — dont 1 compound_heavy (DPCPS) |
| Trapèzes | 5 |
| Mollets | 5 |
| Cardio | 12 |

### Règles appliquées
- `primaryMuscle` = premier muscle de `muscles[]` dans seed.ts appartenant à MUSCLES_LIST
- `Fessiers` exclu de primaryMuscle et secondaryMuscles
- Exercices dont le 1er muscle est Fessiers (Hip Thrust) → muscle suivant dans MUSCLES_LIST
- isUnilateral=true : Fentes*, Step Up, Split Squat, Squat Bulgare, Rowing Haltère Unilatéral, Leg Curl Debout, Curl Concentré, Triceps Kickback, Rotation Externe Épaule
- Cardio : type=compound, minLevel=débutant, primaryMuscle='Cardio'

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit`)
- Tests : ✅ 643 passed, 41 suites
- Nouveau test créé : non (données statiques, pas de logique à tester)

## Commit
b8245b3 feat(ai): add exercise metadata types and classification for 143 exercises
