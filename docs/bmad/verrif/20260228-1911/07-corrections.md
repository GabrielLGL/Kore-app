# Passe 7 — Corrections
> Run : 20260228-1911

## 7a — Critiques 🔴 (3 corrigés)

### Fix 1 — SessionDetailScreen : AlertDialog bloqué si onConfirm rejette
**Fichier** : `mobile/src/screens/SessionDetailScreen.tsx` ligne ~174
```typescript
// Avant
onConfirm={async () => {
  await alertConfig.onConfirm()
  setIsAlertVisible(false)  // ← non atteint si onConfirm throw
}}

// Après
onConfirm={async () => {
  try {
    await alertConfig.onConfirm()
  } finally {
    setIsAlertVisible(false)  // ← toujours exécuté
  }
}}
```
**Impact** : AlertDialog ne peut plus se bloquer indéfiniment si une suppression DB échoue.

---

### Fix 2 — ExercisesScreen : BackHandler re-enregistré à chaque render
**Fichier** : `mobile/src/screens/ExercisesScreen.tsx` lignes ~112-124
```typescript
// Avant — re-enregistre à chaque changement de isOptionsVisible
useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
  return () => backHandler.remove()
}, [isOptionsVisible])

// Après — ref pour lire l'état, listener enregistré une seule fois
const isOptionsVisibleRef = useRef(isOptionsVisible)
useEffect(() => { isOptionsVisibleRef.current = isOptionsVisible }, [isOptionsVisible])
useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (isOptionsVisibleRef.current) { setIsOptionsVisible(false); return true }
    return false
  })
  return () => backHandler.remove()
}, [])
```
**Impact** : Prévient l'empilement de listeners si l'état change rapidement.

---

### Fix 3 — WorkoutScreen : Type générique incorrect sur database.get()
**Fichier** : `mobile/src/screens/WorkoutScreen.tsx` ligne ~234
```typescript
// Avant — UserBadge utilisé pour requêter la table 'sets' + double cast dangereux
const allSetsRaw = await database.get<UserBadge>('sets').query().fetch() as unknown as Array<...>

// Après — SetModel correct + cast transparent à un seul niveau
import SetModel from '../model/models/Set'
const allSetsRaw = await database.get<SetModel>('sets').query().fetch()
const distinctExerciseCount = new Set(allSetsRaw.map(s => (s._raw as unknown as { exercise_id: string }).exercise_id)).size
```
**Impact** : TypeScript correctement typé, plus de double cast `as unknown as Array<...>`.

---

## 7b — Warnings 🟡 (1 corrigé)

### Fix 4 — HomeScreen : Null safety sur celebrations arrays
**Fichier** : `mobile/src/screens/HomeScreen.tsx` ligne ~122
```typescript
// Avant — crash si milestones/badges sont undefined
...celebrations.milestones.map(m => ...)
...celebrations.badges.map(b => ...)

// Après — null guard avec ?? []
...(celebrations.milestones ?? []).map(m => ...)
...(celebrations.badges ?? []).map(b => ...)
```

---

## Non corrigés (risque trop élevé / faux positifs)

| # | Problème | Raison de non-correction |
|---|----------|--------------------------|
| WorkoutExerciseCard debounce | **Faux positif** — cleanup déjà à lignes 64-69 | — |
| ProgramDetailScreen setTimeout | **Faux positif** — cleanup déjà à lignes 64-68 | — |
| ThemeContext race condition | Optimistic update intentionnel — changer serait breaking change UX | — |
| BottomSheet BackHandler stale | Pattern React correct (`onClose` dans deps) — performance only | — |
| Session.ts @field→@text | **Faux positif** — `@text` n'existe pas en WatermelonDB. `@field` est correct pour strings | — |
| UserBadge.ts @field→@text | Même raison | — |
| 23 hardcoded values | Scope trop large pour 7b — nécessite tokens manquants (7px, 9px) | — |

## Vérification post-corrections
- TypeScript : ✅ 0 erreur
- Tests : ✅ 1559 passed / 93 suites — 0 régression
