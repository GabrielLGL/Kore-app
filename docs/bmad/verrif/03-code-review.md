# Code Review — 2026-02-20 (v3)

## Résultat : 18 problèmes trouvés (7 critiques · 8 warnings · 3 suggestions)

---

### 🔴 Critiques

| # | Fichier | Ligne | Problème | Impact |
|---|---------|-------|----------|--------|
| 1 | `hooks/useProgramManager.ts` | 85, 104, 124, 160, 207, 224, 253 | `console.error(...)` sans guard `__DEV__` dans **7 blocs `catch`**. Violation directe de CLAUDE.md Known Pitfall. Tous les autres fichiers du projet utilisent `if (__DEV__)`. | Logs sensibles exposés en production (noms de tables DB, stack traces internes) |
| 2 | `screens/AssistantScreen.tsx` | 338 | `handleResetRequest` (reset soft ≤ 2 steps) initialise `{ equipment: [], musclesFocus: [] }` — il manque `muscleGroups: []`. `handleReset` (l.327) et `handleModify` (l.350) l'incluent. | Si l'utilisateur a sélectionné mode "séance" + muscles puis recommence en mode "programme", `muscleGroups` persiste silencieusement → plan généré corrompu par des muscles non désirés |
| 3 | `model/utils/databaseHelpers.ts` | 304–308 | `getLastPerformanceForExercise` fait **N requêtes DB individuelles** : `Promise.all(historyIds.map(id => db.find(id)))`. Appelé par `WorkoutExerciseCard` via `from(Promise)` pour chaque exercice de la séance. | 5 exercices × 10 histoires = 50 requêtes au lieu de 1 `Q.oneOf`. Ralentit le chargement de `WorkoutScreen`. |
| 4 | `model/utils/databaseHelpers.ts` | 204–213 | `getMaxWeightForExercise` fetch tous les sets en mémoire puis `Math.max(...sets.map(s => s.weight))`. Le **spread sur tableau illimité** peut lever `RangeError: Maximum call stack size exceeded`. De plus, la requête ramène tous les poids au lieu d'un seul. | Crash potentiel pour utilisateurs avancés. Perf dégradée même sans crash. |
| 5 | `hooks/useProgramManager.ts` | 172–181 | `duplicateSession` fetch `parent = await selectedSession.program.fetch()` — si `parent` est `null`, la session est créée **sans programme parent** (orpheline en DB). Aucun `throw`, `if (onSuccess)` s'exécute, l'UI affiche un succès. | Corruption silencieuse de données : session orpheline invisible et non supprimable via l'UI |
| 6 | `screens/SettingsScreen.tsx` | 60–72 | Les clés API (Claude, OpenAI, Gemini) sont stockées en clair dans WatermelonDB SQLite (`u.aiApiKey = key.trim()`). SQLite Android n'est pas chiffré par défaut. | Clés extractables par root, ADB backup non chiffré, ou outil forensique. Nécessite `expo-secure-store` (Android Keystore / iOS Keychain). |
| 7 | `model/models/Program.ts` | 22–57 | `duplicate()` fait **N `create()` séquentiels** dans `write()` (1 Program + M Sessions + M×K SessionExercises). WatermelonDB recommande `database.batch()` pour les writes multiples. Pour un programme de 5 séances × 10 exercices = 51 writes individuels dans une transaction. | Duplication lente visible par l'utilisateur, risque de timeout sur les grands programmes |

---

### 🟡 Warnings

