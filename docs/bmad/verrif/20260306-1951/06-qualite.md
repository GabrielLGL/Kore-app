# Passe 6/8 — Code mort & qualité

**Date :** 2026-03-06

## Violations détectées

| # | Sévérité | Fichier | Ligne(s) | Problème |
|---|----------|---------|----------|----------|
| 1 | 🔴 | ChartsScreen.tsx | 167-293 | ~10 chaînes FR hardcodées sans i18n |
| 2 | 🔴 | ExerciseCatalogScreen.tsx | 190-529 | ~15 chaînes FR hardcodées sans i18n |
| 3 | 🔴 | StatsExercisesScreen.tsx | 87-159 | ~10 chaînes FR hardcodées sans i18n |
| 4 | 🟡 | StatsCalendarScreen.tsx | 343, 604 | 'Exercice inconnu', 'PC' hardcodés |
| 5 | 🟡 | StatsMeasurementsScreen.tsx | 36-40 | Labels METRICS en FR hardcodé |
| 6 | 🟡 | StatsVolumeScreen.tsx | 33 | BAR_PERIOD_LABELS FR hardcodés |
| 7 | 🟡 | HistoryDetailScreen.tsx | 43-44 | `_raw` unsafe access |
| 8 | 🟡 | WorkoutScreen.tsx | 266 | `_raw` unsafe access |
| 9 | 🔵 | StatsScreen.tsx | 84 | `as never` bypass TypeScript |
| 10 | 🔵 | AssistantScreen.tsx | 32 | `_programs` observable inutilisée |
| 11 | 🔵 | ExercisesScreen.tsx | 375-404 | Styles dupliqués dans 2 fonctions |
| 12 | 🔵 | Multiple écrans | Multiple | Magic numbers au lieu de tokens du thème |

## Points conformes
- Aucun `console.log` hors `__DEV__` ✅
- Aucun `any` dans le code source ✅
- Aucune couleur hardcodée ✅
- Imports utilisés ✅
