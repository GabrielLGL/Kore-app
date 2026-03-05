<!-- v1.0 — 2026-03-05 -->
# Prompt — Notes par exercice (workout) — 20260305-2230

## Demande originale
`MVP` Notes par exercice pendant le workout

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `20260305-2230-exercise-notes-A.md` | schema.ts, SessionExercise.ts, useSessionManager.ts, migrations.ts | 1 | ⏳ |
| B | `20260305-2230-exercise-notes-B.md` | WorkoutExerciseCard.tsx, useWorkoutState.ts, WorkoutScreen.tsx, fr.ts, en.ts | 2 | ⏳ |

## Ordre d'exécution
- **Vague 1** : Groupe A (data layer) — aucune dépendance
- **Vague 2** : Groupe B (UI) — dépend de A (le champ `SessionExercise.notes` doit exister)

## Résumé technique
Le champ `Exercise.notes` existe déjà (notes template globales). Le nouveau champ `SessionExercise.notes` permet des notes spécifiques à une session de workout. L'UI de `WorkoutExerciseCard` est refactorée pour distinguer les deux : template en lecture seule, session en édition.
