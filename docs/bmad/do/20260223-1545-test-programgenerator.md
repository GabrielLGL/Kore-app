# test(programGenerator) — Coverage des 4 modules ProgramGenerator
Date : 2026-02-23 15:45

## Instruction
docs/bmad/prompts/20260223-1400-coverage-B.md

## Rapport source
docs/bmad/prompts/20260223-1400-coverage-B.md

## Classification
Type : test
Fichiers modifiés :
- mobile/src/services/ai/programGenerator/__tests__/tables.test.ts (créé)
- mobile/src/services/ai/programGenerator/__tests__/volumeCalculator.test.ts (créé)
- mobile/src/services/ai/programGenerator/__tests__/exerciseSelector.test.ts (créé)
- mobile/src/services/ai/programGenerator/__tests__/sessionBuilder.test.ts (créé)

## Ce qui a été fait
- **tables.test.ts** (18 tests) : structure WEEKLY_VOLUME_TABLE, PARAMS_TABLE, SPLIT_BY_FREQUENCY, MUSCLES_BY_PATTERN, MUSCLE_TO_PATTERN, constantes limites
- **volumeCalculator.test.ts** (10 tests) : cas supplémentaires au-delà de splitStrategy.test.ts — advanced vs beginner, strength vs hypertrophy, petits muscles, postural core boost, séance courte, fat_loss, general_fitness, distribution single session, absent muscles
- **exerciseSelector.test.ts** (6 tests) : avec mock DB et EXERCISE_METADATA — filtrage muscles, équipement, blessures, tri nervousDemand, DB vide, order séquentiel
- **sessionBuilder.test.ts** (6 tests) : avec mock exerciseSelector — session valide, totalSets cap, params par goal, dayOfWeek, session vide, strength params

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 921 passed (879 existants + 42 nouveaux)
- Nouveau test créé : oui (4 fichiers, 42 tests)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260223-1545

## Commit
