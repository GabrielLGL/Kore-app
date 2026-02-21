# Changelog — stats-dashboard — 2026-02-21

## Résumé
Tableau de bord statistiques globales remplaçant l'écran historique. Accessible depuis l'onglet Stats, le dashboard affiche le prénom de l'utilisateur, une phrase d'accroche dynamique et 7 boutons vers des écrans de stats détaillées : durée, volume, calendrier d'activité, répartition musculaire, records personnels, mesures corporelles et historique.

## Décisions clés

1. **Remplacement total de l'onglet Historique** : L'ancien `ChartsScreen` devient accessible via le bouton "Historique" dans la grille du dashboard (même style que les autres boutons).

2. **react-native-chart-kit** : Bibliothèque déjà installée dans le projet, utilisée à la place de victory-native qui n'était pas présente.

3. **Schéma v17 addColumns-compatible** : Migration safe — ajout d'une colonne optionnelle sur `users` + nouvelle table `body_measurements`, pas de suppression/modification.

4. **Helpers purs dans statsHelpers.ts** : Toutes les fonctions de calcul sont pures (pas d'accès DB) pour faciliter les tests unitaires futurs.

5. **CompositeNavigationProp** : Nécessaire pour permettre la navigation depuis un écran d'onglet vers les écrans de la stack racine.

6. **Phrase d'accroche contextuelle** : 6 niveaux de priorité (streak ≥3j, PR cette semaine, retour après pause >4j, 1er du mois, régularité ≥4/semaine, volume total par défaut).

## Stories implémentées

| Story | Description | Statut | Commit |
|-------|-------------|--------|--------|
| S01 | Migration schéma v17 + BodyMeasurement model | ✅ | feat(stats) |
| S02 | statsHelpers.ts — fonctions de calcul pures | ✅ | feat(stats) |
| S03 | StatsScreen dashboard + navigation | ✅ | feat(stats) |
| S04 | StatsDurationScreen | ✅ | feat(stats) |
| S05 | StatsVolumeScreen | ✅ | feat(stats) |
| S06 | StatsCalendarScreen (GitHub-style) | ✅ | feat(stats) |
| S07 | StatsRepartitionScreen | ✅ | feat(stats) |
| S08 | StatsExercisesScreen (PRs + fréquence) | ✅ | feat(stats) |
| S09 | StatsMeasurementsScreen | ✅ | feat(stats) |
| S10 | SettingsScreen — champ prénom | ✅ | feat(stats) |

## Résultat QA
✅ 10/10 stories PASSED
✅ TypeScript 0 erreur
✅ 789 tests passés, 0 échoués
