# Product Brief — Gamification Pro (Badges) — 2026-02-26

## Problème
Les métriques XP/niveau/streak de gamification-base restent abstraites. L'utilisateur n'a pas de collection tangible représentant son parcours. La motivation s'érode après les premières semaines sans récompenses visuelles permanentes.

## Solution
Système de badges collectionnables : ~18 badges en 4 catégories, débloqués de façon permanente, accessibles depuis un écran "Mes Badges", célébrés par un BottomSheet animé.

## Utilisateurs cibles
- **Primaire** : intermédiaire (6-24 mois) — maintien de la discipline long terme
- **Secondaire** : avancé — motivation par complétion de collection

## Périmètre MVP

### In scope
- 18 badges, 4 catégories (régularité, volume, séances, niveau XP)
- Table `user_badges` (migration schema)
- Helper `checkBadges()` — vérification en fin de séance
- Écran "Mes Badges" (grille colorée/grisée)
- BottomSheet célébration au déblocage
- Entrée depuis HomeScreen

### Out of scope
- Badges exercice-spécifique
- Partage badge réseaux sociaux
- Notifications push badge
- Badges diversité musculaire

## Métriques de succès
- Au moins 1 badge débloqué dans les 3 premières séances
- Écran "Mes Badges" consulté 1x/semaine
- 0 régression tests existants

## Dépendances
- gamification-base (champs level, total_tonnage, current_streak, best_streak sur User)
- Helpers calculateLevel(), formatTonnage()
