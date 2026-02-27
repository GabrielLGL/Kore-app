# fix(useSessionManager) — guard exercise null avant PerformanceLog
Date : 2026-02-27 14:30

## Instruction
RAPPORT 20260227-1220 — problème #2
Ajoute if (!exercise) return false dans useSessionManager.ts:96 avant la
création du PerformanceLog (évite un crash si la relation exercice ne charge pas).

## Rapport source
docs/bmad/git-history/20260227-1220-verrif.md — description directe

## Classification
Type : fix
Fichiers modifiés :
- mobile/src/hooks/useSessionManager.ts
- mobile/src/hooks/__tests__/useSessionManager.test.ts

## Ce qui a été fait
Ajout d'un guard `if (!exercise) return false` dans la fonction `addExercise`
de `useSessionManager.ts`, après la validation existante et avant le bloc `try`.

Position choisie : ligne 80, cohérente avec les autres gardes de la fonction
(`if (!validation.valid) return false`), hors du `database.write()` pour éviter
tout conflit avec le contexte asynchrone WatermelonDB.

Ajout d'un test unitaire couvrant le nouveau cas : `addExercise` avec
`exercise = null` → retourne `false` sans appeler `database.write()`.

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 29/29 passed (1 nouveau test ajouté)
- Nouveau test créé : oui — "should return false when exercise is null or undefined"

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260227-1430

## Commit
999b22d fix(useSessionManager): guard exercise null before PerformanceLog creation
