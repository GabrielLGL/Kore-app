# S06 — Composant BadgeCard

## Story
**En tant que** pratiquant,
**je veux** voir chaque badge sous forme de carte avec emoji, titre et statut visuel,
**afin de** distinguer d'un coup d'œil les badges débloqués des badges encore à atteindre.

## Tâches techniques
1. Créer `mobile/src/components/BadgeCard.tsx`
2. Props interface :
   ```ts
   interface BadgeCardProps {
     badge: BadgeDefinition
     unlocked: boolean
     unlockedAt?: Date
   }
   ```
3. Rendu :
   - Conteneur : `borderRadius.md`, fond `colors.card`, padding `spacing.sm`
   - Taille fixe : largeur flexible (grille 3 colonnes), hauteur ~90px
   - Emoji : `fontSize` 32, centré
   - Titre : `fontSize.xs`, centré, `colors.text` si débloqué, `colors.textSecondary` si non
   - Si verrouillé : `opacity: 0.35` sur le conteneur entier
4. `npx tsc --noEmit` → 0 erreur

## Spécifications visuelles
- Débloqué : opacity 1, emoji couleur native, titre colors.text
- Verrouillé : opacity 0.35, titre colors.textSecondary
- Pas de hardcoded colors → colors.* du theme uniquement
- Pas de border visible (fond card suffit)

## Critères d'acceptation
- [ ] Composant `BadgeCard` créé
- [ ] Props interface typée sans `any`
- [ ] Rendu débloqué correct (emoji + titre visibles)
- [ ] Rendu verrouillé correct (opacity 0.35)
- [ ] Utilise uniquement colors.* du theme
- [ ] `npx tsc --noEmit` passe

## Dépend de
- S02

## Estimation
S (~30min)
