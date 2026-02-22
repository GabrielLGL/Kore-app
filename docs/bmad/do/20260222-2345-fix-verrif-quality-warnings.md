# fix(quality) — Corrections qualite verrif 20260222-2241
Date : 2026-02-22 23:45

## Instruction
docs/bmad/verrif/20260222-2241/RAPPORT.md

## Rapport source
docs/bmad/verrif/20260222-2241/RAPPORT.md — 4 problemes restants (issues 2, 3, 4)

## Classification
Type : fix
Fichiers modifies :
- mobile/src/components/AlertDialog.tsx
- mobile/src/screens/ProgramsScreen.tsx
- mobile/src/screens/AssistantScreen.tsx
- mobile/src/screens/WorkoutScreen.tsx
- mobile/src/components/WorkoutExerciseCard.tsx
- mobile/src/screens/SessionDetailScreen.tsx
- mobile/src/screens/__tests__/SessionDetailScreen.test.tsx

## Ce qui a ete fait

### Issue 2 : Alert.alert -> AlertDialog (4 usages)
- Ajoute prop `hideCancel` a AlertDialog pour supporter les alertes erreur avec un seul bouton "OK"
- ProgramsScreen : remplace Alert.alert du drag-and-drop par AlertDialog avec hideCancel
- AssistantScreen : remplace 2 Alert.alert (generation + enregistrement) par AlertDialog avec hideCancel
- WorkoutScreen : remplace Alert.alert du createWorkoutHistory par AlertDialog avec hideCancel + callback goBack
- Supprime l'import `Alert` de react-native dans les 3 fichiers

### Issue 3 : WorkoutExerciseCard from() one-shot observable
- Remplace `from(getLastPerformanceForExercise(...))` (one-shot) par `exercise.observe().pipe(switchMap(...))` (reactif)
- Le lastPerformance se met desormais a jour si la relation exercise change

### Issue 4 : SessionDetailScreen fetch imperatif -> withObservables
- Supprime le `useState<Exercise[]>` + `useEffect` imperatif pour charger les exercices
- Ajoute `exercises` dans le withObservables enhancer (observe reactif)
- Passe `exercises` comme prop au composant (toujours a jour, pas de re-fetch)
- Mise a jour des tests pour inclure la nouvelle prop `exercises`

### Issue 1 : API key en clair (non traite)
- Scope trop large (60min, ajout dependance expo-secure-store)
- La fonctionnalite IA cloud est marquee "Prochainement" dans SettingsScreen
- A traiter separement quand la feature IA cloud sera activee

## Verification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 840 passed, 47 suites, 0 failed
- Nouveau test cree : non (tests existants mis a jour)

## Documentation mise a jour
aucune

## Statut
✅ Resolu — 20260222-2345

## Commit
3ad4400 fix(quality): replace Alert.alert with AlertDialog, fix reactive patterns
