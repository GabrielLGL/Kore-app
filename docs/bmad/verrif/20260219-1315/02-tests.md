# Passe 2 — Tests — 20260219-1315

## Résultat : ✅ PASS

- **Test Suites :** 33 passed, 33 total
- **Tests :** 533 passed, 533 total (↑ 6 depuis dernier run 527)
- **Snapshots :** 0
- **Durée :** ~9.7s

## Coverage globale

| Métrique   | Score  | Δ vs précédent |
|------------|--------|----------------|
| Statements | 60.70% | +0.96% |
| Branches   | 54.14% | +0.70% |
| Functions  | 52.81% | +0.46% |
| Lines      | 61.72% | +0.84% |

**Score Coverage : 15/20** (seuil 60-80% lines = 15 pts)

## Fichiers sans aucun test (coverage 0%)
- `components/AssistantPreviewSheet.tsx`
- `components/ExercisePickerModal.tsx`
- `model/models/Exercise.ts`
- `model/models/Program.ts`
- `screens/AssistantScreen.tsx`
- `screens/ChartsScreen.tsx`
- `screens/SessionDetailScreen.tsx`
- `screens/WorkoutScreen.tsx`
- `services/ai/aiService.ts`
- `services/ai/claudeProvider.ts`
- `services/ai/geminiProvider.ts`
- `services/ai/openaiProvider.ts`
- `services/ai/types.ts`
- `types/workout.ts`

## Observations console (attendues, hors erreurs)
- `console.warn` dans `databaseHelpers.ts` → gardé par `__DEV__` ✅
- `console.error` dans `useExerciseManager.ts` → gardé par try/catch ✅

## Score Tests : 20/20
