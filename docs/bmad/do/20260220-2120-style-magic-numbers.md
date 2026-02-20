# STYLE(components) — Remplacer magic numbers par tokens thème
Date : 2026-02-20 21:20

## Instruction
20260220-2022 (magic numbers — touche ExerciseTargetInputs aussi modifié par CC1)

## Rapport source
docs/bmad/morning/20260220-2022-style-magic-numbers.md

## Classification
Type : style
Fichiers modifiés :
- mobile/src/components/ExerciseTargetInputs.tsx
- mobile/src/components/CustomModal.tsx
- mobile/src/components/ExercisePickerModal.tsx
- mobile/src/components/ErrorBoundary.tsx
- mobile/src/components/RestTimer.tsx
- mobile/src/components/SessionExerciseItem.tsx
- mobile/src/components/SetItem.tsx
- mobile/src/components/SessionItem.tsx

## Ce qui a été fait

BottomSheet.tsx était déjà 100% tokenisé — aucune modification.

Stratégie : remplacer uniquement les valeurs avec un token EXACT (pas de "plus proche") pour ne pas changer les valeurs visuelles.

### Tokens appliqués par fichier

**ExerciseTargetInputs** — import ajouté: `spacing, borderRadius, fontSize`
- `marginRight: 8` → `spacing.sm`
- `fontSize: 12` → `fontSize.xs`
- `borderRadius: 8` → `borderRadius.sm`
- `fontSize: 16` → `fontSize.md`

**CustomModal** — import ajouté: `fontSize`
- `borderRadius: 20` → `borderRadius.lg`
- `padding: 24` → `spacing.lg`
- `fontSize: 20` → `fontSize.xl`
- `marginBottom: 16` → `spacing.md`

**ExercisePickerModal** — import ajouté: `spacing, borderRadius, fontSize`
- JSX inline `{ marginTop: 8 }` → `{ marginTop: spacing.sm }`
- `borderRadius: 20` → `borderRadius.lg`
- `fontSize: 18` → `fontSize.lg`
- `borderRadius: 8` (×3: exoChip, cancelBtn, confirmBtn) → `borderRadius.sm`
- `fontSize: 16` → `fontSize.md`

**ErrorBoundary** — import ajouté: `spacing, borderRadius, fontSize`
- `padding: 24` → `spacing.lg`
- `marginBottom: 16` → `spacing.md`
- `fontSize: 20` → `fontSize.xl`
- `borderRadius: 8` (×2: errorDetails, button) → `borderRadius.sm`
- `fontSize: 12` → `fontSize.xs`
- `paddingHorizontal: 24` → `spacing.lg`
- `fontSize: 16` → `fontSize.md`

**RestTimer** — import ajouté: `spacing, borderRadius, fontSize`
- `marginBottom: 8` → `spacing.sm`
- `borderRadius: 8` → `borderRadius.sm`
- `paddingVertical: 4` → `spacing.xs`
- `fontSize: 12` → `fontSize.xs`

**SessionExerciseItem** — import ajouté: `spacing, borderRadius, fontSize`
- `borderRadius: 12` → `borderRadius.md`
- `paddingHorizontal: 8` → `spacing.sm`
- `paddingVertical: 4` → `spacing.xs`
- `marginRight: 8` → `spacing.sm`
- `gap: 4` → `spacing.xs`
- `fontSize: 18` → `fontSize.lg`
- `marginBottom: 4` → `spacing.xs`
- `fontSize: 12` → `fontSize.xs`
- `borderRadius: 8` → `borderRadius.sm`
- `fontSize: 16` → `fontSize.md`
- `marginHorizontal: 8` → `spacing.sm`
- `fontSize: 20` → `fontSize.xl`

**SetItem** — import ajouté: `fontSize`
- `fontSize: 16` → `fontSize.md`
- `fontSize: 12` → `fontSize.xs`
- `fontSize: 20` → `fontSize.xl`
- `fontSize: 14` → `fontSize.sm`

**SessionItem** — import ajouté: `spacing, fontSize`
- `marginTop: 4` → `spacing.xs`
- `fontSize: 16` → `fontSize.md`

### Valeurs NON remplacées (pas de token exact)
- Padding/margin 5, 10, 12, 15, 20, 25 (pas dans spacing)
- fontSize 9, 10, 13, 15, 17, 22, 48 (pas dans fontSize)
- borderRadius 1, 2, 16 (pas dans borderRadius)

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 673 passed, 0 failed
- Nouveau test créé : non

## Documentation mise à jour
aucune (pattern déjà documenté dans CLAUDE.md : "No hardcoded colors")

## Statut
✅ Résolu — 20260220-2120

## Commit
e1da681 style(components): replace magic numbers with theme tokens in 8 components
