# style(WorkoutExerciseCard) — bouton "Ajouter une note" visible
Date : 2026-02-27 12:00

## Instruction
docs/bmad/prompts/20260227-1200-note-visible-A.md

## Rapport source
docs/bmad/prompts/20260227-1200-note-visible-A.md

## Classification
Type : style
Fichiers modifiés :
- mobile/src/components/WorkoutExerciseCard.tsx

## Ce qui a été fait

### JSX (ligne ~274-277)
Remplacé le `TouchableOpacity` nu par un chip styled :
- Ajout `style={styles.addNoteButton}` et `activeOpacity={0.7}` sur le `TouchableOpacity`
- Ajout icône `<Ionicons name="create-outline" size={12} color={colors.primary} />`
- Texte changé de `+ Ajouter une note` → `Ajouter une note` (l'icône joue le rôle du +)

### Styles (ligne ~392)
Ajout du style `addNoteButton` :
- `flexDirection: 'row'`, `alignItems: 'center'`, `gap: spacing.xs`
- `alignSelf: 'flex-start'`
- `paddingVertical: 4`, `paddingHorizontal: spacing.sm`
- `borderRadius: borderRadius.sm`, `borderWidth: 1`
- `borderColor: colors.primary + '40'` (bordure primary à 25% d'opacité)

Modifié le style `addNoteLink` :
- `color: colors.textSecondary` → `colors.primary`
- Ajout `fontWeight: '500'`
- Suppression `marginBottom` (déplacé sur `addNoteButton`)

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 1260 passed (7 échecs préexistants ExercisePickerModal — hors scope)
- Nouveau test créé : non (changement visuel pur)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260227-1200

## Commit
[à remplir]
