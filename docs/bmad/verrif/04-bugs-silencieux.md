# Bugs silencieux — 2026-02-20

## Résumé : 🔴 2 critiques / 🟡 4 warnings

> **Scan complet :** 117 fichiers `.ts`/`.tsx` dans `mobile/src/` (screens, hooks, services, model, components, navigation).
> Les 6 bugs ci-dessous sont **persistants** — aucun n'a été corrigé depuis le dernier scan.

---

### Critiques

| Fichier | Ligne | Type | Description |
|---------|-------|------|-------------|
| `components/RestTimer.tsx` | 34 | `.then()` sans `.catch()` | `scheduleRestEndNotification(duration).then(id => {...})` sans `.catch()`. Si la notification échoue, `notificationIdRef.current` reste `null` → `cancelNotification` jamais appelé au cleanup → fuite de notification planifiée. |
| `screens/HomeScreen.tsx` | 137–139 | Async sans try/catch | `handleSkipOnboarding` : `await markOnboardingCompleted()` sans try/catch. Si la DB échoue, `setIsOnboardingVisible(false)` n'est jamais appelé → onboarding bloqué indéfiniment + unhandled rejection. |

---

### Warnings

| Fichier | Ligne(s) | Type | Description |
|---------|----------|------|-------------|
| `hooks/useProgramManager.ts` | 85, 104, 124, 159, 208, 227, 253 | `console.error` sans `__DEV__` | 7 occurrences non gardées. Violation CLAUDE.md §3.1 : logs actifs en production. |
| `hooks/useSessionManager.ts` | 108, 148, 170, 213 | `console.error` sans `__DEV__` | 4 occurrences (`addExercise`, `updateTargets`, `removeExercise`, `reorderExercises`). |
| `screens/ChartsScreen.tsx` | 89–94 | Catch vide silencieux | `handleDeleteStat` : bloc `catch` vide, aucun log ni feedback. L'utilisateur croit que la suppression a réussi alors qu'elle a silencieusement échoué. |
| `model/utils/databaseHelpers.ts` | 304–305 | Race condition null safety | `getLastPerformanceForExercise` : `Promise.all(historyIds.map(id => db.find(id)))`. Si une History est détruite entre le fetch des sets et ce `find()`, WatermelonDB lève une exception non gérée localement. |

---

## Détail des critiques

### 🔴 1 — RestTimer.tsx:34 — `.then()` sans `.catch()`

```typescript
// mobile/src/components/RestTimer.tsx — ligne 34
useEffect(() => {
  if (notificationEnabled) {
    scheduleRestEndNotification(duration).then(id => {
      notificationIdRef.current = id
    })
    // Pas de .catch() — rejet silencieux, notificationIdRef.current reste null
  }
  return () => {
    if (notificationIdRef.current) {
      cancelNotification(notificationIdRef.current)  // Jamais atteint si .then() a échoué
      notificationIdRef.current = null
    }
  }
}, [])
```

**Impact :** Permissions non accordées ou module indisponible → rejet silencieux → `notificationIdRef.current` reste `null` → cleanup ne peut pas annuler la notification → fuite potentielle.

**Fix :**
```typescript
scheduleRestEndNotification(duration)
  .then(id => { notificationIdRef.current = id })
  .catch(e => { if (__DEV__) console.error('[RestTimer] scheduleRestEndNotification:', e) })
```

---

### 🔴 2 — HomeScreen.tsx:137 — Async sans try/catch

```typescript
// mobile/src/screens/HomeScreen.tsx — lignes 137-139
const handleSkipOnboarding = async () => {
  await markOnboardingCompleted()   // Pas de try/catch
  setIsOnboardingVisible(false)     // Jamais appelé si throw
}
```

**Impact :** Échec DB → `setIsOnboardingVisible(false)` jamais appelé → onboarding bloqué indéfiniment + unhandled promise rejection en production.

