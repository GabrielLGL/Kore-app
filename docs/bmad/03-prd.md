# PRD — Dashboard Statistiques Globales — 2026-02-21

## Vue d'ensemble
Remplacement de l'écran Historique par un Dashboard Stats personnalisé avec 7 accès vers des vues de statistiques détaillées. Migration schéma v16 → v17 (champ `name` sur `users` + table `body_measurements`).

---

## User Stories & Critères d'acceptation

### US-01 — Dashboard principal [MUST]
**En tant qu'utilisateur**, je veux voir un dashboard qui affiche mon nom, mes KPIs globaux et une phrase d'accroche motivante, **afin de** comprendre ma progression en un coup d'œil.

**Critères d'acceptation :**
- [ ] L'onglet "Historique" est renommé "Stats" dans la bottom tab
- [ ] L'écran affiche le prénom de l'utilisateur (champ `name` de la table `users`)
- [ ] Les KPIs affichés : nombre total de séances, volume cumulé (kg), nombre de PRs
- [ ] Une phrase d'accroche dynamique est affichée selon le contexte (cf US-02)
- [ ] La grille affiche 7 boutons : Durée, Volume, Calendrier, Répartition, Exercices, Mesures, Historique
- [ ] Tous les boutons sont visuellement identiques (même style, même taille)
- [ ] L'écran est entièrement offline (0 requête réseau)

### US-02 — Phrase d'accroche dynamique [MUST]
**En tant qu'utilisateur**, je veux une phrase d'accroche contextuelle et motivante, **afin de** ressentir que l'app comprend où j'en suis.

**Critères d'acceptation :**
- [ ] Cas streak ≥ 3 jours → `"🔥 X jours consécutifs — ne lâche rien !"`
- [ ] Cas PR cette semaine → `"💥 Nouveau record cette semaine — tu progresses !"`
- [ ] Cas retour après gap > 4 jours → `"😤 De retour après X jours — l'important c'est de revenir."`
- [ ] Cas premier jour du mois → `"🎯 Nouveau mois, nouvelles perfs. C'est parti !"`
- [ ] Cas régularité ≥ 4 séances/semaine moyenne → `"⚡ X séances/semaine — niveau sérieux."`
- [ ] Cas défaut → volume du mois fun format : `"🚀 Ce mois : X kg soulevés."`
- [ ] Priorité des cas : streak > PR > retour > début mois > régularité > défaut
- [ ] Calculé depuis WatermelonDB, sans requête réseau

### US-03 — Champ nom utilisateur [MUST]
**En tant qu'utilisateur**, je veux pouvoir définir mon prénom dans l'app, **afin de** voir mon nom affiché sur le dashboard.

**Critères d'acceptation :**
- [ ] Migration schéma v16 → v17 : ajout colonne `name` (string, isOptional) sur `users`
- [ ] Le champ `name` est saisissable depuis l'écran Réglages (existant)
- [ ] Si `name` vide → afficher "Toi" par défaut sur le dashboard
- [ ] La migration ne casse pas les données existantes

### US-04 — Vue Durée [MUST]
**En tant qu'utilisateur**, je veux voir les statistiques de durée de mes séances, **afin de** comprendre combien de temps je passe à m'entraîner.

**Critères d'acceptation :**
- [ ] Durée moyenne par séance (en min)
- [ ] Durée totale cumulée (en heures)
- [ ] Durée min et max par séance
- [ ] Graphique d'évolution de la durée par séance (30 dernières séances)
- [ ] Calculé depuis `histories.start_time` et `histories.end_time`
- [ ] Séances sans `end_time` exclues du calcul

### US-05 — Vue Volume [MUST]
**En tant qu'utilisateur**, je veux voir l'évolution de mon volume d'entraînement, **afin de** vérifier que je progresse en charge totale.

**Critères d'acceptation :**
- [ ] Volume total cumulé (somme weight × reps de tous les sets)
- [ ] Volume par semaine (graphique des 12 dernières semaines)
- [ ] Comparaison semaine actuelle vs semaine précédente (+ ou - %)
- [ ] Top 3 exercices par volume total
- [ ] Sélecteur de période : 1 mois / 3 mois / tout
- [ ] Calculé depuis la table `sets` (weight × reps)

