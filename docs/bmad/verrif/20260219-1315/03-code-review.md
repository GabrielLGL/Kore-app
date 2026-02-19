# Passe 3 — Code Review — 20260219-1315

## Résumé

18 problèmes potentiels analysés par l'agent (adversarial review), **confirmés après vérification manuelle** :
- 🔴 Critiques : **1 confirmé**
- 🟡 Warnings : **2 confirmés**
- 🔵 Suggestions : **3 confirmées**
- 🟢 Faux positifs : **12 infirmés**

---

## 🔴 CRITIQUES (1)

### C1 — AlertDialog.handleConfirm sans try/catch
- **Fichier :** `src/components/AlertDialog.tsx:68-71`
- **Code problématique :**
```typescript
const handleConfirm = async () => {
  haptics.onDelete()
  await onConfirm() // Peut lever une exception non catchée
}
```
- **Impact :** Si `onConfirm()` lance une erreur (ex: DB error lors d'une suppression), la Promise est rejetée silencieusement. Le dialog ne se ferme pas, l'UI se bloque, aucun feedback utilisateur.
- **Correction :** Ajouter try/catch autour de `await onConfirm()`.

---

## 🟡 WARNINGS (2)

### W1 — ExercisePickerModal utilise ScrollView au lieu de FlatList
- **Fichier :** `src/components/ExercisePickerModal.tsx:131-143`
- **Problème :** `ScrollView` rend TOUS les exercices en mémoire simultanément. Avec 100+ exercices, c'est une dégradation de performance notable (RAM + temps de rendu initial).
- **Correction :** Remplacer par `FlatList` avec `initialNumToRender` et `keyExtractor`.

### W2 — Pas de maxLength sur les TextInput de noms
- **Fichier :** `src/screens/ExercisesScreen.tsx` (inputs de création/édition d'exercice)
- **Problème :** Un utilisateur peut coller du texte très long (> 1000 caractères) dans les champs nom d'exercice, nom de programme, etc.
- **Correction :** Ajouter `maxLength={100}` sur les inputs de texte libre.

---

## 🔵 SUGGESTIONS (3)

### S1 — Magic strings pour les noms de table WatermelonDB
- **Fichier :** `src/model/utils/databaseHelpers.ts` et partout
- **Problème :** Les noms de table ('sets', 'sessions', 'exercises', etc.) sont des strings littérales dispersées dans le code.
- **Suggestion :** Centraliser dans des constantes ou utiliser les tableNames des modèles.

### S2 — ExercisePickerModal sans React.memo()
- **Fichier :** `src/components/ExercisePickerModal.tsx`
- **Problème :** Le composant n'est pas mémorisé avec `React.memo()`. Avec `withObservables`, chaque update DB déclenche un re-render complet même si les props n'ont pas changé.
- **Suggestion :** Wrapper avec `React.memo()`.

### S3 — DeviceEventEmitter.emit() sans vérification navigation
- **Fichier :** `src/hooks/useModalState.ts:28`
- **Problème :** L'émission d'événements n'a pas de vérification d'existence du listener.
- **Suggestion :** Pattern acceptable en pratique (l'événement est simplement ignoré si pas de listener), mais mérite documentation.

---

## ✅ Faux positifs infirmés

| # | Claim agent | Verdict | Raison |
|---|-------------|---------|--------|
| 1 | ChartsScreen batch() hors write() | ❌ Faux | batch() est dans database.write() (ligne 78) |
| 2 | RestTimer fuite mémoire setInterval | ❌ Faux | Cleanup complet lignes 68-73 |
| 3 | HomeScreen setTimeout orphelin | ❌ Faux | Cleanup correct si condition vraie |
| 4 | navigation/index.tsx resetTimerRef non nettoyé | ❌ Faux | Cleanup ligne 110 |
| 5 | databaseHelpers.ts catch vides | ❌ Faux | Aucun catch vide (grep retourne vide) |
| 6 | exercise.muscles crash null | ❌ Faux | Getter retourne `[]` avec fallback `|| '[]'` |
| 7 | WorkoutSummarySheet debounce fuite | ❌ Faux | Cleanup complet + flush |
| 8 | useHaptics memoization re-renders | ❌ Faux | useMemo correct, impact négligeable |

---

## Points positifs confirmés

- Architecture offline-first propre avec `withObservables`
- Pattern Portal/AlertDialog/BottomSheet cohérent
- Haptics sémantiques bien abstraits
- Cleanup timers systématique (7 sur 8 fichiers vérifiés)
- TypeScript strict sans `any`
- Validation centralisée dans helpers
