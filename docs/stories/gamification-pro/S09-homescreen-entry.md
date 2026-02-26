# S09 — Entrée HomeScreen vers Mes Badges

## Story
**En tant que** pratiquant,
**je veux** accéder à ma collection de badges directement depuis le dashboard,
**afin de** consulter mes accomplissements sans chercher.

## Tâches techniques
1. Modifier `mobile/src/screens/HomeScreen.tsx`
   - Dans la card gamification existante, ajouter une ligne touchable sous StreakIndicator
   - Afficher "🏅 Mes Badges" + compteur badges débloqués "X/50"
   - `onPress` → `navigation.navigate('BadgesScreen')`
2. Le compteur badges vient de `withObservables` sur `userBadges` (déjà observable si HomeScreen observe User)
   - Calculer `unlockedCount = userBadges.length`
3. Style : `colors.textSecondary` pour le texte, `colors.primary` pour le compteur
4. `npx tsc --noEmit` → 0 erreur

## Layout dans la card gamification
```
⭐ Niveau 8   [██████░░░] 62%
🔥 5 semaines (obj: 3/sem)
─────────────────────────────
🏅 Mes Badges              12/50 →
```

## Critères d'acceptation
- [ ] Lien "Mes Badges" visible dans la card gamification
- [ ] Compteur "X/50" correct et réactif via withObservables
- [ ] Navigation vers BadgesScreen au tap
- [ ] Haptic `onPress` au tap
- [ ] Dark mode respecté (colors.* uniquement)
- [ ] `npx tsc --noEmit` passe

## Dépend de
- S07

## Estimation
S (~30min)
