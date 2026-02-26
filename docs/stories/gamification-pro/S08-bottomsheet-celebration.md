# S08 — BottomSheet célébration badge

## Story
**En tant que** pratiquant,
**je veux** être célébré par un BottomSheet animé quand je débloque un nouveau badge,
**afin de** vivre un moment de fierté et de motivation.

## Tâches techniques
1. Dans le composant gérant la fin de séance, après l'affichage du BottomSheet milestones (S09 gamification-base) :
   - Si `newBadges.length > 0` → afficher le BottomSheet badge
   - Sélectionner le badge le plus rare : `newBadges[newBadges.length - 1]` (dernier dans BADGES_LIST = plus rare)
2. Utiliser le composant `<BottomSheet>` existant avec :
   ```tsx
   <BottomSheet visible={badgeSheetVisible} onClose={closeBadgeSheet} title="Nouveau badge !">
     <View style={styles.celebration}>
       <Text style={styles.emoji}>{badge.emoji}</Text>
       <Text style={styles.badgeTitle}>{badge.title}</Text>
       <Text style={styles.description}>{badge.description}</Text>
       <Button variant="primary" onPress={closeBadgeSheet}>Super !</Button>
     </View>
   </BottomSheet>
   ```
3. Haptic `useHaptics().onSuccess()` à l'ouverture du BottomSheet
4. Style : emoji `fontSize: 48`, centré, titre bold, description `colors.textSecondary`
5. `npx tsc --noEmit` → 0 erreur

## Comportement
- S'affiche uniquement si `newBadges.length > 0`
- Si plusieurs badges débloqués en même temps : affiche le plus rare (index le plus élevé dans BADGES_LIST)
- S'enchaîne après le BottomSheet milestones (S09 gamification-base) si présent
- Bouton "Super !" ferme le sheet

## Critères d'acceptation
- [ ] BottomSheet badge s'affiche après une séance avec nouveau badge
- [ ] Emoji 48px visible et centré
- [ ] Titre et description du badge affichés
- [ ] Bouton "Super !" ferme le sheet
- [ ] Haptic `onSuccess` au moment de l'affichage
- [ ] Ne s'affiche pas si aucun nouveau badge
- [ ] Si plusieurs badges : affiche le plus rare
- [ ] Utilise `<BottomSheet>` via Portal (pas de native Modal)
- [ ] `npx tsc --noEmit` passe

## Dépend de
- S05, S06

## Estimation
M (~1h)
