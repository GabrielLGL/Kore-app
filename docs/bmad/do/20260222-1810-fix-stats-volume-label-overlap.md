# fix(stats-volume) — Corriger le chevauchement des labels X du BarChart
Date : 2026-02-22 18:10

## Instruction
docs/bmad/prompts/20260222-1430-stats-ux-B.md

## Rapport source
docs/bmad/prompts/20260222-1430-stats-ux-B.md — Chevauchement labels X sur BarChart Volume

## Classification
Type : fix
Fichiers modifiés : mobile/src/screens/StatsVolumeScreen.tsx

## Ce qui a été fait
- Modifié la construction de `chartData.labels` pour n'afficher qu'un label sur 3
- Avant : `stats.perWeek.map(w => w.weekLabel)` (12 labels = chevauchement)
- Après : `stats.perWeek.map((w, i) => i % 3 === 0 ? w.weekLabel : '')` (4 labels visibles)
- Les 12 barres de données restent affichées, seuls les labels intermédiaires sont masqués

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 847 passed, 47 suites
- Nouveau test créé : non (changement purement visuel, pas de logique métier)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260222-1810

## Commit
27db945 fix(stats-volume): show every 3rd X-axis label to prevent overlap
