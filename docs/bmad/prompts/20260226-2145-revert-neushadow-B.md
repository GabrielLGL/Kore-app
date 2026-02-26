<!-- v1.0 — 2026-02-26 -->
# Rapport — Revert NeuShadow — Groupe B — 20260226-2145

## Objectif
Supprimer les 8 wrappers NeuShadow des sections dans SettingsScreen.tsx et restaurer
l'approche `...neuShadow.elevatedSm` spread directement dans le style `section`.

Résultat : sections Cards propres avec ombre native simple, sans imbrication SVG.

## Fichiers concernés
1. `mobile/src/screens/SettingsScreen.tsx` — retirer NeuShadow, restaurer neuShadow spread

## Contexte technique
- `useTheme()` retourne `{ colors, neuShadow, isDark, toggleTheme, ... }`
- `neuShadow.elevatedSm` = ViewStyle spread `{ elevation: 7, borderWidth: 1, borderColor, ...shadowColor }` (platform-aware)
- `neuShadow.pressed` et `neuShadow.elevatedSm` sont encore utilisés dans `streakTargetBtn`,
  `streakTargetBtnActive`, `exportButton` → ces usages doivent RESTER intacts
- `spacing.lg` = 24, `borderRadius.md` = 14
- CLAUDE.md §3 : pas de Modal natif, pas de any TypeScript

## État actuel de SettingsScreen.tsx (à revert)

### Import (ligne 11) — à supprimer :
```tsx
import { NeuShadow } from '../components/NeuShadow'
```

### Style `section` (lignes 50-54) — actuellement sans neuShadow :
```tsx
section: {
  backgroundColor: colors.card,
  borderRadius: borderRadius.md,
  padding: spacing.lg,
  // marginBottom absent — il était sur le NeuShadow container
  // neuShadow absent
},
```

### Structure JSX actuelle — 8 fois ce pattern :
```tsx
<NeuShadow level="elevatedSm" radius={borderRadius.md} style={{ marginBottom: spacing.lg, marginHorizontal: spacing.xs }}>
  <View style={styles.section}>
    {/* contenu */}
  </View>
</NeuShadow>
```

## État cible (après revert)

### Style `section` restauré :
```tsx
section: {
  backgroundColor: colors.card,
  borderRadius: borderRadius.md,
  padding: spacing.lg,
  marginBottom: spacing.lg,    // ← restaurer
  ...neuShadow.elevatedSm,     // ← restaurer
},
```

### Structure JSX restaurée — les 8 sections redeviennent :
```tsx
<View style={styles.section}>
  {/* contenu intact */}
</View>
```
(Supprimer simplement les lignes `<NeuShadow ...>` et `</NeuShadow>`)

## Étapes

### 1. Lire SettingsScreen.tsx en entier
`mobile/src/screens/SettingsScreen.tsx`

### 2. Supprimer l'import NeuShadow (ligne 11)
Retirer : `import { NeuShadow } from '../components/NeuShadow'`

### 3. Restaurer le style `section` dans StyleSheet.create
Ajouter `marginBottom: spacing.lg` et `...neuShadow.elevatedSm` au style `section`.
La ligne `...neuShadow.elevatedSm` doit être la DERNIÈRE du style (spread en dernier).

### 4. Supprimer les 8 wrappers NeuShadow dans le JSX
Pour chaque section, transformer :
```tsx
<NeuShadow level="elevatedSm" radius={borderRadius.md} style={{ marginBottom: spacing.lg, marginHorizontal: spacing.xs }}>
<View style={styles.section}>
  ...
</View>
</NeuShadow>
```
en :
```tsx
<View style={styles.section}>
  ...
</View>
```

Les 8 sections (dans l'ordre) :
- 👤 Mon profil
- 🎨 Apparence
- ⏱️ Minuteur de repos
- ⭐ Gamification
- ✨ Intelligence Artificielle
- 💾 Données
- ℹ️ À propos
- ❓ Aide

**Important** : NE PAS modifier le contenu intérieur des sections. Supprimer uniquement
les balises `<NeuShadow ...>` ouvrantes et `</NeuShadow>` fermantes.

**Vérifier** : `streakTargetBtn`, `streakTargetBtnActive`, `exportButton` dans les styles
ont encore `...neuShadow.pressed` et `...neuShadow.elevatedSm` → les garder intacts.

### 5. Vérifier TypeScript + Tests
```bash
cd mobile && npx tsc --noEmit
cd mobile && npm test -- --testPathPattern="SettingsScreen" --passWithNoTests 2>&1 | tail -5
```

## Contraintes
- Ne pas modifier la logique métier (WatermelonDB, handlers, withObservables, AlertDialog)
- Conserver `neuShadow` dans le destructuring de `useTheme()` — il est utilisé partout
- Ne pas supprimer les usages existants de `neuShadow` sur `streakTargetBtn`, `exportButton`
- Pas de hardcoded colors
- Pas de console.log

## Critères de validation
- `npx tsc --noEmit` → zéro erreur
- `npm test -- --testPathPattern="SettingsScreen"` → 28/28 PASS
- Aucune occurrence de `NeuShadow` dans SettingsScreen.tsx
- Sections avec ombre native propre (pas de SVG, pas de chevauchement)

## Dépendances
Aucune dépendance sur Groupe A. Peut tourner en parallèle.

## Statut
⏳ En attente
