# Passe 7 — Corrections — 20260221-0921

## 7a — Critiques 🔴

Aucun critique trouvé. ✅

## 7b — Warnings 🟡

### Fix #1 — Race condition validateSet / debounce flush

**Fichier modifié :** `mobile/src/hooks/useWorkoutState.ts`

**Problème :** `validateSet` lisait `setInputs[key]` depuis le closure React, qui était stale si le debounce venait d'être flushé synchroniquement (user tape + clique validate < 300ms).

**Fix appliqué :**
1. Import ajouté : `useRef`
2. Ajout de `setInputsRef` synchronisé avec `setInputs` à chaque render
3. `updateSetInput` met aussi à jour `setInputsRef.current` dans le setter (garantit synchronisation immédiate)
4. `validateSet` lit `setInputsRef.current[key]` (toujours fresh)

**Vérifications :**
- `npx tsc --noEmit` → 0 erreur ✅
- `npx jest --testPathPattern="useWorkoutState"` → 30/30 ✅
- `npx jest` → 773/773 ✅

## 7c — Suggestions 🔵

### Non appliquées (faible ROI, risque zero-régression)

| # | Suggestion | Raison de ne pas appliquer |
|---|------------|---------------------------|
| #2 | `aiService.ts` wrap fallback try/catch | Déjà attrapé par caller AssistantScreen. Modification inutile. |
| #3 | FlatList renderItem useCallback dans ExercisesScreen | Performance concern. Les exercices sont peu nombreux en pratique (~100). Risque de régression sans bénéfice mesurable. |
