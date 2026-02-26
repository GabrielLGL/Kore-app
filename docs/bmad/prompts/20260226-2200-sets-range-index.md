<!-- v1.0 — 2026-02-26 -->
# Prompt — sets-range — 20260226-2200

## Demande originale
"quand je veux ajouter un exercice a une seance je ne peux pas mettre de range de
series j'aimerais implémenter ça"

## Analyse
Feature : permettre à l'utilisateur de définir une **fourchette de séries** (ex: "3 à 5")
au lieu d'un nombre fixe, quand il ajoute/édite un exercice dans une séance.

### Changements nécessaires
- **Schéma DB** : colonne `sets_target_max` (number, optional) dans `session_exercises`, schema v23→v24
- **Modèle** : `SessionExercise.setsTargetMax?: number`
- **UI** : `ExerciseTargetInputs` — second input pour le max de séries
- **Glue** : validation + modal + hook + screen wired end-to-end

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `docs/bmad/prompts/20260226-2200-sets-range-A.md` | schema.ts, SessionExercise.ts | 1 | ⏳ |
| B | `docs/bmad/prompts/20260226-2200-sets-range-B.md` | ExerciseTargetInputs.tsx | 1 | ⏳ |
| C | `docs/bmad/prompts/20260226-2200-sets-range-C.md` | validationHelpers.ts, ExercisePickerModal.tsx, useSessionManager.ts, SessionDetailScreen.tsx | 2 | ⏳ |

## Ordre d'exécution
- **Vague 1 (parallèle)** : A et B sont indépendants — lancer simultanément.
- **Vague 2 (après A+B)** : C câble les nouvelles props/champs définis en A et B.
