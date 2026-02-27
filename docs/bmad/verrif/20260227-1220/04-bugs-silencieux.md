# Passe 4 — Bugs silencieux — 20260227-1220

## 12 problèmes (2🔴 5🟡 5🔵)

### 🔴 CRITIQUES

#### B1 — handleSaveNote: async sans try/catch sur onBlur
**Fichier:** `mobile/src/components/WorkoutExerciseCard.tsx:262`
```tsx
<TextInput onBlur={handleSaveNote} />  // async, pas de try/catch
```
Si database.write() échoue, l'UI et la DB seront désynchronisées sans feedback.

#### B2 — RestTimer: sound.playAsync() peut rejeter après démontage
**Fichier:** `mobile/src/components/RestTimer.tsx:128-133`
```tsx
createBeepSound().then(sound => { return sound.playAsync() }).catch(...)
```
Si le composant est démonté pendant `createBeepSound()`, `sound.playAsync()` s'exécute
sur un composant mort. Le catch existe mais ne prévient pas le crash potentiel.

### 🟡 HAUTS

#### B3 — WorkoutScreen: setupNotification sans retry
**Fichier:** `mobile/src/screens/WorkoutScreen.tsx:172-178`
Echec silencieux (log __DEV__ seulement), pas de retry, pas de feedback utilisateur.

#### B4 — handleConfirmEnd: gestion d'erreurs fragmentée
**Fichier:** `mobile/src/screens/WorkoutScreen.tsx:202-333`
Multiples opérations async avec try/catch séparés. Si database.write() à la ligne 281
échoue à mi-chemin, état partiellement corrompu possible.

#### B5 — validateSet/unvalidateSet: échec DB invisible pour l'user
**Fichier:** `mobile/src/hooks/useWorkoutState.ts:103-154`
```tsx
} catch (error) {
  if (__DEV__) console.error(...)  // log dev seulement
  return false
}
```
L'utilisateur ne sait pas que la sauvegarde a échoué.

#### B6 — handleAdd: onAdd sans try/catch
**Fichier:** `mobile/src/components/ExercisePickerModal.tsx:101-106`
```tsx
await onAdd(selectedExerciseId, ...) // non gardé
```
Si onAdd throw, l'état modal n'est pas réinitialisé.

#### B7 — SessionDetailScreen: handlers async non gardés
**Fichier:** `mobile/src/screens/SessionDetailScreen.tsx:72-87`
`handleAddExercise` et `handleUpdateTargets` attendent des async ops sans try/catch global.

### 🔵 MODÉRÉS

#### B8 — useWorkoutState: catch vérifie pas `cancelled`
**Fichier:** `mobile/src/hooks/useWorkoutState.ts:64-70`
Le flag `cancelled` est dans le `.then()` mais pas dans le `.catch()`.

#### B9 — RestTimer: notification sans fallback UX
**Fichier:** `mobile/src/components/RestTimer.tsx:55-59`
Echec silencieux, utilisateur ne sait pas qu'il n'aura pas de notification.

#### B10 — RestTimer: progress animation jamais stoppée
Identique à C1 code review.

#### B11 — Debounce race condition au démontage
**Fichier:** `mobile/src/components/WorkoutExerciseCard.tsx:60-110`
Edge case: flush manuel lors du démontage peut théoriquement race avec cleanup.

#### B12 — Null safety: propriétés lastPerformance potentiellement undefined
**Fichier:** `mobile/src/screens/WorkoutScreen.tsx:288-291`
Gardé par `lastPerformance &&` mais propriétés internes non vérifiées.