| # | Fichier | Ligne | Problème | Impact |
|---|---------|-------|----------|--------|
| 8 | `components/WorkoutExerciseCard.tsx` | 202–216 | `lastPerformance` est un observable créé avec `from(Promise)`. Un Promise converti en observable émet **une seule fois** puis se complète. Si les données changent (autre séance ouverte), la carte ne se met pas à jour. | Données de performance potentiellement obsolètes pendant la séance |
| 9 | `hooks/useWorkoutState.ts` | 42–117 | `updateSetInput`, `validateSet`, `unvalidateSet` sont des fonctions plain (non `useCallback`). Passées comme props à chaque `WorkoutExerciseCard`, elles sont recréées à chaque state change. | Re-renders de **toutes** les cartes d'exercice à chaque frappe clavier dans n'importe quel input |
| 10 | `screens/AssistantScreen.tsx` | 623 | `programs: database.get('programs').query().observe()` — **pas de `Q.sortBy('position')`**. HomeScreen le fait (l.453), AssistantScreen non. | Ordre aléatoire des programmes dans l'étape "Dans quel programme ?" → UX incohérente et confuse |
| 11 | `services/ai/aiService.ts` | 112–117 | Fallback silencieux sur `offlineEngine` : toutes les erreurs cloud sont avalées. L'utilisateur voit un plan généré mais **ignore que son provider payant a échoué**. Seul un `console.warn(__DEV__)` est émis. | Mauvaise UX : clé API invalide = plan offline sans avertissement. Budget API potentiellement consommé. |
| 12 | `screens/ExercisesScreen.tsx` | 20–22 | `UIManager.setLayoutAnimationEnabledExperimental(true)` est appelé mais `LayoutAnimation` n'est jamais utilisé dans ce fichier. Code mort. | Activation inutile d'une feature expérimentale Android, couplage fragile |
| 13 | `screens/HomeScreen.tsx` | 183, 389 | `renderItem` passe `sessions={[]}` (tableau littéral recréé à chaque render) à `ProgramSection`. De plus, `shadowColor: '#000'` est une couleur hardcodée — violation CLAUDE.md Known Pitfall "No hardcoded colors". | Re-renders inutiles + règle projet violée |
| 14 | `screens/WorkoutScreen.tsx` | 97–104 | `createWorkoutHistory` est appelé dans un `useEffect` sans cleanup. Si le composant est **démonté avant la résolution** (navigation rapide), la History est créée en DB mais jamais complétée ni supprimée. | Entrées orphelines dans la table `histories` qui faussent les stats |
| 15 | `screens/ExercisesScreen.tsx` | 177–202 | `FlatList` sans `getItemLayout`, `windowSize`, `maxToRenderPerBatch` ni `removeClippedSubviews`. Items à hauteur fixe sans optimisation. | Scroll saccadé et mesures inutiles avec 100+ exercices |

---

### 🔵 Suggestions

| # | Fichier | Ligne | Problème | Suggestion |
|---|---------|-------|----------|------------|
| 16 | `components/WorkoutExerciseCard.tsx` | 181–193 | `onValidate`/`onUnvalidate` : fonctions async inline dans `.map()`, recréées à chaque render. `validateSetInput` appelée deux fois (l.80 + l.182). | Extraire en `useCallback`, mémoïser `WorkoutSetRow` avec `React.memo`, supprimer validation dupliquée |
| 17 | `screens/HomeScreen.tsx` | 204–215 | `onDragEnd` est une fonction async définie **inline dans le JSX** du `DraggableFlatList`, recréée à chaque render, avec `database.write()` non protégé contre double-fire. | Extraire dans un `useCallback` dans le composant ou dans `useProgramManager` |
| 18 | `screens/ExercisesScreen.tsx` | 30, 86–97 | State `keyboardVisible` + 2 listeners `Keyboard.addListener` dupliquent `useKeyboardAnimation`. Double gestion du clavier dans le même composant. | Exposer un booléen `isVisible` depuis `useKeyboardAnimation` pour supprimer la duplication |

---

## Détails des critiques

### #1 — console.error sans `__DEV__` (useProgramManager)

```ts
// Exemple — se répète 7 fois dans le fichier (lignes 85, 104, 124, 160, 207, 224, 253)
} catch (error) {
  console.error('Failed to save program:', error)  // ← fuite en production
  return false
}
```

Tous les autres fichiers (HomeScreen, WorkoutScreen, databaseHelpers, etc.) utilisent `if (__DEV__) console.error(...)`. Ce hook est le seul à violer systématiquement cette règle listée dans CLAUDE.md Known Pitfalls.

