# Passe 3 — Code Review
**Date:** 2026-03-06 22:55

| # | Sev | Fichier | Probleme | Action |
|---|-----|---------|----------|--------|
| C1 | CRIT | `screens/StatsScreen.tsx:80` | `computeMotivationalPhrase` sans `language` — EN users voient FR | FIXE |
| W1 | WARN | `components/AnimatedSplash.tsx:11` | Import statique `colors` au lieu de `useColors()` | NON FIXE (pre-provider mount) |
| W2 | WARN | `model/models/SessionExercise.ts:16` | `@field('reps_target')` sur colonne string | FIXE |
| W3 | WARN | `model/models/UserBadge.ts:7` | `@field('badge_id')` sur colonne string | FIXE |
| S1 | SUGG | `screens/StatsExercisesScreen.tsx` | Charge tous les sets sans filtre date | NON FIXE (non-critique) |
| S2 | SUGG | AnimatedSplash, ErrorBoundary | Static colors (exceptions documentees) | NON FIXE |

**Critiques:** 1 (fixe)
**Warnings:** 3 (2 fixes, 1 ignore justifie)
**Suggestions:** 2 (ignores)
