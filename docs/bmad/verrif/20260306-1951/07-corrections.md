# Passe 7/8 — Corrections

**Date :** 2026-03-06

## 7a — Critiques 🔴 (4 corrigés)

| # | Fichier | Correction |
|---|---------|------------|
| 1 | `Program.ts:64` | `duplicate()` copie maintenant `setsTargetMax` — bug de perte de données |
| 2 | `StatsCalendarScreen.tsx:176` | `handleConfirmDelete` enveloppé dans try/catch — UnhandledPromiseRejection |
| 3 | `StatsCalendarScreen.tsx:275` | `handleDayPress` enveloppé dans try/catch global — UnhandledPromiseRejection |
| 4 | `ExercisesScreen.test.tsx:328` | Test obsolète supprimé — le bouton globe a été déplacé dans le wrapper |

## 7b — Warnings 🟡 (1 corrigé)

| # | Fichier | Correction |
|---|---------|------------|
| 1 | `ChartsScreen.tsx:99` | Catch vide remplacé par `__DEV__` console.error |

## Non corrigés (justification)

| # | Problème | Raison |
|---|----------|--------|
| 1 | `ai_api_key` dans schema/modèle | Migration schema v32 nécessaire — risque de régression si fait sans planification. Actuellement inoffensif car l'app utilise secureKeyStore. |
| 2 | ~30 chaînes i18n hardcodées (3 écrans) | Trop volumineux pour une correction automatique — nécessite ajout de clés dans fr.ts + en.ts + refactoring des écrans. |
| 3 | `_raw` accès unsafe (2 fichiers) | Nécessite vérification que `s.exercise.id` fonctionne sans fetch sur les relations WDB — risque de régression. |
| 4 | Magic numbers (5 écrans) | Cosmétique — pas de risque fonctionnel. |
| 5 | WorkoutScreen perf (query all sets) | Nécessite refactoring du flow de gamification — risque de régression. |
| 6 | `handleValidateSet`/`handleConfirmEnd` sans useCallback | Nécessite analyse des deps — risque de régression. |

## Vérification post-correction

- TypeScript : ✅ 0 erreur
- Tests : ✅ 93 suites, 1571 tests passés
