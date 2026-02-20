# Passe 7/8 — Corrections — 20260220-2303

## 7a — Critiques 🔴
**Aucun critique trouvé.** Rien à corriger.

## 7b — Warnings 🟡

### Correction #1 — HomeScreen.tsx : drag-drop sans feedback utilisateur

**Problème:** Si `database.write()` échoue lors du réordonnement drag-drop, l'utilisateur ne reçoit aucun feedback en production. L'ordre est perdu silencieusement.

**Fichiers modifiés:**
- `mobile/src/screens/HomeScreen.tsx`

**Changements:**
1. Ajout de `Alert` dans l'import react-native (ligne 2)
2. Ajout de `Alert.alert(...)` dans le catch block (ligne ~213)

**Code avant:**
```tsx
import { View, Text, ..., BackHandler } from 'react-native'
// ...
} catch (error) {
  if (__DEV__) console.error('[HomeScreen] Drag-and-drop batch update failed:', error)
}
```

**Code après:**
```tsx
import { View, Text, ..., BackHandler, Alert } from 'react-native'
// ...
} catch (error) {
  if (__DEV__) console.error('[HomeScreen] Drag-and-drop batch update failed:', error)
  Alert.alert('Erreur', 'Impossible de réorganiser les programmes.')
}
```

**Vérification:**
- ✅ `npx tsc --noEmit` — 0 erreur
- ✅ `jest HomeScreen.test.tsx` — 8/8 tests passent

## 7c — Suggestions 🔵
**Aucune suggestion appliquée** — les points identifiés (emoji hardcodé, stale closure acceptable) ne justifient pas une correction.

## Résumé
| Niveau | Trouvés | Corrigés |
|--------|---------|---------|
| 🔴 Critiques | 0 | 0 |
| 🟡 Warnings | 1 | 1 |
| 🔵 Suggestions | 1 | 0 |
