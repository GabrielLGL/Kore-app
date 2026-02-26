# feat(gamification-pro) — Badges collectionnables (50 badges, 7 catégories)
Date : 2026-02-26 16:00

## Instruction
`/idee gamification-pro` — Pipeline BMAD complet : brainstorming → PRD → architecture → UX → stories → implémentation autonome

## Rapport source
Pipeline /idee — description libre "gamification-pro"

## Classification
Type : feat
Scope : gamification-pro

## Stories implémentées

| Story | Titre | Statut |
|-------|-------|--------|
| S01 | Schéma & modèle UserBadge | ✅ |
| S02 | Catalogue 50 badges (badgeConstants) | ✅ |
| S03 | Logique checkBadges + tests | ✅ |
| S04 | Intégration WorkoutScreen — calcul badges fin de séance | ✅ |
| S05 | Intégration WorkoutScreen — écriture DB + total_prs | ✅ |
| S06 | Composant BadgeCard (locked/unlocked) | ✅ |
| S07 | Écran BadgesScreen (grille 3 colonnes par catégorie) | ✅ |
| S08 | Composant BadgeCelebration (BottomSheet) | ✅ |
| S09 | HomeScreen — entrée "Mes Badges" + compteur | ✅ |

## Fichiers modifiés

### Nouveaux fichiers
- `mobile/src/model/models/UserBadge.ts` — modèle WatermelonDB (badge_id, unlocked_at)
- `mobile/src/model/utils/badgeConstants.ts` — 50 badges, 7 catégories, getBadgeById, BADGE_CATEGORY_LABELS
- `mobile/src/model/utils/badgeHelpers.ts` — checkBadges() function
- `mobile/src/model/utils/__tests__/badgeHelpers.test.ts` — 19 tests (toutes catégories)
- `mobile/src/components/BadgeCard.tsx` — carte badge (locked opacity 0.35)
- `mobile/src/components/BadgeCelebration.tsx` — BottomSheet de célébration
- `mobile/src/screens/BadgesScreen.tsx` — écran grille 3 colonnes avec withObservables

### Fichiers modifiés
- `mobile/src/model/schema.ts` — v21 → v22 : +user_badges table, +total_prs sur users
- `mobile/src/model/models/User.ts` — +totalPrs field (S01)
- `mobile/src/model/index.ts` — +UserBadge dans modelClasses
- `mobile/src/screens/WorkoutScreen.tsx` — checkBadges() + badge inserts dans database.write() + BadgeCelebration
- `mobile/src/screens/HomeScreen.tsx` — +userBadges prop, "Mes Badges" TouchableOpacity avec compteur
- `mobile/src/screens/__tests__/HomeScreen.test.tsx` — +userBadges={[]} sur les 9 renders
- `mobile/src/navigation/index.tsx` — +Badges route dans RootStackParamList + Stack.Screen

## Ce qui a été fait

### Architecture
- Schéma v22 avec table `user_badges` (badge_id, unlocked_at, created_at, updated_at)
- Colonne `total_prs` sur `users` pour tracker le nombre total de PRs

### Catalogue
- 50 badges répartis en 7 catégories : sessions, tonnage, streak, level, pr, session_volume, exercises
- Chaque badge : id, title, emoji, description, category, threshold

### Logique
- `checkBadges()` : reçoit user stats + existingBadgeIds, retourne les nouveaux badges débloqués
- Déduplication via Set (pas de re-débloquage)
- Évaluation par switch sur category, comparaison threshold

### Intégration fin de séance
- Dans `handleConfirmEnd` (WorkoutScreen) :
  - Requête distinct exercise_ids via `_raw.exercise_id`
  - Requête existing badge IDs depuis user_badges
  - `checkBadges()` pour déterminer les nouveaux badges
  - `database.write()` : update user (totalPrs, totalTonnage, currentStreak, bestStreak, totalXp, level) + inserts UserBadge
- Flux de célébration : summary → milestone → badge → home

### UI
- BadgeCard : emoji 28px + title + date unlock, locked = opacity 0.35
- BadgeCelebration : BottomSheet avec emoji 48px, titre, description, bouton "Super !"
- BadgesScreen : 7 sections par catégorie, grille 3 colonnes, compteur X/50 en header
- HomeScreen : section "🏅 Mes Badges" avec compteur Y/50

## Vérification
- TypeScript : ✅ 0 nouvelles erreurs (pre-existing: WorkoutSummarySheet.test, statsHelpers)
- Tests badgeHelpers : ✅ 19/19 passed
- Tests HomeScreen : ✅ 9/9 passed
- Nouveau test créé : oui (badgeHelpers.test.ts — 19 tests)

## Documentation mise à jour
- `docs/bmad/01-brainstorm-gamification-pro.md`
- `docs/bmad/02-product-brief-gamification-pro.md`
- `docs/bmad/03-prd-gamification-pro.md`
- `docs/bmad/04-architecture-gamification-pro.md`
- `docs/bmad/05-ux-design-gamification-pro.md`
- `docs/stories/gamification-pro/` (S01→S09 + SPRINT-overview)

## Statut
✅ Résolu — 20260226-1600

## Commit
[sera rempli après commit]
