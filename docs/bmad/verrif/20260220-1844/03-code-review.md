# Passe 3 — Code Review — 20260220-1844

## Résultat

Analyse adversariale du codebase mobile/src/.

---

## Critiques 🔴

### 1. Unhandled Promise in useWorkoutState (ligne 59-64)
- **Fichier** : `hooks/useWorkoutState.ts`
- `.catch()` silencieux sans log — erreur de chargement des poids invisibles
- **Risque** : utilisateur ne sait pas si les poids historiques ont chargé

### 2. AlertDialog onConfirm silencieux en prod (ligne 68-75)
- **Fichier** : `components/AlertDialog.tsx`
- Erreur de suppression swallowed silencieusement en production
- **Risque** : utilisateur croit que la suppression a réussi alors qu'elle a échoué

### 3. Race Condition RestTimer (lignes 32-43)
- **Fichier** : `components/RestTimer.tsx`
- Double-cancel notification possible si unmount avant async completes
- **Risque** : ressources notification non libérées

### 4. Type Mismatch History.deletedAt
- **Fichier** : `model/models/History.ts`
- `@date('deleted_at')` → `Date | null` mais schema = `number | null` et queries Q.where('deleted_at', null)
- **Risque** : soft-delete queries peuvent retourner mauvais résultats

### 5. Dialog stacking AssistantScreen (lignes 237-244)
- **Fichier** : `screens/AssistantScreen.tsx`
- `previewModal.close()` non awaited avant `Alert.alert()` → UI glitch potentiel

---

## Warnings 🟡

### 6. WorkoutScreen historyId vide si créeation rate
- **Fichier** : `screens/WorkoutScreen.tsx`
- Si `createWorkoutHistory` échoue, `historyId` reste vide et les sets ne se sauvegardent pas silencieusement

### 7. RestTimer useEffect dependency array vide
- **Fichier** : `components/RestTimer.tsx`
- `useEffect(() => {...}, [])` devrait dépendre de `[duration, notificationEnabled]`
- **Risque** : fuite mémoire si duration change

### 8. Unsafe cast JSON → GeneratedPlan
- **Fichier** : `services/ai/providerUtils.ts`
- `as unknown as GeneratedPlan` — pas de validation complète
- **Risque** : plan invalide passe la validation et crash au runtime

### 9. Fetch abort signal cleanup
- **Fichier** : `services/ai/geminiProvider.ts`
- Si fetch throw avant finally, signal non cleared correctement

### 10. Silent errors useSessionManager
- **Fichier** : `hooks/useSessionManager.ts` (lignes 107, 147, 169)
- `console.error` sans feedback utilisateur

### 11. API key non chiffrée
- **Fichier** : `model/schema.ts`
- `ai_api_key` stockée en clair dans SQLite
- **Risque** : extraction si device compromis

---

## Suggestions 🔵

### 12. Timeout global AI generation (aiService.ts)
- Pas de timeout wrapper global, cloud provider peut bloquer indéfiniment

### 13. Requête inefficace buildDBContext (aiService.ts)
- `Q.take(500)` sans filtre de date sur performance_logs

### 14. `forceUpdate` hack AssistantScreen (ligne 179)
- `useState(0)` utilisé juste pour forcer un re-render — code smell

### 15. Debounce inputs WorkoutExerciseCard
- Chaque frappe trigger `onUpdateInput` sans debounce

### 16. Input clamping manquant (ExerciseTargetInputs)
- Pas de validation de plage sur sets/reps/weight

### 17. Pas de React Error Boundary global
- Pas de mécanisme centralisé pour erreurs async

### 18. AbortSignal dans buildDBContext
- Queries WatermelonDB pas annulables si timeout Gemini triggered

---

## Vérifications manuelles à effectuer en passe 4

- [ ] History.deletedAt type : vérifier schema vs model vs usages
- [ ] RestTimer useEffect dependencies : vérifier le code exact
- [ ] useSessionManager : vérifier si console.error ou __DEV__

---

## Résumé

| Sévérité | Trouvé |
|----------|--------|
| 🔴 Critiques | 5 |
| 🟡 Warnings | 6 |
| 🔵 Suggestions | 7 |
