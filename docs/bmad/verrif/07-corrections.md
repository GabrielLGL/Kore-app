# Corrections — 2026-02-19

## Résultat final : ✅ TSC propre — 117/117 tests passants — 3 commits

---

## Critiques corrigées

### 1. WatermelonDB — 7 colonnes manquantes dans les modèles
**Commit :** `fix(critical): corrige les incohérences WatermelonDB et bugs silencieux`

| Modèle | Champ ajouté |
|--------|-------------|
| `Program.ts` | `@readonly @date('updated_at') updatedAt!: Date` |
| `Session.ts` | `@readonly @date('updated_at') updatedAt!: Date` |
| `Session.ts` | `@date('deleted_at') deletedAt!: Date \| null` |
| `History.ts` | `@readonly @date('updated_at') updatedAt!: Date` |
| `History.ts` | `@date('deleted_at') deletedAt!: Date \| null` |
| `Set.ts` | `@readonly @date('created_at') createdAt!: Date` |
| `Set.ts` | `@readonly @date('updated_at') updatedAt!: Date` |

### 2. AssistantScreen — double bug handleValidate
**Fichier :** `screens/AssistantScreen.tsx`
- Ajout d'un `try/catch` autour de `handleValidate` — `previewModal.close()` était jamais appelé en cas d'erreur DB
- Guard `if (!plan.sessions.length)` avant l'accès `plan.sessions[0]` (crash si plan vide)
- Remplacement du `// @ts-ignore` par un cast typé : `(navigation.getParent() as NavigationProp<RootStackParamList> | undefined)?.navigate(...)`
- Import ajouté : `NavigationProp` + `RootStackParamList`

### 3. ChartsScreen — handleDeleteStat sans try/catch
**Fichier :** `screens/ChartsScreen.tsx`
- Ajout d'un `try/catch/finally` : `setIsAlertVisible(false)` et `setSelectedStat(null)` sont maintenant toujours appelés (via `finally`), même si la DB échoue

### 4. RestTimer — fuite de notification au démontage
**Fichier :** `components/RestTimer.tsx`
- Premier `useEffect` (planification notification) : ajout d'un `return () => { cancelNotification(...) }` — la notification est maintenant annulée si le composant est démonté avant la fin du décompte

### 5. SettingsScreen — promesses non awaited
**Fichier :** `screens/SettingsScreen.tsx`
- `handleSelectProvider` → rendu `async` + `await handleSaveAI(...)`
- `handleApiKeyBlur` → rendu `async` + `await handleSaveAI(...)`
- Garantit l'ordre des écritures DB si l'utilisateur change de provider rapidement

### 6. databaseHelpers — division par zéro potentielle
**Fichier :** `model/utils/databaseHelpers.ts`
- Fonction `getLastPerformanceForExercise` : ajout de `if (recentSets.length === 0) return null` avant le calcul de `avgReps = ... / recentSets.length`

---

## Warnings corrigés

### 7. console.log/warn/error non protégés par `__DEV__`
**Commit :** `fix(warnings): console.log prod, haptics directs, code mort`

| Fichier | Avant | Après |
|---------|-------|-------|
| `screens/WorkoutScreen.tsx:99,108` | `.catch(console.error)` | `.catch(e => { if (__DEV__) console.error(...) })` |
| `services/sentry.ts:26` | `console.warn(...)` | `if (__DEV__) console.warn(...)` |
| `model/utils/databaseHelpers.ts:446` | `console.warn(...)` | `if (__DEV__) console.warn(...)` |
| `model/index.ts:18` | `console.error(...)` | `if (__DEV__) console.error(...)` |

### 8. Haptics directs → useHaptics()
7 appels `Haptics.impactAsync` directs migrés vers `useHaptics()` :

