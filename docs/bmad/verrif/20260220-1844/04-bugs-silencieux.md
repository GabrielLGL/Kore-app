# Passe 4 — Bugs silencieux — 20260220-1844

## Résultat

Scan complet de mobile/src/ — bugs actifs identifiés.

---

## 🔴 Critiques

### BUG #1 — Promise sans .catch() dans RestTimer
- **Fichier** : `components/RestTimer.tsx` ligne ~34
- **Type** : Unhandled promise rejection
- **Code** :
```typescript
scheduleRestEndNotification(duration).then(id => {
  notificationIdRef.current = id
})  // ← PAS de .catch()
```
- **Fix** : Ajouter `.catch(e => { if (__DEV__) console.error('[RestTimer]', e) })`

### BUG #2 — Array access sans vérification longueur
- **Fichier** : `screens/AssistantScreen.tsx` ligne ~256
- **Type** : Potential array out of bounds
- **Code** :
```typescript
const validDays = getDaysForSplit(value as AISplit)
if (!validDays.includes(newData.daysPerWeek)) {
  newData = { ...newData, daysPerWeek: validDays[0] }  // ← si [] crash
}
```
- **Fix** : `if (validDays.length > 0) { newData = { ...newData, daysPerWeek: validDays[0] } }`

---

## 🟡 Warnings

### BUG #3 — .catch() silencieux sans log dans useWorkoutState
- **Fichier** : `hooks/useWorkoutState.ts` lignes 59-64
- **Type** : Silent error swallowing
- **Code** :
```typescript
getLastSetsForExercises(exerciseIds).then(lastWeights => {
  if (cancelled) return
  setSetInputs(buildInitialInputs(sessionExercises, lastWeights))
}).catch(() => {
  // inputs restent vides si erreur — aucun log
})
```
- **Fix** : Ajouter `if (__DEV__) console.warn('[useWorkoutState]', e)` dans le catch

---

## ✅ Vérifications — OK

- **WatermelonDB mutations** : toutes dans `database.write()` ✅
- **setTimeout/setInterval** : tous avec cleanup dans useEffect ✅
- **Subscriptions .observe()** : gérées via `withObservables` HOC ✅
- **Division par zéro** : guards présents (recentSets.length === 0, totalSteps > 1) ✅
- **console.log hors __DEV__** : non détectés ✅
- **WorkoutScreen async** : `.catch()` avec `__DEV__` guard ✅

---

## Résumé

| Sévérité | Trouvé |
|----------|--------|
| 🔴 Critiques | 2 |
| 🟡 Warnings | 1 |
| ✅ Propre | Mutations WM, timers, subscriptions |
