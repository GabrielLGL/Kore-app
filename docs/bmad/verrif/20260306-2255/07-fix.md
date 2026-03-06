# Passe 7 — Corrections
**Date:** 2026-03-06 22:55

## 7a — Critique (1 fix)
**`StatsScreen.tsx:80`** — Ajoute `language` a `computeMotivationalPhrase`:
```ts
// AVANT
const motivationalPhrase = useMemo(() => computeMotivationalPhrase(histories, sets), [histories, sets])
// APRES
const motivationalPhrase = useMemo(() => computeMotivationalPhrase(histories, sets, language), [histories, sets, language])
```

## 7b — Warnings (2 fixes cosmetiques)
1. **`SessionExercise.ts:16`** : `@field('reps_target')` -> `@text('reps_target')`
2. **`UserBadge.ts:7`** : `@field('badge_id')` -> `@text('badge_id')` + ajout `text` a l'import

## Verification post-fix
- `npx tsc --noEmit` -> 0 erreurs
- `npm test` -> 1558 tests, 0 failures
