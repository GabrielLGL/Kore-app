<!-- v1.0 — 2026-02-22 -->
# Rapport — HomeScreen Dashboard — Groupe A — 20260222-2100

## Objectif
Extraire toute la logique de gestion des programmes du HomeScreen actuel vers un nouveau fichier `ProgramsScreen.tsx`. Ce screen sera autonome et accessible depuis le futur dashboard HomeScreen.

## Fichiers concernés
- **CREER** : `mobile/src/screens/ProgramsScreen.tsx` (nouveau fichier)

## Contexte technique

### Architecture actuelle
Le fichier `mobile/src/screens/HomeScreen.tsx` contient actuellement :
- Liste draggable de programmes (DraggableFlatList)
- CRUD complet : créer, renommer, dupliquer, supprimer des programmes
- CRUD sessions : créer, renommer, dupliquer, déplacer, supprimer des sessions
- Modals : CustomModal (creation/rename), BottomSheet (options), ProgramDetailBottomSheet (detail), AlertDialog (confirm delete), OnboardingSheet
- Navigation vers SessionDetail, Workout
- Hooks : useProgramManager, useSessionManager, useModalState, useMultiModalSync, useHaptics, useKeyboardAnimation
- withObservables HOC pour la réactivité WatermelonDB

### Stack
- React Native (Expo 52) + TypeScript + Fabric
- WatermelonDB + withObservables (NO Redux/Context)
- React Navigation 7 (Native Stack)
- Dark Mode Only (#121212 bg, #1C1C1E cards)
- Langue : Français (fr-FR)

### Patterns obligatoires (CLAUDE.md)
- Modals : TOUJOURS via `<Portal>` (BottomSheet, AlertDialog) - JAMAIS `<Modal>` natif (crash Fabric)
- Haptics : useHaptics() pour feedback
- Validation : validationHelpers.ts
- DB : databaseHelpers.ts, tout dans database.write()
- Theme : colors/spacing/borderRadius de theme/index.ts, JAMAIS de couleurs hardcodées
- Pas de `any` TypeScript
- Pas de console.log sans __DEV__
- Cleanup de tous setTimeout/setInterval/subscribe dans useEffect

## Etapes

1. **Copier** le contenu complet de `mobile/src/screens/HomeScreen.tsx` dans un nouveau fichier `mobile/src/screens/ProgramsScreen.tsx`.

2. **Renommer** le composant :
   - Le composant principal devient `ProgramsScreen` (au lieu de `HomeScreen`)
   - L'enhanced component (withObservables) devient `EnhancedProgramsScreen`
   - L'export default devient `EnhancedProgramsScreen`

3. **Adapter le header** :
   - Le titre de la page doit etre "Programmes" (il l'est probablement deja via la navigation)
   - Retirer le bouton Settings (gear icon) du header si present — il sera dans le nouveau HomeScreen

4. **Conserver TOUTE la logique existante** :
   - Drag & drop des programmes
   - Tous les modals (create, rename, duplicate, delete, move)
   - ProgramDetailBottomSheet avec sessions
   - OnboardingSheet (peut etre retire si le onboarding sera sur le dashboard)
   - Navigation vers SessionDetail et Workout
   - Tous les hooks (useProgramManager, useSessionManager, etc.)
   - Le footer "Creer un Programme"

5. **Verifier** que le fichier compile sans erreur (`npx tsc --noEmit`).

## Contraintes
- Ne pas modifier `HomeScreen.tsx` (sera fait dans le Groupe B)
- Ne pas modifier `navigation/index.tsx` (sera fait dans le Groupe C)
- Le nouveau fichier doit etre 100% autonome et fonctionnel
- Respecter tous les patterns CLAUDE.md (Portal, haptics, validation, theme, etc.)
- AUCUNE couleur hardcodee — utiliser colors.* de theme/index.ts
- AUCUN `any` TypeScript

## Criteres de validation
- `npx tsc --noEmit` -> zero erreur
- Le fichier ProgramsScreen.tsx exporte un composant enhanced avec withObservables
- Toute la logique programmes/sessions du HomeScreen actuel est preservee
- Aucune reference a "HomeScreen" dans le nouveau fichier

## Dependances
Aucune dependance — ce groupe peut etre execute en premier.

## Statut
En attente
