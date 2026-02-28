# Passe 4 — Bugs silencieux
> Run : 20260228-1911

## Bugs trouvés

| # | ID | Fichier | Ligne | Type | Description | Sévérité |
|---|----|---------|-------|------|-------------|----------|
| 1 | B4-1 | `screens/ProgramDetailScreen.tsx` | ~173 | setTimeout sans cleanup unmount | Timer `renameSessionTimerRef` fire sur composant démonté | 🟡 |
| 2 | B4-2 | `screens/ProgramsScreen.tsx` | ~115 | setTimeout onboarding cleanup partielle | Race condition si programs change rapidement | 🟡 |
| 3 | B4-3 | `screens/ExercisesScreen.tsx` | ~112 | BackHandler re-enregistré à chaque render | Si `isOptionsVisible` change rapidement → listeners s'empilent | 🔴 |
| 4 | B4-4 | `screens/WorkoutScreen.tsx` | ~186 | Erreurs gamification non signalées à l'utilisateur | Silent fail — séance termine sans récompenses, user ne sait pas | 🟡 |
| 5 | B4-5 | `screens/SessionDetailScreen.tsx` | ~174 | AlertDialog bloqué si onConfirm rejette | `setIsAlertVisible(false)` non appelé si exception → modal bloqué | 🔴 |
| 6 | B4-6 | `screens/HomeScreen.tsx` | ~119 | Array access sans null guard | `celebrations.milestones?.map` sans `??[]` → crash si undefined | 🟡 |

## Détail

### B4-3 — ExercisesScreen: BackHandler re-enregistré
```typescript
// ❌ Actuel — nouveau handler à chaque changement de isOptionsVisible
useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
  return () => backHandler.remove()
}, [isOptionsVisible])  // Re-enregistre à chaque changement!

// ✅ Fix — ref pour lire l'état sans re-enregistrer
const isOptionsVisibleRef = useRef(false)
useEffect(() => { isOptionsVisibleRef.current = isOptionsVisible }, [isOptionsVisible])
useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (isOptionsVisibleRef.current) { setIsOptionsVisible(false); return true }
    return false
  })
  return () => backHandler.remove()
}, [])  // Une seule fois
```

### B4-5 — SessionDetailScreen: AlertDialog bloqué
```typescript
// ❌ Actuel — si onConfirm() throw, setIsAlertVisible(false) n'est jamais appelé
onConfirm={async () => {
  await alertConfig.onConfirm()
  setIsAlertVisible(false)
}}

// ✅ Fix — finally garantit la fermeture
onConfirm={async () => {
  try { await alertConfig.onConfirm() }
  finally { setIsAlertVisible(false) }
}}
```

### B4-6 — HomeScreen: Array null safety
```typescript
// ❌ Actuel — crash si milestones ou badges undefined
...celebrations.milestones.map(m => ...)
...celebrations.badges.map(b => ...)

// ✅ Fix
...(celebrations.milestones ?? []).map(m => ...)
...(celebrations.badges ?? []).map(b => ...)
```

## Score bugs : 14/20
(2 critiques présents : B4-3 BackHandler + B4-5 AlertDialog)
