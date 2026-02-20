# FIX(components) — AlertDialog onError + debounce WorkoutExerciseCard + clamping ExerciseTargetInputs
Date : 2026-02-20 20:20

## Instruction
20260220-2020 (AlertDialog + debounce + clamping)

## Rapport source
docs/bmad/morning/20260220-2020-fix-alertdialog-debounce-clamping.md

## Classification
Type : fix
Fichiers modifiés :
- mobile/src/components/AlertDialog.tsx
- mobile/src/components/WorkoutExerciseCard.tsx
- mobile/src/components/ExerciseTargetInputs.tsx
- mobile/src/components/__tests__/AlertDialog.test.tsx
- mobile/src/components/__tests__/WorkoutExerciseCard.test.tsx
- mobile/src/components/__tests__/ExerciseTargetInputs.test.tsx

## Ce qui a été fait

### 1. AlertDialog.tsx — haptics.onError() dans le catch
- Ajout de `haptics.onError()` dans le bloc catch de `handleConfirm`
- En production, si `onConfirm` lève une exception, l'utilisateur reçoit un retour haptique d'erreur (`notificationAsync(Error)`)
- Le log `__DEV__` conservé pour le debug

### 2. WorkoutExerciseCard.tsx — debounce 300ms sur les inputs
- `WorkoutSetRow` : ajout de `localWeight`/`localReps` (state local pour affichage immédiat)
- Refs `weightTimerRef`/`repsTimerRef` + handlers `handleWeightChange`/`handleRepsChange` avec debounce 300ms
- Cleanup des timers dans `useEffect` retour (conformité CLAUDE.md 3.1)
- Hooks déplacés avant le return conditionnel `if (validated)` (règle des hooks React)
- Validation (`weightError`, `repsError`, `valid`) basée sur le state local (feedback instantané)

### 3. ExerciseTargetInputs.tsx — clamping des valeurs
- `handleSetsChange` : clamp entier 1–10 (vide passé tel quel)
- `handleRepsChange` : clamp entier 1–99 (vide passé tel quel)
- `handleWeightChange` : clamp float 0–999 (préserve la chaîne originale si dans les limites, pour conserver "85.0" vs "85")

### Tests mis à jour
- `AlertDialog.test.tsx` : nouveau test "should trigger error haptic when onConfirm throws"
- `WorkoutExerciseCard.test.tsx` : describe "série non validée" avec `jest.useFakeTimers()` + test debounce + test "une seule fois pour frappes rapides"
- `ExerciseTargetInputs.test.tsx` : 7 nouveaux tests de clamping (max sets, min sets, max reps, max weight, min weight, vide, préservation décimale)

## Vérification
- TypeScript : ✅ 0 erreur (erreurs sentry.test.ts préexistantes, non liées)
- Tests : ✅ 673 passed, 0 failed
- Nouveaux tests créés : oui (10 nouveaux tests)

## Documentation mise à jour
aucune (patterns existants documentés dans CLAUDE.md 3.1)

## Statut
✅ Résolu — 20260220-2020

## Commit
ec4caae fix(components): AlertDialog onError haptic + debounce inputs + clamping targets
