# Brainstorm — Gamification Pro (Badges) — 2026-02-26

## Idée reformulée
En tant que pratiquant régulier, je veux débloquer des badges collectionnables permanents qui récompensent ma régularité, mon volume et mes progrès, pour avoir une trace visuelle de mes accomplissements sur le long terme.

## Persona cible
Intermédiaire (prioritaire) — pratique depuis 6-24 mois, a déjà une routine, cherche à maintenir la motivation sur le long terme. Aussi motivant pour l'avancé qui veut "compléter la collection".

## Idées explorées
1. Défis hebdomadaires dynamiques
2. Tableau de records personnels (écran PRs)
3. Score Forme hebdomadaire (KPI composite)
4. Badges collectionnables permanents
5. Prédictions motivantes ("niveau X dans N séances")
6. Streaks multi-types (par exercice)
7. Comeback Bonus (XP doublé après absence)
8. Historique niveau timeline
9. Défis mensuels
10. Classement personnel périodique (mois vs mois)
11. Streaks multi-groupes musculaires
12. Notifications intelligentes (streak en danger)

## Top 5 Insights
1. **Défis hebdomadaires dynamiques** — Renouveler la motivation chaque semaine avec 3 défis adaptés | Risque : complexité offline, défis irréalistes
2. **Badges collectionnables** — Trophées visuels permanents, motivants sur le long terme ✅ RETENU | Risque : inflation si trop de badges
3. **Score Forme hebdomadaire** — KPI synthétique gamifiant la régularité | Risque : formule opaque
4. **PRs mis en scène** — Records en moments de célébration avec historique visuel | Risque : doublon avec validation sets existante
5. **Prédictions motivantes** — "Dans X séances, tu passes au niveau suivant" | Risque : prédictions fausses si rythme change

## Décision : Badges collectionnables

### Catégories MVP
| Catégorie | Exemples | Source données |
|-----------|----------|----------------|
| Régularité | "Fer forgé" (10 sem), "Invaincu" (best 20 sem) | current_streak, best_streak |
| Volume | "Camionneur" (50t), "Titan" (500t) | total_tonnage |
| Séances | "Centurion" (100 séances), "Légendaire" (500) | count histories |
| Niveau XP | "Guerrier" (niv 10), "Maître" (niv 25) | level |

### Mécanique
- Badge débloqué une fois → table `user_badges`
- Écran "Mes Badges" : grille colorée/grisée
- BottomSheet célébration au déblocage
- Vérification en fin de séance

### Scope MVP : ~15-20 badges, 4 catégories
### Scope futur : badges exercice-spécifique, diversité musculaire, partage

## Questions ouvertes
- Icônes : emoji ou icônes vectorielles custom ?
- Ordre d'affichage dans la grille : catégorie ou difficulté ?

## Contraintes techniques identifiées
- Nouvelle table `user_badges` → migration schema (version suivante)
- Vérification en fin de séance (s'intègre avec S05 gamification-base)
- Pas de Modal natif → BottomSheet Portal
- Offline-first : toute la logique en local

## Prêt pour Phase 2 ?
OUI
