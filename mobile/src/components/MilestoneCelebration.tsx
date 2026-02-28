import React from 'react'
import { View, Text } from 'react-native'
import { BottomSheet } from './BottomSheet'
import { Button } from './Button'
import { spacing, fontSize } from '../theme'
import { useColors } from '../contexts/ThemeContext'
import type { MilestoneEvent } from '../model/utils/gamificationHelpers'

interface MilestoneCelebrationProps {
  visible: boolean
  milestone: MilestoneEvent | null
  onClose: () => void
}

export function MilestoneCelebration({ visible, milestone, onClose }: MilestoneCelebrationProps) {
  const colors = useColors()

  if (!milestone) return null

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={{ alignItems: 'center', paddingVertical: spacing.md }}>
        <Text style={{ fontSize: fontSize.jumbo, marginBottom: spacing.md }}>
          {milestone.emoji}
        </Text>
        <Text
          style={{
            fontSize: fontSize.xxl,
            fontWeight: '700',
            color: colors.text,
            marginBottom: spacing.sm,
            textAlign: 'center',
          }}
        >
          {milestone.title}
        </Text>
        <Text
          style={{
            fontSize: fontSize.sm,
            color: colors.textSecondary,
            marginBottom: spacing.lg,
            textAlign: 'center',
          }}
        >
          {milestone.message}
        </Text>
        <Button variant="primary" size="md" onPress={onClose} enableHaptics={false}>
          OK
        </Button>
      </View>
    </BottomSheet>
  )
}
