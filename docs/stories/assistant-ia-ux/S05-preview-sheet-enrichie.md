# S05 — PreviewSheet enrichie
> Priorité : Must | Effort : S | Dépend de : S01 | Bloque : —

## Objectif
Afficher les poids cibles, un résumé du plan et un titre dynamique dans AssistantPreviewSheet.

## Fichiers touchés
- `mobile/src/components/AssistantPreviewSheet.tsx`
- `mobile/src/screens/AssistantScreen.tsx` (passage du prop `mode`)

## Tâches techniques

### AssistantPreviewSheet.tsx

#### Nouvelle prop
```typescript
interface AssistantPreviewSheetProps {
  visible: boolean
  plan: GeneratedPlan | null
  isLoading: boolean
  mode: 'program' | 'session'  // NEW
  onClose: () => void
  onModify: () => void
  onValidate: (plan: GeneratedPlan) => Promise<void>
}
```

#### Titre dynamique (BottomSheet title prop)
```typescript
const title = mode === 'program' ? 'Programme généré' : 'Séance générée'
// Passer à : <BottomSheet visible={visible} onClose={onClose} title={title}>
```

#### Résumé sous le champ Nom
```tsx
// Calculer avant le return :
const totalExercises = plan
  ? plan.sessions.reduce((acc, s) => acc + s.exercises.length, 0)
  : 0
const summary = plan
  ? `${plan.sessions.length} séance${plan.sessions.length > 1 ? 's' : ''} · ${totalExercises} exercice${totalExercises > 1 ? 's' : ''}`
  : ''

// Afficher après le TextInput :
<Text style={styles.summary}>{summary}</Text>
```

#### Poids dans exerciseRow
```tsx
// Avant :
<Text style={styles.exerciseSets}>
  {ex.setsTarget}×{ex.repsTarget}
</Text>

// Après :
<Text style={styles.exerciseSets}>
  {ex.setsTarget}×{ex.repsTarget}
  {ex.weightTarget > 0 ? `  ·  ~${ex.weightTarget} kg` : ''}
</Text>
```

#### ScrollView flex
```typescript
// Avant :
scrollView: { maxHeight: 320, marginBottom: spacing.md }

// Après :
scrollView: { flex: 1, marginBottom: spacing.md }
```

#### Style summary
```typescript
summary: {
  color: colors.textSecondary,
  fontSize: fontSize.sm,
  marginBottom: spacing.md,
},
```

### AssistantScreen.tsx

Passer le prop `mode` à `AssistantPreviewSheet` :
```tsx
<AssistantPreviewSheet
  visible={previewModal.isOpen}
  plan={generatedPlan}
  isLoading={isGenerating}
  mode={formData.mode ?? 'program'}  // NEW
  onClose={previewModal.close}
  onModify={handleModify}
  onValidate={handleValidate}
/>
```

## Critères d'acceptation
- [ ] Titre "Programme généré" ou "Séance générée" selon le mode
- [ ] Résumé "X séance(s) · Y exercice(s)" visible sous le champ nom
- [ ] Poids affiché `~45 kg` quand weightTarget > 0
- [ ] Exercices sans PR n'affichent rien (pas de "~0 kg")
- [ ] ScrollView sans height fixe — s'adapte au contenu
- [ ] `npx tsc --noEmit` passe sans erreur
