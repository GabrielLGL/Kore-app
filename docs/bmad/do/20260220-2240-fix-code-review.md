# fix(multiple) — Corrections code review 20260220-2225

Date : 2026-02-20 22:40

## Instruction
docs/bmad/verrif/code-review-20260220-2225.md

## Rapport source
docs/bmad/verrif/code-review-20260220-2225.md

## Classification
Type : fix
Fichiers modifiés :
- `mobile/src/hooks/useSessionManager.ts`
- `mobile/src/hooks/useProgramManager.ts`
- `mobile/src/components/RestTimer.tsx`
- `mobile/src/theme/index.ts`
- `mobile/src/components/AlertDialog.tsx` (déjà corrigé par linter)
- `mobile/src/components/BottomSheet.tsx` (déjà corrigé par linter)
- `mobile/src/components/CustomModal.tsx` (déjà corrigé par linter)
- `mobile/src/screens/HomeScreen.tsx` (déjà corrigé par linter)
- `mobile/src/model/utils/databaseHelpers.ts`

## Ce qui a été fait

### Groupe A — console.error sans guard __DEV__ (11 occurrences)
- `useSessionManager.ts` : 4 `console.error` → `if (__DEV__) console.error('[useSessionManager] ...', error)`
  - `addExercise` (l.108), `updateTargets` (l.148), `removeExercise` (l.170), `reorderExercises` (l.213)
- `useProgramManager.ts` : 7 `console.error` → `if (__DEV__) console.error('[useProgramManager] ...', error)`
  - `saveProgram` (l.85), `duplicateProgram` (l.104), `deleteProgram` (l.124), `saveSession` (l.159), `duplicateSession` (l.208), `deleteSession` (l.227), `moveSession` (l.253)

### Groupe B — RestTimer useEffect manque ses dépendances
- `RestTimer.tsx` : premier `useEffect` notification → `[duration, notificationEnabled]`
  - Corrige le bug où la notification n'était jamais re-schedulée si `duration` changeait après mount

### Groupe C — shadowColor '#000' hardcodé
- `theme/index.ts` : ajout de `shadow: '#000'` dans les couleurs
- AlertDialog, BottomSheet, CustomModal, HomeScreen : `shadowColor: colors.shadow` (déjà appliqué par le linter avant intervention)

### Groupe D — Queries sans WHERE sur la table exercises
- `importPresetProgram` : collecte les noms avant la requête → `Q.where('name', Q.oneOf(exerciseNames))`
- `importGeneratedPlan` : déplace `collectExerciseNames` avant la requête → `Q.where('name', Q.oneOf(names))`
- `importGeneratedSession` : déplace la collecte des noms avant la requête → `Q.where('name', Q.oneOf(names))`
- Résultat : chargement linéaire réduit drastiquement (seulement les exercices nécessaires au lieu de toute la table)

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit`)
- Tests : ✅ 131 passed, 4 suites (useSessionManager, useProgramManager, RestTimer, databaseHelpers)
- Nouveau test créé : non (corrections de bugs sur du code déjà testé)

## Documentation mise à jour
- `mobile/src/theme/index.ts` : ajout de la couleur `shadow`

## Statut
✅ Résolu — 20260220-2240

## Commit
5cf7556 fix(hooks,components,db): apply code review fixes from 20260220-2225
