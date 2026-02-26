import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, fontSize, borderRadius } from '../theme'
import type { BadgeDefinition } from '../model/utils/badgeConstants'

interface BadgeCardProps {
  badge: BadgeDefinition
  unlocked: boolean
  unlockedAt?: Date
}

export function BadgeCard({ badge, unlocked }: BadgeCardProps) {
  return (
    <View style={[styles.card, !unlocked && styles.locked]}>
      <Text style={styles.emoji}>{badge.emoji}</Text>
      <Text
        style={[styles.title, !unlocked && styles.titleLocked]}
        numberOfLines={2}
      >
        {badge.title}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 90,
  },
  locked: {
    opacity: 0.35,
  },
  emoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.xs,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  titleLocked: {
    color: colors.textSecondary,
  },
})
