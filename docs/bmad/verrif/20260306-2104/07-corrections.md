# Passe 7/8 — Corrections

## Date : 2026-03-06 21:04

## 7a — Critiques corriges

| # | Fichier | Correction |
|---|---------|-----------|
| 1 | `screens/ExerciseCatalogScreen.tsx` | Race condition double-import : ajout `isImportingRef` (ref guard synchrone) + reset `isImporting` dans chemin "doublon detecte" |
| 2 | `screens/WorkoutScreen.tsx` | BackHandler deps : ajout `handleClose` + deplacement avant useEffect |
| 3 | `screens/WorkoutScreen.tsx` | createWorkoutHistory useEffect : ajout cleanup `cancelled` flag anti-demontage |
| 4 | `screens/WorkoutScreen.tsx` | `completedSets`, `totalSetsTarget`, `totalPrs` memoises avec `useMemo` |
| 5 | `screens/WorkoutScreen.tsx` | Retrait `completeWorkoutHistory` des deps useCallback (import stable) |
| 6 | `screens/StatsCalendarScreen.tsx` | `handleDayPress` wrappee dans `useCallback` avec deps `[detail, histories, locale]` |
| 7 | `model/utils/workoutSetUtils.ts` | Remplacement `_raw` par `s.history.id` (Relation.id synchrone officiel WatermelonDB) |
| 8 | `screens/ChartsScreen.tsx` | `Dimensions.get('window').width` remplace par `useWindowDimensions()` reactif |

## 7b — Warnings corriges

| # | Fichier | Correction |
|---|---------|-----------|
| 1 | `hooks/useSessionManager.ts` | Toast 'Retire' hardcode → `t.common.removed` via `useLanguage()` |
| 2 | `i18n/fr.ts` | Ajout cle `common.removed: 'Retire'` |
| 3 | `i18n/en.ts` | Ajout cle `common.removed: 'Removed'` |

## 7c — Non corriges (restants)

| # | Probleme | Fichiers | Raison | Effort |
|---|----------|----------|--------|--------|
| 1 | i18n `METRICS` labels hardcodes | StatsMeasurementsScreen.tsx | Necessite ajout ~10 cles i18n + refactor constante | 30min |
| 2 | i18n `BAR_PERIOD_LABELS` hardcodes | StatsVolumeScreen.tsx | Refactor vers cles constantes + labelMap | 20min |
| 3 | `_raw` dans exportHelpers.ts | exportHelpers.ts | Justifie pour export brut — documenter | 5min |
| 4 | StatsExercisesScreen charge tous les sets | StatsExercisesScreen.tsx | Optimisation perf — non critique | 20min |
| 5 | StatsVolumeScreen sets sans filtre histories | StatsVolumeScreen.tsx | Optimisation perf — non critique | 15min |
| 6 | `useStyles` non memoises | Tous les ecrans | Amelioration globale — non critique | 45min |

## Verifications post-corrections
- TypeScript : `npx tsc --noEmit` → 0 erreurs
- Tests : `npx jest` → 93 suites, 1571 tests, 0 failures
