# S06 — Choix du type de split (mode programme)
> Priorité : Must | Effort : S | Dépend de : S02 | Bloque : S07

## Objectif
Permettre à l'utilisateur de choisir le style de son programme (Auto / Full Body / Upper-Lower / PPL)
au lieu de le laisser être calculé automatiquement depuis le nombre de jours.

## Fichiers touchés
- `mobile/src/services/ai/types.ts`
- `mobile/src/services/ai/offlineEngine.ts`
- `mobile/src/services/ai/providerUtils.ts`
- `mobile/src/screens/AssistantScreen.tsx`

## Tâches techniques

### types.ts — Nouveau type et champ

```typescript
export type AISplit = 'auto' | 'fullbody' | 'upperlower' | 'ppl'

export interface AIFormData {
  // ... champs existants ...
  split?: AISplit  // NEW
}
```

### offlineEngine.ts — Respecter le choix utilisateur

Modifier `getSplitName` :
```typescript
// Avant :
function getSplitName(days: number): string {
  if (days <= 3) return 'fullbody'
  if (days <= 4) return 'upperlower'
  return 'ppl'
}

// Après :
function getSplitName(days: number, split?: AISplit): string {
  if (split && split !== 'auto') return split
  if (days <= 3) return 'fullbody'
  if (days <= 4) return 'upperlower'
  return 'ppl'
}
```

Modifier `generateProgram` pour passer `form.split` :
```typescript
const splitName = getSplitName(days, form.split)
```

Ajouter l'import de `AISplit` dans le fichier :
```typescript
import type { AIProvider, AIFormData, DBContext, GeneratedPlan, GeneratedExercise, GeneratedSession, ExerciseInfo, AISplit } from './types'
```

### providerUtils.ts — Enrichir le prompt

Dans `buildPrompt`, étendre `modeDetails` pour le mode programme :
```typescript
const modeDetails = form.mode === 'program'
  ? [
      `Jours par semaine : ${form.daysPerWeek ?? 3}.`,
      form.split && form.split !== 'auto'
        ? `Style de programme souhaité : ${form.split}.`
        : '',
    ].filter(Boolean).join('\n')
  : `Groupe musculaire ciblé : ${form.muscleGroup ?? 'Full Body'}.`
```

### AssistantScreen.tsx — Nouveau step wizard

#### Constante SPLIT_OPTIONS
```typescript
const SPLIT_OPTIONS: StepOption[] = [
  { value: 'auto',       label: 'Automatique',   sub: "L'IA choisit selon tes jours",       icon: '🔄' },
  { value: 'fullbody',   label: 'Full Body',      sub: 'Tout le corps à chaque séance',      icon: '💪' },
  { value: 'upperlower', label: 'Upper / Lower',  sub: 'Haut du corps / Bas du corps',       icon: '↕️' },
  { value: 'ppl',        label: 'PPL',            sub: 'Push · Pull · Legs',                 icon: '🔁' },
]
```

#### buildSteps — mode programme
```typescript
// Après le step daysPerWeek, ajouter :
steps.push({
  id: 'split',
  field: 'split',
  question: 'Quel style de programme ?',
  kind: 'single',
  options: SPLIT_OPTIONS,
})
```

## Critères d'acceptation
- [ ] Step "Quel style de programme ?" apparaît après "Combien de jours ?" en mode programme
- [ ] Sélectionner "Full Body" → `formData.split === 'fullbody'`
- [ ] Sélectionner "Automatique" → `formData.split === 'auto'`
- [ ] `offlineEngine` génère un programme Full Body même si daysPerWeek = 5, si split = 'fullbody'
- [ ] Le mode séance n'a pas ce step
- [ ] `npx tsc --noEmit` passe sans erreur
