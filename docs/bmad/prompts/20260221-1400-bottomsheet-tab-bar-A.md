<!-- v1.0 — 2026-02-21 -->
# Rapport — bottomsheet-tab-bar — Groupe A — 20260221-1400

## Objectif
Empêcher la tab bar de disparaître quand une BottomSheet s'ouvre.
Actuellement, la séquence est :
1. BottomSheet s'ouvre → `HIDE_TAB_BAR` → tab bar se cache
2. User sélectionne une option → BottomSheet se ferme → `SHOW_TAB_BAR` → tab bar réapparaît → action

La BottomSheet utilise `<Portal>` (gorhom/portal). Le `PortalProvider` est à la racine dans `navigation/index.tsx`, AVANT `NavigationContainer` — donc le Portal rend déjà la BottomSheet AU-DESSUS de la tab bar en termes de z-order (zIndex: 999 dans les styles de BottomSheet). Il est donc inutile de cacher la tab bar.

**But :** retirer les états BottomSheet de `useMultiModalSync` dans les écrans concernés + optionnellement ajouter un param `hideTabBar` au hook pour la doc.

## Fichiers concernés
1. `mobile/src/screens/HomeScreen.tsx`
2. `mobile/src/screens/ExercisesScreen.tsx`
3. `mobile/src/hooks/useModalState.ts` (optionnel : ajouter `hideTabBar` param pour sémantique)

## Contexte technique

### Architecture Portal (important)
```
<PortalProvider>              ← ROOT — portals se rendent ici, AU-DESSUS de tout
  <NavigationContainer>
    <Stack.Navigator>
      <TabNavigator>          ← tab bar vit ici
        <HomeScreen>
          <BottomSheet>       ← via <Portal>, se rend dans PortalProvider (au-dessus de la tab bar)
```

La `BottomSheet` a déjà `zIndex: 999` dans son container. Le Portal + PortalProvider root garantit que la BottomSheet est visuellement au-dessus de la tab bar SANS qu'on ait besoin de la cacher.

### Cause du bug
Dans `HomeScreen.tsx` (ligne ~86) :
```ts
useMultiModalSync([
  // ... inclut des états de BottomSheet ...
])
```
Et dans `ExercisesScreen.tsx` (ligne 56) :
```ts
useMultiModalSync([isAddModalVisible, isOptionsVisible, isEditModalVisible, isAlertVisible])
//                                    ^^ isOptionsVisible = BottomSheet — à retirer
```

Chaque fois qu'un état dans le tableau passe à `true`, `useMultiModalSync` émet `HIDE_TAB_BAR`. Pour les BottomSheets, c'est inutile.

### Pattern `useMultiModalSync` (rappel)
```ts
// mobile/src/hooks/useModalState.ts
export function useMultiModalSync(modalStates: boolean[]) {
  // Si ANY state est true → HIDE_TAB_BAR
  // Sinon → SHOW_TAB_BAR
}
```

## Étapes

### Étape 1 — Lire HomeScreen.tsx pour identifier les états BottomSheet
Chercher l'appel `useMultiModalSync([...])` et identifier quels états correspondent à des `<BottomSheet>` vs `<AlertDialog>`.
- Les `<BottomSheet>` → retirer du tableau
- Les `<AlertDialog>` → garder dans le tableau (AlertDialog est fullscreen, cacher la tab bar a du sens)

### Étape 2 — Modifier HomeScreen.tsx
Retirer les états BottomSheet de l'appel `useMultiModalSync`. Si TOUS les états restants sont pour des AlertDialogs, l'appel peut être réduit à juste ces états.

Si HomeScreen a un `ProgramDetailBottomSheet` ou des BottomSheets pour "options", leurs états booléens doivent être RETIRÉS du `useMultiModalSync`.

### Étape 3 — Modifier ExercisesScreen.tsx
Ligne 56 actuelle :
```ts
useMultiModalSync([isAddModalVisible, isOptionsVisible, isEditModalVisible, isAlertVisible])
```
`isOptionsVisible` contrôle le `<BottomSheet>` visible ligne 225. Le retirer :
```ts
useMultiModalSync([isAddModalVisible, isEditModalVisible, isAlertVisible])
```
Vérifier si `isAddModalVisible` et `isEditModalVisible` sont des BottomSheets ou des plein-écran. Si BottomSheet → les retirer aussi.

### Étape 4 — (Optionnel, amélioration DX) Modifier useModalState.ts
Ajouter un param `hideTabBar = true` pour expliciter l'intention :
```ts
export function useModalState(initialState = false, hideTabBar = true) {
  useEffect(() => {
    if (hideTabBar) {
      DeviceEventEmitter.emit(isOpen ? 'HIDE_TAB_BAR' : 'SHOW_TAB_BAR')
    }
  }, [isOpen, hideTabBar])
  // ...
}

export function useMultiModalSync(modalStates: boolean[], hideTabBar = true) {
  useEffect(() => {
    if (!hideTabBar) return
    const anyModalOpen = modalStates.some(state => state)
    DeviceEventEmitter.emit(anyModalOpen ? 'HIDE_TAB_BAR' : 'SHOW_TAB_BAR')
  }, [modalStatesKey, hideTabBar])
}
```
**Cette étape est optionnelle** — la correction principale est dans les étapes 2 et 3.

### Étape 5 — Vérification visuelle mentale
Après fix, la séquence devrait être :
1. BottomSheet s'ouvre → tab bar reste visible (Portal la met au-dessus)
2. User sélectionne option → BottomSheet se ferme → action s'exécute immédiatement (pas d'animation de tab bar)

## Contraintes
- Ne pas casser : `AlertDialog` (doit toujours cacher la tab bar — c'est un overlay fullscreen)
- Ne pas casser : le comportement du clavier (Keyboard show/hide reste indépendant et n'est pas touché)
- Ne pas casser : les screens qui n'ont PAS de BottomSheet (ChartsScreen, WorkoutScreen, etc.)
- Respecter : patterns CLAUDE.md — pas de native Modal, pas de hardcoded colors
- Respecter : TypeScript strict, pas de `any`
- Le `PortalProvider` dans `navigation/index.tsx` ne doit PAS être déplacé (il est bien à la racine)

## Critères de validation
- `npx tsc --noEmit` → zéro erreur (depuis `mobile/`)
- `npm test` → zéro fail (depuis `mobile/`)
- Comportement attendu :
  - Ouvrir une BottomSheet → tab bar reste visible et la BottomSheet est par-dessus
  - Sélectionner une option → action immédiate sans flash de tab bar
  - Ouvrir un AlertDialog → tab bar se cache toujours (comportement inchangé)

## Dépendances
Aucune dépendance externe — groupe unique.

## Statut
⏳ En attente