---

### #2 — Reset partiel de formData (AssistantScreen)

```ts
// handleReset (l.327) — correct ✓
setFormData({ equipment: [], musclesFocus: [], muscleGroups: [] })

// handleModify (l.350) — correct ✓
setFormData({ equipment: [], musclesFocus: [], muscleGroups: [] })

// handleResetRequest (l.338) — manque muscleGroups ✗
setFormData({ equipment: [], musclesFocus: [] })
//                                             ↑ muscleGroups absent
```

**Scénario de reproduction :**
1. Sélectionner mode "séance" + groupes musculaires → avancer step 4+
2. Revenir manuellement (3× bouton retour) → `currentStep` = 1
3. Appuyer "Recommencer" → `currentStep <= 2` → reset sans alerte, sans `muscleGroups: []`
4. Repartir en mode "programme" → `muscleGroups` de la session précédente persiste

---

### #3 — N+1 queries dans `getLastPerformanceForExercise`

```ts
// Ligne 304 — N requêtes DB individuelles ✗
const histories = await Promise.all(
  historyIds.map(id => database.get<History>('histories').find(id))
)

// Correction attendue ✓ — même pattern que getExerciseStatsFromSets (l.423)
const histories = await database
  .get<History>('histories')
  .query(Q.where('id', Q.oneOf(historyIds)), Q.where('deleted_at', null))
  .fetch()
```

Appelée via `from(Promise)` dans `WorkoutExerciseCard.withObservables` pour chaque exercice au chargement. La fonction sœur `getExerciseStatsFromSets` (l.423) utilise correctement `Q.oneOf` — incohérence dans le même fichier.

---

### #4 — Spread overflow + fetch complet dans `getMaxWeightForExercise`

```ts
// Ligne 212 — spread sur tableau potentiellement illimité ✗
return Math.max(...sets.map(s => s.weight))

// Correction attendue ✓ — 1 ligne DB au lieu de N
const best = await database.get<WorkoutSet>('sets')
  .query(
    Q.where('exercise_id', exerciseId),
    Q.where('history_id', Q.notEq(excludeHistoryId)),
    Q.sortBy('weight', Q.desc),
    Q.take(1)
  ).fetch()
return best[0]?.weight ?? 0
```

---

### #5 — Session orpheline si `parent.fetch()` retourne null

```ts
// useProgramManager.ts:172–181
const parent = await selectedSession.program.fetch()  // peut retourner null
const newS = await database.get<Session>('sessions').create(s => {
  s.name = `${selectedSession.name} (Copie)`
  s.position = position
  if (parent) s.program.set(parent)  // ← si null : session sans programme
  // La création continue quand même → session orpheline confirmée
})
// Aucun throw → if (onSuccess) onSuccess() s'exécute → UI affiche succès
```

---

### #7 — Program.duplicate() — writes séquentiels vs batch

```ts
// Program.ts:22–57 — N await create() séquentiels ✗
for (const session of originalSessions) {
  const newSession = await db.get<Session>('sessions').create(...)  // write individuel
  for (const se of sessionExos) {
    await db.get<SessionExercise>('session_exercises').create(...)  // write individuel
  }
}

// Correction attendue ✓ — préparer puis batcher
const batch = [newProgram, ...newSessions, ...newSEs]
await db.batch(...batch)
```

Pour un programme de 5 séances × 8 exercices = 41 writes individuels au lieu de 1 batch. La méthode `importPresetProgram` dans `databaseHelpers.ts` fait déjà le bon pattern.

---

### #11 — Fallback offline silencieux (aiService)

```ts
// Ligne 112–117
try {
  return await provider.generate(form, context)
} catch (error) {
  if (__DEV__) console.warn('[aiService] Provider cloud échoué, fallback offline:', error)
  return await offlineEngine.generate(form, context)  // ← silencieux en prod
}
```

L'utilisateur qui a configuré Claude/OpenAI/Gemini reçoit un plan offline sans jamais savoir que son provider a échoué.
