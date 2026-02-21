# FIX(screens) — Tab bar ne disparaît plus lors de l'ouverture d'une BottomSheet
Date : 2026-02-21 14:15

## Instruction
docs/bmad/prompts/20260221-1400-bottomsheet-tab-bar-A.md

## Rapport source
docs/bmad/prompts/20260221-1400-bottomsheet-tab-bar-A.md

## Classification
Type : fix
Fichiers modifiés :
- `mobile/src/screens/HomeScreen.tsx`
- `mobile/src/screens/ExercisesScreen.tsx`

## Ce qui a été fait

**HomeScreen.tsx** (ligne 86) — retiré 4 états BottomSheet de `useMultiModalSync` :
- `isOnboardingVisible` → `<OnboardingSheet>` qui wraps `<BottomSheet>`
- `isOptionsVisible` → `<BottomSheet>` options programme
- `isSessionOptionsVisible` → `<BottomSheet>` options séance
- `isDetailVisible` → `<ProgramDetailBottomSheet>`

Conservés : `isProgramModalVisible`, `isSessionModalVisible`, `isAlertVisible` (CustomModal et AlertDialog couvrent l'écran entier — cacher la tab bar a du sens).

**ExercisesScreen.tsx** (ligne 56) — retiré 1 état BottomSheet de `useMultiModalSync` :
- `isOptionsVisible` → `<BottomSheet>` options exercice

Conservés : `isAddModalVisible`, `isEditModalVisible`, `isAlertVisible` (CustomModal et AlertDialog).

**Logique :** Le `PortalProvider` est à la racine (avant `NavigationContainer`), et `<BottomSheet>` a `zIndex: 999`. Le Portal rend donc la BottomSheet visuellement AU-DESSUS de la tab bar sans qu'on ait besoin de la cacher. Cacher la tab bar était inutile et causait un flash visuel à chaque fermeture de BottomSheet.

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 773 passed
- Nouveau test créé : non (comportement purement visuel)

## Documentation mise à jour
Aucune — pattern déjà bien documenté dans CLAUDE.md (Portal).

## Statut
✅ Résolu — 20260221-1415

## Commit
ad15e39 fix(screens): stop hiding tab bar when BottomSheet opens