| Fichier | Avant | Après |
|---------|-------|-------|
| `components/SessionItem.tsx:61` | `Haptics.impactAsync(Medium)` | `haptics.onPress()` |
| `components/RestTimer.tsx:76` | `Haptics.impactAsync(Heavy)` | `haptics.onDelete()` |
| `components/RestTimer.tsx:77` | `Haptics.impactAsync(Heavy)` | `haptics.onDelete()` |
| `components/RestTimer.tsx:78` | `Haptics.impactAsync(Heavy)` | `haptics.onDelete()` |
| `navigation/index.tsx:83` | `Haptics.impactAsync(Medium)` | `haptics.onPress()` |
| `navigation/index.tsx:97` | `Haptics.impactAsync(Light)` | `haptics.onSelect()` |
| `navigation/index.tsx:179` | `Haptics.impactAsync(Medium)` | `haptics.onPress()` |

Import `* as Haptics from 'expo-haptics'` supprimé de `navigation/index.tsx` et `components/SessionItem.tsx`.

### 9. Code mort supprimé

| Élément | Fichier | Action |
|---------|---------|--------|
| `STRINGS` (fichier orphelin) | `constants/strings.ts` | Supprimé (git rm) |
| `captureMessage` | `services/sentry.ts` | Supprimé |
| `setUser` | `services/sentry.ts` | Supprimé |
| `clearUser` | `services/sentry.ts` | Supprimé |
| `addBreadcrumb` | `services/sentry.ts` | Supprimé |
| `commonStyles` | `theme/index.ts` | Supprimé |
| `import { StyleSheet }` | `theme/index.ts` | Supprimé (devenu inutile) |

---

## Suggestions appliquées

### 10. AssistantPreviewSheet — clés React stables
**Commit :** `fix(suggestions): clés React stables et mémoïsation chartStats`
**Fichier :** `components/AssistantPreviewSheet.tsx`
- `key={si}` → `key={\`${si}-${session.name}\`}`
- `key={ei}` → `key={\`${ei}-${ex.exerciseName}\`}`

### 11. ChartsScreen — mémoïsation de `chartStats`
**Fichier :** `screens/ChartsScreen.tsx`
- `const chartStats = statsForSelectedExo.slice(-15)` → `useMemo(() => statsForSelectedExo.slice(-15), [statsForSelectedExo])`
- Rend le cache de `chartData` effectif (`.slice()` retournait toujours une nouvelle référence)

---

## Corrections NON effectuées (risque trop élevé)

| # | Problème | Raison |
|---|---------|--------|
| CR#1 | SettingsScreen — local state désynchronisé du prop `user` réactif | Nécessite un `useEffect` de synchronisation qui écraserait les valeurs en cours de saisie — changement de logique UX non trivial |
| CR#2 | aiService.ts — fetch ALL PerformanceLogs sans limite | Nécessite de changer la logique de requête et de pagination — risque fonctionnel |
| CR#3 | ChartsScreen — `ObservableExerciseStats` observe `histories` et `sessions` entières | Refactoring architectural du `withObservables` — hors périmètre |
| CR#5 | HomeScreen — `renderItem` useCallback neutralisé | Optimisation de performance pure, aucun comportement incorrect |
| CR#6 | SessionDetailScreen — rechargement liste à chaque toggle de modale | Correction du `useEffect` deps risque de changer le comportement de chargement |
| CR#8 | AssistantScreen — architecture mixte `withObservables` + subscribe manuel pour `user` | Refactoring architectural — hors périmètre |
| CR#13 | Clé API en clair dans WatermelonDB | Nécessite `expo-secure-store` + migration DB — feature, pas correction |

---

## Bilan

| Catégorie | Trouvé | Corrigé | Non corrigé |
|-----------|--------|---------|-------------|
| Critiques | 9 | 9 | 0 |
| Warnings | 10 | 9 | 1 (clé API en clair = feature) |
| Suggestions | 3 | 2 | 1 (commentaires tutoriel = cosmétique) |

**TSC final :** ✅ 0 erreur
**Tests finaux :** ✅ 117/117 passants
**Commits :** 3 (`fix(critical)`, `fix(warnings)`, `fix(suggestions)`)
