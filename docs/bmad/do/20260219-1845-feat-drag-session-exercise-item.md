# feat(session) — Drag-and-drop support in SessionExerciseItem
Date : 2026-02-19 18:45

## Instruction
Adapter SessionExerciseItem pour supporter le drag-and-drop avec react-native-draggable-flatlist :
- Ajouter props `drag?` et `dragActive?` à l'interface
- Ajouter un drag handle visuel (3 barres horizontales) à gauche, TouchableOpacity avec `onPressIn={drag}`
- Appliquer `colors.cardSecondary` comme background quand `dragActive` est true
- Utiliser uniquement des couleurs existantes (`colors.*`)

## Classification
Type : feat
Fichiers : mobile/src/components/SessionExerciseItem.tsx

## Ce qui a été fait
- Ajout de `drag?: () => void` et `dragActive?: boolean` dans `SessionExerciseItemProps`
- Ces props sont propagées via `EnhancedProps extends SessionExerciseItemProps`
- Ajout d'un drag handle conditionnel (`{drag && <TouchableOpacity onPressIn={drag}>`)
  avec 3 barres `<View style={styles.dragBar} />` en `colors.border`
- Style `itemContainerDragging` : `backgroundColor: colors.cardSecondary` appliqué si `dragActive`
- Aucune prop existante cassée (les deux nouvelles props sont optionnelles)

## Vérification
- TypeScript : ✅ (npx tsc --noEmit — zéro erreur)
- Tests : ✅ (aucun test cassé)
- Nouveau test créé : non (changement UI pur, pas de logique métier)

## Commit
d5af43b feat(session): add drag-and-drop support to SessionExerciseItem
