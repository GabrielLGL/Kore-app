# fix(stats-measurements) — Renommer "Taille" en "Tour de taille" + fix clavier BottomSheet
Date : 2026-02-22 17:00

## Instruction
docs/bmad/prompts/20260222-1430-stats-ux-E.md

## Rapport source
docs/bmad/prompts/20260222-1430-stats-ux-E.md

## Classification
Type : fix
Fichiers modifies : mobile/src/screens/StatsMeasurementsScreen.tsx

## Ce qui a ete fait
1. **Renommage label** : Dans le tableau `METRICS`, le label `'Taille'` a ete renomme en `'Tour de taille'` pour eviter la confusion avec la taille (hauteur). Le prefixe `T:` dans l'historique compact est conserve.
2. **Fix clavier BottomSheet** : Le `KeyboardAvoidingView` (inefficace sur Android) a ete remplace par une `ScrollView` avec `keyboardShouldPersistTaps="handled"` et `maxHeight: screenHeight * 0.6`. Le formulaire est maintenant scrollable quand le clavier est ouvert.
3. **Nettoyage imports** : `KeyboardAvoidingView` et `Platform` retires des imports (plus utilises). `height` ajoute a la destructuration de `useWindowDimensions`.

## Verification
- TypeScript : ✅
- Tests : ✅ 847 passed
- Nouveau test cree : non

## Documentation mise a jour
aucune

## Statut
✅ Resolu — 20260222-1700

## Commit
f47390f fix(stats-measurements): rename "Taille" to "Tour de taille" and fix keyboard in BottomSheet
