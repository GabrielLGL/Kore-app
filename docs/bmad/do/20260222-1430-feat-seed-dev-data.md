# feat(seed) — Jeu de données de développement
Date : 2026-02-22 14:30

## Instruction
Créer un jeu de données implémenté pour tester l'affichage de tous les écrans.

## Rapport source
docs/bmad/prompts/20260222-1400-seed-data-A.md

## Classification
Type : feat
Fichiers modifiés :
- `mobile/src/model/seedDevData.ts` (nouveau — 440 lignes)
- `mobile/App.tsx` (ajout appel seedDevData en DEV)

## Ce qui a été fait
- Créé `seedDevData.ts` avec une fonction idempotente qui peuple la DB avec :
  - **3 programmes** : Push Pull Legs (3 sessions, 18 exos), Full Body (2 sessions, 10 exos), Cardio & Abdos (2 sessions, 9 exos)
  - **10 historiques** de séances sur 30 jours avec notes
  - **~207 sets** avec progression de poids réaliste et détection automatique des PRs
  - **~56 performance logs** (résumé best weight/reps par exercice par séance)
  - **4 mesures corporelles** sur 3 mois (progression poids/tour de taille/etc.)
  - **Mise à jour utilisateur** : nom "Gabriel", onboarding complété, repos 90s
- Guard idempotent : skip si des programmes existent déjà
- Toutes les mutations dans `database.write()` + `database.batch()` (un seul batch)
- Dates backdatées via helper `raw()` typé (contourne `@readonly @date`)
- Appel dans `App.tsx` : `seedExercises().then(() => { if (__DEV__) seedDevData() })`

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 847 passed
- Nouveau test créé : non (données de seed, pas de logique métier)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260222-1430

## Commit
daadfac feat(seed): add dev data for UI testing (programs, workouts, stats)
