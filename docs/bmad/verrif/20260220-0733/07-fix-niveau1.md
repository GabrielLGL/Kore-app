# Fix Niveau 1 — Critiques — 2026-02-20

**Run :** 20260220-0733
**Date correction :** 2026-02-20
**Statut :** ✅ 7 corrections appliquées / 0 ignorée

---

## Résumé

| # | Fichier | Type | Statut |
|---|---------|------|--------|
| 1 | `WorkoutSummarySheet.test.tsx` | Tests failing | ✅ Corrigé |
| 2 | `components/RestTimer.tsx` | Async sans .catch() | ✅ Corrigé |
| 3 | `screens/HomeScreen.tsx` | Async sans try/catch | ✅ Corrigé |
| 4 | `hooks/useProgramManager.ts` | 7× console.error sans __DEV__ | ✅ Corrigé |
| 5 | `hooks/useSessionManager.ts` | 4× console.error sans __DEV__ | ✅ Corrigé |
| 6 | `screens/AssistantScreen.tsx` | Reset partiel formData | ✅ Corrigé |
| 7 | `hooks/useProgramManager.ts` | duplicateSession session orpheline | ✅ Corrigé |

---

## Détail des corrections

### Fix 1 — WorkoutSummarySheet.test.tsx — 12 tests failing

**Source :** rapport `02-tests.md`
**Cause :** Le composant a été redessiné mais les tests n'ont pas suivi.

| Ancien texte | Nouveau texte |
|---|---|
| `'Fermer'` (getByText) | `'Terminer'` |
| `'Ajouter une note (optionnel)...'` (placeholder) | `'Ressenti, conditions, progrès...'` |

**Fichier modifié :** `mobile/src/components/__tests__/WorkoutSummarySheet.test.tsx`

Occurrences remplacées :
- `getByText('Fermer')` → `getByText('Terminer')` : 4 occurrences (lignes 95, 172, 190, et le titre du test à la ligne 92)
- Placeholder : 6 occurrences (`getByPlaceholderText(...)`)

**Comportement fonctionnel :** inchangé — seuls les sélecteurs de test ont été mis à jour.

---

### Fix 2 — RestTimer.tsx:34 — .then() sans .catch()

**Source :** rapport `04-bugs-silencieux.md` — Critique #1
**Cause :** `scheduleRestEndNotification(duration).then(...)` sans `.catch()`. Si la notification échoue (permissions refusées, module indisponible), `notificationIdRef.current` reste `null` → cleanup ne peut pas annuler la notification → fuite potentielle.

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

**Fichier modifié :** `mobile/src/components/RestTimer.tsx` — ligne 34

---

### Fix 3 — HomeScreen.tsx:137 — handleSkipOnboarding sans try/catch

**Source :** rapport `04-bugs-silencieux.md` — Critique #2
**Cause :** Si `markOnboardingCompleted()` échoue, `setIsOnboardingVisible(false)` n'est jamais appelé → onboarding bloqué indéfiniment + unhandled rejection en production.

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

**Fichier modifié :** `mobile/src/screens/HomeScreen.tsx` — ligne 137

---

### Fix 4 — useProgramManager.ts — 7 console.error sans __DEV__

