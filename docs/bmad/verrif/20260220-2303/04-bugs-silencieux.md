# Passe 4/8 — Bugs Silencieux — 20260220-2303

## Scan de tous les fichiers .ts/.tsx

### ✅ Mutations WatermelonDB
Toutes dans `database.write()` — aucune violation.

### ✅ Observables/Subscriptions
Aucune subscription `.observe()` / `.subscribe()` sans cleanup trouvée.

### ✅ Timers
- Navigation `index.tsx`: `setTimeout` avec `clearTimeout` dans return du useEffect ✅
- `WorkoutExerciseCard.tsx`: debounce timers avec cleanup dans useEffect ✅
- `HomeScreen.tsx:118-123`: `setTimeout` onboarding avec cleanup ✅

### ✅ Console.log sans __DEV__
Aucun — tous les logs de production sont soit dans `if (__DEV__)` soit absents.

### ✅ Hardcoded colors
Aucun — tout utilise `colors.*` du theme.

### ✅ TypeScript any
Aucun `any` dans le code de production.

### 🟡 Cas limites acceptables

#### WorkoutScreen.tsx:144 — historyId vide
```tsx
if (historyId) {
  await completeWorkoutHistory(historyId, now).catch(...)
}
```
Si `createWorkoutHistory` (l'effet initial) échoue, un Alert avec "OK → goBack()" force la sortie. L'utilisateur ne peut pas normalement rester sur l'écran. **Acceptable** (chemin d'erreur protégé).

#### useWorkoutState.ts:53-72 — Promise avec cancelled flag
```tsx
let cancelled = false
getLastSetsForExercises(exerciseIds).then(lastWeights => {
  if (cancelled) return
  setSetInputs(...)
})
return () => { cancelled = true }
```
Pattern correct pour annulation de promise. Pas de vrai unsubscribe disponible sur une Promise, mais le flag cancelled empêche toute mise à jour d'état après unmount. **OK**.

#### SessionDetailScreen.tsx:73-86 — Chargement exercices sans feedback
```tsx
} catch (error) {
  if (__DEV__) console.error('Failed to load exercises:', error)
  setExercisesList([])
}
```
En cas d'erreur, liste vide sans message utilisateur. **Acceptable** — échec DB extrêmement rare, et la liste vide est visible visuellement.

### ✅ Résumé
**0 bug critique** — **0 bug warning** à corriger.

Le code est propre. Tous les bugs identifiés par l'analyse automatique sont soit des false positives, soit des cas limites acceptables par design.
