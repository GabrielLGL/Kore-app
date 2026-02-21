# S07 — StatsRepartitionScreen

## Description
Créer l'écran de répartition du volume par groupe musculaire.

## Fichiers à créer
- `mobile/src/screens/StatsRepartitionScreen.tsx`

## UI (cf UX Design Écran 5)
- ChipSelector de période : 1 mois / 3 mois / Tout
- Barres horizontales custom (View avec width proportionnelle) pour chaque muscle
- Pourcentage affiché en fin de barre
- Max 7 muscles + "Autres"
- Volume total analysé affiché en bas

## Données
`withObservables` sur `sets` + `exercises` → `computeMuscleRepartition(sets, exercises, period)`

## Critères d'acceptation
- [ ] Barres proportionnelles au volume
- [ ] Parsing muscles correcte (split par virgule)
- [ ] Max 8 groupes (7 + Autres)
- [ ] ChipSelector période fonctionnel
- [ ] `npx tsc --noEmit` passe

## Estimation : S (1-2h)
## Dépendances : S02, S03
