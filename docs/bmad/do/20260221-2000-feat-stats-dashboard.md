# feat(stats) — Tableau de bord statistiques globales
Date : 2026-02-21 20:00

## Instruction
`/idee j'aimerais faire des statistique globales de la personne`

## Rapport source
Pipeline BMAD complet (phases 1–11)
Stories : docs/stories/stats-dashboard/S01–S10

## Classification
Type : feat
Scope : stats

## Fichiers modifiés

### Nouveaux fichiers
- `mobile/src/model/models/BodyMeasurement.ts` — Modèle WatermelonDB mesures corporelles
- `mobile/src/model/utils/statsHelpers.ts` — Fonctions de calcul stats (pures)
- `mobile/src/screens/StatsScreen.tsx` — Dashboard principal (remplace ChartsScreen dans l'onglet)
- `mobile/src/screens/StatsDurationScreen.tsx` — Stats durée des séances
- `mobile/src/screens/StatsVolumeScreen.tsx` — Stats volume d'entraînement
- `mobile/src/screens/StatsCalendarScreen.tsx` — Calendrier GitHub-style activité
- `mobile/src/screens/StatsRepartitionScreen.tsx` — Répartition musculaire par période
- `mobile/src/screens/StatsExercisesScreen.tsx` — Records personnels + fréquence
- `mobile/src/screens/StatsMeasurementsScreen.tsx` — Suivi mesures corporelles

### Fichiers modifiés
- `mobile/src/model/schema.ts` — v16→v17 : `name` sur users + table `body_measurements`
- `mobile/src/model/models/User.ts` — Ajout `@text('name')`
- `mobile/src/model/index.ts` — Ajout BodyMeasurement dans modelClasses
- `mobile/src/navigation/index.tsx` — Onglet Stats → StatsScreen + 7 sous-écrans dans Root Stack
- `mobile/src/screens/SettingsScreen.tsx` — Section "👤 Mon profil" avec champ prénom

### Documentation
- `docs/bmad/01-brainstorm.md` — Phase brainstorming
- `docs/bmad/02-product-brief.md` — Product brief
- `docs/bmad/03-prd.md` — PRD + MoSCoW
- `docs/bmad/04-architecture.md` — Architecture technique
- `docs/bmad/05-ux-design.md` — UX design
- `docs/stories/stats-dashboard/` — S01–S10 + SPRINT-overview
- `docs/bmad/07-qa-report.md` — Rapport QA

## Ce qui a été fait

### Fonctionnalités
1. **Dashboard stats** : Remplace l'onglet Historique. Affiche le prénom de l'utilisateur, une phrase d'accroche dynamique contextuelle (streak, PR, retour après pause, 1er du mois, régularité, volume), 3 KPIs (séances, volume, PRs), et une grille de 7 boutons d'accès aux stats détaillées.

2. **Durée** : 4 métriques (moy/total/min/max) + LineChart 30 séances.

3. **Volume** : Comparaison % inter-périodes (vert/rouge) + BarChart 12 semaines + top 3 exercices.

4. **Calendrier** : Grille GitHub-style 6 mois glissants, intensité colorée, tooltip au tap, badges streak actuel et record.

5. **Muscles** : Barres horizontales proportionnelles par muscle (top 7 + Autres), filtrable par période.

6. **Exercices** : Records personnels (weight×reps + 1RM Epley) + top 5 les plus pratiqués.

7. **Mesures corporelles** : Suivi poids + taille + hanches + bras + poitrine. Dernière mesure en cards, graphique évolution par métrique, historique avec suppression, formulaire d'ajout en BottomSheet.

8. **Prénom utilisateur** : Champ `name` sur la table `users`, saisi dans les Paramètres.

### Helpers purs (statsHelpers.ts)
- `computeGlobalKPIs` — totalSessions, totalVolumeKg, totalPRs
- `computeMotivationalPhrase` — 6 cas prioritaires
- `computeCurrentStreak` / `computeRecordStreak`
- `computeDurationStats` — statistiques de durée
- `computeVolumeStats` — volume par période + comparaison
- `computeCalendarData` — Map date→count
- `computeMuscleRepartition` — top muscles par volume
- `computePRsByExercise` — meilleur PR par exercice
- `computeTopExercisesByFrequency` — fréquence d'utilisation
- `formatDuration` / `formatVolume` — formatage fr-FR

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 789 passed, 0 failed, 46 suites
- Nouveau test créé : non (logique pure, couverture future via /test-coverage)

## Documentation mise à jour
- docs/bmad/07-qa-report.md ✅
- docs/stories/stats-dashboard/ (S01–S10) ✅
- docs/bmad/CHANGELOG-20260221.md ✅

## Statut
✅ Résolu — 20260221-2000

## Commit
9b3e293 feat(stats): tableau de bord statistiques globales
