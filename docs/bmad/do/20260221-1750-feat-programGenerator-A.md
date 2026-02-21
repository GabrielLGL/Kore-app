# feat(programGenerator) — Groupe A : types.ts + tables.ts (fondation)
Date : 2026-02-21 17:50

## Instruction
docs/bmad/prompts/20260221-1725-program-generator-A.md

## Rapport source
description directe (rapport prompt)

## Classification
Type : feat
Fichiers modifiés :
- `mobile/src/services/ai/programGenerator/types.ts` (créé)
- `mobile/src/services/ai/programGenerator/tables.ts` (créé)

## Ce qui a été fait
Les fichiers ont été créés lors de l'exécution du Groupe B (f7e9f29) car ils étaient
un prérequis manquant. Ce rapport documente formellement la livraison du Groupe A :

- `types.ts` : Equipment, MuscleGroup, BodyZone, SplitType, MovementPattern, UserProfile,
  SetParams, PGSessionExercise, PGGeneratedSession, PGGeneratedProgram,
  EQUIPMENT_TO_DB, MUSCLE_TO_DB, INJURY_ZONE_TO_BODY_ZONE
- `tables.ts` : WEEKLY_VOLUME_TABLE, PARAMS_TABLE, SPLIT_BY_FREQUENCY, MUSCLES_BY_PATTERN,
  MUSCLE_TO_PATTERN, MAX_SETS_PER_MUSCLE_PER_SESSION, MAX_TOTAL_SETS_PER_SESSION,
  MIN_EFFECTIVE_SETS, DUMBBELL_ONLY_EQUIPMENT

Critères de validation vérifiés :
- ✅ Les 2 fichiers sont dans `mobile/src/services/ai/programGenerator/`
- ✅ Toutes les clés de MUSCLE_TO_DB couvrent tous les MuscleGroup (11 clés)
- ✅ Toutes les clés de EQUIPMENT_TO_DB couvrent tous les Equipment (7 clés)
- ✅ mobile/src/services/ai/types.ts non modifié

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 13 passed (couverts par Groupe B test suite)
- Nouveau test créé : non (types/tables pures — testés indirectement via splitStrategy.test.ts)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260221-1750

## Commit
f7e9f29 feat(programGenerator): pure algo modules — splitStrategy + volumeCalculator (Groupe B)
(fichiers Groupe A inclus dans ce même commit)
