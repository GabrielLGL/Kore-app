import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import withObservables from '@nozbe/with-observables'
import { from } from 'rxjs'
import SessionExercise from '../model/models/SessionExercise'
import Exercise from '../model/models/Exercise'
import { validateSetInput } from '../model/utils/validationHelpers'
import { getLastPerformanceForExercise } from '../model/utils/databaseHelpers'
import { useHaptics } from '../hooks/useHaptics'
import { LastPerformanceBadge } from './LastPerformanceBadge'
import { colors, spacing, borderRadius, fontSize } from '../theme'
import type { SetInputData, ValidatedSetData, LastPerformance } from '../types/workout'

// --- Types ---

interface WorkoutSetRowProps {
  setOrder: number
  inputKey: string
  input: SetInputData
  validated: ValidatedSetData | undefined
  onUpdateInput: (key: string, field: 'weight' | 'reps', value: string) => void
  onValidate: () => Promise<void>
}

interface WorkoutExerciseCardContentProps {
  sessionExercise: SessionExercise
  exercise: Exercise
  lastPerformance: LastPerformance | null
  setInputs: Record<string, SetInputData>
  validatedSets: Record<string, ValidatedSetData>
  onUpdateInput: (key: string, field: 'weight' | 'reps', value: string) => void
  onValidateSet: (sessionExercise: SessionExercise, setOrder: number) => Promise<void>
}

// --- WorkoutSetRow ---

const WorkoutSetRow: React.FC<WorkoutSetRowProps> = ({
  setOrder,
  inputKey,
  input,
  validated,
  onUpdateInput,
  onValidate,
}) => {
  if (validated) {
    return (
      <View style={[styles.setRow, styles.setRowValidated]}>
        <Text style={styles.setLabel}>Série {setOrder}</Text>
        <Text style={styles.validatedText}>
          {validated.weight} kg × {validated.reps}
        </Text>
        {validated.isPr && <Text style={styles.prBadge}>PR !</Text>}
        <Text style={styles.checkmark}>✓</Text>
      </View>
    )
  }

  const weightNum = Number(input.weight)
  const repsNum = Number(input.reps)
  const weightHasValue = input.weight.trim() !== ''
  const repsHasValue = input.reps.trim() !== ''
  const weightError = weightHasValue && (isNaN(weightNum) || weightNum < 0)
  const repsError = repsHasValue && (isNaN(repsNum) || repsNum < 1)
  const { valid } = validateSetInput(input.weight, input.reps)

  return (
    <View style={styles.setRow}>
      <Text style={styles.setLabel}>Série {setOrder}</Text>
      <View style={styles.inputGroup}>
        <TextInput
          style={[styles.input, styles.inputWeight, weightError && styles.inputError]}
          value={input.weight}
          onChangeText={v => onUpdateInput(inputKey, 'weight', v)}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
          editable
          textAlign="center"
        />
        <Text style={styles.inputSuffix}>kg</Text>
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          style={[styles.input, styles.inputReps, repsError && styles.inputError]}
          value={input.reps}
          onChangeText={v => onUpdateInput(inputKey, 'reps', v)}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
          editable
          textAlign="center"
        />
        <Text style={styles.inputSuffix}>reps</Text>
      </View>
      <TouchableOpacity
        style={[styles.validateBtn, !valid && styles.validateBtnDisabled]}
        onPress={onValidate}
        disabled={!valid}
        activeOpacity={0.7}
      >
        <Text style={styles.validateBtnText}>✓</Text>
      </TouchableOpacity>
    </View>
  )
}

// --- WorkoutExerciseCard ---

const WorkoutExerciseCardContent: React.FC<WorkoutExerciseCardContentProps> = ({
  sessionExercise,
  exercise,
  lastPerformance,
  setInputs,
  validatedSets,
  onUpdateInput,
  onValidateSet,
}) => {
  const haptics = useHaptics()
  const setsCount = sessionExercise.setsTarget ?? 0
  const setOrders = Array.from({ length: setsCount }, (_, i) => i + 1)

  return (
    <View style={styles.card}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <LastPerformanceBadge lastPerformance={lastPerformance} />
      {setsCount === 0 ? (
        <Text style={styles.noSetsText}>Aucune série définie.</Text>
      ) : (
        setOrders.map(setOrder => {
          const key = `${sessionExercise.id}_${setOrder}`
          const input = setInputs[key] ?? { weight: '', reps: '' }
          const validated = validatedSets[key]

          return (
            <WorkoutSetRow
              key={key}
              setOrder={setOrder}
              inputKey={key}
              input={input}
              validated={validated}
              onUpdateInput={onUpdateInput}
              onValidate={async () => {
                const { valid } = validateSetInput(input.weight, input.reps)
                if (!valid) {
                  haptics.onError()
                  return
                }
                haptics.onSuccess()
                await onValidateSet(sessionExercise, setOrder)
              }}
            />
          )
        })
      )}
    </View>
  )
}

export const WorkoutExerciseCard = withObservables(
  ['sessionExercise', 'historyId'],
  ({
    sessionExercise,
    historyId,
  }: {
    sessionExercise: SessionExercise
    historyId: string
  }) => ({
    exercise: sessionExercise.exercise.observe(),
    lastPerformance: from(
      getLastPerformanceForExercise(sessionExercise.exercise.id, historyId ?? '')
    ),
  })
)(WorkoutExerciseCardContent)

// --- Styles ---

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  exerciseName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  noSetsText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontStyle: 'italic',
  },

  // Set row
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  setRowValidated: {
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
  },
  setLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    width: 62,
  },

  // Input group
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  input: {
    backgroundColor: colors.cardSecondary,
    borderRadius: borderRadius.sm,
    color: colors.text,
    fontSize: fontSize.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputWeight: { width: 62 },
  inputReps: { width: 52 },
  inputError: {
    borderColor: colors.danger,
  },
  inputSuffix: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    width: 28,
  },

  // Validate button
  validateBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  validateBtnDisabled: {
    opacity: 0.35,
  },
  validateBtnText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: fontSize.md,
  },

  // Validated state
  validatedText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  prBadge: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  checkmark: {
    color: colors.success,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
})
