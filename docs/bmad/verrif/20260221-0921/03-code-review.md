# Passe 3 — Code Review — 20260221-0921

## Résumé : 3 vrais problèmes trouvés

### 🟡 #1 — Race condition dans useWorkoutState.validateSet
**Fichier :** `hooks/useWorkoutState.ts:87` + `components/WorkoutExerciseCard.tsx:93-106`

**Problème :** Quand l'utilisateur tape ET clique "valider" en moins de 300ms :
1. `handleValidate()` flush le debounce → appelle `onUpdateInput()` → `setSetInputs(prev => ...)` (schedule async React state update)
2. Immédiatement appelle `onValidate(localWeight, localReps)` → `onValidateSet(sessionExercise, setOrder)`
3. `validateSet` lit `setInputs[key]` (valeur STALE — state pas encore mis à jour)
4. `validateSetInput` échoue sur valeur stale → set non sauvegardé MAIS `haptics.onSuccess()` déjà déclenché

**Impact :** Feedback haptique trompeur. Set non sauvegardé si frappe rapide + clic immédiat.

**Fix :** Utiliser un ref synchronisé dans `useWorkoutState` pour que `validateSet` lise toujours la valeur courante.

---

### 🔵 #2 — aiService.ts fallback sans try/catch
**Fichier :** `services/ai/aiService.ts:121`

**Problème :** Le fallback `offlineEngine.generate()` n'est pas dans un try/catch. Si le moteur offline échoue aussi, l'exception se propage au caller. Le caller (AssistantScreen `triggerGenerate`) a bien un try/catch, donc l'exception EST gérée. Code OK en pratique mais peu lisible.

**Risque :** Faible (attrapé par le caller). 🔵 Suggestion de clarté.

---

### 🔵 #3 — FlatList renderItem non mémorisé (ExercisesScreen)
**Fichier :** `screens/ExercisesScreen.tsx:180-197`

**Problème :** `renderItem` est une fonction anonyme inline → recréée à chaque render. Avec 100+ exercices, tout re-rend lors de tout changement d'état (ouverture modales, frappe clavier).

**Fix :** Wrap `renderItem` + `ItemSeparatorComponent` dans `useCallback`.

---

## Vérifications CLEAN ✅

| Check | Résultat |
|-------|----------|
| TypeScript | 0 erreur |
| Tests | 773 passed |
| console.log sans `__DEV__` | Aucun (sentry.ts : tous dans `__DEV__` blocks) |
| `any` en production | Aucun (uniquement dans les tests) |
| Couleurs hardcodées | Aucune (uniquement theme/index.ts) |
| WatermelonDB mutations hors `write()` | Aucune |
| Fuites mémoire | Aucune (RestTimer : cleanup des 4 timers correct) |
| AssistantScreen callback deps | Correct |
| Race condition aiService/fallback | Attrapé par caller |
