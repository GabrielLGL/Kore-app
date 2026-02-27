<!-- v1.0 — 2026-02-27 -->
# Rapport — fix(ExerciseTargetInputs) — Option C : setNativeProps — Groupe A — 20260227-0315

## Objectif

Corriger définitivement la perte de caractères lors de la frappe rapide dans tous les champs
de `ExerciseTargetInputs` (séries, reps, poids), en particulier le champ **reps**.

## Contexte du bug

**Option A (defaultValue) est déjà en place** — mais le bug persiste.

**Cause racine confirmée :**
`defaultValue` est passé avec une VALEUR CHANGEANTE à chaque re-render :
- `defaultValue={sets}` → sets change via setTargetSets à chaque frappe → re-render parent → React Native voit `defaultValue` changer → re-applique la valeur native → perte de caractères
- `defaultValue={repsMinRef.current}` → idem : ref mise à jour avant re-render → `defaultValue` change → même problème

Avec `value=`, React Native force le texte natif à chaque render.
Avec `defaultValue=` **changeant**, certaines versions de React Native re-appliquent la valeur initiale quand la prop change.
**La seule solution fiable** : aucun prop `value` ni `defaultValue` sur le TextInput + `setNativeProps({ text })` UNE SEULE FOIS au mount.

## Fichiers concernés

- `mobile/src/components/ExerciseTargetInputs.tsx` (seul fichier à modifier)
- `mobile/src/components/__tests__/ExerciseTargetInputs.test.tsx` (adapter les tests si nécessaire)

## Contraintes

- Respecter CLAUDE.md : pas de `<Modal>` natif, pas de `any`, couleurs via `useColors()`
- Ne PAS modifier `useSessionManager.ts`, `ExercisePickerModal.tsx` (le clamp y est déjà)
- Conserver le toggle Fixe/Plage et la composition des ranges "N-M"
- Les `testID` restent identiques : `input-sets`, `input-weight`, `input-reps`, `input-reps-min`, `input-reps-max`

## Étapes

### 1. Importer le type TextInput React Native pour les refs

```tsx
import { View, Text, TextInput as RNTextInput, TouchableOpacity, StyleSheet } from 'react-native'
```
> On renomme l'import pour avoir un type distinct du composant JSX si besoin.

### 2. Ajouter des refs sur chaque TextInput

Ajouter APRÈS les refs `repsMinRef` / `repsMaxRef` existants :

```tsx
const setsInputRef = useRef<RNTextInput>(null)
const weightInputRef = useRef<RNTextInput>(null)
const repsFixedInputRef = useRef<RNTextInput>(null)
const repsMinInputRef = useRef<RNTextInput>(null)
const repsMaxInputRef = useRef<RNTextInput>(null)
```

### 3. useEffect pour initialiser les TextInputs fixes (sets + weight) au mount

```tsx
useEffect(() => {
  if (sets) setsInputRef.current?.setNativeProps({ text: sets })
  if (weight) weightInputRef.current?.setNativeProps({ text: weight })
}, []) // mount seulement — les deps vides sont intentionnelles
```

### 4. useEffect pour initialiser le TextInput reps fixed au mount

```tsx
useEffect(() => {
  if (repsMinRef.current) repsFixedInputRef.current?.setNativeProps({ text: repsMinRef.current })
}, []) // mount seulement
```

OU combiner avec le useEffect précédent (un seul useEffect de mount) :

```tsx
useEffect(() => {
  if (sets) setsInputRef.current?.setNativeProps({ text: sets })
  if (weight) weightInputRef.current?.setNativeProps({ text: weight })
  if (repsMinRef.current) repsFixedInputRef.current?.setNativeProps({ text: repsMinRef.current })
}, [])
```

### 5. useEffect pour les inputs range — se déclenche quand on passe en mode Plage

Quand l'utilisateur appuie sur "Plage", les deux inputs reps-min et reps-max montent.
Il faut initialiser leur valeur native :

