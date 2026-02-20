# S03 — Retrait weightTarget UI dans SessionExerciseItem
> Feature: exercice-list-redesign | Priorité: Must | Dépendance: —

## Description
Supprimer l'affichage du champ `weightTarget` dans `SessionExerciseItem`. Garder uniquement séries × reps. La donnée `weight_target` reste en DB, juste masquée.

## Fichier modifié
`mobile/src/components/SessionExerciseItem.tsx`

## Tâches techniques
1. Retirer le bloc d'affichage `@ [weightTarget] kg` du JSX
2. Retirer le badge PR lié au poids (si calculé depuis weightTarget)
3. Vérifier que le tap "éditer objectifs" ne montre plus le champ poids

## Critères d'acceptation
- [ ] Plus aucun affichage de weightTarget dans la card
- [ ] Séries et reps toujours affichés et tappables
- [ ] DB intacte (weight_target non supprimé)
- [ ] Pas de TypeScript error
