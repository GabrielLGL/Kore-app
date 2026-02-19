# style(workout) — Redesign UI WorkoutSummarySheet
Date : 2026-02-19 18:50

## Instruction
Redesign UI de WorkoutSummarySheet dans le projet WEGOGYM (React Native + Expo 52 + Fabric, dark mode only).

## Classification
Type : style
Fichiers : mobile/src/components/WorkoutSummarySheet.tsx

## Ce qui a été fait
1. **Sous-titre conditionnel** : Ajout d'un message de célébration après `<BottomSheet>` :
   - `totalPrs > 0` → "🏅 Nouveau record personnel !" en `colors.primary`
   - `totalSets > 0` → "💪 Beau travail !" en `colors.success`
2. **StatBlock emojis** : Ajout du prop `emoji` et affichage avant la valeur (⏱ Durée, 🏋️ Volume, ✅ Séries, 🏆 Records). Taille `statValue` passée de `fontSize.xxl` → `fontSize.xxxl`
3. **Séparateur** : `<View style={styles.separator} />` entre la grille et la note (`height: 1, backgroundColor: colors.separator, marginVertical: spacing.md`)
4. **Label note** : `<Text style={styles.noteLabel}>Note de séance</Text>` au-dessus du TextInput (`colors.textSecondary, fontSize.xs, marginBottom xs`)
5. **TextInput** : `borderWidth: 1, borderColor: colors.separator` + placeholder "Ressenti, conditions, progrès..."
6. **Bouton** : "Fermer" → "Terminer"
7. Logique debounce (500ms) et flush au `onClose` inchangée.

## Vérification
- TypeScript : ✅ 0 erreurs (`npx tsc --noEmit`)
- Tests : ✅ non cassés
- Nouveau test créé : non (style uniquement)

## Commit
ed74808 style(workout): redesign summary sheet with celebratory message, stat icons, and improved note input
