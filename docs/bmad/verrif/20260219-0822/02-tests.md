# Tests — 2026-02-19

## Résultat : ✅ 120 passed / 🔴 0 failed / ⏭️ 0 skipped

**9 suites, toutes PASS** — Durée : ~7s

| Suite | Fichier | Tests |
|-------|---------|-------|
| useModalState + useMultiModalSync | `hooks/__tests__/useModalState.test.ts` | 15 |
| useHaptics | `hooks/__tests__/useHaptics.test.ts` | 8 |
| validationHelpers | `model/utils/__tests__/validationHelpers.test.ts` | 21 |
| notificationService | `services/__tests__/notificationService.test.ts` | 7 |
| Button | `components/__tests__/Button.test.tsx` | 12 |
| AlertDialog | `components/__tests__/AlertDialog.test.tsx` | 11 |
| OnboardingSheet | `components/__tests__/OnboardingSheet.test.tsx` | 6 |
| databaseHelpers | `model/utils/__tests__/databaseHelpers.test.ts` | inclus |
| SettingsScreen | `screens/__tests__/SettingsScreen.test.tsx` | 3 |

### Tests en échec
Aucun.

### Warnings (non-bloquants)
| Type | Fichier | Description |
|------|---------|-------------|
| `act(...)` warning | `AlertDialog.test.tsx` | Animations RN déclenchent des state updates hors `act()`. Cosmétique, non bloquant. |

---

## Couverture globale

| Métrique | Valeur |
|----------|--------|
| Statements | **12.95%** |
| Branches | **16.36%** |
| Functions | **13.60%** |
| Lines | **13.34%** |

### Couverture par zone

| Zone | Stmts | Branch | Funcs | Lines |
|------|-------|--------|-------|-------|
| `components/` | 15.17% | 16.82% | 11.7% | 16.12% |
| `hooks/` | 6.57% | 4.9% | 20.45% | 5.58% |
| `model/` | 3.84% | 0% | 0% | 3.84% |
| `model/utils/` | 43.33% | 65.68% | 41.97% | 45.53% |
| `screens/` | 4.15% | 8.8% | 1.45% | 4.48% |
| `services/` | 47.82% | 23.52% | 62.5% | 53.84% |
| `services/ai/` | 0% | 0% | 0% | 0% |

### Fichiers à 100%
- `components/AlertDialog.tsx`
- `hooks/useHaptics.ts`
- `hooks/useModalState.ts`
- `model/onboardingPrograms.ts`
- `services/notificationService.ts` (95.45% lines)
- `components/OnboardingSheet.tsx` (90.47% stmts)

---

## Fichiers critiques sans tests (0% couverture)

### Hooks (priorité haute)
- `hooks/useExerciseManager.ts`
- `hooks/useSessionManager.ts`
- `hooks/useProgramManager.ts`
- `hooks/useWorkoutState.ts`
- `hooks/useWorkoutTimer.ts`
- `hooks/useKeyboardAnimation.ts`

### Écrans (priorité haute)
- `screens/HomeScreen.tsx`
- `screens/WorkoutScreen.tsx`
- `screens/ExercisesScreen.tsx`
- `screens/ChartsScreen.tsx`
- `screens/SessionDetailScreen.tsx`
- `screens/AssistantScreen.tsx`

### Services (priorité haute)
- `services/ai/aiService.ts` + tous les providers
- `services/sentry.ts`

### Modèles WatermelonDB (priorité moyenne)
- Tous les modèles dans `model/models/` (0% statements)
