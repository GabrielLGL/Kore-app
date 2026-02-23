# test(screens) — Coverage vague 2 groupe B (+37 tests, 5 screens)
Date : 2026-02-23 23:45

## Instruction
docs/bmad/prompts/20260223-2200-coverage2-B.md

## Rapport source
docs/bmad/prompts/20260223-2200-coverage2-B.md

## Classification
Type : test
Fichiers modifiés :
- mobile/src/screens/__tests__/ExercisesScreen.test.tsx
- mobile/src/screens/__tests__/WorkoutScreen.test.tsx
- mobile/src/screens/__tests__/SettingsScreen.test.tsx
- mobile/src/screens/__tests__/StatsCalendarScreen.test.tsx
- mobile/src/screens/__tests__/StatsDurationScreen.test.tsx

## Ce qui a été fait
Enrichi les 5 fichiers de test des écrans du groupe B (coverage 50-68%) :

### ExercisesScreen (52% → 80%, +28pts)
- 21 tests : render, search bar, create modal, exercise list, options BottomSheet (open/close), edit modal (open/save), delete AlertDialog (confirm/cancel), create exercise, update exercise
- Mock useExerciseManager pour contrôler selectedExercise et les callbacks
- Navigation focus listener coverage

### WorkoutScreen (62% → 85.55%, +23.55pts)
- 22 tests : render, loading state, exercise cards, end session (confirm/cancel/summary), nav options, RestTimer (show/close/disabled), start error (alert/OK), abandon via BackHandler (open/confirm/cancel), close summary → Home
- BackHandler spy pour tester le flow d'abandon
- WorkoutExerciseCard mock avec bouton Validate exposé

### SettingsScreen (64% → 82%, +18pts)
- 27 tests : state sync, timer toggle (save/null/error-revert), rest duration (valid/invalid/null), profile name (blur/submit/null/empty), AI section, About section, Help section
- Timer toggle error revert coverage (catch block line 75-76)

### StatsCalendarScreen (66% → 94.73%, +28.73pts)
- 10 tests : render, streaks, legend, day labels, data render, streak > 0, tooltip repos, tooltip session details, tooltip toggle, duration in tooltip
- UNSAFE_getAllByType(TouchableOpacity) pour cibler les cellules du calendrier

### StatsDurationScreen (68% → 85.71%, +17.71pts)
- 11 tests : render, KPI cards, empty state, chart with 2+ sessions, section title count, KPI values, data point tooltip (show/toggle), different durations
- LineChart mock avec bouton ClickPoint pour tester onDataPointClick

## Vérification
- TypeScript : ✅ zero errors
- Tests : ✅ 1042 passed (1005 → 1042, +37 new tests)
- Nouveau test créé : oui (enrichi 5 fichiers existants)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260223-2345

## Commit
5ad40ac test(screens): increase coverage for 5 screens group B (+37 tests, 1005→1042)
