# S04 — StatsDurationScreen

## Description
Créer l'écran des statistiques de durée des séances.

## Fichiers à créer
- `mobile/src/screens/StatsDurationScreen.tsx`

## UI (cf UX Design Écran 2)
- 4 KPI cards (Moyenne, Total, Min, Max) en grille 2×2
- Line chart (VictoryLine) : évolution durée par séance (30 dernières)
- Durée formatée via `formatDuration()`
- Séances sans `end_time` ignorées

## Données
`withObservables` sur `histories` → `computeDurationStats(histories)`

## Critères d'acceptation
- [ ] 4 KPIs affichés et corrects
- [ ] Line chart visible avec les 30 dernières séances
- [ ] Séances sans end_time exclues silencieusement
- [ ] `npx tsc --noEmit` passe

## Estimation : S (1-2h)
## Dépendances : S02, S03
