# S02 — Pré-remplissage poids dans useWorkoutState
> Feature: exercice-list-redesign | Priorité: Must | Dépendance: S01

## Description
Modifier `useWorkoutState` pour charger les derniers poids (via `getLastSetsForExercises`) au montage et pré-remplir les inputs poids. Les reps restent toujours en placeholder "6-8" avec champ vide.

## Fichier modifié
`mobile/src/hooks/useWorkoutState.ts`

## Tâches techniques
1. Au montage (useEffect), appeler `getLastSetsForExercises(exerciseIds)`
2. Modifier `buildInitialInputs()` pour accepter `initialWeights` en param
3. Si `initialWeights[exerciseId][setOrder]` existe → weight = valeur string
4. Reps toujours initialisées à `''` (champ vide, placeholder géré par le composant)

## Critères d'acceptation
- [ ] Poids pré-remplis depuis la dernière session si disponibles
- [ ] Reps toujours à `''` (jamais pré-remplies)
- [ ] Pas de crash si pas d'historique (graceful fallback à `''`)
- [ ] Pas de `any` TypeScript
- [ ] Cleanup useEffect si nécessaire
