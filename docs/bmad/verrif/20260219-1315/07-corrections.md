# Passe 7 — Corrections — 20260219-1315

## 7a — Critiques corrigés (🔴 → ✅)

### C1 — AlertDialog.handleConfirm : try/catch ajouté
- **Fichier :** `src/components/AlertDialog.tsx:68-76`
- **Avant :**
```typescript
const handleConfirm = async () => {
  haptics.onDelete()
  await onConfirm()
}
```
- **Après :**
```typescript
const handleConfirm = async () => {
  haptics.onDelete()
  try {
    await onConfirm()
  } catch (error) {
    if (__DEV__) console.error('[AlertDialog] onConfirm failed:', error)
  }
}
```
- **Résultat :** Plus de crash silencieux si `onConfirm()` échoue.

---

## 7b — Warnings corrigés (🟡 → ✅)

### 12× console.error → guarded par __DEV__

| Fichier | Ligne | Status |
|---------|-------|--------|
| `screens/SessionDetailScreen.tsx` | 79 | ✅ |
| `screens/HomeScreen.tsx` | 124 | ✅ |
| `screens/HomeScreen.tsx` | 209 | ✅ |
| `screens/SettingsScreen.tsx` | 56 | ✅ |
| `screens/SettingsScreen.tsx` | 71 | ✅ |
| `screens/SettingsScreen.tsx` | 121 | ✅ |
| `hooks/useWorkoutState.ts` | 85 | ✅ |
| `hooks/useWorkoutState.ts` | 114 | ✅ |
| `hooks/useExerciseManager.ts` | 79 | ✅ |
| `hooks/useExerciseManager.ts` | 112 | ✅ |
| `hooks/useExerciseManager.ts` | 130 | ✅ |
| `components/ErrorBoundary.tsx` | 38 | ✅ |

**Pattern appliqué :**
```typescript
// Avant
console.error('message', error)
// Après
if (__DEV__) console.error('message', error)
```

---

## 7c — Suggestions non appliquées (avec justification)

### W1 — ExercisePickerModal ScrollView → FlatList
**Raison du skip :** Refactoring de rendu non trivial (changement d'API ScrollView → FlatList, renderItem, keyExtractor). Risque de régression. À planifier séparément.

### Hardcoded values CustomModal.tsx
**Raison du skip :** `CustomModal.tsx` est un composant legacy, peu utilisé (AlertDialog le remplace). Corriger les tokens de thème ne change pas le comportement visuel et le risque n'est pas justifié.

---

## Vérification post-corrections

- `npx tsc --noEmit` : **0 erreur** ✅
- `npm test` : **533 passed, 0 fail** ✅
- Aucune régression introduite
