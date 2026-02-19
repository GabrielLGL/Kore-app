# Passe 6 — Code mort & qualité — 20260219-1315

## Résumé : 13 problèmes confirmés

- 🟡 Warnings : 12 (console.error sans __DEV__)
- 🔵 Suggestions : 1 (hardcoded values)

---

## 🟡 WARNINGS — console.error sans guard __DEV__ (12)

Ces logs s'afficheront en production, violant la règle Known Pitfalls.

| # | Fichier | Ligne | Message |
|---|---------|-------|---------|
| Q1 | `screens/SessionDetailScreen.tsx` | 79 | `'Failed to load exercises:'` |
| Q2 | `screens/HomeScreen.tsx` | 124 | `'[HomeScreen] Erreur import programme :'` |
| Q3 | `screens/HomeScreen.tsx` | 209 | `'[HomeScreen] Drag-and-drop batch update failed:'` |
| Q4 | `screens/SettingsScreen.tsx` | 56 | `'Failed to update rest duration:'` |
| Q5 | `screens/SettingsScreen.tsx` | 71 | `'Failed to save AI settings:'` |
| Q6 | `screens/SettingsScreen.tsx` | 121 | `'Failed to toggle timer:'` |
| Q7 | `hooks/useWorkoutState.ts` | 85 | `'Failed to save workout set:'` |
| Q8 | `hooks/useWorkoutState.ts` | 114 | `'Failed to delete workout set:'` |
| Q9 | `hooks/useExerciseManager.ts` | 79 | `'[useExerciseManager] createExercise failed:'` |
| Q10 | `hooks/useExerciseManager.ts` | 112 | `'[useExerciseManager] updateExercise failed:'` |
| Q11 | `hooks/useExerciseManager.ts` | 130 | `'[useExerciseManager] deleteExercise failed:'` |
| Q12 | `components/ErrorBoundary.tsx` | 38 | `'ErrorBoundary caught:'` |

**Correction pour chaque :**
```typescript
// Avant
console.error('message', error)

// Après
if (__DEV__) console.error('message', error)
```

---

## 🔵 SUGGESTIONS — Hardcoded values (1 fichier)

### CustomModal.tsx (styles hardcodés)
- **Ligne 84 :** `borderRadius: 20` → `borderRadius.lg` (= 20, incohérence future)
- **Ligne 85 :** `padding: 24` → `spacing.xl` (si défini)
- **Ligne 87 :** `shadowColor: '#000'` → couleur hardcodée (Shadow ne fait pas partie du thème)
- **Ligne 94 :** `fontSize: 20` → pas de token fontSize dans le thème (acceptable)
- **Ligne 105 :** `gap: 10` → `spacing.sm` (8) ou `spacing.md` (12)

Note : Ces valeurs sont mineures. Le fichier `CustomModal.tsx` est un composant legacy; les nouveaux composants (AlertDialog, BottomSheet) utilisent correctement les tokens.

---

## ✅ Faux positifs infirmés

| Claim agent | Verdict | Raison |
|-------------|---------|--------|
| WorkoutSummarySheet:58,66 console.error non gardés | ❌ Faux | Wrappés dans `if (__DEV__)` ✅ |
| RestTimer variable non utilisée | ❌ Non confirmé | Code acceptable |

---

## ✅ Aucune incohérence trouvée sur

- Imports inutilisés : aucun
- `any` TypeScript : aucun
- Variables déclarées non lues : aucune
- Styles StyleSheet inutilisés : aucun
- TODOs / FIXMEs : aucun
- Code commenté : aucun
- Incohérences camelCase/snake_case : aucune
