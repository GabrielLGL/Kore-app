# Product Brief — Dashboard Statistiques Globales — 2026-02-21

## Problème
L'écran Historique actuel affiche une liste brute de séances passées, sans synthèse ni insight. L'utilisateur ne peut pas mesurer sa progression globale, sa régularité ou ses records en un coup d'œil. Il n'existe aucun endroit dans l'app pour voir "où j'en suis" de manière motivante.

## Solution
Remplacer l'écran Historique par un **Dashboard Statistiques** personnalisé :
- En-tête avec nom de l'utilisateur + KPIs clés + phrase d'accroche dynamique contextuelle
- Grille de 7 boutons menant aux vues détaillées :
  ⏱ Durée · 🏋 Volume · 🗓 Calendrier · 💪 Répartition · 📊 Exercices · 📏 Mesures · 📋 Historique
- Le bouton Historique donne accès à la liste existante des séances (même style que les autres)

## Utilisateurs cibles
- **Primaire** : Intermédiaire (6-24 mois de pratique) — veut voir sa progression et rester motivé
- **Secondaire** : Avancé — veut les analytics granulaires (répartition, volumes, 1RM)

## Périmètre de la feature

### Dans le scope (MVP)
- Dashboard principal : nom, KPIs synthétiques, phrase d'accroche dynamique
- Ajout champ `name` sur table `users` (migration schéma v17)
- Nouvelle table `body_measurements` (poids, taille, hanches, bras, poitrine)
- Vue Durée : durée moyenne/totale des séances, min/max, tendance
- Vue Volume : volume total (kg), tendance semaine/mois, top exercices par volume
- Vue Calendrier : grille GitHub-style, 1 carré = 1 jour, intensité = nb séances
- Vue Répartition : tonnage par groupe musculaire (parsing muscles string)
- Vue Exercices : top exercices fréquence + PRs centralisés (depuis is_pr sur sets)
- Vue Mesures corporelles : saisie manuelle + graphique évolution dans le temps

### Hors scope (v2)
- Export CSV/PDF
- Photos de progression
- Comparaison avec d'autres utilisateurs
- Objectifs personnalisés avec suivi
- Rappels automatiques pour les mesures

## Métriques de succès
- L'utilisateur comprend sa progression en < 5 secondes sur le dashboard
- Toutes les stats disponibles offline (0 dépendance réseau)
- Phrase d'accroche toujours pertinente et contextualisée
- Temps de calcul des stats < 500ms (requêtes WatermelonDB optimisées)

## Contraintes techniques
- Migration schéma v16 → v17 (migration WatermelonDB avec addColumns)
- Offline-first : toutes stats calculées localement depuis SQLite
- Dark Mode uniquement (#121212 bg, #1C1C1E cards)
- Composants existants à réutiliser : Button, BottomSheet, ChipSelector
- Charts : exploiter la fondation WEGO-007 (sets table)
- Pas de native Modal (Fabric) → Portal pattern

## Architecture de navigation
- Tab "Historique" (existant) → renommé "Stats" → charge StatsScreen (nouveau)
- StatsScreen → 7 sous-écrans (push sur le Native Stack) :
  - StatsDurationScreen
  - StatsVolumeScreen
  - StatsCalendarScreen
  - StatsRepartitionScreen
  - StatsExercisesScreen
  - StatsMeasurementsScreen
  - HistoryScreen (existant, réutilisé)
