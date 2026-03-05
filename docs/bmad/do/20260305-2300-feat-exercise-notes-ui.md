# feat(workout) — Notes par exercice, couche UI
Date : 2026-03-05 23:00

## Instruction
docs/bmad/prompts/20260305-2230-exercise-notes-B.md

## Rapport source
docs/bmad/prompts/20260305-2230-exercise-notes-B.md

## Classification
Type : feat
Fichiers modifies :
- mobile/src/components/WorkoutExerciseCard.tsx (refactor notes section)
- mobile/src/i18n/fr.ts (4 cles workout)
- mobile/src/i18n/en.ts (4 cles workout)

## Ce qui a ete fait
1. **WorkoutExerciseCard** refactore :
   - Notes template (`Exercise.notes`) affichees en lecture seule, style grise/italique
   - Notes de session (`SessionExercise.notes`) editables inline via TextInput
   - Sauvegarde on blur directement en DB (`sessionExercise.update()`)
   - Bouton "Ajouter une note" avec haptic feedback (`onPress`)
   - Nouveau style `exerciseNoteText` pour differencier visuellement les notes template

2. **i18n** — 4 nouvelles cles dans `workout` :
   - `exerciseNote`, `sessionNote`, `addSessionNote`, `sessionNotePlaceholder`
   - FR et EN

## Verification
- TypeScript : OK (zero erreur)
- Tests : OK (93 suites, 1572 passed)
- Nouveau test cree : non (UI refactor, pas de logique metier nouvelle)

## Documentation mise a jour
Aucune

## Statut
OK - 20260305-2300

## Commit
(a remplir)