```tsx
useEffect(() => {
  if (repsMode === 'range') {
    if (repsMinRef.current) repsMinInputRef.current?.setNativeProps({ text: repsMinRef.current })
    if (repsMaxRef.current) repsMaxInputRef.current?.setNativeProps({ text: repsMaxRef.current })
  }
}, [repsMode]) // se déclenche quand repsMode change (mount range inputs)
```

### 6. Supprimer `defaultValue` de tous les TextInputs — ajouter `ref`

**TextInput Séries :**
```tsx
<TextInput
  ref={setsInputRef}
  testID="input-sets"
  style={styles.input}
  keyboardType="numeric"
  // PAS de value, PAS de defaultValue
  onChangeText={handleSetsChange}
  placeholder="0"
  placeholderTextColor={colors.placeholder}
  autoFocus={autoFocus}
/>
```

**TextInput Poids :**
```tsx
<TextInput
  ref={weightInputRef}
  testID="input-weight"
  style={styles.input}
  keyboardType="numeric"
  // PAS de value, PAS de defaultValue
  onChangeText={handleWeightChange}
  placeholder="0"
  placeholderTextColor={colors.placeholder}
/>
```

**TextInput Reps (mode fixe) :**
```tsx
<TextInput
  ref={repsFixedInputRef}
  testID="input-reps"
  style={styles.input}
  keyboardType="numeric"
  // PAS de value, PAS de defaultValue
  onChangeText={handleRepsMinChange}
  placeholder="0"
  placeholderTextColor={colors.placeholder}
/>
```

**TextInput Reps min (mode plage) :**
```tsx
<TextInput
  ref={repsMinInputRef}
  testID="input-reps-min"
  style={[styles.input, styles.repsRangeInput]}
  keyboardType="numeric"
  // PAS de value, PAS de defaultValue
  onChangeText={handleRepsMinChange}
  placeholder="min"
  placeholderTextColor={colors.placeholder}
/>
```

**TextInput Reps max (mode plage) :**
```tsx
<TextInput
  ref={repsMaxInputRef}
  testID="input-reps-max"
  style={[styles.input, styles.repsRangeInput]}
  keyboardType="numeric"
  // PAS de value, PAS de defaultValue
  onChangeText={handleRepsMaxChange}
  placeholder="max"
  placeholderTextColor={colors.placeholder}
/>
```

### 7. Adapter les tests

Les tests utilisent maintenant `getByTestId` (déjà en place depuis Option A).
Avec `setNativeProps` dans des `useEffect`, les `defaultValue` ne sont plus présents.

**Tests à adapter :**
- `affiche les valeurs initiales dans les inputs` : au lieu de `props.defaultValue`, utiliser `fireEvent.changeText` pour vérifier que les handlers fonctionnent. OU mocker `setNativeProps` et vérifier qu'il est appelé avec la bonne valeur. La méthode la plus simple : vérifier les callbacks et la présence des inputs, pas les valeurs initiales.

**Alternative simple pour le test de rendu initial :**
```tsx
it('affiche les inputs avec les bons testIDs', () => {
  const { getByTestId } = render(<ExerciseTargetInputs {...defaultProps} />)
  expect(getByTestId('input-sets')).toBeTruthy()
  expect(getByTestId('input-reps')).toBeTruthy()
  expect(getByTestId('input-weight')).toBeTruthy()
})
```

Les tests d'interactions (`fireEvent.changeText`) restent inchangés — ils testent les callbacks, pas la valeur affichée.

## Critères de validation

```bash
cd mobile
npx tsc --noEmit                                            # 0 erreur
npm test -- --testPathPattern="ExerciseTargetInputs" --no-coverage   # tous verts
npm test -- --testPathPattern="useSessionManager" --no-coverage      # tous verts
```

Test manuel : taper "555555" vite dans TOUS les champs → aucun caractère perdu ✓

## Dépendances

Aucune dépendance entre groupes — ce groupe est autonome.

## Statut

✅ Résolu — 20260227-0320

## Résolution
Rapport do : docs/bmad/do/20260227-0320-fix-ExerciseTargetInputs-nativeprops.md
