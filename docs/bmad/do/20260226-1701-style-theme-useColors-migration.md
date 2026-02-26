# STYLE(theme) — Migration useColors() dynamique — Groupe D

Date : 2026-02-26 17:01

## Instruction
docs/bmad/prompts/20260226-theme-D.md

## Rapport source
docs/bmad/prompts/20260226-theme-D.md (description directe)

## Classification
Type : style
Fichiers modifiés :
- mobile/src/components/AlertDialog.tsx
- mobile/src/components/Button.tsx
- mobile/src/components/BottomSheet.tsx
- mobile/src/components/ChipSelector.tsx
- mobile/src/components/SessionItem.tsx
- mobile/src/components/SetItem.tsx
- mobile/src/components/WorkoutExerciseCard.tsx
- mobile/src/components/WorkoutHeader.tsx
- mobile/src/components/ProgramSection.tsx
- mobile/src/components/HeatmapCalendar.tsx
- mobile/src/components/ExercisePickerModal.tsx
- mobile/src/components/LevelBadge.tsx
- mobile/src/components/XPProgressBar.tsx
- mobile/src/components/StreakIndicator.tsx
- mobile/src/components/BadgeCard.tsx
- mobile/src/components/OnboardingCard.tsx
- mobile/src/components/RestTimer.tsx
- mobile/src/components/AssistantPreviewSheet.tsx
- mobile/src/components/WorkoutSummarySheet.tsx
- mobile/src/components/ExerciseInfoSheet.tsx
- mobile/src/components/ExerciseTargetInputs.tsx
- mobile/src/components/SessionExerciseItem.tsx
- mobile/src/components/ProgramDetailBottomSheet.tsx
- mobile/src/components/LastPerformanceBadge.tsx
- mobile/src/screens/HomeScreen.tsx
- mobile/src/screens/ProgramsScreen.tsx
- mobile/src/screens/ExercisesScreen.tsx
- mobile/src/screens/WorkoutScreen.tsx
- mobile/src/screens/StatsScreen.tsx
- mobile/src/screens/SessionDetailScreen.tsx
- mobile/src/screens/AssistantScreen.tsx
- mobile/src/screens/StatsDurationScreen.tsx
- mobile/src/screens/StatsVolumeScreen.tsx
- mobile/src/screens/StatsCalendarScreen.tsx
- mobile/src/screens/StatsRepartitionScreen.tsx
- mobile/src/screens/StatsExercisesScreen.tsx
- mobile/src/screens/StatsMeasurementsScreen.tsx
- mobile/src/screens/BadgesScreen.tsx
- mobile/src/screens/ChartsScreen.tsx
- mobile/src/screens/OnboardingScreen.tsx
- mobile/jest.config.js
- mobile/__mocks__/ThemeContextMock.ts

## Ce qui a été fait

Migration complète de 40 fichiers (24 composants + 16 écrans) du pattern `colors` statique vers `useColors()` dynamique.

**Pattern appliqué sur chaque fichier :**
1. Suppression de `colors` (et `neuShadow` si applicable) des imports `../theme`
2. Ajout de `import { useTheme } from '../contexts/ThemeContext'` (si neuShadow nécessaire) ou `import { useColors } from '../contexts/ThemeContext'`
3. Ajout de `import type { ThemeColors } from '../theme'`
4. Appel `const { colors, neuShadow } = useTheme()` (ou `const colors = useColors()`) au top du composant
5. Appel `const styles = useStyles(colors)` dans le composant
6. Déplacement de `StyleSheet.create({...})` dans `function useStyles(colors: ThemeColors)` en bas de fichier

**Cas particuliers traités :**
- `AlertDialog.tsx` : `confirmColor = colors.danger` (default prop) → changé en `confirmColor?: string` + `const effectiveConfirmColor = confirmColor ?? colors.danger` dans le corps
- `WorkoutExerciseCard.tsx` : deux composants (`WorkoutSetRow` React.memo + `WorkoutExerciseCardContent`) partagent `useStyles()` — chacun appelle le hook séparément
- `WorkoutSummarySheet.tsx` : `getMotivationMessage()` refactorisé pour accepter `colors: ThemeColors` en paramètre
- `ProgramDetailBottomSheet.tsx` : deux blocs de styles → deux fonctions `useRowStyles(colors)` et `useContentStyles(colors)`
- `ChipSelector.tsx`, `Button.tsx`, `BottomSheet.tsx`, `SessionItem.tsx`, `WorkoutHeader.tsx`, `ProgramSection.tsx` : `neuShadow` utilisé en JSX → `useTheme()` pour avoir les deux
- `intensityColors` (HeatmapCalendar, StatsCalendarScreen) : tableau constant statique, conservé tel quel
- `ChartsScreen.tsx` : `chartConfig` déplacé dans le corps du composant (référence `colors.card` et `colors.primary`)

**Fix test :** ajout de `mobile/__mocks__/ThemeContextMock.ts` + `moduleNameMapper` dans `jest.config.js` pour intercepter `contexts/ThemeContext` et éviter la chaîne ThemeContext → database → SQLiteAdapter qui cassait les tests de composants.

## Vérification
- TypeScript : ✅ 0 erreurs (`npx tsc --noEmit`)
- Tests : ✅ 1255 passed / 4 failed (pré-existants — causés par changements model/Exercise.ts antérieurs, non liés à cette migration)
- Nouveau test créé : non (aucune logique business modifiée)

## Documentation mise à jour
Aucune (migration purement de wiring styles, aucun nouveau pattern ou API)

## Statut
✅ Résolu — 20260226-1701

## Commit
[sera rempli]
