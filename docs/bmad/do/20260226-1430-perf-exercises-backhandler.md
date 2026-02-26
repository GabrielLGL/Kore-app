# perf(screens) — Comparateur custom ExerciseItem + magic numbers → theme tokens

Date : 2026-02-26 14:30

## Instruction
docs/bmad/verrif/20260226-0938/RAPPORT.md

## Rapport source
docs/bmad/verrif/20260226-0938/RAPPORT.md — Groupe D (magic numbers)
+ amélioration du commit 7aab69f (comparateur custom WatermelonDB)

## Classification
Type : perf / style
Fichiers modifiés :
- `mobile/src/screens/ExercisesScreen.tsx`
- `mobile/src/screens/ProgramsScreen.tsx`
- `mobile/src/theme/index.ts`

## Contexte
Les Groupes C (FlatList memo + BackHandler) et B (statsHelpers split) avaient déjà été
traités dans des sessions précédentes (commits 7aab69f et 8df202d respectivement).

## Ce qui a été fait

### 1. Comparateur custom WatermelonDB sur ExerciseItem
Le commit 7aab69f avait extrait `ExerciseItem` en `memo()` sans comparateur custom.
WatermelonDB mute les instances en place (même référence JS même si les données changent),
ce qui rendrait le memo inopérant lors des mises à jour d'exercices.

Ajout du comparateur explicite :
```tsx
(prev, next) =>
  prev.item === next.item &&
  prev.item.name === next.item.name &&
  prev.item.equipment === next.item.equipment &&
  JSON.stringify(prev.item.muscles) === JSON.stringify(next.item.muscles) &&
  prev.onOptionsPress === next.onOptionsPress
```
**Résultat :** le memo fonctionne correctement même avec les mutations WatermelonDB.

### 2. Magic numbers → theme constants (Groupe D)
Remplacement des valeurs hardcodées dans `ExercisesScreen.tsx` et `ProgramsScreen.tsx` :
- `borderRadius: 12` → `borderRadius.md`
- `borderRadius: 20` → `borderRadius.lg`
- `fontSize: 15` → `fontSize.bodyMd`
- `fontSize: 16` → `fontSize.md`
- `fontSize: 18` → `fontSize.lg`
- `fontSize: 20` → `fontSize.xl`
- `fontSize: 12` → `fontSize.xs`
- `fontSize: 14` → `fontSize.sm`
- `padding: 16` → `spacing.md`
- `padding: 12` → `spacing.ms`
- `paddingVertical: 16` → `spacing.md`
- `paddingHorizontal: 12` → `spacing.ms`
- `marginRight: 8` → `spacing.sm`

### 3. Ajout de tokens manquants dans theme/index.ts
Pour couvrir les valeurs utilisées dans l'app :
- `caption: 11`
- `bodyMd: 15`
- `jumbo: 48`

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit`)
- Tests : ✅ 1206 passed, 67 suites, 0 failed
- Nouveau test créé : non (changements de styles/optimisation)

## Documentation mise à jour
Aucune (tokens ajoutés dans theme/index.ts — auto-documentés par les noms)

## Statut
✅ Résolu — 20260226-1430

## Commit
[sera rempli après commit]
