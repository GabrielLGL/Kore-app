# S07 — Focus musculaire (mode programme)
> Priorité : Must | Effort : M | Dépend de : S06 | Bloque : —

## Objectif
Permettre à l'utilisateur de spécifier les muscles à prioriser dans son programme.
L'engine biaise la sélection d'exercices en faveur de ces muscles (priorité de volume).

## Fichiers touchés
- `mobile/src/services/ai/types.ts`
- `mobile/src/services/ai/offlineEngine.ts`
- `mobile/src/services/ai/providerUtils.ts`
- `mobile/src/screens/AssistantScreen.tsx`

## Tâches techniques

### types.ts — Nouveau champ

```typescript
export interface AIFormData {
  // ... champs existants + split (S06) ...
  musclesFocus?: string[]  // NEW — [] = équilibré, sinon muscles prioritaires
}
```

### offlineEngine.ts — Biais priorité de volume

Modifier la signature de `buildSession` pour recevoir `musclesFocus` :
```typescript
function buildSession(
  name: string,
  availableExercises: ExerciseInfo[],
  count: number,
  goal: string,
  level: string,
  usedExercises: Set<string>,
  prs: Record<string, number>,
  musclesFocus?: string[]  // NEW
): GeneratedSession
```

Logique de biais dans `buildSession` :
```typescript
// Après avoir construit pool/source (logique existante inchangée) :
let sorted: ExerciseInfo[]

if (musclesFocus && musclesFocus.length > 0) {
  // Séparer en deux pools : focus en premier, reste après
  const focusPool = shuffleArray(
    source.filter(e => e.muscles.some(m => musclesFocus.includes(m)))
  )
  const otherCompounds = shuffleArray(
    source.filter(e =>
      !e.muscles.some(m => musclesFocus.includes(m)) &&
      e.muscles.some(m => COMPOUND_MUSCLES.includes(m))
    )
  )
  const otherIsolations = shuffleArray(
    source.filter(e =>
      !e.muscles.some(m => musclesFocus.includes(m)) &&
      !e.muscles.some(m => COMPOUND_MUSCLES.includes(m))
    )
  )
  sorted = [...focusPool, ...otherCompounds, ...otherIsolations]
} else {
  // Comportement actuel : compound-first
  const compounds = shuffleArray(source.filter(e => e.muscles.some(m => COMPOUND_MUSCLES.includes(m))))
  const isolations = shuffleArray(source.filter(e => !e.muscles.some(m => COMPOUND_MUSCLES.includes(m))))
  sorted = [...compounds, ...isolations]
}
```

Passer `musclesFocus` depuis `generateProgram` :
```typescript
sessions.push(buildSession(
  sessionName, finalPool, count, form.goal, form.level,
  usedExercises, context.prs,
  form.musclesFocus  // NEW
))
```

### providerUtils.ts — Enrichir le prompt

Étendre `modeDetails` (compléter ce qui a été ajouté en S06) :
```typescript
const modeDetails = form.mode === 'program'
  ? [
      `Jours par semaine : ${form.daysPerWeek ?? 3}.`,
      form.split && form.split !== 'auto'
        ? `Style de programme souhaité : ${form.split}.`
        : '',
      form.musclesFocus && form.musclesFocus.length > 0
        ? `Muscles prioritaires (donne-leur plus de volume dans chaque séance) : ${form.musclesFocus.join(', ')}.`
        : '',
    ].filter(Boolean).join('\n')
  : `Groupe musculaire ciblé : ${form.muscleGroup ?? 'Full Body'}.`
```

### AssistantScreen.tsx — Nouveau step multi-focus

#### Constante MUSCLES_FOCUS_OPTIONS
```typescript
const MUSCLES_FOCUS_OPTIONS = ['Équilibré', 'Pecs', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Abdos']
```

#### WizardStepKind — nouveau kind
```typescript
type WizardStepKind = 'single' | 'multi' | 'programs' | 'multi-focus'  // + 'multi-focus'
```

#### buildSteps — mode programme (après split)
```typescript
steps.push({
  id: 'musclesFocus',
  field: 'musclesFocus',
  question: 'Sur quels muscles veux-tu progresser ?',
  kind: 'multi-focus',
})
```

#### State initial — "Équilibré" par défaut
```typescript
// formData initial — ajouter musclesFocus vide (= Équilibré)
const [formData, setFormData] = useState<Partial<AIFormData>>({
  equipment: [],
  musclesFocus: [],  // [] = Équilibré
})
```

#### Handler toggleMusclesFocus
```typescript
const toggleMusclesFocus = useCallback((muscle: string) => {
  haptics.onSelect()
  setFormData(prev => {
    const current = prev.musclesFocus ?? []
    if (muscle === 'Équilibré') {
      return { ...prev, musclesFocus: [] }
    }
    const isSelected = current.includes(muscle)
    const next = isSelected
      ? current.filter(m => m !== muscle)
      : [...current, muscle]
    return { ...prev, musclesFocus: next }
  })
}, [haptics])
```

#### renderStepContent — case 'multi-focus'
```tsx
if (step.kind === 'multi-focus') {
  const selected = formData.musclesFocus ?? []
  const isEquilibre = selected.length === 0
  return (
    <View>
      <View style={styles.chipsWrap}>
        {MUSCLES_FOCUS_OPTIONS.map(muscle => {
          const isActive = muscle === 'Équilibré' ? isEquilibre : selected.includes(muscle)
          return (
            <TouchableOpacity
              key={muscle}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => toggleMusclesFocus(muscle)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {muscle}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <TouchableOpacity
        style={styles.nextBtn}
        onPress={handleEquipmentNext}  // réutiliser le handler "suivant" existant
      >
        <Text style={styles.nextBtnText}>Suivant →</Text>
      </TouchableOpacity>
    </View>
  )
}
```

**Note :** "Équilibré" est toujours valide (même si rien sélectionné = `[]`),
donc le bouton "Suivant →" n'est jamais disabled pour ce step.

## Critères d'acceptation
- [ ] Step "Sur quels muscles progresser ?" apparaît après "Quel style ?" en mode programme
- [ ] "Équilibré" sélectionné par défaut
- [ ] Sélectionner un muscle désactive visuellement "Équilibré"
- [ ] Sélectionner "Équilibré" vide les autres sélections
- [ ] Bouton "Suivant →" toujours actif (Équilibré = valide)
- [ ] Avec musclesFocus = ['Dos', 'Bras'] : le programme a plus d'exercices dos/bras
- [ ] musclesFocus = [] → comportement existant (compound-first)
- [ ] Mode séance : ce step n'apparaît pas
- [ ] `npx tsc --noEmit` passe sans erreur
