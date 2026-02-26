# feat(WorkoutSummarySheet) — Récap post-séance enrichi
Date : 2026-02-26

## Stories implémentées

### S01 — Types RecapExerciseData + RecapComparisonData
### S02 — Helpers getLastSessionVolume + buildRecapExercises
### S03 — WorkoutScreen : états + calcul + props
### S04 — WorkoutSummarySheet : message + chips + exercices + progression

## Fichiers modifiés
- `mobile/src/types/workout.ts` — +RecapExerciseData, +RecapComparisonData
- `mobile/src/model/utils/databaseHelpers.ts` — +getLastSessionVolume, +buildRecapExercises
- `mobile/src/screens/WorkoutScreen.tsx` — +imports, +2 useState, +calcul recap dans handleConfirmEnd, +2 props au sheet
- `mobile/src/components/WorkoutSummarySheet.tsx` — message dynamique, chips muscles, section exercices, section progression, ScrollView
- `mobile/src/components/__tests__/WorkoutSummarySheet.test.tsx` — +recapExercises/recapComparison dans defaultProps, tests message motivant mis à jour

## Ce qui a été fait

### S01 — Types (types/workout.ts)
- `RecapExerciseData` : nom exercice, sets validés/cibles, tableau sets {reps,weight}, prevMaxWeight, currMaxWeight, muscles[]
- `RecapComparisonData` : prevVolume (null si première séance), currVolume, volumeGain

### S02 — Helpers (databaseHelpers.ts)
- `getLastSessionVolume(sessionId, excludeHistoryId)` : query histories par session_id, filtre séances terminées (endTime != null), prend la plus récente, somme reps×poids de tous ses sets → number | null
- `buildRecapExercises(sessionExercises, validatedSets, historyId)` : loop sur sessionExercises, collecte sets validés depuis état mémoire (clé `${seId}_${order}`), se.exercise.fetch() pour nom+muscles, getMaxWeightForExercise pour prevMaxWeight, skip exercices sans set validé

### S03 — WorkoutScreen (WorkoutScreen.tsx)
- Import buildRecapExercises + getLastSessionVolume + types
- 2 nouveaux useState : recapExercises, recapComparison
- Dans handleConfirmEnd() après gamification : appel buildRecapExercises + getLastSessionVolume, setState, try/catch avec log DEV
- 2 props ajoutés à <WorkoutSummarySheet> : recapExercises, recapComparison

### S04 — WorkoutSummarySheet (WorkoutSummarySheet.tsx)
- Message motivant dynamique (remplace celebrationText) : PR → "🏅 Record battu!" / volumeGain>0 → "🔺 En progression!" / else → "💪 Bonne séance!"
- Chips muscles travaillés : dédupliqués, non-interactifs, masqués si aucun muscle
- Section "Ce que tu as fait" : liste exercices avec indicateur complétion (X/Y ou ✅) + sets "10×80 kg · 8×82.5 kg"
- Section "Progression" : delta volume (+X kg 🔺 / -X kg 🔻 / Même volume / Première séance 🎉) + delta poids max par exercice si différent
- ScrollView wrapping tout le contenu (sheet scrollable sur longues séances)

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 1187/1187 passés (20 tests WorkoutSummarySheet dont 4 nouveaux)
- Critères d'acceptation : ✅ tous couverts
- Flow de navigation : ✅ inchangé
- Schéma DB : ✅ aucune migration (v17 inchangé)
