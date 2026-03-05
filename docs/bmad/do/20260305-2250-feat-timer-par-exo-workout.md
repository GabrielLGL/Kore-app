# feat(workout) — Timer par exercice — WorkoutScreen
Date : 2026-03-05 22:50

## Instruction
docs/bmad/prompts/20260305-2230-timer-par-exo-B.md

## Rapport source
docs/bmad/prompts/20260305-2230-timer-par-exo-B.md

## Classification
Type : feat
Fichiers modifies :
- mobile/src/screens/WorkoutScreen.tsx

## Ce qui a ete fait
1. Ajoute state `currentRestDuration` initialise avec le timer global
2. Dans `handleValidateSet` : set `currentRestDuration` avec `sessionExercise.restTime ?? user.restDuration ?? 90` avant d'afficher le timer (pour exercice normal ET superset)
3. `<RestTimer duration={currentRestDuration}>` au lieu du global fixe

## Verification
- TypeScript : 0 erreur
- Tests : 1572 passed, 0 failed
- Nouveau test cree : non (logique triviale, 2 lignes de state)

## Documentation mise a jour
aucune

## Statut
Resolue — 20260305-2250
