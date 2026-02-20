# Do — Redesign Liste Exercices Séance
> Date : 2026-02-20

## Changements effectués

### SessionExerciseItem.tsx
- Suppression de l'affichage du poids cible (weightTarget)
- Suppression du badge PR (lié au poids)
- Suppression de l'observable history (plus nécessaire)
- Simplification : séries × reps uniquement

### WorkoutExerciseCard.tsx
- Objectif sans poids : "4×8 reps"
- Dernière perf en texte : "Moy. X kg × Y sur Z séries"
- Toggle ✓ : gris → vert au clic, re-clic → normal (suppression ↩)
- Placeholder reps : "6-8" fixe
- Placeholder poids : "0" (valeur réelle pré-remplie via S02)

### useWorkoutState.ts
- Pré-remplissage poids depuis dernière session (getLastSetsForExercises)
- Reps toujours vides (placeholder seulement)
- Cleanup effect avec cancelled flag

### databaseHelpers.ts
- Ajout getLastSetsForExercises()
- Ajout avgWeight dans getLastPerformanceForExercise()

### types/workout.ts
- Ajout avgWeight: number dans LastPerformance
