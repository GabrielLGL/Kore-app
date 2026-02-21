# Passe 4 — Bugs silencieux — 20260221-0921

## Résultat : 1 bug réel

### 🟡 Bug #1 — validateSet lit setInputs stale (race condition debounce)
**Fichier :** `hooks/useWorkoutState.ts:87-119`

**Code problématique :**
```typescript
const validateSet = async (sessionExercise, setOrder) => {
  const key = `${sessionExercise.id}_${setOrder}`
  const input = setInputs[key]  // ← closure sur state React (peut être stale)
  // ...
  const { valid } = validateSetInput(input.weight, input.reps)
  if (!valid) return false  // ← silencieux ! haptics.onSuccess() déjà déclenché côté UI
```

**Séquence du bug :**
1. User tape poids + reps en < 300ms
2. `handleValidate()` flush debounce → `setSetInputs(prev => ...)` (queued)
3. `validateSet` appelé synchroniquement avant flush React
4. `setInputs[key]` = ancienne valeur → échec silencieux

**Gravité :** 🟡 Warning - UX bug (haptic trompeur, set non sauvegardé)

---

## Vérifications CLEAN ✅

| Pattern | Résultat |
|---------|----------|
| async sans try/catch critiques | ✅ tous couverts |
| mutations WDB hors write() | ✅ aucune |
| null safety sur fetch() WDB | ✅ checks `if (!exercise) return false` |
| fuites mémoire setTimeout | ✅ cleanup dans useEffect return |
| fuites mémoire subscriptions | ✅ withObservables gère auto-cleanup |
| AbortSignal.timeout() | ✅ utilise `withTimeout()` de providerUtils |
