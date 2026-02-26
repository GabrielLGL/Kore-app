# style(NeuShadow) — Fix double-Shadow → Shadow unique + borderColor
Date : 2026-02-26 21:35

## Instruction
/do docs/bmad/prompts/20260226-2130-fix-neushadow-settings-A.md

## Rapport source
docs/bmad/prompts/20260226-2130-fix-neushadow-settings-A.md

## Classification
Type : style/fix
Fichiers modifiés :
- `mobile/src/components/NeuShadow.tsx`
- `mobile/src/screens/SettingsScreen.tsx`

## Ce qui a été fait
**NeuShadow.tsx** : remplacé les 2 Shadow SVG imbriqués (instables, se coupaient mutuellement)
par 1 seul Shadow (ombre sombre bas-droite) + `borderColor: params.lightColor` (reflet clair simulé).
Ce pattern hybride est stable dans ScrollView — pas de double couche SVG, pas de clipping.

**SettingsScreen.tsx** : ajouté `marginHorizontal: spacing.xs` (4px) sur les 8 NeuShadow
containers pour donner de la respiration aux ombres latérales sans décaler le layout.

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 28/28 passed (SettingsScreen)

## Documentation mise à jour
Aucune (pattern déjà documenté dans NeuShadow JSDoc)

## Statut
✅ Résolu — 20260226-2135

## Commit
[à remplir]
