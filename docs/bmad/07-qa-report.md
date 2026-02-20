# QA Report — Redesign Liste Exercices Séance
> Date : 2026-02-20

## Stories vérifiées

### S01 — Helper getLastSetsForExercises ✅
- Retourne {} si exerciseIds vide ✅
- Filtre deleted_at null sur histories ✅
- Groupe par exerciseId → set_order → weight ✅
- Pas de `any` TypeScript ✅

### S02 — Pré-remplissage poids useWorkoutState ✅
- useEffect au montage avec cancelled flag (cleanup) ✅
- Poids pré-remplis depuis historique si disponibles ✅
- Reps toujours '' (champ vide) ✅
- Graceful fallback si erreur DB ✅

### S03 — Retrait weightTarget SessionExerciseItem ✅
- Plus d'affichage weightTarget dans la card ✅
- Séries et reps toujours affichés ✅
- history observable supprimé (plus nécessaire) ✅
- prBadge supprimé ✅

### S04 — Redesign WorkoutExerciseCard ✅
- Bouton ✓ : gris si non validé, vert si validé ✅
- Re-clic vert → onUnvalidate ✅
- Objectif : "4×8 reps" (sans poids) ✅
- Dernière perf : "Moy. X kg × Y sur Z séries" (ou masqué) ✅
- Reps placeholder "6-8" ✅
- Pas de flèche ↩ ✅

### S05 — Header stats ✅
- Déjà implémenté correctement (totalVolume + completedSets) ✅
- Bouton Terminer dans footer uniquement ✅
- Aucun changement requis ✅

## TypeScript
- `npx tsc --noEmit` : 0 erreur ✅

## Fichiers modifiés
- `mobile/src/types/workout.ts` — ajout avgWeight
- `mobile/src/model/utils/databaseHelpers.ts` — avgWeight + getLastSetsForExercises
- `mobile/src/components/SessionExerciseItem.tsx` — retrait weightTarget
- `mobile/src/components/WorkoutExerciseCard.tsx` — redesign complet
- `mobile/src/hooks/useWorkoutState.ts` — pré-remplissage poids
- `mobile/src/components/__tests__/LastPerformanceBadge.test.tsx` — mock avgWeight
