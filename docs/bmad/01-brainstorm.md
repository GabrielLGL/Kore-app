# Brainstorm — Statistiques Globales Utilisateur — 2026-02-21

## Idée reformulée
En tant qu'utilisateur, je veux remplacer l'écran Historique par un Dashboard Stats personnalisé qui affiche mes KPIs, ma régularité et mes records, avec des accès rapides vers des vues détaillées (durée, volume, répartition, calendrier, exercices, mesures corporelles).

## Persona cible
**Intermédiaire** (prioritaire) — pratique régulière depuis 6-24 mois, veut voir sa progression de manière concrète et rester motivé. Secondairement : **Avancé** pour les analytics granulaires.

## Idées explorées
1. Dashboard global KPIs (total séances, volume total, séries)
2. Streak de régularité (jours consécutifs)
3. Calendrier d'activité façon GitHub contributions (grille de carrés colorés par intensité)
4. Progression par exercice (poids max, volume) → graphiques
5. Records personnels centralisés (flag `is_pr` existant, non encore affiché globalement)
6. Volume par groupe musculaire (répartition, équilibre)
7. Durée moyenne des séances (min/max/moyenne)
8. Top exercices les plus pratiqués (fréquence)
9. Comparaison semaine actuelle vs précédente
10. 1RM estimé par exercice (formule Epley : poids × (1 + reps/30))
11. Heatmap de la fréquence d'entraînement
12. Bilan hebdomadaire automatique
13. Score de cohérence (indice de régularité)
14. Tendances temporelles (semaine / mois / trimestre)
15. Évolution du volume par séance dans le temps
16. Mesures corporelles (poids, tour de taille, hanches, bras, poitrine) avec graphique évolution

## Top 5 Insights
1. **Dashboard synthétique** — Point d'entrée unique avec KPIs clés (séances totales, volume cumulé, PRs) + phrase d'accroche dynamique contextuelle | Risque : surcharge d'information, hiérarchiser clairement
2. **Régularité & Streaks** — Calendrier GitHub-style + streak actif : mécanisme de rétention le plus puissant, visualise la constance | Risque : pression négative si streak brisé
3. **Records personnels centralisés** — Flag `is_pr` déjà sur `sets` mais jamais affiché globalement — quick win motivant, 0 migration | Risque : faible
4. **Volume par muscle** — Répartition tonnage par groupe musculaire depuis `sets` × `exercises.muscles` — détecte déséquilibres | Risque : muscles en string → parsing
5. **Mesures corporelles** — Nouvelle table `body_measurements` + champ `name` sur `users` — suivi physique complet | Risque : migration schéma v17

## Questions ouvertes
- Mode de saisie des mesures : manuelle à chaque fois ou rappel périodique ?
- Période par défaut du dashboard : 30 jours ou tout l'historique ?
- Bouton "Voir l'historique" : écran séparé ou modale ?

## Contraintes techniques identifiées
- Schéma v17 requis : ajout `name` sur `users` + nouvelle table `body_measurements`
- Muscles stockés en string JSON → parsing nécessaire pour répartition
- `is_pr` existant sur `sets` → exploitable directement
- Composants existants : `ChipSelector`, `BottomSheet`, `Button`, `AlertDialog`
- Charts : déjà fondation sur `sets` (WEGO-007)
- Offline-first : toutes les stats calculées depuis WatermelonDB local

## Décisions utilisateur
- Mesures corporelles : poids + tour de taille + hanches + bras + poitrine
- Nom utilisateur : nouveau champ `name` dans table `users`
- Phrase d'accroche : dynamique selon contexte (streak, PR, volume, retour après gap, début de mois)
- Historique : accessible via bouton depuis le Dashboard

## Exemples de phrases d'accroche
- Streak actif → "🔥 7 jours consécutifs — ne lâche rien !"
- Nouveau PR → "💥 Nouveau record cette semaine — tu progresses !"
- Volume fun → "🚀 Ce mois : 12 400 kg soulevés. L'équivalent de 2 voitures."
- Régularité → "⚡ 4 séances/semaine en moyenne — niveau sérieux."
- Retour après gap → "😤 De retour après 5 jours — l'important c'est de revenir."
- Début de mois → "🎯 Nouveau mois, nouvelles perfs. C'est parti !"

## Prêt pour Phase 2 ?
OUI
