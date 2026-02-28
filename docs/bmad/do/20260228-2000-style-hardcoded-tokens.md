# style(theme) — normaliser les valeurs hardcodées vers les tokens theme
Date : 2026-02-28 20:00

## Instruction
[rapport 20260228-1911 — problème restant #1 : 23 hardcoded values] ← groupe A

## Rapport source
`docs/bmad/verrif/20260228-1911/06-qualite.md`

## Classification
Type : style
Fichiers modifiés :
- `mobile/src/theme/index.ts` — 6 nouveaux tokens ajoutés
- `mobile/src/screens/HomeScreen.tsx`
- `mobile/src/screens/AssistantScreen.tsx`
- `mobile/src/screens/ProgramDetailScreen.tsx`
- `mobile/src/screens/ProgramsScreen.tsx`
- `mobile/src/screens/SettingsScreen.tsx`
- `mobile/src/screens/OnboardingScreen.tsx`
- `mobile/src/components/HeatmapCalendar.tsx`
- `mobile/src/components/BottomSheet.tsx`
- `mobile/src/components/SessionExerciseItem.tsx`
- `mobile/src/components/WorkoutExerciseCard.tsx`
- `mobile/src/components/WorkoutHeader.tsx`

## Ce qui a été fait

### Nouveaux tokens ajoutés à theme/index.ts
```typescript
// borderRadius
xxs: 2,  // thin elements (drag handles, progress bars, heatmap cells)
xs: 4,   // small chips and tags

// fontSize
micro: 7,   // ultra-small (calendar metadata)
tiny: 8,    // very small (calendar session names)
mini: 9,    // small (calendar labels, mini tags)
title: 26,  // large question/section titles
```

### Remplacements effectués (22 valeurs normalisées)

| Fichier | Valeur avant | Token après | Note |
|---------|-------------|-------------|------|
| HomeScreen.tsx | `fontSize: 9` (x2) | `fontSize.mini` | dayLabel, emptyDayText |
| HomeScreen.tsx | `fontSize: 8` | `fontSize.tiny` | sessionName |
| HomeScreen.tsx | `fontSize: 7` | `fontSize.micro` | sessionMeta |
| HomeScreen.tsx | `borderRadius: 4` | `borderRadius.xs` | sessionTag chip |
| AssistantScreen.tsx | `fontSize: 26` | `fontSize.title` | question text |
| ProgramDetailScreen.tsx | `fontSize: 17` | `fontSize.md` (16) | sheetOptionText |
| ProgramDetailScreen.tsx | `borderRadius: 10` (x3) | `borderRadius.sm` | moveChip, input, modalButton |
| ProgramDetailScreen.tsx | `padding: 14` | `spacing.md` (16) | modalButton |
| ProgramsScreen.tsx | `fontSize: 17` | `fontSize.md` (16) | sheetOptionText |
| ProgramsScreen.tsx | `borderRadius: 10` (x3) | `borderRadius.sm` | input, modalButton, moveChip |
| ProgramsScreen.tsx | `padding: 14` | `spacing.md` (16) | modalButton |
| SettingsScreen.tsx | `borderRadius: 9` | `borderRadius.sm` (10) | radioCircle 18×18 → reste cercle ✓ |
| OnboardingScreen.tsx | `borderRadius: 5` | `borderRadius.sm` (10) | dot 10×10 → reste cercle ✓ |
| HeatmapCalendar.tsx | `fontSize: 10` (x2) | `fontSize.caption` (11) | monthLabel, legendText |
| HeatmapCalendar.tsx | `borderRadius: 2` (x2) | `borderRadius.xxs` | cell, legendCell |
| BottomSheet.tsx | `borderRadius: 2` | `borderRadius.xxs` | dragHandle |
| SessionExerciseItem.tsx | `borderRadius: 1` | `borderRadius.xxs` (2) | dragBar — visuellement équivalent (r ≥ h/2) |
| WorkoutExerciseCard.tsx | `borderRadius: 14` (x2) | `borderRadius.md` | setBadge, setBadgeValidated (exact) |
| WorkoutExerciseCard.tsx | `borderRadius: 19` (x2) | `borderRadius.lg` (20) | validateBtn — reste cercle ✓ |
| WorkoutHeader.tsx | `borderRadius: 2` | `borderRadius.xxs` | progressTrack |

### Imports ajoutés
- `OnboardingScreen.tsx` : ajout de `borderRadius` dans l'import theme
- `HeatmapCalendar.tsx` : ajout de `borderRadius, fontSize` dans l'import theme

### Arrondis mineurs acceptés
- `borderRadius: 9` → 10 (radioCircle 18×18 : ≥ width/2, reste cercle)
- `borderRadius: 5` → 10 (dot 10×10 : ≥ width/2, reste cercle)
- `borderRadius: 19` → 20 (validateBtn 38×38 : ≥ width/2, reste cercle)
- `borderRadius: 1` → 2 (dragBar 18×2 : r=h/2, visuellement équivalent)
- `fontSize: 10` → 11 (heatmap labels : 1px, imperceptible)
- `fontSize: 17` → 16 (option text : 1px, imperceptible)
- `padding: 14` → 16 (modal button : 2px plus grand, meilleur pour touch targets)

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 1559 passed / 93 suites — 0 régression
- Nouveau test créé : non (style uniquement)

## Documentation mise à jour
- `theme/index.ts` : 6 nouveaux tokens avec JSDoc inline

## Statut
✅ Résolu — 20260228-2000

## Commit
`526c0b9` — `style(theme): normalize 22 hardcoded values to theme tokens`
