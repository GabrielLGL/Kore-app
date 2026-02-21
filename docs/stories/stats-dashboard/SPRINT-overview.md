# Sprint — stats-dashboard — 2026-02-21

## Feature
Dashboard Statistiques Globales — remplace l'onglet Historique par un dashboard complet.

## Stories dans l'ordre d'implémentation

| Story | Titre | Estimation | Dépendances |
|-------|-------|-----------|-------------|
| S01 | Migration schéma v17 | S | — |
| S02 | statsHelpers.ts | M | S01 |
| S03 | StatsScreen + Navigation | M | S01, S02 |
| S04 | StatsDurationScreen | S | S02, S03 |
| S05 | StatsVolumeScreen | M | S02, S03 |
| S06 | StatsCalendarScreen | L | S02, S03 |
| S07 | StatsRepartitionScreen | S | S02, S03 |
| S08 | StatsExercisesScreen | S | S02, S03 |
| S09 | StatsMeasurementsScreen | L | S01, S02, S03 |
| S10 | SettingsScreen — nom | XS | S01 |

## Estimation totale
XS(1) + S(4) + M(3) + L(2) = ~2-3 jours de dev

## Nouveaux fichiers créés
- `mobile/src/screens/StatsScreen.tsx`
- `mobile/src/screens/StatsDurationScreen.tsx`
- `mobile/src/screens/StatsVolumeScreen.tsx`
- `mobile/src/screens/StatsCalendarScreen.tsx`
- `mobile/src/screens/StatsRepartitionScreen.tsx`
- `mobile/src/screens/StatsExercisesScreen.tsx`
- `mobile/src/screens/StatsMeasurementsScreen.tsx`
- `mobile/src/model/models/BodyMeasurement.ts`
- `mobile/src/model/utils/statsHelpers.ts`

## Fichiers modifiés
- `mobile/src/model/schema.ts` (v17)
- `mobile/src/model/models/User.ts` (ajout name)
- `mobile/src/model/index.ts` (ajout BodyMeasurement)
- `mobile/src/navigation/index.tsx` (tab + 6 sous-écrans)
- `mobile/src/screens/SettingsScreen.tsx` (champ name)
