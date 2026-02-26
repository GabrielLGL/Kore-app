# S07 — Écran BadgesScreen

## Story
**En tant que** pratiquant,
**je veux** consulter ma collection complète de badges dans un écran dédié,
**afin de** voir ma progression et les badges encore à débloquer.

## Tâches techniques
1. Créer `mobile/src/screens/BadgesScreen.tsx`
   - Lister tous les badges via `BADGES_LIST`
   - Observer `userBadges` via `withObservables`
   - Calculer `unlockedIds = new Set(userBadges.map(b => b.badgeId))`
   - Grouper par catégorie : `sessions | tonnage | streak | level | pr | session_volume | exercises`
   - Rendu : `SectionList` ou `ScrollView` avec sections manuelles
   - Header de section : label catégorie traduit, uppercase, `colors.textSecondary`
   - Grille 3 colonnes par section (FlatList horizontal ou flexWrap)
   - Compteur total en haut : "X/50 badges débloqués"
2. Ajouter la route dans `mobile/src/navigation/index.tsx`
   - Nom : `BadgesScreen`
   - Header natif avec titre "Mes Badges"
3. `npx tsc --noEmit` → 0 erreur

## Labels de catégories (fr-FR)
| Category | Label affiché |
|----------|--------------|
| sessions | Séances |
| tonnage | Volume total |
| streak | Régularité |
| level | Niveau XP |
| pr | Records personnels |
| session_volume | Volume par séance |
| exercises | Exercices |

## Layout
```
Header : "Mes Badges"          "12/50 🏅"
─────────────────────────────────────────
SÉANCES
[BadgeCard] [BadgeCard] [BadgeCard]
[BadgeCard] [BadgeCard] [BadgeCard]
[BadgeCard] [BadgeCard] [BadgeCard]

VOLUME TOTAL
[BadgeCard] [BadgeCard] [BadgeCard]
...
```

## Critères d'acceptation
- [ ] Écran `BadgesScreen` créé et navigable
- [ ] Route enregistrée dans navigation/index.tsx
- [ ] Badges groupés par catégorie avec header de section
- [ ] Compteur "X/50" correct et réactif
- [ ] `withObservables` sur `userBadges`
- [ ] Badges débloqués visuellement distincts des verrouillés
- [ ] Dark mode respecté (colors.* du theme)
- [ ] `npx tsc --noEmit` passe

## Dépend de
- S01, S06

## Estimation
M (~1h30)
