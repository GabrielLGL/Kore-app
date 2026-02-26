<!-- v1.0 — 2026-02-26 -->
# Rapport — Fix NeuShadow SettingsScreen — Groupe A — 20260226-2130

## Objectif
Corriger le rendu visuel chaotique du SettingsScreen : les ombres neumorphiques se
superposent, se coupent mutuellement ou débordent par-dessus les sections voisines.

**Résultat attendu** : sections bien séparées avec une ombre douce et propre sur chaque card,
sans chevauchement visible entre sections.

## Diagnostic du problème actuel

### Root cause 1 — Double Shadow imbriqué → clipping
`NeuShadow.tsx` utilise deux `Shadow` SVG imbriqués :
- Shadow extérieur (dark, offset [+6,+6]) → son `containerStyle` reçoit `marginBottom: 24`
- Shadow intérieur (light, offset [-6,-6]) → rendu DANS le Shadow extérieur

Le Shadow extérieur a `overflow: hidden` par défaut (comportement interne react-native-shadow-2).
Le Shadow intérieur tente de rendre son ombre HORS de ses propres bounds → coupé par le parent.
Résultat : l'ombre claire (haut-gauche) est partiellement ou totalement coupée.

### Root cause 2 — L'ombre dark déborde dans la zone du voisin
La dark shadow (offset [+6,+6], distance 8) s'étend ~14px en bas de la section.
Le margin entre sections = 24px, mais l'ombre SVG est rendue DANS le SVG du container,
pas dans le layout. Si le container est mal dimensionné, l'ombre chevauche la section suivante.

### Root cause 3 — backgroundColor card ≠ background gradient
SettingsScreen a un fond `LinearGradient` qui varie. Les sections ont `backgroundColor: colors.card`.
Si `card !== background` (ou si le gradient est différent à cet endroit), le relief neumorphique
ne fonctionne pas : l'ombre semble "collée" à un fond différent.

## Fichiers concernés
1. `mobile/src/components/NeuShadow.tsx` — simplifier l'implémentation
2. `mobile/src/screens/SettingsScreen.tsx` — ajuster l'espacement et les styles

## Contexte technique
- `react-native-shadow-2@7.1.2` installé
- API Shadow v7 : `style` (corner radii + border), `containerStyle` (layout externe), `stretch`, `offset`, `paintInside`
- `spacing.lg` = 24, `borderRadius.md` = 14
- `colors.card = '#21242b'` (dark) / `'#e8ecef'` (light) — identique à `colors.background` ✅
- `neuShadowParams` dans `theme/index.ts` : dark elevatedSm = `{ distance: 8, offset: 6, darkColor: '#060809', lightColor: '#3c4558' }`
- CLAUDE.md §3 : pas de Modal natif, pas de hardcoded colors, pas de console.log
- `useTheme()` depuis `contexts/ThemeContext` expose `{ colors, neuShadow, mode, isDark }`

## Approche recommandée — NeuShadow hybride (1 Shadow + borderColor)

Au lieu de 2 Shadow imbriqués (instable), utiliser :
- **1 Shadow** pour l'ombre principale sombre (bas-droite) → via react-native-shadow-2
- **borderColor** pour le reflet clair (haut-gauche) → simulé par une bordure claire

Ce pattern est similaire à l'ancien `neuShadow` (1 ombre + borderColor) mais avec
`react-native-shadow-2` pour l'ombre principale → plus stable SVG + meilleure qualité iOS.

```tsx
// NeuShadow simplifié
<Shadow
  distance={params.distance}
  offset={[params.offset, params.offset]}
  startColor={params.darkColor}
  endColor="transparent"
  style={{
    borderRadius: radius,
    borderWidth: 1,
    borderColor: params.lightColor,
  }}
  containerStyle={style}
  stretch={stretch}
>
  {children}
</Shadow>
```

Si ce rendu n'est pas satisfaisant visuellement (tester sur device), fallback sur l'approche
ViewStyle pure (sans react-native-shadow-2) : revenir à l'ancien `neuShadow` spread mais avec
les tokens intensifiés (déjà présents dans `neuShadow` du theme).

