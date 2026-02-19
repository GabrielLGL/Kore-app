# Prompt analysé — fix-abortsignal-timeout — 2026-02-19

## Demande originale
"maintenant l'erreur que j'ai c'est AbortSignal.timeout is not a function (it is undefined)"

## Analyse

### Problème identifié
`AbortSignal.timeout(ms)` est une API Web moderne (Chrome 103+, Node 17+) non disponible dans Hermes, le moteur JS de React Native / Expo.
Tous les providers AI utilisent `signal: AbortSignal.timeout(30000)` dans leurs appels `fetch()`.

### Fichiers concernés
Tous dans `mobile/src/services/ai/` :
- `geminiProvider.ts` — 2 usages (generate + testGeminiConnection)
- `claudeProvider.ts` — 1 usage (generate)
- `openaiProvider.ts` — 1 usage (generate)
- `providerUtils.ts` — vérifier si utilitaire partagé possible

### Fix pattern
Remplacer `AbortSignal.timeout(ms)` par `AbortController` + `setTimeout` manuel.
Ajouter une helper `createTimeoutSignal(ms)` dans `providerUtils.ts` pour DRY.

## Commandes générées

| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | fix AbortSignal.timeout → AbortController dans tous les providers | geminiProvider.ts, claudeProvider.ts, openaiProvider.ts, providerUtils.ts | seul (même répertoire) |
