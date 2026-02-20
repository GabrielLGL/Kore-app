# FIX(multiple) — Code review violations 20260220-2225

Date : 2026-02-20 22:30

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
- `mobile/src/components/AlertDialog.tsx`
- `mobile/src/components/BottomSheet.tsx`
- `mobile/src/components/CustomModal.tsx`
- `mobile/src/screens/HomeScreen.tsx`
- `mobile/src/model/utils/databaseHelpers.ts`
- `mobile/src/theme/index.ts`

## Ce qui a été fait

### Groupe A — console.error sans guard __DEV__ (critiques #1+2)
- `useSessionManager.ts` : 4 occurrences wrappées `if (__DEV__) console.error('[useSessionManager] ...', error)`
- `useProgramManager.ts` : 7 occurrences wrappées `if (__DEV__) console.error('[useProgramManager] ...', error)`

### Groupe B — RestTimer useEffect deps manquantes (critique #3)
- `RestTimer.tsx:46` : `}, [])` → `}, [duration, notificationEnabled])`
- Le cleanup annule et re-schedule la notification si duration ou notificationEnabled change après le mount

### Groupe C — shadowColor '#000' hardcodé (warnings #4)
- `theme/index.ts` : ajout de `shadow: '#000'` dans `colors`
- `AlertDialog.tsx:146` : `shadowColor: '#000'` → `shadowColor: colors.shadow`
- `BottomSheet.tsx:137` : idem
- `CustomModal.tsx:87` : idem
- `HomeScreen.tsx:389` : idem

### Groupe D — Query DB sans WHERE (warning #5)
- `databaseHelpers.ts` : `importGeneratedPlan` — noms collectés avant le fetch, `Q.where('name', Q.oneOf(names))` avec guard `names.length > 0`
- `databaseHelpers.ts` : `importGeneratedSession` — idem, noms déplacés avant la requête
- `importPresetProgram` était déjà optimisé (`Q.oneOf(exerciseNames)`)

Note : l'optimisation Q.oneOf réduit drastiquement la charge pour les imports (O(n) → O(matched)). La correspondance case-insensitive via `resolveExercisesForBatch` fonctionne sur le sous-ensemble récupéré. Pour un match parfait case-insensitive, il faudrait `LOWER()` SQL non supporté nativement par WatermelonDB.

## Vérification
- TypeScript : ✅ 0 erreurs (`npx tsc --noEmit`)
- Tests : ✅ 674 passed, 0 failed (`npm test`)
- Nouveau test créé : non (corrections d'hygiène, comportement existant préservé)

## Documentation mise à jour
- `mobile/src/theme/index.ts` : ajout de `colors.shadow`

## Statut
✅ Résolu — 20260220-2230

## Commit
[sera rempli]
