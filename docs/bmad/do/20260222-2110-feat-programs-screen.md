# feat(screens) — Extraire ProgramsScreen depuis l'ancien HomeScreen
Date : 2026-02-22 21:10

## Instruction
docs/bmad/prompts/20260222-2100-homescreen-dashboard-A.md

## Rapport source
docs/bmad/prompts/20260222-2100-homescreen-dashboard-A.md

## Classification
Type : feat
Fichiers modifies : mobile/src/screens/ProgramsScreen.tsx (nouveau)

## Ce qui a ete fait
- Recupere l'ancien HomeScreen (avant commit b5fd610 qui l'a transforme en dashboard) depuis l'historique git (commit 18fd2e8)
- Cree mobile/src/screens/ProgramsScreen.tsx avec toute la logique programmes :
  - DraggableFlatList avec drag & drop
  - CRUD programmes (creer, renommer, dupliquer, supprimer)
  - CRUD sessions (creer, renommer, dupliquer, deplacer, supprimer)
  - ProgramDetailBottomSheet avec navigation SessionDetail
  - OnboardingSheet pour premier lancement
  - Tous les modals (CustomModal, BottomSheet, AlertDialog)
  - Hooks : useProgramManager, useKeyboardAnimation, useHaptics, useMultiModalSync
  - withObservables HOC pour reactivite WatermelonDB
- Renomme tous les composants : HomeScreen -> ProgramsScreen, HomeContent -> ProgramsContent
- Supprime toute reference a "HomeScreen"
- Ajoute export nomme ProgramsContent pour les tests

## Verification
- TypeScript : OK (exit code 0)
- Tests : OK 848 passed, 47 suites, 0 failed
- Nouveau test cree : non (pas de logique nouvelle)

## Documentation mise a jour
Aucune

## Statut
Resolu — 20260222-2110

## Commit
7d22d21 feat(screens): extract ProgramsScreen from old HomeScreen for dashboard hub
