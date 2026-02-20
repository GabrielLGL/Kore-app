# Architecture — Redesign Liste Exercices Séance
> Date : 2026-02-20

## Composants modifiés

```
mobile/src/
├── components/
│   ├── SessionExerciseItem.tsx     ← US-01 : retrait weightTarget UI
│   └── WorkoutExerciseCard.tsx     ← US-02/03/04/06/07
├── screens/
│   └── WorkoutScreen.tsx           ← US-05 : calcul volume + header
└── hooks/
    └── useWorkoutState.ts          ← US-02 : chargement pré-remplissage (interne)
model/utils/
    └── databaseHelpers.ts          ← US-02 : nouvelle helper getLastSetsForExercises
```

## US-01 — SessionExerciseItem
- Retrait de l'affichage `weightTarget` dans le rendu JSX
- Aucun changement logique, aucun changement DB
- `weight_target` reste en DB (juste masqué)

## US-02 — Pré-remplissage des poids

### Décision : le hook charge en interne
`useWorkoutState` charge les derniers sets au montage (autonome, sans prop supplémentaire de WorkoutScreen).

### Flux
```
useWorkoutState.init()
  → getLastSetsForExercises(exerciseIds[])
  → query: Sets WHERE exercise_id IN [...] 
           JOIN History ORDER BY history.created_at DESC
  → grouper par exercice + set_order → initialWeights
  → setInputs initialisés avec weight = initialWeights[exerciseId][setOrder] ?? ''
```

### Nouvelle helper (databaseHelpers.ts)
```typescript
// Retourne les derniers poids par exercice et par set_order
getLastSetsForExercises(
  exerciseIds: string[]
): Promise<Record<string, Record<number, number>>>
// { [exerciseId]: { [setOrder]: weight } }
```

### Comportement inputs
- Poids : valeur réelle pré-remplie (ex: "80") depuis dernière session
- Reps : champ vide + placeholder gris "6-8" (jamais pré-rempli)
- Pas d'historique → poids vide + placeholder gris "0"

## US-03 — Dernière perf (résumé)
- `getLastPerformanceForExercise` déjà présent dans databaseHelpers.ts
- Déjà observé via withObservables dans WorkoutExerciseCard
- Affichage : "Dernière : Moy. X kg × Y reps sur Z séries"
- Remplacement du LastPerformanceBadge actuel par ce texte
- Si pas d'historique → ligne masquée

## US-04 — Toggle validation
### Avant
- État validé : fond vert + ✓ + bouton ↩ séparé pour annuler

### Après
- Un seul bouton ✓ rond (circle)
- `isValidated = false` → cercle gris/transparent + ✓ gris
- `isValidated = true` → cercle vert + ✓ blanc
- `onPress` → toggle : validé → onUnvalidate, sinon → onValidate

## US-05 — Header : volume + séries
### Calcul (mémoire locale, pas de query DB)
```typescript
const totalSets = Object.keys(validatedSets).length
const totalVolume = Object.values(validatedSets).reduce(
  (sum, s) => sum + (s.weight * s.reps), 0
)
```
- Recalculé à chaque update de `validatedSets`
- Passé à `WorkoutHeader` comme props

## US-06 — Objectif par exercice
- `setsTarget` et `repsTarget` déjà disponibles dans `sessionExercise`
- Affichage sous le nom : "Objectif : 4×8 reps"

## US-07 — Animation toggle ✓
- `Animated.spring` sur scale au moment de la validation
- Haptic `onSuccess` via `useHaptics()`

## Aucun changement de schéma DB
- Set model : exercise_id, weight, reps, set_order, history_id — tout disponible
- Schéma reste v16
