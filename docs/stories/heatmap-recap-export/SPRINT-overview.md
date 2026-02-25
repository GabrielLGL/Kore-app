# Sprint — Composants visuels (Heatmap, Recap, Export)

> Phase 1 Fondations — Groupe D
> Features : #90 (Heatmap calendrier), #8 (Recap post-seance), #92 (Export donnees)

## Objectif
Trois composants visuels gratuits qui renforcent la retention et la confiance utilisateur.

## Stories (ordre d'implementation)

| # | Story | Estimation | Dependance |
|---|-------|------------|------------|
| S01 | Helper `buildHeatmapData` + tests | S | — |
| S02 | Composant `HeatmapCalendar` | M | S01 |
| S03 | Integration HomeScreen | S | S02 |
| S04 | Recap enrichi (gamification dans WorkoutSummarySheet) | M | — |
| S05 | Installation expo-file-system + expo-sharing | XS | — |
| S06 | Helper `exportAllData` + tests | M | S05 |
| S07 | Bouton export dans SettingsScreen + partage | S | S06 |

Estimations : XS = <15min, S = 15-30min, M = 30-60min

## Parallelisation possible
- S01-S03 (Heatmap) et S04 (Recap) sont independants
- S05 doit preceder S06 qui doit preceder S07
- S04 est totalement independant du reste

## Schema
Pas de migration. Schema v20 inchange.

## Fichiers nouveaux
- `components/HeatmapCalendar.tsx`
- `model/utils/exportHelpers.ts`

## Fichiers modifies
- `model/utils/statsHelpers.ts` (+buildHeatmapData, +HeatmapDay)
- `screens/HomeScreen.tsx` (+heatmap card)
- `components/WorkoutSummarySheet.tsx` (+section gamification)
- `screens/WorkoutScreen.tsx` (+useState gamification, +props)
- `screens/SettingsScreen.tsx` (+section Donnees, +bouton export)
- `package.json` (+expo-file-system, +expo-sharing)
