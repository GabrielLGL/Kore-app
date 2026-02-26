# style(SettingsScreen) — Revert NeuShadow wrappers → neuShadow spread
Date : 2026-02-26 21:45

## Instruction
docs/bmad/prompts/20260226-2145-revert-neushadow-B.md

## Rapport source
docs/bmad/prompts/20260226-2145-revert-neushadow-B.md

## Classification
Type : style
Fichiers modifiés : mobile/src/screens/SettingsScreen.tsx

## Ce qui a été fait
1. Supprimé `import { NeuShadow } from '../components/NeuShadow'`
2. Restauré le style `section` : ajout `marginBottom: spacing.lg` et `...neuShadow.elevatedSm` (spread en dernier)
3. Supprimé les 8 wrappers `<NeuShadow level="elevatedSm" ...>` / `</NeuShadow>` autour des sections :
   - 👤 Mon profil
   - 🎨 Apparence
   - ⏱️ Minuteur de repos
   - ⭐ Gamification
   - ✨ Intelligence Artificielle
   - 💾 Données
   - ℹ️ À propos
   - ❓ Aide
4. Conservé intacts : `...neuShadow.pressed` dans `streakTargetBtn` et `...neuShadow.elevatedSm` dans `streakTargetBtnActive` et `exportButton`

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 28/28 passed
- Nouveau test créé : non

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260226-2145

## Commit
698b3f5 style(SettingsScreen): revert NeuShadow wrappers → neuShadow spread
