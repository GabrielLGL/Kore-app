# perf(screens) — Mémoiser renderItem + ItemSeparatorComponent FlatList ExercisesScreen
Date : 2026-02-21 09:37

## Instruction
ExercisesScreen FlatList renderItem useCallback

## Rapport source
docs/bmad/verrif/20260221-0921/RAPPORT.md (suggestion #3)

## Classification
Type : perf
Fichiers modifiés : `mobile/src/screens/ExercisesScreen.tsx`

## Ce qui a été fait
- Ajout de `useCallback` à l'import React
- Extraction de `renderItem` (inline → `renderExerciseItem`) mémorisé avec deps stables : `[haptics, setSelectedExercise, setIsOptionsVisible]`
- Extraction de `ItemSeparatorComponent` (inline → `renderSeparator`) mémorisé avec `[]`
- La FlatList reçoit désormais des références stables → évite le re-render de toute la liste lors de changements d'état non liés (ouverture modales, frappe clavier)

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 773 passed (45 suites)
- Nouveau test créé : non (perf seulement, comportement identique)

## Documentation mise à jour
Aucune

## Statut
✅ Résolu — 20260221-0937

## Commit
672ef5a perf(screens): memoize FlatList renderItem and separator in ExercisesScreen
