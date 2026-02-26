/**
 * Couleurs centralisées de l'application (dark mode uniquement)
 */
export const colors = {
  // Backgrounds
  background: '#21242b',
  card: '#21242b',
  cardSecondary: '#252830',

  // Actions
  primary: '#00cec9',
  danger: '#ff6b6b',
  success: '#00cec9',
  warning: '#FF9500',

  // Neutrals
  border: '#2c3039',
  separator: '#2c3039',

  // Text
  text: '#dfe6e9',
  textSecondary: '#b2bec3',
  placeholder: '#636e72',

  // UI Elements
  overlay: 'rgba(10, 12, 16, 0.9)',
  bottomSheetOverlay: 'rgba(10, 12, 16, 0.5)',

  // Secondary buttons
  secondaryButton: '#252830',

  // Shadow (iOS neumorphique)
  shadow: '#16181d',

  // Transparent tints (pour les chips et fonds semi-transparents)
  successBg: 'rgba(0, 206, 201, 0.12)',
  primaryBg: 'rgba(0, 206, 201, 0.15)',
  surfaceOverlay: 'rgba(255, 255, 255, 0.08)',

  // Neumorphism tokens
  neuShadowDark: '#16181d',
  neuShadowLight: '#2c3039',
  secondaryAccent: '#6c5ce7',
}

/**
 * Espacements standardisés
 */
export const spacing = {
  xs: 4,
  sm: 8,
  ms: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
}

/**
 * Border radius standardisés (coins plus arrondis pour le neumorphisme)
 */
export const borderRadius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
}

/**
 * Tailles de police standardisées
 */
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  hero: 32,
  caption: 11,
  bodyMd: 15,
  jumbo: 48,
}

/**
 * Couleurs d'intensité pour le calendrier heatmap (cyan neumorphique)
 * Index 0 = repos, 1 = 1 séance, 2 = 2 séances, 3 = 3+ séances
 */
export const intensityColors = ['#252830', '#004d4a', '#007875', '#00cec9'] as const

import { Platform } from 'react-native'

/**
 * Ombres neumorphiques dark — Platform-aware
 * iOS : shadowColor + shadowOffset + shadowOpacity + shadowRadius
 * Android : elevation
 * borderColor simule le reflet clair (second shadow CSS)
 */
export const neuShadow = {
  elevated: {
    ...Platform.select({
      ios: {
        shadowColor: '#0a0c10',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 0.9,
        shadowRadius: 16,
      },
      android: { elevation: 10 },
    }),
    borderWidth: 1,
    borderColor: '#353b47',
  },
  elevatedSm: {
    ...Platform.select({
      ios: {
        shadowColor: '#0a0c10',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
      },
      android: { elevation: 5 },
    }),
    borderWidth: 1,
    borderColor: '#353b47',
  },
  pressed: {
    ...Platform.select({
      ios: {
        shadowColor: '#0a0c10',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
    borderWidth: 1,
    borderColor: '#1a1d22',
  },
}
