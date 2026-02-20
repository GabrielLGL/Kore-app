# Prompt analysé — drag-drop-session-exercises — 2026-02-19 18:10

## Demande originale
dans la seance on doit pouvoir drag and drop les exercices pour les changer d'ordre

## Analyse

### Contexte technique (découvert par exploration)
- **Bibliothèque DnD déjà installée** : `react-native-draggable-flatlist@4.0.3` (+ reanimated ~3.16.1 + gesture-handler ~2.20.2)
- **Écran cible** : `mobile/src/screens/SessionDetailScreen.tsx` — utilise un `FlatList` pour afficher les exercices
- **Composant item** : `mobile/src/components/SessionExerciseItem.tsx` — doit recevoir un drag handle
- **Hook de données** : `mobile/src/hooks/useSessionManager.ts` — gère les mutations WatermelonDB
- **Model** : `mobile/src/model/models/SessionExercise.ts` — field `position!: number` déjà présent
- **Tri existant** : exercices déjà fetchés avec `Q.sortBy('position', Q.asc)`
- **Contraintes CLAUDE.md** : mutations WatermelonDB MUST être dans `database.write()`, haptics via `useHaptics()`, pas de `any` TypeScript

### Plan d'action
1. **useSessionManager.ts** — ajouter `reorderExercises(items: SessionExercise[])` qui écrit les nouvelles positions en batch
2. **SessionExerciseItem.tsx** — ajouter un drag handle (icône 3 barres) visible uniquement en mode édition, avec le type `RenderItemParams` de DraggableFlatList
3. **SessionDetailScreen.tsx** — remplacer `FlatList` par `DraggableFlatList`, passer `onDragEnd` au hook

## Commandes générées

| Groupe | Fichiers | Parallèle | Description |
|--------|----------|-----------|-------------|
| A | useSessionManager.ts | avec B | Ajouter reorderExercises() |
| B | SessionExerciseItem.tsx | avec A | Ajouter drag handle |
| C | SessionDetailScreen.tsx | après A+B | Remplacer FlatList par DraggableFlatList |

---

## /do complets

### Vague 1 — PARALLÈLE

**Groupe A :**
```
/do Dans mobile/src/hooks/useSessionManager.ts, ajouter une fonction reorderExercises(items: SessionExercise[]) qui met à jour le champ position de chaque SessionExercise selon l'ordre du tableau reçu. Règles strictes : (1) toute mutation WatermelonDB DOIT être dans database.write() et utiliser database.batch() pour grouper les updates — voir pattern existant dans le hook, (2) chaque item.prepareUpdate(se => { se.position = index }) pour i de 0 à items.length-1, (3) importer database depuis mobile/src/model/index.ts si pas encore importé, (4) typer correctement avec SessionExercise depuis mobile/src/model/models/SessionExercise.ts, (5) pas de any TypeScript. Exporter la fonction depuis le hook. Vérifier avec npx tsc --noEmit depuis mobile/.
```

**Groupe B :**
```
/do Dans mobile/src/components/SessionExerciseItem.tsx, adapter le composant pour supporter le drag-and-drop avec react-native-draggable-flatlist. Étapes : (1) Ajouter une prop drag?: () => void et dragActive?: boolean à l'interface Props existante (les deux optionnelles pour ne pas casser les usages actuels), (2) Ajouter un drag handle visuel à gauche de l'item : une icône "menu" (3 barres horizontales) de couleur colors.textMuted (ou colors.border si textMuted n'existe pas), TouchableOpacity avec onPressIn={drag} — NE PAS utiliser onPress car DraggableFlatList requiert onPressIn/onLongPress pour démarrer le drag, (3) Si dragActive est true, appliquer un style visuel léger sur le container (ex: backgroundColor légèrement plus clair), (4) Importer les couleurs depuis mobile/src/theme/index.ts — utiliser uniquement des couleurs existantes dans colors.*, jamais de valeurs hardcodées, (5) Ne pas casser les props existantes (exerciseName, muscles, equipment, sets, reps, weight, onEdit, onDelete). Vérifier avec npx tsc --noEmit depuis mobile/.
```

### Vague 2 — APRÈS Vague 1

**Groupe C :**
```
/do Dans mobile/src/screens/SessionDetailScreen.tsx, remplacer le FlatList des exercices par DraggableFlatList de react-native-draggable-flatlist pour permettre le drag-and-drop. Étapes : (1) Importer DraggableFlatList et RenderItemParams depuis 'react-native-draggable-flatlist', (2) Importer reorderExercises depuis mobile/src/hooks/useSessionManager.ts (déstructurer depuis le hook comme les autres fonctions), (3) Remplacer le <FlatList> des session exercises par <DraggableFlatList data={exercises} keyExtractor={item => item.id} renderItem={({ item, drag, isActive }) => <SessionExerciseItem ... drag={drag} dragActive={isActive} />} onDragEnd={({ data }) => reorderExercises(data)} />, (4) Le type de data est SessionExercise[] — typer correctement, pas de any, (5) Conserver tous les autres props du FlatList existant (ListHeaderComponent, ListEmptyComponent, contentContainerStyle, etc.), (6) NE PAS envelopper dans un ScrollView si un ScrollView externe existe déjà (DraggableFlatList gère son propre scroll), (7) Utiliser les haptics existants si disponible : haptics.onSelect() au début du drag si onDragBegin est supporté. Vérifier avec npx tsc --noEmit depuis mobile/. Commit : feat(session): add drag-and-drop reordering for exercises
```
