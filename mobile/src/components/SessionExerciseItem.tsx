import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import withObservables from '@nozbe/with-observables'
import SessionExercise from '../model/models/SessionExercise'
import Exercise from '../model/models/Exercise'
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { colors } from '../theme'

interface SessionExerciseItemProps {
  item: SessionExercise
  onEditTargets: (se: SessionExercise) => void
  onRemove: (se: SessionExercise, exoName: string) => void
  drag?: () => void
  dragActive?: boolean
}

interface EnhancedProps extends SessionExerciseItemProps {
  exercise: Exercise | null
}

const SessionExerciseItemComponent: React.FC<EnhancedProps> = ({ item, exercise, onEditTargets, onRemove, drag, dragActive }) => {
  if (!exercise) return null

  return (
    <View style={[styles.itemContainer, dragActive && styles.itemContainerDragging]}>
      {drag && (
        <TouchableOpacity style={styles.dragHandle} onPressIn={drag}>
          <View style={styles.dragBar} />
          <View style={styles.dragBar} />
          <View style={styles.dragBar} />
        </TouchableOpacity>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{exercise.name}</Text>
        <Text style={styles.itemTags}>{exercise.muscles?.join(', ')} • {exercise.equipment}</Text>
        <TouchableOpacity style={styles.targetRow} onPress={() => onEditTargets(item)}>
          <View style={styles.targetBox}>
            <Text style={styles.targetValue}>{item.setsTarget || 0}</Text>
            <Text style={styles.targetLabel}>Séries</Text>
          </View>
          <Text style={styles.targetSeparator}>×</Text>
          <View style={styles.targetBox}>
            <Text style={styles.targetValue}>{item.repsTarget || '0'}</Text>
            <Text style={styles.targetLabel}>Reps</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onRemove(item, exercise.name)}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.card,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardSecondary,
  },
  itemContainerDragging: {
    backgroundColor: colors.cardSecondary,
  },
  dragHandle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    justifyContent: 'center',
    gap: 4,
  },
  dragBar: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.border,
  },
  itemInfo: { flex: 1 },
  itemTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemTags: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 12,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetBox: {
    backgroundColor: colors.cardSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 55,
  },
  targetValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  targetLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  targetSeparator: {
    color: colors.placeholder,
    fontSize: 16,
    marginHorizontal: 8,
    fontWeight: '300',
  },
  deleteBtn: { padding: 15 },
  deleteIcon: { fontSize: 20, color: colors.placeholder },
})

export const SessionExerciseItem = withObservables(['item'], ({ item }: SessionExerciseItemProps) => ({
  item,
  exercise: item.exercise.observe().pipe(catchError(() => of(null))),
}))(SessionExerciseItemComponent)
