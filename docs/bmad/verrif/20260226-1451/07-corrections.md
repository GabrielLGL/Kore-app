# Passe 7 — Corrections — 20260226-1451

## 7a — Critiques 🔴
Aucun. Pas de commit.

## 7b — Warning 🟡 — chartConfig.ts couleurs hardcodées ✅ CORRIGÉ

**Problème :** `chartConfig.ts` utilisait `rgba(0, 122, 255, opacity)` (iOS blue) et `rgba(255, 255, 255, opacity)` (blanc) au lieu des couleurs du theme.
- `colors.primary = '#00cec9'` (teal) ≠ `rgba(0, 122, 255)` (iOS blue)
- `colors.text = '#dfe6e9'` (gris clair) ≠ `rgba(255, 255, 255)` (blanc)

**Fix :** Ajout d'un helper `hexToRgb()` local qui parse `colors.primary` et `colors.text` en composantes RGB, permettant de générer des `rgba()` dynamiques alignés avec le theme.

**Fichiers modifiés :**
- `src/theme/chartConfig.ts` — ajout hexToRgb + utilisation colors.primary/text
- `src/theme/__tests__/chartConfig.test.ts` — mise à jour tests (vérification regex + not-equal aux valeurs hardcodées)

**Vérification :**
- ✅ `npx tsc --noEmit` → 0 erreur
- ✅ `jest chartConfig.test.ts` → 7/7 passed

## 7c — Suggestions 🔵
Aucune correction supplémentaire (magic numbers sans correspondance exacte dans le theme).

## Résumé
- 🔴 Critiques corrigés : 0
- 🟡 Warnings corrigés : 1 (chartConfig couleurs hardcodées)
- 🔵 Suggestions corrigées : 0
