import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { formatRelativeDate } from '../model/utils/databaseHelpers'
import { colors, fontSize } from '../theme'
import type { LastPerformance } from '../types/workout'

interface LastPerformanceBadgeProps {
  lastPerformance: LastPerformance | null
}

export const LastPerformanceBadge: React.FC<LastPerformanceBadgeProps> = ({
  lastPerformance,
}) => {
  if (!lastPerformance) {
    return <Text style={styles.text}>Première fois sur cet exercice</Text>
  }

  const { setsCount, avgReps, maxWeight, date } = lastPerformance
  return (
    <Text style={styles.text}>
      Dernière fois : {setsCount}x{avgReps} @ {maxWeight} kg —{' '}
      {formatRelativeDate(date)}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontStyle: 'italic',
    marginBottom: 6,
  },
})
