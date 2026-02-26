import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { fontSize } from '../theme'
import { useColors } from '../contexts/ThemeContext'
import type { ThemeColors } from '../theme'

interface StreakIndicatorProps {
  currentStreak: number
  streakTarget: number
}

export function StreakIndicator({ currentStreak, streakTarget }: StreakIndicatorProps) {
  const colors = useColors()
  const styles = useStyles(colors)

  if (currentStreak <= 0) {
    return <Text style={styles.inactive}>Pas encore de streak</Text>
  }

  return (
    <Text style={styles.active}>
      {'\uD83D\uDD25'} {currentStreak} semaine{currentStreak > 1 ? 's' : ''} (obj: {streakTarget}/sem)
    </Text>
  )
}

function useStyles(colors: ThemeColors) {
  return StyleSheet.create({
    active: {
      fontSize: fontSize.sm,
      color: colors.text,
    },
    inactive: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
  })
}
