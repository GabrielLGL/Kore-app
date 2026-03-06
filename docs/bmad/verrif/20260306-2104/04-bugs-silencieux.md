# Passe 4/8 — Bugs silencieux

## Date : 2026-03-06 21:04

## Violations detectees

| # | Severite | Fichier | Ligne(s) | Description | Correctif |
|---|----------|---------|----------|-------------|-----------|
| 1 | CRITIQUE | `screens/ExerciseCatalogScreen.tsx` | 361-396 | Race condition double-import : `isImporting` state-based guard peut echouer sur double-tap rapide | Utiliser ref `isImportingRef` en complement du state |
| 2 | WARNING | `screens/ExerciseCatalogScreen.tsx` | 373-375 | `setIsImporting(false)` non appele dans le chemin "doublon detecte" — bouton reste desactive | Ajouter `setIsImporting(false)` avant le `return` |
| 3 | WARNING | `screens/WorkoutScreen.tsx` | 199 | `handleClose` manquant dans deps du BackHandler useEffect `[summaryVisible]` | Ajouter `handleClose` aux deps |
| 4 | WARNING | `screens/WorkoutScreen.tsx` | 167-177 | `createWorkoutHistory` useEffect sans cleanup anti-demontage | Ajouter flag `cancelled` dans cleanup |
| 5 | WARNING | `screens/WorkoutScreen.tsx` | 155 | `completedSets` calcule a chaque render sans memo | Memoiser avec `useMemo` |
| 6 | WARNING | `screens/StatsCalendarScreen.tsx` | 279-389 | `handleDayPress` : N+1 requetes DB en cascade (`.fetch()` par set) | Batch prefetch exercices avec `Q.oneOf` |
| 7 | SUGGESTION | `screens/StatsExercisesScreen.tsx` | 281-284 | Observable `sets` charge TOUS les sets sans filtre | Filtrer aux histories actives |
| 8 | SUGGESTION | `screens/StatsVolumeScreen.tsx` | 389-392 | Sets charges sans filtre — inclut sets orphelins | Ajouter `Q.on('histories', Q.where('deleted_at', null))` |

## Risques critiques
1. **ExerciseCatalogScreen double-import** : Un double tap rapide peut creer 2 exercices identiques. Le guard `isImporting` base sur useState n'est pas synchrone entre deux taps dans le meme cycle React.

## Notes
- Pas de mutations WDB hors `database.write()` detectees
- Pas de `.subscribe()` sans cleanup detecte
- Tous les timers ont un cleanup correct
