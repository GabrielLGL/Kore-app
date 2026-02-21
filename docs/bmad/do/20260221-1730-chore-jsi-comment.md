# chore(model) — Commentaire explicatif JSI SQLiteAdapter
Date : 2026-02-21 17:30

## Instruction
docs/bmad/prompts/20260221-1730-warnings-A.md

## Rapport source
docs/bmad/prompts/20260221-1730-warnings-A.md

## Classification
Type : chore
Fichiers modifiés : mobile/src/model/index.ts

## Ce qui a été fait
Ajout de 2 lignes de commentaire au-dessus de `jsi: true` dans `mobile/src/model/index.ts` :
- Explique que JSI est requis pour la performance avec New Architecture / Bridgeless mode
- Explique que le warning `[🍉] JSI SQLiteAdapter not available` est attendu en dev sans rebuild natif

Aucune logique modifiée. `jsi: true` conservé.

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : non lancés (changement cosmétique uniquement — commentaires)
- Nouveau test créé : non

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260221-1730

## Commit
[sera rempli à l'étape 8]
