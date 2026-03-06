# feat(db) — Timer par exercice — Fondation DB
Date : 2026-03-05 22:45

## Instruction
docs/bmad/prompts/20260305-2230-timer-par-exo-A.md

## Rapport source
docs/bmad/prompts/20260305-2230-timer-par-exo-A.md

## Classification
Type : feat
Fichiers modifies :
- mobile/src/model/schema.ts
- mobile/src/model/migrations.ts
- mobile/src/model/models/SessionExercise.ts
- mobile/src/model/models/Program.ts

## Ce qui a ete fait
1. Schema v29→v30 : ajoute `rest_time` (number, optional) dans `session_exercises`
2. Migration v30 : `addColumns` sur `session_exercises` avec `rest_time`
3. Model SessionExercise : ajoute `@field('rest_time') restTime?: number | null`
4. Program.duplicate() : copie `restTime` avec fallback null

## Verification
- TypeScript : 0 erreur
- Tests : 1560 passed, 0 failed
- Nouveau test cree : non (fondation DB, pas de logique metier)

## Documentation mise a jour
aucune

## Statut
Resolue — 20260305-2245
