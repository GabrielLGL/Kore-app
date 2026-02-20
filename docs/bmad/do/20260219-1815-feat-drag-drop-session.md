# FEAT(session) — Drag-and-drop reordering for exercises
Date : 2026-02-19 18:15

## Instruction
Dans mobile/src/screens/SessionDetailScreen.tsx, remplacer le FlatList des exercices par DraggableFlatList de react-native-draggable-flatlist pour permettre le drag-and-drop.

## Classification
Type : feat
Fichiers modifiés : mobile/App.tsx, mobile/src/screens/SessionDetailScreen.tsx

## Ce qui a été fait

### Découvertes (déjà implémentés)
- `react-native-draggable-flatlist@4.0.3` : déjà installé dans package.json
- `reorderExercises()` dans useSessionManager.ts : déjà implémenté et exporté
- Props `drag` et `dragActive` dans SessionExerciseItem : déjà présentes avec drag handle visuel (3 barres)

### Modifications apportées
1. **mobile/App.tsx** : ajout de `GestureHandlerRootView` (requis par DraggableFlatList v4 avec gesture-handler v2+), wrapping de `AppNavigator`
2. **mobile/src/screens/SessionDetailScreen.tsx** :
   - Suppression de `FlatList` de l'import react-native
   - Ajout de `import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'`
   - Destructuration de `reorderExercises` depuis `useSessionManager`
   - Remplacement de `<FlatList>` par `<DraggableFlatList>` avec `renderItem={({ item, drag, isActive }) => ...}`, `onDragEnd={({ data }) => reorderExercises(data)}`
   - Conservation de tous les props existants (contentContainerStyle, ListEmptyComponent, keyExtractor)

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 44 passed (SessionDetail, SessionExercise, useSessionManager)
- Nouveau test créé : non (logique couverte par les tests existants du hook)

## Commit
224cc29 feat(session): add drag-and-drop reordering for exercises
