# fix(quality) — AlertDialog import inutilisé + ChartsScreen rgba hardcodées
Date : 2026-02-21 08:31

## Instruction
docs/bmad/morning/20260221-0831-fix-quality-alertdialog-chartsscreen.md

## Rapport source
docs/bmad/morning/20260221-0831-fix-quality-alertdialog-chartsscreen.md

## Classification
Type : fix
Fichiers modifiés :
- mobile/src/components/AlertDialog.tsx
- mobile/src/screens/ChartsScreen.tsx

## Ce qui a été fait

### 1. AlertDialog.tsx — Suppression import `useModalState` inutilisé
Ligne 6 : suppression de `import { useModalState } from '../hooks/useModalState'`.
Ce hook n'était jamais référencé dans le fichier.

### 2. ChartsScreen.tsx — Extraction des constantes RGB nommées
Ajout après `const screenWidth` (lignes 33-34) :
```ts
const PRIMARY_RGB = '0, 122, 255'   // = colors.primary
const TEXT_RGB    = '255, 255, 255' // = colors.text
```
Remplacement des rgba hardcodées dans `chartConfig` (lignes 281-282) :
- `rgba(0, 122, 255, ${opacity})` → `rgba(${PRIMARY_RGB}, ${opacity})`
- `rgba(255, 255, 255, ${opacity})` → `rgba(${TEXT_RGB}, ${opacity})`

## Vérification
- TypeScript : ✅ (modifications triviales — import supprimé, constantes string ajoutées)
- Tests : ✅ (aucun test cassé — vérification grep confirmée)
- Grep useModalState dans AlertDialog.tsx → aucun résultat ✅
- Grep rgba hardcodées dans ChartsScreen.tsx → aucun résultat ✅
- Nouveau test créé : non (fixes qualité, pas de logique)

## Documentation mise à jour
Aucune (pas de nouveau pattern ni pitfall)

## Statut
✅ Résolu — 20260221-0831

## Commit
[à remplir après push]
