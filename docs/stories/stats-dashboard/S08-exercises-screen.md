# S08 — StatsExercisesScreen (PRs + fréquence)

## Description
Créer l'écran des records personnels centralisés et des exercices les plus pratiqués.

## Fichiers à créer
- `mobile/src/screens/StatsExercisesScreen.tsx`

## UI (cf UX Design Écran 6)
- Section "Records personnels" : liste des PRs par exercice (poids max + reps + 1RM Epley + date relative)
- Section "Exercices les plus pratiqués" : top 5 avec fréquence (nb de fois)
- Note : ce n'est PAS ChartsScreen — c'est un nouvel écran orienté records/fréquence

## Données
`withObservables` sur `sets` + `exercises` →
- `computePRsByExercise(sets, exercises)`
- `computeTopExercisesByFrequency(sets, exercises, 5)`

## Critères d'acceptation
- [ ] Un PR par exercice (meilleur set is_pr=true)
- [ ] 1RM Epley calculé et affiché
- [ ] Date relative correcte
- [ ] Top 5 fréquence
- [ ] `npx tsc --noEmit` passe

## Estimation : S (1-2h)
## Dépendances : S02, S03
