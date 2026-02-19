# Passe 4 — Bugs silencieux — 20260219-1315

## Résumé : 3 bugs confirmés

- 🔴 Critiques : 0
- 🟡 Warnings : 3 (console sans __DEV__)
- 🔵 Suggestions : 0

---

## 🟡 WARNINGS (3)

### B1 — console.error sans __DEV__ dans SessionDetailScreen
- **Fichier :** `src/screens/SessionDetailScreen.tsx:79`
- **Code :**
```typescript
} catch (error) {
  console.error('Failed to load exercises:', error)  // ⚠️ pas de __DEV__ guard
  setExercisesList([])
}
```
- **Impact :** Log visible en production → leak d'informations internes.
- **Correction :** `if (__DEV__) console.error('Failed to load exercises:', error)`

### B2 — console.error sans __DEV__ dans SettingsScreen (×3)
- **Fichier :** `src/screens/SettingsScreen.tsx:56, 71, 121`
- **Code :**
```typescript
console.error('Failed to update rest duration:', error)  // ligne 56
console.error('Failed to save AI settings:', error)      // ligne 71
console.error('Failed to toggle timer:', error)          // ligne 121
```
- **Impact :** 3 logs produits en production.
- **Correction :** Wrapper chacun avec `if (__DEV__)`

### B3 — AlertDialog.handleConfirm : exception onConfirm() non catchée
- **Fichier :** `src/components/AlertDialog.tsx:68-71`
- **Code :**
```typescript
const handleConfirm = async () => {
  haptics.onDelete()
  await onConfirm() // Si ça throw, aucun catch → UI bloquée
}
```
- **Impact :** Si `onConfirm()` throw (ex: erreur DB lors suppression), la Promise est rejetée. Le Dialog reste ouvert, l'utilisateur ne peut plus interagir normalement.
- **Correction :** Ajouter try/catch et fermer le dialog en cas d'erreur.

---

## ✅ Vérifications negatives (code correct)

| Aspect | Verdict |
|--------|---------|
| Mutations WatermelonDB hors write() | ✅ Aucune trouvée |
| setInterval/setTimeout sans cleanup | ✅ Tous nettoyés |
| Subscriptions .observe() sans unsubscribe | ✅ Non applicable (withObservables gère) |
| Promesses non awaited | ✅ Aucune trouvée |
| Division par zéro | ✅ Aucune trouvée |
| Index out of bounds | ✅ getLastPerformanceForExercise protégé par `sets.length === 0` |
| Accès null/undefined | ✅ Protégés ou relations WatermelonDB correctes |
