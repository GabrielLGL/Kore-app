# S05 — Intégration fin de séance — checkBadges + insert user_badges

## Story
**En tant que** système,
**je veux** que `checkBadges()` soit appelé en fin de séance et que les nouveaux badges soient persistés en DB,
**afin que** les badges se débloquent automatiquement sans action manuelle.

## Tâches techniques
1. Dans le handler de fin de séance, avant ou après le `database.write()` existant :
   a. Calculer `sessionVolume` = somme de `(set.reps * set.weight)` pour tous les sets de la séance
   b. Requête `sessionCount` = count de histories où `deleted_at IS NULL` (inclut la séance courante)
   c. Requête `distinctExerciseCount` = count distinct de `exercise_id` dans tous les sets de l'utilisateur
   d. Charger `existingBadgeIds` = tous les `badge_id` de la table `user_badges`
2. Appeler `checkBadges({ user, existingBadgeIds, sessionCount, sessionVolume, distinctExerciseCount })`
3. Dans le `database.write()` (même transaction que XP/tonnage/streak/total_prs) :
   - Pour chaque badge dans `newBadges` : `database.collections.get('user_badges').create(record => { record.badgeId = badge.id; record.unlockedAt = new Date() })`
4. Stocker `newBadges` dans le state local pour affichage BottomSheet (S08)
5. `npx tsc --noEmit` → 0 erreur

## Flow complet fin de séance
```
Fin de séance
  → [existant] calculer XP, tonnage, streak, prCount
  → [nouveau]  sessionVolume = sum(reps * weight) des sets courants
  → [nouveau]  sessionCount = count histories non-deleted
  → [nouveau]  distinctExerciseCount = count distinct exercise_id in sets
  → [nouveau]  existingBadgeIds = tous les badge_id de user_badges
  → [nouveau]  newBadges = checkBadges(...)
  → database.write(() => {
      // [existant] history.create, sets.create
      // [existant] user.update(xp, level, tonnage, streak)
      // [nouveau]  user.update(totalPrs += prCount)
      // [nouveau]  user_badges.create pour chaque newBadge
    })
  → setState({ newBadges })  // pour S08
```

## Critères d'acceptation
- [ ] `sessionVolume` calculé correctement depuis les sets
- [ ] `sessionCount` inclut la séance qui vient de se terminer
- [ ] `distinctExerciseCount` basé sur tous les sets historiques
- [ ] Badges insérés dans `user_badges` dans le même `database.write()`
- [ ] Pas de badge dupliqué (vérification via existingBadgeIds)
- [ ] `newBadges` disponible en state pour le BottomSheet
- [ ] Flow existant non cassé
- [ ] `npx tsc --noEmit` passe

## Dépend de
- S03, S04

## Estimation
L (~2h)
