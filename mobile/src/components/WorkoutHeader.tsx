import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { colors, spacing, borderRadius, fontSize } from '../theme'

interface WorkoutHeaderProps {
  formattedTime: string
  totalVolume: number
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ formattedTime, totalVolume }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formattedTime}</Text>
      <Text style={styles.volume}>Volume total : {totalVolume.toFixed(1)} kg</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    alignItems: 'center',
  },
  timer: {
    color: colors.text,
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 2,
  },
  volume: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
})

export { WorkoutHeader }