### US-06 — Vue Calendrier [MUST]
**En tant qu'utilisateur**, je veux voir un calendrier d'activité style GitHub, **afin de** visualiser ma régularité d'entraînement.

**Critères d'acceptation :**
- [ ] Grille de carrés : 1 carré = 1 jour, organisés par semaine (colonnes) sur 6 mois glissants
- [ ] Couleur selon intensité : 0 séance = gris (#2C2C2E), 1 = vert clair, 2+ = vert foncé
- [ ] Au tap sur un carré → afficher la date + nb de séances ce jour
- [ ] Streak actuel affiché (jours consécutifs avec au moins 1 séance)
- [ ] Streak record affiché
- [ ] Calculé depuis la table `histories` (groupé par jour via `start_time`)

### US-07 — Vue Répartition musculaire [MUST]
**En tant qu'utilisateur**, je veux voir la répartition de mon volume par groupe musculaire, **afin de** détecter les déséquilibres dans mon entraînement.

**Critères d'acceptation :**
- [ ] Graphique en barres horizontales : top groupes musculaires par volume (weight × reps)
- [ ] Parsing du champ `exercises.muscles` (format string, ex: "Pectoraux,Triceps")
- [ ] Sélecteur de période : 1 mois / 3 mois / tout
- [ ] Maximum 8 groupes musculaires affichés (autres regroupés en "Autres")
- [ ] Pourcentage de chaque groupe affiché

### US-08 — Vue Exercices & PRs [MUST]
**En tant qu'utilisateur**, je veux voir mes records personnels centralisés et mes exercices les plus pratiqués, **afin de** voir mes accomplissements.

**Critères d'acceptation :**
- [ ] Liste des PRs : 1 entrée par exercice avec le poids max, les reps et la date
- [ ] Construit depuis `sets` où `is_pr = true`, groupé par `exercise_id`
- [ ] Top 5 exercices par fréquence (nb de fois pratiqué)
- [ ] 1RM estimé affiché pour chaque exercice avec PR (formule Epley : poids × (1 + reps/30))
- [ ] Tri par date du PR (plus récent en premier)

### US-09 — Vue Mesures corporelles [MUST]
**En tant qu'utilisateur**, je veux saisir et suivre mes mesures corporelles, **afin de** tracker mon évolution physique en parallèle de mes performances.

**Critères d'acceptation :**
- [ ] Migration v17 : nouvelle table `body_measurements` avec colonnes : `date` (number), `weight` (number, isOptional), `waist` (number, isOptional), `hips` (number, isOptional), `chest` (number, isOptional), `arms` (number, isOptional), `created_at`, `updated_at`
- [ ] Bouton "Ajouter une mesure" → BottomSheet avec formulaire (keyboardType numeric pour tous les champs)
- [ ] Validation via `validateWorkoutInput()` ou helper dédié
- [ ] Graphique d'évolution pour chaque mesure (sélecteur : poids / taille / hanches / bras / poitrine)
- [ ] Dernière mesure affichée en haut de l'écran
- [ ] Suppression d'une mesure via AlertDialog de confirmation
- [ ] Toutes mutations dans `database.write()`

---

## MoSCoW

| US | Titre | Priorité |
|----|-------|----------|
| US-01 | Dashboard principal | MUST |
| US-02 | Phrase d'accroche dynamique | MUST |
| US-03 | Champ nom utilisateur | MUST |
| US-04 | Vue Durée | MUST |
| US-05 | Vue Volume | MUST |
| US-06 | Vue Calendrier GitHub-style | MUST |
| US-07 | Vue Répartition musculaire | MUST |
| US-08 | Vue Exercices & PRs | MUST |
| US-09 | Vue Mesures corporelles | MUST |
| — | Export CSV/PDF | WON'T |
| — | Photos de progression | WON'T |
| — | Rappels automatiques mesures | WON'T |
| — | Objectifs avec suivi | WON'T (v2) |

---

## Contraintes non-fonctionnelles
- Calcul de toutes les stats < 500ms
- Offline-first : 0 requête réseau
- Dark Mode uniquement
- Langue : français (fr-FR)
- Pas de native Modal (Portal pattern obligatoire)
- Toutes mutations DB dans `database.write()`
