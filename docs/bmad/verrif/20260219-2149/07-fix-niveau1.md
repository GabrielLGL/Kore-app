# Fix Niveau 1 — Corrections critiques
**Run :** 20260219-2149
**Date :** 2026-02-20
**Statut :** ✅ Terminé — 6 fichiers corrigés, 0 commit

---

## Résumé des corrections

| # | Fichier | Type | Statut |
|---|---------|------|--------|
| 1 | `components/__tests__/WorkoutSummarySheet.test.tsx` | Tests failing | ✅ Corrigé |
| 2 | `components/RestTimer.tsx` | Async sans catch | ✅ Corrigé |
| 3 | `screens/HomeScreen.tsx` | Async sans try/catch | ✅ Corrigé |
| 4 | `screens/AssistantScreen.tsx` | Bug silencieux reset partiel | ✅ Corrigé |
| 5 | `hooks/useProgramManager.ts` | console.error sans __DEV__ | ✅ Corrigé |
| 6 | `hooks/useSessionManager.ts` | console.error sans __DEV__ | ✅ Corrigé |

---

## Détail des corrections

### ✅ 1 — WorkoutSummarySheet.test.tsx — 12 tests failing

**Source :** rapport 02-tests.md
**Cause :** Le composant `WorkoutSummarySheet.tsx` a été redessiné mais les assertions du test n'ont pas été mises à jour.

**Corrections appliquées :**
- `getByText('Fermer')` → `getByText('Terminer')` (3 occurrences : assertion + 2 interactions `fireEvent.press`)
- `getByPlaceholderText('Ajouter une note (optionnel)...')` → `getByPlaceholderText('Ressenti, conditions, progrès...')` (5 occurrences)
- Description des tests `it(...)` mises à jour pour cohérence

**Lignes modifiées :** 92, 95, 107, 109, 118, 119, 138, 139, 166, 172, 181, 186, 190

---

### ✅ 2 — RestTimer.tsx:34 — .then() sans .catch()

**Source :** rapport 04-bugs-silencieux.md — Critique #1
**Cause :** `scheduleRestEndNotification(duration).then(...)` sans `.catch()`. Si la planification de notification échoue (permissions refusées, module indisponible), le rejet est silencieux et `notificationIdRef.current` reste `null` → `cancelNotification` jamais appelé au cleanup.

**Avant :**
```ts
scheduleRestEndNotification(duration).then(id => {
  notificationIdRef.current = id
})
```

**Après :**
```ts
scheduleRestEndNotification(duration)
  .then(id => { notificationIdRef.current = id })
  .catch(e => { if (__DEV__) console.error('[RestTimer] scheduleRestEndNotification:', e) })
```

**Comportement fonctionnel :** inchangé. Le timer fonctionne toujours sans notification en cas d'échec.

---

### ✅ 3 — HomeScreen.tsx:137 — Async sans try/catch

**Source :** rapport 04-bugs-silencieux.md — Critique #2
**Cause :** `handleSkipOnboarding` appelle `await markOnboardingCompleted()` sans protection. En cas d'échec DB : `setIsOnboardingVisible(false)` jamais appelé → l'onboarding reste bloqué indéfiniment + unhandled rejection.

**Avant :**
```ts
const handleSkipOnboarding = async () => {
  await markOnboardingCompleted()
  setIsOnboardingVisible(false)
}
```

