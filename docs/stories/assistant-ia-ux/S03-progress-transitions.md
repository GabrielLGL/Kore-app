# S03 — Progress bar & transitions améliorées
> Priorité : Must | Effort : S | Dépend de : S02 | Bloque : S04

## Objectif
Rendre la progression dans le wizard visuellement claire et fluide.

## Fichiers touchés
- `mobile/src/screens/AssistantScreen.tsx`

## Tâches techniques

### Progress bar
```typescript
// Avant
progressTrack: { height: 3 }
progressFill:  { height: 3, backgroundColor: colors.primary }

// Après
progressTrack: { height: 6 }
progressFill:  { height: 6, backgroundColor: colors.primary, borderRadius: borderRadius.sm }
```

### Step counter
```typescript
// Avant
stepCounter: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '500' }

// Après
stepCounter: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' }
```

### Fade entre étapes
Ajouter un `contentAnim` Animated.Value pour le contenu :

```typescript
const contentAnim = useRef(new Animated.Value(1)).current
```

Créer un helper `goToStep(nextIndex: number)` :
```typescript
const goToStep = useCallback((nextIndex: number) => {
  Animated.timing(contentAnim, {
    toValue: 0,
    duration: 100,
    useNativeDriver: true,
  }).start(() => {
    setCurrentStep(nextIndex)
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start()
  })
}, [contentAnim])
```

Utiliser `goToStep` dans :
- `handleSelect` : remplacer `setCurrentStep(prev => prev + 1)` par `goToStep(currentStep + 1)`
- `handleEquipmentNext` : idem
- `handleBack` : `goToStep(currentStep - 1)`

Wrapper le contenu dans une `Animated.View` :
```tsx
<Animated.View style={[styles.scrollContentAnimated, { opacity: contentAnim }]}>
  <Text style={styles.question}>{step?.question}</Text>
  {renderStepContent()}
</Animated.View>
```

**Note :** Ne pas wrapper la progress bar ni le header dans l'animation.

## Critères d'acceptation
- [ ] Progress bar visible à 6px avec borderRadius
- [ ] Step counter en `colors.text` et `fontSize.md`
- [ ] Transition fade out/in visible entre chaque étape
- [ ] Le bouton retour fait aussi une transition fade
- [ ] `npx tsc --noEmit` passe sans erreur
