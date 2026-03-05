# fix(settings) — Reset email dans suppression RGPD
Date : 2026-03-05 17:20

## Instruction
couleur hardcodee #FFFFFF dans HomeScreen quickStartGoText + reset email RGPD dans SettingsScreen

## Rapport source
docs/bmad/reviews/20260305-1700-review.md — Problemes #2 et #3

## Classification
Type : fix
Fichiers modifies : mobile/src/screens/SettingsScreen.tsx

## Ce qui a ete fait
- Couleur hardcodee #FFFFFF dans HomeScreen : deja corrigee par une autre session (utilise colors.primaryText)
- Reset email RGPD : ajoute `u.email = ''` dans handleDeleteAllData pour conformite RGPD

## Verification
- TypeScript : ✅
- Tests : ✅ 32 passed (SettingsScreen)
- Nouveau test cree : non

## Documentation mise a jour
aucune

## Statut
✅ Resolu — 20260305-1720

## Commit
