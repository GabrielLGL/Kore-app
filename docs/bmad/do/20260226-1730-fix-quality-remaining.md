# FIX(quality) — qualité restante : geminiProvider + observable error handlers
Date : 2026-02-26 17:30

## Instruction
20260225-0900-fix-quality-remaining

## Rapport source
docs/bmad/morning/20260225-0900-fix-quality-remaining.md
(Problèmes restants #2 et #3 de docs/bmad/verrif/20260223-0943/RAPPORT.md)

## Classification
Type : fix
Fichiers modifiés :
- mobile/src/services/ai/geminiProvider.ts
- mobile/src/components/WorkoutExerciseCard.tsx
- mobile/src/components/ProgramDetailBottomSheet.tsx

## Ce qui a été fait

### 1. geminiProvider.ts — `let response: Response` non initialisée
Restructuré le pattern try-finally en utilisant `.finally(() => clear())` directement sur la Promise fetch.
Avant : `let response: Response` + try/finally séparé → potentiel undefined si usage incorrect.
Après : `const response = await fetch(...).finally(() => clear())` → variable `const`, assignation garantie.
Appliqué aux 2 fonctions : `generate()` et `testGeminiConnection()`.

### 2. WorkoutExerciseCard.tsx — observable sans error handler
Ajout de `catchError` sur le pipe `lastPerformance` (qui contient un `from(promise)` susceptible d'erreur).
Import de `of` (rxjs) et `catchError` (rxjs/operators).
En cas d'erreur, retourne `of(null)` avec log `__DEV__` guard.

### 3. ProgramDetailBottomSheet.tsx — observables sans error handler
Ajout de `catchError` sur les 2 query observables :
- `SessionPreviewRow` : exercises query → fallback `of([] as Exercise[])`
- `ProgramDetailContent` : sessions query → fallback `of([] as Session[])`
Import de `of` et `catchError` depuis rxjs.

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 1257 passed, 0 failed
- Nouveau test créé : non (fixes de qualité pure, non comportemental)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260226-1730

## Commit
76d61aa fix(quality): response init + observable error handlers
