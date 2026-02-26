import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BottomSheet } from './BottomSheet'
import { Button } from './Button'
import { colors, spacing, fontSize } from '../theme'
import type { BadgeDefinition } from '../model/utils/badgeConstants'

interface BadgeCelebrationProps {
  visible: boolean
  badge: BadgeDefinition | null
  onClose: () => void
}

export function BadgeCelebration({ visible, badge, onClose }: BadgeCelebrationProps) {
  if (!badge) return null

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{badge.emoji}</Text>
        <Text style={styles.headline}>Nouveau badge !</Text>
        <Text style={styles.title}>{badge.title}</Text>
        <Text style={styles.description}>{badge.description}</Text>
        <Button variant="primary" size="md" onPress={onClose} enableHaptics={false}>
          Super !
        </Button>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  headline: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
})
