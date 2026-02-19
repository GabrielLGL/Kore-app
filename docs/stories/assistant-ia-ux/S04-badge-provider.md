# S04 — Badge provider dans le wizard
> Priorité : Must | Effort : XS | Dépend de : S03 | Bloque : —

## Objectif
Remplacer le texte hint gris en bas d'écran par un badge élégant dans le header.

## Fichiers touchés
- `mobile/src/screens/AssistantScreen.tsx`

## Tâches techniques

### Supprimer providerHint
```tsx
// Supprimer complètement :
<Text style={styles.providerHint}>
  {providerLabel}
  {providerLabel === 'Offline' ? ' — configure une clé API dans Paramètres pour booster' : ''}
</Text>
```
Et le style associé `providerHint`.

### Ajouter le badge dans le header
```tsx
// Dans la View header, remplacer backBtnPlaceholder droit par :
<View style={styles.badge}>
  <Text style={styles.badgeText}>
    {providerLabel === 'Offline' ? '🔌' : '⚡'} {providerLabel}
  </Text>
</View>
```

### Styles badge
```typescript
badge: {
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  backgroundColor: colors.card,
  borderRadius: borderRadius.lg,
},
badgeText: {
  color: colors.text,
  fontSize: fontSize.sm,
  fontWeight: '600',
},
```

### Garder providerLabel
La variable `providerLabel` (depuis `PROVIDER_LABELS`) reste nécessaire pour le badge.

## Critères d'acceptation
- [ ] Badge visible dans le header coin droit
- [ ] Affiche `🔌 Offline` pour le provider offline
- [ ] Affiche `⚡ Claude` / `⚡ Gemini` / `⚡ GPT-4o` pour les providers cloud
- [ ] Plus aucun texte hint en bas d'écran
- [ ] `npx tsc --noEmit` passe sans erreur