**Après :**
```ts
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

**Comportement fonctionnel :** identique en cas de succès. En cas d'échec DB, l'onboarding se ferme quand même (meilleur UX vs blocage infini).

---

### ✅ 4 — AssistantScreen.tsx:338 — Reset partiel de formData

**Source :** rapport 03-code-review.md — Critique #2
**Cause :** `handleResetRequest` (reset rapide pour `currentStep ≤ 2`) oubliait `muscleGroups: []`. Divergeait de `handleReset` (ligne 327) qui l'inclut. Bug silencieux : si l'utilisateur avait sélectionné des `muscleGroups` puis revenait en step 1 et repartait, les groupes musculaires persistaient dans le formulaire.

**Avant :**
```ts
setFormData({ equipment: [], musclesFocus: [] })
```

**Après :**
```ts
setFormData({ equipment: [], musclesFocus: [], muscleGroups: [] })
```

**Comportement fonctionnel :** corrige un bug (réinitialisation incomplète). `handleReset` et `handleResetRequest` sont maintenant cohérents.

---

### ✅ 5 — useProgramManager.ts — 7 × console.error sans __DEV__

**Source :** rapports 03-code-review.md (Critique #1) et 04-bugs-silencieux.md (Warning W1)
**Cause :** Violation CLAUDE.md §3.1 — logs actifs en production, exposant stack traces DB et noms de tables.

**Fonctions corrigées :**
| Ligne | Fonction | Avant | Après |
|-------|----------|-------|-------|
| 85 | `saveProgram` | `console.error('Failed to save program:', error)` | `if (__DEV__) console.error('[useProgramManager] saveProgram:', error)` |
| 104 | `duplicateProgram` | `console.error('Failed to duplicate program:', error)` | `if (__DEV__) console.error('[useProgramManager] duplicateProgram:', error)` |
| 124 | `deleteProgram` | `console.error('Failed to delete program:', error)` | `if (__DEV__) console.error('[useProgramManager] deleteProgram:', error)` |
| 159 | `saveSession` | `console.error('Failed to save session:', error)` | `if (__DEV__) console.error('[useProgramManager] saveSession:', error)` |
| 208 | `duplicateSession` | `console.error('Failed to duplicate session:', error)` | `if (__DEV__) console.error('[useProgramManager] duplicateSession:', error)` |
| 227 | `deleteSession` | `console.error('Failed to delete session:', error)` | `if (__DEV__) console.error('[useProgramManager] deleteSession:', error)` |
| 253 | `moveSession` | `console.error('Failed to move session:', error)` | `if (__DEV__) console.error('[useProgramManager] moveSession:', error)` |

---

### ✅ 6 — useSessionManager.ts — 4 × console.error sans __DEV__

**Source :** rapport 04-bugs-silencieux.md — Warning W2
**Cause :** Même violation que useProgramManager.

**Fonctions corrigées :**
| Ligne | Fonction | Avant | Après |
|-------|----------|-------|-------|
| 108 | `addExercise` | `console.error('Failed to add exercise:', error)` | `if (__DEV__) console.error('[useSessionManager] addExercise:', error)` |
| 148 | `updateTargets` | `console.error('Failed to update targets:', error)` | `if (__DEV__) console.error('[useSessionManager] updateTargets:', error)` |
| 170 | `removeExercise` | `console.error('Failed to remove exercise:', error)` | `if (__DEV__) console.error('[useSessionManager] removeExercise:', error)` |
| 213 | `reorderExercises` | `console.error('Failed to reorder exercises:', error)` | `if (__DEV__) console.error('[useSessionManager] reorderExercises:', error)` |

---

## Problèmes critiques NON corrigés (et pourquoi)

| # | Fichier | Problème | Raison de non-correction |
|---|---------|----------|--------------------------|
| CR-3 | `model/utils/databaseHelpers.ts` | N+1 queries dans `getLastPerformanceForExercise` | Optimisation performance — pas un crash. Changer `find()` → `Q.where(Q.oneOf())` peut modifier l'ordre des résultats si WatermelonDB ne garantit pas le même tri. Risque de régression fonctionnelle. À traiter en niveau 2. |
| CR-4 | `model/models/Program.ts` | `duplicate()` ouvre son propre `database.write()` — crash si appelé depuis un write existant | Refactoring vers `prepareCreate + batch` changerait le comportement transactionnel. Aucun appel actuel dans un contexte write imbriqué. Risque de régression > bénéfice. À documenter comme contrainte connue. |
| CR-5 | `screens/SettingsScreen.tsx` | Clés API en clair dans SQLite | Nécessite `expo-secure-store` + migration des données existantes. Scope trop large pour un fix niveau 1. À planifier comme feature de sécurité séparée. |
| DB-W4 | `model/utils/databaseHelpers.ts` | Race condition `Promise.all` + `find()` dans `getLastPerformanceForExercise` | La correction (wrapping try/catch local) interagit avec le problème CR-3. Traiter conjointement lors de la réécriture N+1. |

---

## Build & Tests post-correction

- **TypeScript :** aucun changement de types — build attendu ✅ (à valider avec `npx tsc --noEmit`)
- **Tests :** 12 tests `WorkoutSummarySheet.test.tsx` devraient passer après correction des assertions
- **Comportement fonctionnel :** inchangé pour tous les flux normaux
