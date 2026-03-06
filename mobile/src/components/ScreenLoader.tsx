import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useColors } from '../contexts/ThemeContext'

/**
 * Fallback leger pour React.Suspense lors du lazy loading des ecrans.
 * Affiche un spinner centre sur le fond du theme.
 */
export default function ScreenLoader() {
  const colors = useColors()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
