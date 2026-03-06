# Passe 3/8 — Code Review adversarial

## Date : 2026-03-06 21:04

## Points conformes
- Mutations WatermelonDB correctement dans `database.write()`
- Aucun `<Modal>` natif — Portal pattern respecte
- `withObservables` HOC correctement applique
- Schema v32 et modeles synchronises
- SecureStore pour cles API (jamais SQLite)
- Hooks reutilisables correctement appliques
- `useWorkoutTimer` cleanup correct
- FlatList optimisees (initialNumToRender, maxToRenderPerBatch, etc.)

## Violations detectees

| # | Fichier | Ligne | Severite | Probleme | Solution |
|---|---------|-------|----------|---------|---------|
| 1 | `screens/StatsMeasurementsScreen.tsx` | 36-40 | WARNING | Chaines i18n en dur dans `METRICS` ('Poids', 'Tour de taille', etc.) | Utiliser cles i18n `t.statsMeasurements.*` |
| 2 | `screens/StatsVolumeScreen.tsx` | 33 | WARNING | `BAR_PERIOD_LABELS` en francais en dur | Refactorer vers cles constantes + labelMap i18n |
| 3 | `hooks/useSessionManager.ts` | 172 | WARNING | `ToastAndroid.show('Retire', ...)` non traduit | Utiliser `t.common.removed` |
| 4 | `screens/ChartsScreen.tsx` | 38 | WARNING | `Dimensions.get('window').width` statique au module-load | Utiliser `useWindowDimensions()` |
| 5 | `model/utils/workoutSetUtils.ts` | 144-148 | WARNING | Acces `_raw` pour `history_id` sur Set | Utiliser `s.history.id` (relation FK synchrone) |
| 6 | `model/utils/exportHelpers.ts` | 55, 94 | WARNING | Acces `_raw` pour export — justifie mais fragile | Documenter le choix architectural |
| 7 | `screens/WorkoutScreen.tsx` | 341 | CRITIQUE | `completeWorkoutHistory` dans deps useCallback mais import stable | Nettoyer les deps |
| 8 | `screens/StatsCalendarScreen.tsx` | 279-389 | CRITIQUE | `handleDayPress` async lourd sans `useCallback` — recree a chaque render | Wrapper dans `useCallback` |

## Points d'amelioration
1. `useStyles(colors)` recree `StyleSheet.create()` a chaque render — memoiser avec `useMemo`
2. `PERIOD_LABELS` dupliquee entre `statsTypes.ts` et `StatsVolumeScreen.tsx` — unifier
3. `secureKeyStore.ts` ligne 81 : acces `_raw` pour migration — acceptable mais documenter