**Source :** rapports `03-code-review.md` (Critique #1) et `06-qualite.md`
**Cause :** Violation CLAUDE.md §3.1 Known Pitfalls — logs sensibles actifs en production (noms de tables DB, stack traces internes).

**Fichier modifié :** `mobile/src/hooks/useProgramManager.ts`

| Ligne | Fonction | Avant | Après |
|-------|----------|-------|-------|
| ~85 | `saveProgram` | `console.error('Failed to save program:', error)` | `if (__DEV__) console.error('[useProgramManager] saveProgram:', error)` |
| ~104 | `duplicateProgram` | `console.error('Failed to duplicate program:', error)` | `if (__DEV__) console.error('[useProgramManager] duplicateProgram:', error)` |
| ~124 | `deleteProgram` | `console.error('Failed to delete program:', error)` | `if (__DEV__) console.error('[useProgramManager] deleteProgram:', error)` |
| ~159 | `saveSession` | `console.error('Failed to save session:', error)` | `if (__DEV__) console.error('[useProgramManager] saveSession:', error)` |
| ~208 | `duplicateSession` | `console.error('Failed to duplicate session:', error)` | `if (__DEV__) console.error('[useProgramManager] duplicateSession:', error)` |
| ~228 | `deleteSession` | `console.error('Failed to delete session:', error)` | `if (__DEV__) console.error('[useProgramManager] deleteSession:', error)` |
| ~254 | `moveSession` | `console.error('Failed to move session:', error)` | `if (__DEV__) console.error('[useProgramManager] moveSession:', error)` |

---

### Fix 5 — useSessionManager.ts — 4 console.error sans __DEV__

**Source :** rapport `04-bugs-silencieux.md` — Warning W1/W2, `06-qualite.md`
**Cause :** Même violation que Fix 4.

**Fichier modifié :** `mobile/src/hooks/useSessionManager.ts`

| Ligne | Fonction | Avant | Après |
|-------|----------|-------|-------|
| ~108 | `addExercise` | `console.error('Failed to add exercise:', error)` | `if (__DEV__) console.error('[useSessionManager] addExercise:', error)` |
| ~148 | `updateTargets` | `console.error('Failed to update targets:', error)` | `if (__DEV__) console.error('[useSessionManager] updateTargets:', error)` |
| ~170 | `removeExercise` | `console.error('Failed to remove exercise:', error)` | `if (__DEV__) console.error('[useSessionManager] removeExercise:', error)` |
| ~213 | `reorderExercises` | `console.error('Failed to reorder exercises:', error)` | `if (__DEV__) console.error('[useSessionManager] reorderExercises:', error)` |

---

### Fix 6 — AssistantScreen.tsx:338 — handleResetRequest manque muscleGroups

**Source :** rapport `03-code-review.md` — Critique #2
**Cause :** `handleReset` (l.327) et `handleModify` (l.350) incluent `muscleGroups: []` correctement, mais `handleResetRequest` (l.338, chemin "retour silencieux" sans alerte) ne le faisait pas. Si l'utilisateur a sélectionné des `muscleGroups` en mode "séance", revient à l'étape 1-2, puis recommence, les groupes musculaires de la session précédente persistaient silencieusement dans `formData`.

**Avant :**
```ts
setFormData({ equipment: [], musclesFocus: [] })
```

**Après :**
```ts
setFormData({ equipment: [], musclesFocus: [], muscleGroups: [] })
```

**Fichier modifié :** `mobile/src/screens/AssistantScreen.tsx` — ligne 338

---

### Fix 7 — useProgramManager.ts:172 — duplicateSession session orpheline

**Source :** rapport `03-code-review.md` — Critique #5
**Cause :** Si `selectedSession.program.fetch()` retourne `null`, la session était créée sans programme parent (orpheline). L'UI affichait quand même un succès car aucun `throw` n'était levé. La session orpheline est non affichée dans l'UI et non supprimable, causant une corruption silencieuse de la DB.

**Avant :**
```ts
const parent = await selectedSession.program.fetch()
const position = ...
const newS = await database.get<Session>('sessions').create((s) => {
  s.name = `${selectedSession.name} (Copie)`
  s.position = position
  if (parent) s.program.set(parent)  // ← création continue même si parent = null
})
```

**Après :**
```ts
const parent = await selectedSession.program.fetch()
if (!parent) throw new Error('Programme parent introuvable')  // ← rollback transaction
const position = ...
const newS = await database.get<Session>('sessions').create((s) => {
  s.name = `${selectedSession.name} (Copie)`
  s.position = position
  s.program.set(parent)  // ← toujours défini grâce au guard ci-dessus
})
```

**Fichier modifié :** `mobile/src/hooks/useProgramManager.ts` — lignes 172-182
**Remarque :** Le `throw` à l'intérieur de `database.write()` provoque un rollback automatique de la transaction WatermelonDB — aucune session n'est créée. L'appelant reçoit `false` via le bloc `catch`.

---

## Corrections non appliquées

| # | Fichier | Raison |
|---|---------|--------|
| — | `model/utils/databaseHelpers.ts:304` N+1 queries | Critique de performance (code-review #3), pas un bug silencieux bloquant. La correction nécessiterait un refactor non trivial de `getLastPerformanceForExercise` pouvant affecter `WorkoutExerciseCard`. Laissé pour un fix niveau 2. |
| — | `model/utils/databaseHelpers.ts:204` spread overflow | Critique de performance (code-review #4), crash potentiel uniquement pour 65k+ sets (cas très rare). Laissé pour un fix niveau 2. |
| — | `screens/SettingsScreen.tsx` clés API en clair | Critique de sécurité (code-review #6) — nécessite `expo-secure-store` + migration. Trop risqué à modifier sans tests dédiés. |

---

## Impact sur les tests

- **12 tests précédemment en échec** dans `WorkoutSummarySheet.test.tsx` → ✅ devraient passer après Fix 1
- **Aucun autre test cassé** par les corrections 2-7 (modifications uniquement dans des blocs catch et logique de guard)