**Fix :**
```typescript
const handleSkipOnboarding = async () => {
  try {
    await markOnboardingCompleted()
  } catch (e) {
    if (__DEV__) console.error('[HomeScreen] markOnboardingCompleted:', e)
  } finally {
    setIsOnboardingVisible(false)
  }
}
```

---

## Détail des warnings

### 🟡 W1 & W2 — `console.error` sans `__DEV__` (useProgramManager + useSessionManager)

11 occurrences au total. Pattern incorrect :
```typescript
} catch (error) {
  console.error('Failed to save program:', error)  // actif en production
  return false
}
```
Correction attendue :
```typescript
} catch (error) {
  if (__DEV__) console.error('[useProgramManager] saveProgram:', error)
  return false
}
```

Fonctions concernées dans `useProgramManager.ts` : `saveProgram` (85), `duplicateProgram` (104), `deleteProgram` (124), `saveSession` (159), `duplicateSession` (208), `deleteSession` (227), `moveSession` (253).

Fonctions concernées dans `useSessionManager.ts` : `addExercise` (108), `updateTargets` (148), `removeExercise` (170), `reorderExercises` (213).

---

### 🟡 W3 — ChartsScreen.tsx:89 — Catch vide

```typescript
// mobile/src/screens/ChartsScreen.tsx — lignes 89-94
} catch {
  // Erreur DB : on ne bloque pas l'UI
} finally {
  setIsAlertVisible(false)
  setSelectedStat(null)
}
```
Aucun log ni feedback utilisateur. L'utilisateur pense que la suppression a réussi alors qu'elle a silencieusement échoué.

---

### 🟡 W4 — databaseHelpers.ts:304 — Promise.all race condition

```typescript
// mobile/src/model/utils/databaseHelpers.ts — lignes 304-305
const histories = await Promise.all(
  historyIds.map(id => database.get<History>('histories').find(id))
)
```
`find()` lève une exception si l'enregistrement n'existe pas. Si une History est définitivement détruite entre le fetch des sets et ce `find()`, toute la fonction `getLastPerformanceForExercise` crash sans gestion locale.

---

## Ce qui est correct ✅

| Domaine | Statut |
|---------|--------|
| Toutes les mutations WatermelonDB (`create`, `update`, `destroyPermanently`, `batch`) | ✅ Toutes dans `database.write()` |
| `setTimeout` / `setInterval` (RestTimer, useWorkoutTimer, GlobalBackHandler, WorkoutSummarySheet) | ✅ Tous nettoyés dans cleanup useEffect |
| Listeners keyboard (navigation/index.tsx, ExercisesScreen) | ✅ Tous retirés dans cleanup (`.remove()`) |
| BackHandler listeners (WorkoutScreen, GlobalBackHandler, HomeScreen, ExercisesScreen) | ✅ Tous `.remove()` dans cleanup |
| `withObservables` HOC (toutes les observables) | ✅ Cleanup automatique par le HOC |
| `withTimeout` dans les providers AI (Gemini, Claude, OpenAI) | ✅ `clear()` toujours appelé dans `finally` |
| `useWorkoutTimer` — setInterval | ✅ Nettoyé dans cleanup |
| `WorkoutSummarySheet` — debounce timer | ✅ Nettoyé dans cleanup + flush à la fermeture |
| Providers AI — try/catch | ✅ Gestion d'erreur correcte avec fallback offline |
| `useExerciseManager` — console.error | ✅ Tous gardés par `__DEV__` |
| `AssistantScreen` — `triggerGenerate` / `handleValidate` | ✅ try/catch complets avec `Alert.alert` |
| Division par zéro (WorkoutHeader, databaseHelpers, AssistantScreen) | ✅ Tous protégés par guard explicite |
| Accès tableau `[0]` (user queries, plan.sessions) | ✅ Tous protégés par `|| null` ou guard de longueur |
| `handleSkipOnboarding` dans HomeScreen (ligne 125-140) — `importPresetProgram` | ✅ Enveloppé dans try/catch avec log `__DEV__` |
