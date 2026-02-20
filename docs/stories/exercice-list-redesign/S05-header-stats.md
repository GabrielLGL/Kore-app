# S05 — Vérification/ajustement header stats
> Feature: exercice-list-redesign | Priorité: Must | Dépendance: S02

## Description
Vérifier et ajuster le WorkoutHeader pour afficher correctement : Timer | Nb séries validées | Volume total (kg). WorkoutHeader a déjà les props, useWorkoutState calcule déjà le volume — vérifier que WorkoutScreen passe bien les bonnes valeurs.

## Fichiers vérifiés
- `mobile/src/screens/WorkoutScreen.tsx`
- `mobile/src/components/WorkoutHeader.tsx`

## Tâches techniques
1. Vérifier que WorkoutScreen passe `totalVolume` depuis useWorkoutState
2. Vérifier que `completedSets` = nb de séries validées (Object.keys(validatedSets).length)
3. Vérifier que le bouton "Terminer" N'EST PAS dans le header (déjà dans le footer)
4. Ajuster si nécessaire

## Critères d'acceptation
- [ ] Header affiche : Timer | X séries | Y kg
- [ ] Mis à jour en temps réel à chaque validation/invalidation
- [ ] Bouton Terminer absent du header (uniquement dans footer)
- [ ] Volume = Σ(weight × reps) des séries validées
