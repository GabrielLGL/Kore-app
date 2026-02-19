# Tests — 2026-02-19

## Résultat : ✅ 117 passed / 🔴 0 failed / ⏭️ 0 skipped

**Test runner :** Jest
**Suites :** 8 passed, 8 total
**Durée :** ~3.9 s

---

### Tests en échec

Aucun test en échec. ✅

---

### Avertissements (non-bloquants)

| Type | Fichier | Message |
|------|---------|---------|
| `console.warn` | `databaseHelpers.ts:444` | `[importPresetProgram] Exercice introuvable` — attendu dans le test "ignore silencieusement un exercice introuvable" |
| `console.error` | `OnboardingSheet.test.tsx`, `AlertDialog.test.tsx` | Multiple warnings `"An update to Animated(View) inside a test was not wrapped in act(...)"` — animations RN non wrappées dans `act()`. Non bloquant mais bruyant. |

---

### Suites de tests existantes

| Fichier de test | Tests |
|-----------------|-------|
| `services/__tests__/notificationService.test.ts` | 7 |
| `model/utils/__tests__/validationHelpers.test.ts` | 19 |
| `hooks/__tests__/useHaptics.test.ts` | 8 |
| `hooks/__tests__/useModalState.test.ts` | 13 |
| `model/utils/__tests__/databaseHelpers.test.ts` | 12 |
| `components/__tests__/OnboardingSheet.test.tsx` | 6 |
| `components/__tests__/Button.test.tsx` | 12 |
| `components/__tests__/AlertDialog.test.tsx` | 11 |

---

### Fichiers critiques sans tests

#### Hooks (0% couverture)
- `hooks/useExerciseFilters.ts`
- `hooks/useExerciseManager.ts` — gestion CRUD exercices (critique)
- `hooks/useKeyboardAnimation.ts`
- `hooks/useProgramManager.ts` — gestion CRUD programmes (critique)
- `hooks/useSessionManager.ts` — gestion CRUD séances (critique)
- `hooks/useWorkoutState.ts` — état session d'entraînement en cours (critique)
- `hooks/useWorkoutTimer.ts` — timer de repos

#### Composants (0% couverture)
- `components/BottomSheet.tsx` — composant modal principal
- `components/ChipSelector.tsx`
- `components/CustomModal.tsx`
- `components/ErrorBoundary.tsx`
- `components/ExercisePickerModal.tsx` — sélecteur exercice (critique)
- `components/ExerciseTargetInputs.tsx`
- `components/LastPerformanceBadge.tsx`
- `components/ProgramSection.tsx`
- `components/RestTimer.tsx` — timer visible utilisateur
- `components/SessionExerciseItem.tsx`
- `components/SessionItem.tsx`
- `components/SetItem.tsx`
- `components/WorkoutExerciseCard.tsx` — carte exercice entraînement (critique)
- `components/WorkoutHeader.tsx`
- `components/WorkoutSummarySheet.tsx`
- `components/AssistantPreviewSheet.tsx`

#### Écrans (0% couverture — tous)
- `screens/HomeScreen.tsx`
- `screens/WorkoutScreen.tsx` (critique)
- `screens/ExercisesScreen.tsx`
- `screens/SessionDetailScreen.tsx`
- `screens/ChartsScreen.tsx`
- `screens/SettingsScreen.tsx`
- `screens/AssistantScreen.tsx`

#### Services IA (0% couverture)
- `services/ai/aiService.ts` — orchestrateur IA (critique)
- `services/ai/claudeProvider.ts`
- `services/ai/geminiProvider.ts`
- `services/ai/offlineEngine.ts` — moteur offline (critique)
- `services/ai/openaiProvider.ts`
- `services/ai/providerUtils.ts`

#### Modèles WatermelonDB (0% couverture)
- `model/models/Exercise.ts`
- `model/models/Program.ts`
- `model/models/History.ts`, `Session.ts`, `SessionExercise.ts`, `Set.ts`, `User.ts`

#### Autres
- `services/sentry.ts`
- `model/seed.ts`
- `model/constants.ts`
- `constants/strings.ts`

---

### Couverture globale

| Métrique | Valeur |
|----------|--------|
| Statements | **11.64%** |
| Branches | **14.03%** |
| Functions | **12.73%** |
| Lines | **11.97%** |

#### Couverture par module (détail)

| Module | Stmts | Branches | Funcs | Lines |
|--------|-------|----------|-------|-------|
| `components/AlertDialog.tsx` | 100% | 100% | 100% | 100% |
| `components/Button.tsx` | 92.85% | 94.73% | 100% | 100% |
| `components/OnboardingSheet.tsx` | 90.47% | 80% | 100% | 100% |
| `hooks/useHaptics.ts` | 100% | 100% | 100% | 100% |
| `hooks/useModalState.ts` | 100% | 100% | 100% | 100% |
| `services/notificationService.ts` | 81.48% | 66.66% | 100% | 95.45% |
| `model/utils/validationHelpers.ts` | 75.67% | 73.17% | 83.33% | 74.28% |
| `model/utils/databaseHelpers.ts` | 38.26% | 63.15% | 38.66% | 40.7% |
| Tout le reste | **0%** | **0%** | **0%** | **0%** |

---

### Priorités de test recommandées

1. **Haute priorité** — Logique métier critique sans tests :
   - `useWorkoutState.ts` (état entraînement)
   - `useProgramManager.ts` (CRUD programmes)
   - `useSessionManager.ts` (CRUD séances)
   - `useExerciseManager.ts` (CRUD exercices)
   - `services/ai/aiService.ts` + `offlineEngine.ts`

2. **Moyenne priorité** — Composants UI clés :
   - `WorkoutExerciseCard.tsx`
   - `ExercisePickerModal.tsx`
   - `BottomSheet.tsx`
   - `RestTimer.tsx`

3. **Basse priorité** — Écrans (intégration complexe) et modèles WatermelonDB

---

### Actions recommandées

- **Corriger les warnings `act()`** dans `OnboardingSheet.test.tsx` et `AlertDialog.test.tsx` (wrapper les assertions avec `act()` ou `waitFor()`)
- **Ajouter `--detectOpenHandles`** au script de test pour identifier les handles ouverts
- **Objectif couverture :** viser ≥ 50% statements en ciblant les hooks critiques en priorité
