# S04 — Redesign WorkoutExerciseCard : toggle + objectif + dernière perf
> Feature: exercice-list-redesign | Priorité: Must | Dépendance: —

## Description
Modifier `WorkoutExerciseCard` pour :
- Afficher l'objectif en texte simple "Objectif : 4×8 reps" (sans poids)
- Remplacer LastPerformanceBadge par texte "Dernière : Moy. X kg × Y reps sur Z séries"
- Remplacer le bouton ↩ par un toggle ✓ simple (cercle gris/vert)

## Fichier modifié
`mobile/src/components/WorkoutExerciseCard.tsx`

## Tâches techniques
1. Modifier `WorkoutSetRow` : bouton toggle unique (✓ gris → ✓ vert au clic)
2. Supprimer le bouton ↩ séparé
3. Modifier `WorkoutExerciseCardContent` : objectif sans poids
4. Remplacer LastPerformanceBadge par ligne texte résumé
5. Ajouter animation spring sur validation (Animated.spring + useHaptics.onSuccess)
6. Placeholder reps : "6-8" en gris (placeholderTextColor)

## Critères d'acceptation
- [ ] Bouton ✓ : gris si non validé, vert si validé
- [ ] Re-clic sur ✓ vert → annule la validation (onUnvalidate)
- [ ] Objectif affiché : "Objectif : 4×8 reps" (sans poids)
- [ ] Dernière perf : "Dernière : Moy. X kg × Y reps sur Z séries" ou masqué si vide
- [ ] Placeholder reps "6-8" en gris
- [ ] Animation spring + haptic onSuccess à la validation
- [ ] Pas de flèche ↩
