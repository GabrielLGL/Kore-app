# perf(WorkoutScreen) — useCallback + _raw + fetchCount
Date : 2026-03-06 20:30

## Instruction
WorkoutScreen perf + _raw + useCallback — groupe C (parallèle)

## Rapport source
docs/bmad/prompts/20260305-2300-perf-audit-C.md

## Classification
Type : perf
Fichiers modifiés : mobile/src/screens/WorkoutScreen.tsx

## Ce qui a été fait
1. **useCallback** sur 3 handlers :
   - `handleClose` — stabilise la ref (passé à WorkoutSummarySheet)
   - `handleConfirmAbandon` — stabilise la ref (passé à AlertDialog)
   - `handleValidateSet` — **critique** : était dans les deps de `renderWorkoutItem` (useCallback) mais recréé à chaque render, annulant la memoization du FlatList renderItem

2. **fetchCount()** au lieu de fetch()+.length :
   - `weekHistories` query (ligne ~234) — évite l'hydratation de N modèles History juste pour compter

3. **unsafeFetchRaw()** au lieu de fetch() :
   - `allSetsRaw` query (ligne ~263) — évite l'hydratation de potentiellement des milliers de modèles Set. On n'a besoin que de `exercise_id` pour le distinct count
   - Supprime le cast `_raw as unknown as { exercise_id: string }` au profit de `Record<string, unknown>`

## Vérification
- TypeScript : ✅
- Tests : ✅ 1570 passed (1 fail pré-existant : exportHelpers schema version mismatch)
- Nouveau test créé : non

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260306-2030

## Commit
b708518 perf(WorkoutScreen): useCallback handlers + fetchCount + unsafeFetchRaw
