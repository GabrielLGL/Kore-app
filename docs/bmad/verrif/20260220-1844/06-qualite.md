# Passe 6 — Code mort & qualité — 20260220-1844

## Résultat

Scan complet de mobile/src/ — qualité et code mort.

---

## ✅ Vérifications propres

| Catégorie | Statut |
|-----------|--------|
| Imports inutilisés | ✅ 0 trouvé |
| Dead exports | ✅ 0 trouvé |
| TypeScript `any` | ✅ 0 trouvé |
| console.log hors __DEV__ | ✅ 0 trouvé |
| Couleurs hardcodées | ✅ 0 trouvé |
| Code commenté | ✅ 0 trouvé |
| TODO/FIXME oubliés | ✅ 0 trouvé |

---

## 🟡 Warnings — Magic numbers (pas de tokens thème)

Plusieurs composants utilisent des valeurs numériques directes au lieu des tokens du thème.

### Fichiers concernés

| Fichier | Valeurs | Impact |
|---------|---------|--------|
| `components/CustomModal.tsx` | borderRadius: 20, fontSize: 20 | 🟡 |
| `components/ExercisePickerModal.tsx` | borderRadius: 20, padding: 25, fontSize: 18 | 🟡 |
| `components/ErrorBoundary.tsx` | fontSize: 48, borderRadius: 16, padding: 20 | 🟡 |
| `components/ExerciseTargetInputs.tsx` | marginBottom: 5, padding: 12, borderRadius: 8 | 🟡 |
| `components/BottomSheet.tsx` | borderRadius: 2 (drag handle) | 🔵 |
| `components/RestTimer.tsx` | borderRadius: 15, marginHorizontal: 20 | 🟡 |
| `components/SessionExerciseItem.tsx` | marginHorizontal: 15, padding: 15 | 🟡 |
| `components/SetItem.tsx` | padding: 15, marginBottom: 10 | 🟡 |
| `components/SessionItem.tsx` | fontSize: 17, fontSize: 13 | 🟡 |

**Tokens manquants dans le thème** : fontSize 13, 15, 17 / spacing 5, 10, 15 / borderRadius 15

---

## 🔵 Suggestions — Nommage

- `CustomModal.tsx`, `SetItem.tsx` utilisent l'interface `Props` au lieu de `ComponentNameProps`
- Légère inconsistance `Content` suffix (ExercisesContent) vs non-suffixés

---

## Résumé

| Sévérité | Trouvé |
|----------|--------|
| 🔴 Critiques | 0 |
| 🟡 Warnings | ~40 magic numbers dans 9 composants |
| 🔵 Suggestions | 3-5 nommage |

---

## Note : Magic numbers vs comportement

Ces magic numbers sont des **problèmes de maintenabilité** uniquement — aucun impact fonctionnel. Le projet respecte les tokens pour les couleurs (point critique), seuls les espacements/tailles sont parfois hors-thème.
