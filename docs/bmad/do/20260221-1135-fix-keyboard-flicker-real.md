# FIX(HomeScreen) — Vrai fix keyboard flickering renommage (setTimeout + ref)

Date : 2026-02-21 11:35

## Instruction
docs/bmad/prompts/20260221-1130-keyboard-flicker-real-fix-A.md

## Rapport source
docs/bmad/prompts/20260221-1130-keyboard-flicker-real-fix-A.md

## Classification
Type : fix
Fichiers modifiés :
- `mobile/src/screens/HomeScreen.tsx`

## Ce qui a été fait
Le fix précédent (InteractionManager) était inefficace : BottomSheet utilise
`useNativeDriver: true`, animation sur le thread natif, InteractionManager ne la
track pas → fire immédiatement.

Corrections appliquées :
1. Retiré `InteractionManager` de l'import react-native (ligne 2)
2. Ajouté `renameTimerRef` et `renameSessionTimerRef` (useRef) après les états locaux
3. Ajouté un `useEffect` de cleanup qui clear les deux timers au unmount
4. Remplacement handler "Renommer le Programme" :
   - `InteractionManager.runAfterInteractions(...)` → `setTimeout(..., 300)`
   - Timer stocké dans `renameTimerRef.current`, remis à null après exécution
5. Remplacement handler "Renommer la Séance" — même pattern avec `renameSessionTimerRef`

Logique : BottomSheet ferme en 200ms → le modal s'ouvre à t=300ms, après la fin
complète de l'animation native. autoFocus fire proprement, pas de layout conflict.

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 8 passed
- Nouveau test créé : non

## Documentation mise à jour
Aucune (pattern setTimeout + ref déjà documenté dans CLAUDE.md section 3.1)

## Statut
✅ Résolu — 20260221-1135

## Commit
[sera rempli à l'étape 7]
