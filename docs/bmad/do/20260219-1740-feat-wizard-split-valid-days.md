# feat(assistant) — filter valid days per split type in wizard
Date : 2026-02-19 17:40

## Instruction
Dans mobile/src/screens/AssistantScreen.tsx, ajouter des contraintes de jours valides par type de split dans le wizard de création de programme.

## Classification
Type : feat
Fichiers : mobile/src/screens/AssistantScreen.tsx

## Ce qui a été fait

### 1. Suppression de DAYS_OPTIONS (static)
L'ancienne constante `DAYS_OPTIONS: StepOption[]` ([2,3,4,5,6]) a été supprimée car rendue inutile.

### 2. Ajout de SPLIT_VALID_DAYS et getDaysForSplit
```typescript
const SPLIT_VALID_DAYS: Record<AISplit, number[]> = {
  auto:       [2, 3, 4, 5, 6],
  fullbody:   [2, 3, 4, 5, 6],
  upperlower: [2, 4],
  ppl:        [3, 6],
  brosplit:   [5],
  arnold:     [3, 6],
  phul:       [4],
  fiveday:    [5],
  pushpull:   [2, 4, 6],
  fullbodyhi: [2, 3, 4, 5, 6],
}

function getDaysForSplit(split: AISplit | undefined): number[] {
  if (split === undefined) return [2, 3, 4, 5, 6]
  return SPLIT_VALID_DAYS[split]
}
```

### 3. Inversion de l'ordre split → days dans buildSteps()
- Avant : days → split → musclesFocus
- Après : **split → days** → musclesFocus
- Les options de jours sont maintenant calculées dynamiquement : `getDaysForSplit(data.split).map(d => ({ value: d, label: \`${d}j\` }))`
- Puisque `buildSteps(formData)` est appelé à chaque render, les options s'adaptent en temps réel

### 4. Auto-correction dans handleSelect
Si l'utilisateur revient en arrière et change le split, daysPerWeek est auto-corrigé :
```typescript
if (field === 'split') {
  const validDays = getDaysForSplit(value as AISplit)
  if (newData.daysPerWeek !== undefined && !validDays.includes(newData.daysPerWeek)) {
    newData = { ...newData, daysPerWeek: validDays[0] }
  }
}
```

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 643 passed (41 suites)
- Nouveau test créé : non (logique purement UI/navigation)

## Commit
e1ff433 feat(assistant): filter valid days per split type in wizard
