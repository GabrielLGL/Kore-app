# fix(navigation) — Supprimer titre Kore + corriger bouton Settings
Date : 2026-02-22 14:10

## Instruction
docs/bmad/prompts/20260222-1400-homescreen-header-A.md

## Rapport source
docs/bmad/prompts/20260222-1400-homescreen-header-A.md

## Classification
Type : fix
Fichiers modifiés : mobile/src/navigation/index.tsx

## Ce qui a été fait
1. **Supprimé le titre "Kore"** : `headerTitle: 'Kore'` → `headerTitle: ''`
2. **Corrigé le bouton Settings** :
   - Remplacé `TouchableOpacity` par `Pressable` (meilleure compatibilité native-stack + Fabric Android)
   - Ajouté `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}` pour agrandir la zone tactile
   - Augmenté le padding de 5 à 10 pour un meilleur confort de tap
3. Nettoyé l'import : `TouchableOpacity` → `Pressable`

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 840 passed
- Nouveau test créé : non (changement UI navigation, pas de logique métier)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260222-1410

## Commit
cac7ca5 fix(navigation): remove Kore title and fix Settings button tap
