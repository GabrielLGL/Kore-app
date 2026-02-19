# feat(assistant) — multi-select muscle groups pour le wizard session
Date : 2026-02-19 17:15

## Instruction
Convertir le champ muscleGroup (string) en muscleGroups (string[]) dans le wizard Assistant — mode session

## Classification
Type : feat
Fichiers :
- mobile/src/services/ai/types.ts
- mobile/src/screens/AssistantScreen.tsx
- mobile/src/services/ai/aiService.ts
- mobile/src/services/ai/offlineEngine.ts
- mobile/src/services/ai/providerUtils.ts
- mobile/src/services/ai/__tests__/aiService.test.ts
- mobile/src/services/ai/__tests__/providers.test.ts
- mobile/src/services/ai/__tests__/offlineEngine.test.ts
- mobile/src/services/ai/__tests__/providerUtils.test.ts

## Ce qui a été fait

### types.ts
- `muscleGroup?: string` → `muscleGroups?: string[]`

### AssistantScreen.tsx
- Ajout de `'multi-muscle'` à `WizardStepKind`
- Step muscle : `kind: 'single'` + `field: 'muscleGroup'` → `kind: 'multi-muscle'` + `field: 'muscleGroups'`
- Question : "Quel groupe musculaire ?" → "Quels groupes musculaires ?"
- Ajout de `muscleGroups: []` dans tous les formData initiaux et resets (×5)
- Nouveau handler `toggleMuscleGroup` (pattern identique à `toggleMusclesFocus`)
- Nouveau bloc `renderStepContent` pour le kind `'multi-muscle'` : chips MUSCLE_OPTIONS multi-select + bouton Suivant désactivé si vide

### aiService.ts
- Filtre `byMuscle` : `form.muscleGroup ? ...includes(mg)` → `form.muscleGroups?.some(mg => ...includes(mg))`
- `testForm` : `muscleGroup: 'Pecs'` → `muscleGroups: ['Pecs']`

### offlineEngine.ts
- `muscle = form.muscleGroup ?? 'Full Body'` → `muscleLabel = form.muscleGroups?.join(' + ') ?? 'Full Body'`
- Pool de fallback utilise `form.muscleGroups ?? ['Full Body']`

### providerUtils.ts
- Prompt session : `Groupe musculaire ciblé : ${form.muscleGroup}` → `Groupes musculaires ciblés : ${form.muscleGroups.join(', ')}`

### Tests (4 fichiers)
- Toutes les fixtures `muscleGroup: 'X'` → `muscleGroups: ['X']`
- Test providerUtils renommé : "inclut muscleGroups pour mode session"

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 94 passed, 0 failed
- Nouveau test créé : non (tests existants adaptés, couverture complète)

## Commit
feat(assistant): multi-select muscle groups for session wizard
