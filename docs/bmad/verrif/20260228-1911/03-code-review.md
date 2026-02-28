# Passe 3 — Code Review
> Run : 20260228-1911

## Problèmes trouvés

| # | Fichier | Ligne | Problème | Sévérité |
|---|---------|-------|----------|----------|
| 1 | `components/SetItem.tsx` | 11 | `useTheme()` au lieu de `useColors()` — incohérence patterns | 🟡 |
| 2 | `components/CustomModal.tsx` | 4 | Import hardcodé des couleurs au lieu de `useColors()` | 🟡 |
| 3 | `screens/WorkoutScreen.tsx` | 234 | `database.get<UserBadge>('sets')` — mauvais type générique + double cast `as unknown` | 🔴 |
| 4 | `components/BottomSheet.tsx` | ~61 | BackHandler stale closure — `onClose` peut être stale sur re-renders rapides | 🔴 |
| 5 | `screens/AssistantScreen.tsx` | entier | Screen > 972 lignes — logique métier non extraite | 🟡 |
| 6 | `contexts/ThemeContext.tsx` | ~30 | Race condition : `setMode()` avant que `database.write()` réussisse | 🔴 |
| 7 | `components/WorkoutExerciseCard.tsx` | ~100 | Debounce timers : cleanup manquante si composant unmount pendant timeout | 🔴 |
| 8 | `screens/WorkoutScreen.tsx` | 234 | Accès à `._raw.exercise_id` — API interne WatermelonDB instable | 🟡 |

## Détail des problèmes critiques

### #3 — WorkoutScreen.tsx : Cast dangereux WatermelonDB
```typescript
// ❌ Actuel
const allSetsRaw = await database.get<UserBadge>('sets').query().fetch() as unknown as Array<{ _raw: { exercise_id: string } }>
// Mauvais type générique (UserBadge au lieu de Set), double cast dangereux, accès ._raw instable
```

### #4 — BottomSheet.tsx : BackHandler stale closure
```typescript
// Risque si onClose change entre renders sans que visible change
useEffect(() => {
  const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
    onClose()  // peut capturer un onClose stale
    return true
  })
  return () => subscription.remove()
}, [visible, onClose])
```

### #6 — ThemeContext.tsx : Race condition persist thème
```typescript
// setMode mis à jour AVANT que la DB confirme → divergence possible
setMode(newMode)           // 1. UI mise à jour immédiatement
await database.write(...)  // 2. DB peut échouer → thème UI ≠ thème DB
```

### #7 — WorkoutExerciseCard.tsx : Timeout sans cleanup unmount
```typescript
// Si le composant unmount pendant les 300ms, le timer fire sur un composant mort
weightTimerRef.current = setTimeout(() => onUpdateInput(inputKey, 'weight', v), 300)
// Pas de cleanup dans le return du useEffect englobant
```

## Patterns positifs
✅ Portal pattern correct (AlertDialog, BottomSheet, CustomModal)
✅ withObservables HOC utilisé correctement
✅ useHaptics() systématique
✅ RestTimer.tsx — cleanup timers impeccable

## Score architecture : 6.5/10
- 4 problèmes 🔴 critiques
- 4 problèmes 🟡 modérés
