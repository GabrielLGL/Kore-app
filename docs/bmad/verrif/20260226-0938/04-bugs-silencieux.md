# Passe 4 — Bugs Silencieux — 20260226-0938

## Résumé
162 fichiers TS/TSX scannés.

## Bugs confirmés

### 1. 🟡 handleSkipOnboarding sans try/catch
**Fichier:** `src/screens/ProgramsScreen.tsx:143-146`

```tsx
const handleSkipOnboarding = async () => {
  await markOnboardingCompleted()   // ← database.write() sans try/catch
  setIsOnboardingVisible(false)
}
```

Appel WatermelonDB `database.write()` qui peut théoriquement échouer sans feedback.

**Correction:** Ajouter try/catch (correction 7b).

---

## Faux positifs clarifiés

### F1 : response undefined dans geminiProvider/openaiProvider
**Fichiers:** `src/services/ai/geminiProvider.ts:15,38`, `src/services/ai/openaiProvider.ts:10,31`

```typescript
let response: Response
try {
  response = await fetch(...)
} finally { clear() }
if (!response.ok) { ... }
```

**NON-BUG** : Si `fetch()` throw, l'exception propage hors de la fonction via le `finally`. Le code `if (!response.ok)` est **syntaxiquement inaccessible** si fetch échoue. TypeScript 0 erreur confirme.

---

## Vérifications OK ✅

- ✅ WatermelonDB mutations correctement dans `database.write()` (useSessionManager, useExerciseManager, useProgramManager, etc.)
- ✅ `AbortSignal.timeout()` absent — tous utilisent `withTimeout()` de providerUtils.ts
- ✅ setTimeout/setInterval : tous les useEffect ont cleanup via ref ou clearTimeout/clearInterval
- ✅ console.log/warn : tous protégés par `__DEV__`
- ✅ Subscriptions/Observables : gérés par withObservables HOC (pas de subscribe() manuel)
- ✅ WorkoutScreen gamification : database.write() avec await correct
- ✅ Promises chaînées dans WorkoutScreen : .catch() présent
- ✅ ErrorBoundary : correctement implémentée

## Bilan
| Sévérité | Trouvés | Réels | Faux positifs |
|----------|---------|-------|---------------|
| 🔴 Critique | 3 | 0 | 3 |
| 🟡 Warning | 1 | 1 | 0 |
| ✅ OK | — | — | — |
