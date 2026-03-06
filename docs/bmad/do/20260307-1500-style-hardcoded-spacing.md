# style(theme) — Replace hardcoded spacing/sizing with theme tokens
Date : 2026-03-07 15:00

## Instruction
docs/bmad/morning/20260226-0900-fix-hardcoded-spacing.md

## Rapport source
docs/bmad/morning/20260226-0900-fix-hardcoded-spacing.md

## Classification
Type : style
Fichiers modifies :
- mobile/src/screens/HomeScreen.tsx
- mobile/src/screens/AssistantScreen.tsx
- mobile/src/screens/ExerciseHistoryScreen.tsx
- mobile/src/screens/ExercisesScreen.tsx
- mobile/src/screens/ProgramsScreen.tsx
- mobile/src/screens/SettingsScreen.tsx
- mobile/src/screens/StatsCalendarScreen.tsx
- mobile/src/screens/CreateExerciseScreen.tsx
- mobile/src/components/WorkoutSummarySheet.tsx
- mobile/src/components/WorkoutExerciseCard.tsx
- mobile/src/components/SessionExerciseItem.tsx
- mobile/src/components/BottomSheet.tsx
- mobile/src/components/XPProgressBar.tsx
- mobile/src/components/RestTimer.tsx
- CLAUDE.md

## Ce qui a ete fait
Remplacement de 30+ valeurs numeriques hardcodees par des tokens theme :
- `gap: 4` -> `spacing.xs` (10+ occurrences dans 6 fichiers)
- `gap: 8` -> `spacing.sm` (2 occurrences inline)
- `marginBottom: 4` -> `spacing.xs` (3 fichiers)
- `paddingVertical: 4` -> `spacing.xs` (WorkoutExerciseCard)
- `paddingHorizontal: 8` -> `spacing.sm` (StatsCalendarScreen)
- `paddingBottom: 40` -> `spacing.xxl` (CreateExerciseScreen)
- `width/height: 40` -> `spacing.xxl` (BottomSheet drag handle, AssistantScreen)
- `width/height: 32` -> `spacing.xl` (WorkoutExerciseCard validate buttons)
- `width/height: 24` -> `spacing.lg` (SessionExerciseItem checkbox)
- `width/height: 16` -> `spacing.md` (StatsCalendarScreen legend box)
- `height: 8` -> `spacing.sm` (XPProgressBar)
- `height: 4` -> `spacing.xs` (RestTimer, BottomSheet handle)
- `borderRadius: 4` -> `borderRadius.xs` (StatsCalendarScreen legend box)

Correction CLAUDE.md section 4.4 : borderRadius values etaient faux (sm=8, md=12) -> corriges vers les vraies valeurs (xxs=2, xs=4, sm=10, md=14, lg=20, xl=26).

Valeurs non touchees (par design) : 1, 2, 3, 5, 6, 10, 15, 20, 50, 80, 100, 120, 150 — aucun token exact correspondant.

## Verification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 1558 passed, 0 failed (93 suites)
- Nouveau test cree : non

## Documentation mise a jour
- CLAUDE.md section 4.4 (borderRadius values corriges)

## Statut
✅ Resolu — 20260307-1500

## Commit
47b3c6f style(theme): replace 30+ hardcoded spacing/sizing values with theme tokens
