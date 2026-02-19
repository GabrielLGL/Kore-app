# Architecture — Assistant IA Refonte Wizard — 2026-02-19

## Principe
5 fichiers modifiés. 0 nouveau fichier. 0 nouvelle dépendance.

---

## services/ai/types.ts

```typescript
export type AISplit = 'auto' | 'fullbody' | 'upperlower' | 'ppl'

export interface AIFormData {
  mode: 'program' | 'session'
  goal: AIGoal
  level: AILevel
  equipment: string[]
  daysPerWeek?: number
  durationMin: AIDuration
  muscleGroup?: string
  targetProgramId?: string
  split?: AISplit          // NEW — choix du split programme
  musclesFocus?: string[]  // NEW — [] = équilibré, sinon priorité volume
}
```

---

## services/ai/offlineEngine.ts

### getSplitName — respecte le choix utilisateur
```
form.split fourni et !== 'auto'  →  utilise form.split directement
sinon                            →  auto-calcul depuis daysPerWeek (comportement actuel)
```

### buildSession — biais musclesFocus (priorité de volume)
```
musclesFocus vide  →  comportement actuel (compound-first)
musclesFocus fourni →
  pool prioritaire = exercices ciblant ≥1 muscle du focus
  pool secondaire  = reste (compound-first)
  résultat         = prioritaire en premier, complété par secondaire jusqu'à count
```

---

## services/ai/providerUtils.ts

### buildPrompt — extension modeDetails programme
```
"Jours par semaine : X.
 Style de programme souhaité : PPL."        ← si split !== 'auto'
 Muscles prioritaires (plus de volume) : Dos, Bras."  ← si musclesFocus non vide
```

---

## screens/AssistantScreen.tsx

### État supprimé (~200 lignes)
- chatMessages, chatStep, chatFormData, chatScrollRef, chatInitRef
- isConnectedMode, providerName
- renderChatUI, handleChatSelect, handleEquipmentChatNext, toggleChatEquipment
- toggleChatEquipment (remplacé par toggleEquipment unique)
- styles chat* (15 entrées StyleSheet)

### État ajouté
```typescript
const contentAnim = useRef(new Animated.Value(1)).current  // fade entre étapes
const [isAlertVisible, setIsAlertVisible] = useState(false) // confirmation reset
```

### buildSteps — mode programme
```
1. mode
2. goal
3. level
4. equipment       (kind: 'multi')
5. durationMin
6. daysPerWeek
7. split           (kind: 'single', options: SPLIT_OPTIONS)   ← NEW
8. musclesFocus    (kind: 'multi-focus')                       ← NEW
```

### Nouvelle step kind 'multi-focus'
- Multi-select avec option "Équilibré" exclusive
- "Équilibré" sélectionné → musclesFocus: [] → désactive tous les autres
- Sélectionner un muscle → désactive automatiquement "Équilibré"
- Bouton "Suivant →" (comme equipment, disabled si rien sélectionné mais "Équilibré" par défaut)

### Transition fade entre étapes
```
handleSelect →
  Animated.timing(contentAnim, { toValue: 0, duration: 100 }).start(() => {
    setCurrentStep(next)
    Animated.timing(contentAnim, { toValue: 1, duration: 150 }).start()
  })
```

### Badge provider (remplace providerHint)
```tsx
// Dans le header, coin droit
<View style={styles.badge}>
  <Text style={styles.badgeText}>
    {providerLabel === 'Offline' ? '🔌' : '⚡'} {providerLabel}
  </Text>
</View>
// Style : colors.card, borderRadius.lg, fontSize.sm, fontWeight '600'
```

### Progress bar
```
height: 6 (au lieu de 3)
borderRadius: borderRadius.sm
```

### Reset (US-8)
```tsx
// Bouton ✕ dans header si currentStep > 0
// AlertDialog si currentStep > 2 → confirm → reset formData + currentStep → useHaptics.onDelete()
// Si currentStep <= 2 → reset direct
```

---

## components/AssistantPreviewSheet.tsx

### Nouvelle prop
```typescript
interface AssistantPreviewSheetProps {
  // ... existants
  mode: 'program' | 'session'  // NEW — pour titre dynamique
}
```

### Titre dynamique (BottomSheet title prop)
```
mode === 'program' → "Programme généré"
mode === 'session' → "Séance générée"
```

### Résumé (sous le nom)
```tsx
const totalExercises = plan.sessions.reduce((acc, s) => acc + s.exercises.length, 0)
// Affiche : "3 séances · 15 exercices"
```

### Poids dans exerciseRow
```tsx
<Text style={styles.exerciseSets}>
  {ex.setsTarget}×{ex.repsTarget}
  {ex.weightTarget > 0 && `  ·  ~${ex.weightTarget} kg`}
</Text>
```

### ScrollView
```
flex: 1 (supprime maxHeight: 320)
```

---

## Flux de données complet

```
Wizard (8 étapes programme / 7 étapes séance)
         ↓
   formData: AIFormData (avec split + musclesFocus)
         ↓
generatePlan(formData, user)
         ↓
   selectProvider() → offlineEngine | claudeProvider | geminiProvider | openaiProvider
         ↓
   offlineEngine:   respecte form.split + biaise musclesFocus (priorité volume)
   cloudProvider:   buildPrompt() inclut split + musclesFocus dans le prompt
         ↓
GeneratedPlan → AssistantPreviewSheet (avec mode prop)
```

---

## Taille estimée après refonte

| Fichier | Avant | Après |
|---------|-------|-------|
| AssistantScreen.tsx | 980 lignes | ~520 lignes |
| AssistantPreviewSheet.tsx | 196 lignes | ~240 lignes |
| offlineEngine.ts | 168 lignes | ~195 lignes |
| providerUtils.ts | 123 lignes | ~135 lignes |
| types.ts | 48 lignes | ~54 lignes |
