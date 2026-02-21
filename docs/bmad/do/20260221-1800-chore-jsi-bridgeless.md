# CHORE(model) — Désactiver JSI SQLiteAdapter (incompatible Bridgeless)
Date : 2026-02-21 18:00

## Instruction
docs/bmad/prompts/20260221-1800-jsi-bridgeless-A.md

## Rapport source
docs/bmad/prompts/20260221-1800-jsi-bridgeless-A.md

## Classification
Type : chore
Fichiers modifiés : mobile/src/model/index.ts

## Ce qui a été fait
- Changé `jsi: true` → `jsi: false` dans `mobile/src/model/index.ts`
- Remplacé le commentaire inexact ("warning attendu en dev") par une explication exhaustive :
  WatermelonDB 0.28.x utilise l'ancienne bridge registration (non-TurboModule),
  incompatible avec Bridgeless mode (New Architecture Expo 52, confirmé par `newArchEnabled=true`
  dans `gradle.properties` et `app.json`). L'adapteur async est utilisé à la place.
- Le warning `[🍉] JSI SQLiteAdapter not available… falling back to asynchronous operation`
  n'apparaîtra plus après le prochain `npm run android`.

## Vérification
- TypeScript : ✅ zéro erreur (`npx tsc --noEmit`)
- Tests : ✅ 789 passed, 0 failed (`npm test`)
- Nouveau test créé : non (changement de config pur, comportement déjà testé)

## Documentation mise à jour
Aucune (CLAUDE.md §3.1 documente déjà ce pitfall JSI/Bridgeless)

## Statut
✅ Résolu — 20260221-1800

## Commit
6a41b06 chore(model): disable JSI SQLiteAdapter — incompatible with Bridgeless (New Arch Expo 52)
