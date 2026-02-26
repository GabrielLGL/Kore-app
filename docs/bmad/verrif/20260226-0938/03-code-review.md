# Passe 3 — Code Review Adversarial — 20260226-0938

## Résumé
87 fichiers TS/TSX analysés. 10 problèmes identifiés.

## Problèmes

### 1. 🟡 handleSkipOnboarding sans try/catch
**Fichier:** `src/screens/ProgramsScreen.tsx:143-146`

```tsx
const handleSkipOnboarding = async () => {
  await markOnboardingCompleted()   // ← pas de try/catch
  setIsOnboardingVisible(false)
}
```

Incohérent avec `handleProgramSelected` (lignes 131-141) qui entoure le même appel dans try/catch.
Si `database.write()` échoue, l'exception propage sans feedback utilisateur.

**Correction:** Ajouter try/catch avec `if (__DEV__) console.error`.

---

### 2. 🟡 BackHandler recréé à chaque changement d'état modal
**Fichier:** `src/screens/ProgramsScreen.tsx:88-112`

Le listener `hardwareBackPress` est recréé à chaque transition modale (race condition potentielle).

**Recommandation:** Pattern useRef pour capturer l'état sans recréer le listener.

---

### 3. 🟡 FlatList — items non memoized
**Fichier:** `src/screens/ExercisesScreen.tsx:118-135`

Les items du FlatList sont renderItem inline sans React.memo. Sur de grandes listes, re-renders inutiles.

**Recommandation:** Extraire en composant React.memo.

---

### 4. 🟡 Notification setup — chain .then().then() fragile
**Fichier:** `src/screens/WorkoutScreen.tsx:169-175`

```tsx
setupNotificationChannel()
  .then(() => requestNotificationPermission())
  .then(granted => { notificationPermissionRef.current = granted })
  .catch(...)
```

Si `requestNotificationPermission()` rejette, le catch attrape mais on ne sait pas si les permissions ont été demandées.

**Recommandation:** Réécrire en async/await avec try/catch.

---

### 5. 🔵 NOTE : ai_api_key en SQLite — DÉJÀ GÉRÉ
**Fichier:** `src/model/schema.ts:76`

La colonne `ai_api_key` existe dans le schema mais c'est intentionnel pour la migration.
`services/secureKeyStore.ts` implémente `migrateKeyFromDB()` qui déplace les clés vers expo-secure-store.
**NON-ISSUE — déjà géré correctement.**

---

### 6. 🔵 NOTE : response undefined dans gemini/openaiProvider — FAUX POSITIF
**Fichiers:** `src/services/ai/geminiProvider.ts:15`, `src/services/ai/openaiProvider.ts:10`

```typescript
let response: Response
try {
  response = await fetch(...)
} finally {
  clear()
}
if (!response.ok) { ... }  // ← jamais atteint si fetch() throw
```

TypeScript confirme 0 erreur car si `fetch()` throw, l'exception propage à travers le `finally` et le code après n'est jamais exécuté. **Pas un bug.**

---

### 7-10. 🔵 Suggestions mineures
- Constantes de timing (`ANIMATION_DURATION = 200`) dans theme
- Databasehelpers.ts (863 lignes) → candidat refactor futur
- statsHelpers.ts (602 lignes) → candidat refactor futur
- `as any` dans les tests → acceptable, considérer `Partial<T>` à terme

## Tableau de synthèse

| # | Sévérité | Fichier | Problème | Action |
|---|----------|---------|----------|--------|
| 1 | 🟡 | ProgramsScreen.tsx:143 | handleSkipOnboarding sans try/catch | Corriger — 7b |
| 2 | 🟡 | ProgramsScreen.tsx:88 | BackHandler race condition | Note uniquement |
| 3 | 🟡 | ExercisesScreen.tsx:118 | FlatList sans React.memo | Note uniquement |
| 4 | 🟡 | WorkoutScreen.tsx:169 | Notification chain fragile | Note uniquement |
| 5 | 🔵 | schema.ts:76 | ai_api_key SQLite | Faux positif — déjà géré |
| 6 | 🔵 | gemini/openaiProvider.ts | response undefined | Faux positif |
| 7-10 | 🔵 | Divers | Magic numbers, gros fichiers | Suggestions futures |