## Étapes

### 1. Lire les fichiers actuels
- Lire `mobile/src/components/NeuShadow.tsx` en entier
- Lire `mobile/src/screens/SettingsScreen.tsx` en entier

### 2. Simplifier `mobile/src/components/NeuShadow.tsx`
Remplacer le double-Shadow imbriqué par un Shadow unique avec `borderColor` :

```tsx
import React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { useTheme } from '../contexts/ThemeContext'
import { neuShadowParams, borderRadius as defaultBorderRadius } from '../theme'

type NeuShadowLevel = 'elevated' | 'elevatedSm' | 'pressed'

interface NeuShadowProps {
  level?: NeuShadowLevel
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  radius?: number
  disabled?: boolean
  stretch?: boolean
}

export const NeuShadow: React.FC<NeuShadowProps> = ({
  level = 'elevated',
  children,
  style,
  radius = defaultBorderRadius.md,
  disabled = false,
  stretch = false,
}) => {
  const { mode } = useTheme()

  if (disabled) {
    return <>{children}</>
  }

  const params = neuShadowParams[mode][level]

  return (
    <Shadow
      distance={params.distance}
      offset={[params.offset, params.offset]}
      startColor={params.darkColor}
      endColor="transparent"
      style={{
        borderRadius: radius,
        borderWidth: 1,
        borderColor: params.lightColor,
      }}
      containerStyle={style}
      stretch={stretch}
    >
      {children}
    </Shadow>
  )
}
```

### 3. Ajuster l'espacement dans `mobile/src/screens/SettingsScreen.tsx`
La Shadow SVG s'étend en dehors des bounds du container. Pour éviter tout chevauchement,
augmenter légèrement le margin vertical dans le `style` passé à chaque NeuShadow :

Remplacer chaque :
```tsx
<NeuShadow level="elevatedSm" radius={borderRadius.md} style={{ marginBottom: spacing.lg }}>
```
par :
```tsx
<NeuShadow level="elevatedSm" radius={borderRadius.md} style={{ marginBottom: spacing.lg, marginHorizontal: spacing.xs }}>
```

`marginHorizontal: spacing.xs` (4px) donne de la respiration aux ombres latérales sans trop
décaler les sections du padding parent.

### 4. Vérifier et tester
```bash
cd mobile && npx tsc --noEmit
cd mobile && npm test -- --testPathPattern="SettingsScreen" --passWithNoTests
```

Si TypeScript → 0 erreur, le fix est propre.
Tester visuellement sur device/émulateur en dark ET light mode.

### 5. Si le rendu est encore instable
Si après simplification le rendu est encore mauvais (shadows qui se coupent, artefacts SVG) :
- Retirer complètement NeuShadow des sections SettingsScreen
- Remettre `...neuShadow.elevatedSm` dans le style `section` (legacy ViewStyle approach)
- Ne laisser NeuShadow que sur Button (où il n'y a pas de siblings qui se chevauchent)

Ce fallback garantit un rendu stable partout. NeuShadow pourra être retravaillé séparément.

## Contraintes
- Ne pas modifier la logique métier (WatermelonDB, handlers, withObservables)
- Pas de hardcoded colors — utiliser `params.lightColor`, `params.darkColor`
- Pas de console.log
- `borderRadius` des sections = `borderRadius.md` = 14 → passer `radius={borderRadius.md}` à NeuShadow
- La `borderColor` dans le `style` de Shadow doit CORRESPONDRE au radius de l'enfant pour les coins arrondis

## Critères de validation
- `cd mobile && npx tsc --noEmit` → zéro erreur
- `npm test -- --testPathPattern="SettingsScreen"` → PASS
- Visuellement : sections bien délimitées, ombres douces non superposées
- Dark mode + Light mode toggle → rendu propre dans les deux modes

## Dépendances
Aucune — modifie les fichiers déjà en place.

## Statut
⏳ En attente
