<!-- v1.0 — 2026-02-26 -->
# Rapport — brainstorm-implement — Groupe A — 20260226-0930
## exercice-list-redesign : finir S03 + S04 + S05

## Objectif
Terminer les 3 stories restantes de la feature `exercice-list-redesign`.
S01 (getLastSetsForExercises) et S02 (prefill poids) ont déjà été implémentées
dans la feature `smart-templates-notes` du 25/02.

## Fichiers concernés
- `mobile/src/components/SessionExerciseItem.tsx`      (S03)
- `mobile/src/components/WorkoutExerciseCard.tsx`       (S04)
- `mobile/src/screens/WorkoutScreen.tsx`                (S05)
- `mobile/src/components/WorkoutHeader.tsx`             (S05)
- `mobile/src/components/__tests__/SessionExerciseItem.test.tsx` (S03 tests)
- `mobile/src/components/__tests__/WorkoutExerciseCard.test.tsx` (S04 tests)

## Contexte technique
- Stack : React Native (Expo 52) + TypeScript + WatermelonDB. Dark mode only.
- Schema actuel : v21 (ne pas modifier le schema)
- `weight_target` reste en DB mais ne doit plus être affiché
- Patterns :
  - NO `<Modal>` natif → `<AlertDialog>` / `<BottomSheet>` avec Portal
  - Haptics via `useHaptics()` hook
  - Colors via `colors.*` from `theme/index.ts`, spacing via `spacing.*`
  - Mutations WatermelonDB → toujours dans `database.write()`
- Tests : Jest + React Native Testing Library, mocks dans `__tests__/`

## Étapes

### S03 — Retrait weightTarget UI dans SessionExerciseItem
Story : `docs/stories/exercice-list-redesign/S03-remove-weight-target.md`

1. Lire `mobile/src/components/SessionExerciseItem.tsx`
2. Supprimer le bloc d'affichage `@ [weightTarget] kg`
3. Supprimer le badge PR lié au poids (si calculé depuis weightTarget)
4. Vérifier que `weight_target` ne cassera pas les modals d'édition
5. Mettre à jour les tests (SessionExerciseItem.test.tsx) si nécessaire

### S04 — Redesign WorkoutExerciseCard
Story : `docs/stories/exercice-list-redesign/S04-workout-card-redesign.md`

1. Lire `mobile/src/components/WorkoutExerciseCard.tsx`
2. Modifier `WorkoutSetRow` : remplacer le bouton ↩ par un toggle ✓ (cercle gris → vert)
3. Modifier `WorkoutExerciseCardContent` : objectif = "Objectif : 4×8 reps" (sans poids)
4. Remplacer `LastPerformanceBadge` par une ligne texte "Dernière : Moy. X kg × Y reps sur Z séries"
5. Ajouter animation `Animated.spring` + `useHaptics().onSuccess()` sur validation toggle
6. Placeholder reps : "6-8" en `placeholderTextColor` gris
7. Mettre à jour WorkoutExerciseCard.test.tsx

### S05 — Vérification WorkoutHeader stats
Story : `docs/stories/exercice-list-redesign/S05-header-stats.md`

1. Lire `mobile/src/screens/WorkoutScreen.tsx` + `mobile/src/components/WorkoutHeader.tsx`
2. Vérifier que `totalVolume` est passé depuis `useWorkoutState` vers WorkoutHeader
3. Vérifier que `completedSets` = nb séries validées (Object.keys(validatedSets).length)
4. Vérifier absence du bouton "Terminer" dans le header (uniquement dans footer)
5. Ajuster si nécessaire, sans casser les tests existants

## Contraintes
- Ne pas casser : WorkoutScreen.test.tsx, SessionDetailScreen.test.tsx
- Ne pas modifier : schema.ts, databaseHelpers.ts (weight_target reste en DB)
- Respecter : no hardcoded colors/spacing, useHaptics pour feedback tactile
- Séquentiel : S03 → S04 → S05

## Critères de validation
- `npx tsc --noEmit` → 0 erreur (run depuis `mobile/`)
- `npm test` → 1186+ pass, 0 fail (run depuis `mobile/`)
- Plus aucun `weightTarget` affiché dans les cards (UI uniquement)
- Toggle ✓ dans WorkoutExerciseCard fonctionne avec animation
- WorkoutHeader affiche : Timer | X séries | Y kg

## Dépendances
Aucune dépendance sur le Groupe B.

## Statut
✅ Résolu — 20260226-1045

## Résolution
Rapport do : docs/bmad/do/20260226-1045-feat-workout-exercise-card.md
