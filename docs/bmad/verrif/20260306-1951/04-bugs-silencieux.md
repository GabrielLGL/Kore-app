# Passe 4/8 — Bugs silencieux

**Date :** 2026-03-06

## Bugs détectés

| # | Sévérité | Fichier | Ligne(s) | Catégorie | Description |
|---|----------|---------|----------|-----------|-------------|
| 1 | 🔴 | StatsCalendarScreen.tsx | 275-381 | Async sans try/catch | `handleDayPress` async dans onPress — UnhandledPromiseRejection si fetch échoue |
| 2 | 🔴 | StatsCalendarScreen.tsx | 176-188 | Async sans try/catch | `handleConfirmDelete` database.write() sans try/catch |
| 3 | 🔴 | WorkoutScreen.tsx | 209-216 | Inconsistance données | `completeWorkoutHistory` .catch() avale l'erreur puis gamification continue |
| 4 | 🟡 | WorkoutScreen.tsx | 266 | Unsafe cast | `_raw` accès non contractuel WatermelonDB |
| 5 | 🟡 | HistoryDetailScreen.tsx | 43-44 | Unsafe cast | Même pattern `_raw` |
| 6 | 🟡 | ChartsScreen.tsx | 99-100 | Catch vide | `catch {}` sans feedback ni log |
| 7 | 🟡 | Multiple écrans | Multiple | i18n manquant | ~30 chaînes FR hardcodées sur 4 écrans |
| 8 | 🔵 | SessionDetailScreen.tsx | 106-118 | Async sans try/catch | Handlers wrapping fonctions déjà protégées |
| 9 | 🔵 | ProgramDetailScreen.tsx | 89-109 | Async sans try/catch | Idem |
| 10 | 🔵 | ProgramsScreen.tsx | 144-154 | Async sans try/catch | Idem |

## Points conformes
- Toutes les mutations WDB dans `database.write()` ✅
- Tous `setTimeout`/`setInterval` avec cleanup ✅
- Pas de `.subscribe()` direct — tout via `withObservables` ✅
- `ErrorBoundary` présent ✅
- Pas de `any` dans le code source ✅
- Couleurs via thème ✅
