# S08 — Bouton Recommencer
> Priorité : Should | Effort : XS | Dépend de : S03 | Bloque : —

## Objectif
Permettre à l'utilisateur de recommencer le wizard depuis le début en un tap,
sans avoir à reculer étape par étape.

## Fichiers touchés
- `mobile/src/screens/AssistantScreen.tsx`

## Tâches techniques

### Import AlertDialog
```typescript
import { AlertDialog } from '../components/AlertDialog'
```

### State
```typescript
const [isResetAlertVisible, setIsResetAlertVisible] = useState(false)
```

### Handler reset
```typescript
const handleResetRequest = useCallback(() => {
  if (currentStep > 2) {
    haptics.onPress()
    setIsResetAlertVisible(true)
  } else {
    handleReset()
  }
}, [currentStep, haptics])

const handleReset = useCallback(() => {
  haptics.onDelete()
  setIsResetAlertVisible(false)
  setFormData({ equipment: [], musclesFocus: [] })
  setCurrentStep(0)
  // Pas de fade ici — reset complet, on repart de zéro
  contentAnim.setValue(1)
}, [haptics, contentAnim])
```

### Header — remplacer backBtnPlaceholder droit par bouton ✕
```tsx
{currentStep > 0 ? (
  <TouchableOpacity style={styles.resetBtn} onPress={handleResetRequest}>
    <Text style={styles.resetBtnText}>✕</Text>
  </TouchableOpacity>
) : (
  <View style={styles.backBtnPlaceholder} />
)}
```

### AlertDialog de confirmation
```tsx
<AlertDialog
  visible={isResetAlertVisible}
  title="Recommencer ?"
  message="Ta progression actuelle sera perdue."
  onConfirm={handleReset}
  onCancel={() => setIsResetAlertVisible(false)}
  confirmText="Recommencer"
  cancelText="Annuler"
/>
```

### Styles
```typescript
resetBtn: {
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: borderRadius.md,
  backgroundColor: colors.card,
},
resetBtnText: {
  color: colors.textSecondary,
  fontSize: fontSize.md,
  fontWeight: '600',
},
```

## Critères d'acceptation
- [ ] Bouton ✕ visible dans le header quand currentStep > 0
- [ ] Au step ≤ 2 : reset direct sans confirmation
- [ ] Au step > 2 : AlertDialog "Recommencer ?" avec boutons Annuler / Recommencer
- [ ] Après reset : step 0, formData vide, "Équilibré" sélectionné par défaut
- [ ] `useHaptics().onDelete()` appelé au reset effectif
- [ ] `npx tsc --noEmit` passe sans erreur
