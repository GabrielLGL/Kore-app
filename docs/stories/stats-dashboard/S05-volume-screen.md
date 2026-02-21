# S05 — StatsVolumeScreen

## Description
Créer l'écran des statistiques de volume d'entraînement.

## Fichiers à créer
- `mobile/src/screens/StatsVolumeScreen.tsx`

## UI (cf UX Design Écran 3)
- ChipSelector de période : 1 mois / 3 mois / Tout
- Volume total + comparaison % vs période précédente (vert/rouge)
- Bar chart (VictoryBar) : volume par semaine (12 semaines)
- Top 3 exercices par volume

## Données
`withObservables` sur `sets` + `exercises` → `computeVolumeStats(sets, exercises, period)`

## Critères d'acceptation
- [ ] Sélecteur période fonctionnel
- [ ] % comparaison vert si positif, rouge si négatif
- [ ] Bar chart correct
- [ ] Top 3 exercices affichés
- [ ] `npx tsc --noEmit` passe

## Estimation : M (2h)
## Dépendances : S02, S03
