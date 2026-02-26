import React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { useTheme } from '../contexts/ThemeContext'
import { neuShadowParams, borderRadius as defaultBorderRadius } from '../theme'

type NeuShadowLevel = 'elevated' | 'elevatedSm' | 'pressed'

interface NeuShadowProps {
  /** Niveau d'élévation de l'ombre. Défaut : 'elevated' */
  level?: NeuShadowLevel
  children: React.ReactNode
  /** Style appliqué au conteneur extérieur (layout : margin, alignSelf…). */
  style?: StyleProp<ViewStyle>
  /** Border radius de l'élément enveloppé. Doit correspondre au borderRadius de l'enfant. */
  radius?: number
  /** Désactive les ombres (rendu direct des enfants). */
  disabled?: boolean
  /** Étire le composant pour remplir l'axe transversal (shortcut alignSelf: 'stretch'). */
  stretch?: boolean
}

/**
 * NeuShadow — Neumorphisme via react-native-shadow-2
 *
 * Ombre sombre bas-droite (SVG) + bordure claire haut-gauche (borderColor).
 * Pattern hybride : stable sur ScrollView, pas de double-couche SVG.
 *
 * Prérequis : backgroundColor de l'enfant === backgroundColor du fond.
 *
 * @example
 * <NeuShadow level="elevatedSm" radius={borderRadius.md} style={{ marginBottom: spacing.lg }}>
 *   <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.md }}>
 *     ...
 *   </View>
 * </NeuShadow>
 */
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
