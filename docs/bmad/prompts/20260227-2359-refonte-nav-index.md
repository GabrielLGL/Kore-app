# Refonte navigation + bibliothèque + historique — Index

**Date :** 2026-02-28
**Status :** ✅ Complété — 0 erreur TS, 1301 tests (75 suites) — 0 fail

## Groupes implémentés

| Groupe | Fichiers | Status |
|--------|----------|--------|
| A | HomeScreen.tsx + HomeScreen.test.tsx | ✅ |
| B | ExercisesScreen.tsx + ExerciseHistoryScreen.tsx (nouveau) + navigation/index.tsx + ExercisesScreen.test.tsx | ✅ |
| C | StatsDurationScreen.tsx + StatsDurationScreen.test.tsx | ✅ |
| D | StatsCalendarScreen.tsx | ✅ |

## Résumé des changements

- **A** : Tuile "Exercices" → "Bibliothèque" ; supprimé "Exercices & Records" et "Historique"
- **B** : Rows exercices cliquables → ExerciseHistoryScreen ; delete masqué pour exercices par défaut
- **C** : Suppression delete de l'historique durée ; accordion exercices + nom séance
- **D** : Bouton suppression séance (soft-delete) dans le panneau calendrier
