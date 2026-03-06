# Passe 3/8 — Code Review

**Date :** 2026-03-06

## Violations détectées

| # | Sévérité | Fichier | Ligne(s) | Problème |
|---|----------|---------|----------|----------|
| 1 | 🔴 | schema.ts | 84 | `ai_api_key` stocké en SQLite — viole CLAUDE.md 3.1 (données sensibles) |
| 2 | 🔴 | Program.ts | 63-64 | `duplicate()` ne copie pas `setsTargetMax` — viole "copier TOUS les champs" |
| 3 | 🔴 | WorkoutScreen.tsx | 265 | `database.get('sets').query().fetch()` charge TOUS les sets en mémoire — perf |
| 4 | 🟡 | WorkoutScreen.tsx | 266 | Accès `_raw` non contractuel au lieu de l'API WatermelonDB |
| 5 | 🟡 | HistoryDetailScreen.tsx | 43-44 | Même pattern `_raw` unsafe |
| 6 | 🟡 | WorkoutScreen.tsx | 376 | `handleValidateSet` pas dans `useCallback` — invalide la mémo du FlatList |
| 7 | 🟡 | WorkoutScreen.tsx | 209 | `handleConfirmEnd` pas dans `useCallback` — recréé à chaque render |
| 8 | 🟡 | ExerciseCatalogScreen.tsx | Multiple | ~15 chaînes FR hardcodées sans i18n |
| 9 | 🟡 | ChartsScreen.tsx | Multiple | ~10 chaînes FR hardcodées sans i18n |
| 10 | 🟡 | StatsVolumeScreen.tsx | 33 | Labels FR utilisés comme clés logiques |
| 11 | 🔵 | ExercisesScreen.tsx | 334-347 | Magic numbers au lieu de tokens du thème |
| 12 | 🔵 | 15+ écrans | Multiple | Pattern "deferred mount" dupliqué partout |

## Points conformes
- Portal pattern utilisé partout (pas de `<Modal>` natif)
- `withObservables` HOC pour données réactives
- `useHaptics()` dans tous les écrans interactifs
- `ErrorBoundary` wrapping le navigateur
- Soft-delete respecté sur History
- Thème centralisé via `useColors()`
