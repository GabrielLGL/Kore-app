import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { colors, spacing, borderRadius, fontSize } from '../theme'

interface ExerciseTargetInputsProps {
  sets: string
  reps: string
  weight: string
  onSetsChange: (value: string) => void
  onRepsChange: (value: string) => void
  onWeightChange: (value: string) => void
  showLabels?: boolean
  autoFocus?: boolean
}

/**
 * ExerciseTargetInputs - Composant réutilisable pour les inputs d'objectifs
 *
 * Affiche 3 inputs côte à côte pour:
 * - Séries (nombre entier)
 * - Reps (nombre entier)
 * - Poids en kg (nombre décimal)
 *
 * @param sets - Valeur du champ séries
 * @param reps - Valeur du champ reps
 * @param weight - Valeur du champ poids
 * @param onSetsChange - Callback appelé quand séries change
 * @param onRepsChange - Callback appelé quand reps change
 * @param onWeightChange - Callback appelé quand poids change
 * @param showLabels - Afficher les labels au-dessus des inputs (défaut: true)
 * @param autoFocus - Auto-focus sur le premier input (défaut: false)
 *
 * @example
 * <ExerciseTargetInputs
 *   sets={targetSets}
 *   reps={targetReps}
 *   weight={targetWeight}
 *   onSetsChange={setTargetSets}
 *   onRepsChange={setTargetReps}
 *   onWeightChange={setTargetWeight}
 *   autoFocus
 * />
 */
export const ExerciseTargetInputs: React.FC<ExerciseTargetInputsProps> = ({
  sets,
  reps,
  weight,
  onSetsChange,
  onRepsChange,
  onWeightChange,
  showLabels = true,
  autoFocus = false,
}) => {
  const handleSetsChange = (value: string) => {
    if (value === '') { onSetsChange(value); return }
    const num = parseInt(value, 10)
    if (isNaN(num)) return
    onSetsChange(String(Math.min(Math.max(num, 1), 10)))
  }

  const handleRepsChange = (value: string) => {
    if (value === '') { onRepsChange(value); return }
    const num = parseInt(value, 10)
    if (isNaN(num)) return
    onRepsChange(String(Math.min(Math.max(num, 1), 99)))
  }

  const handleWeightChange = (value: string) => {
    if (value === '' || value === '.') { onWeightChange(value); return }
    const num = parseFloat(value)
    if (isNaN(num)) return
    if (num < 0) { onWeightChange('0'); return }
    if (num > 999) { onWeightChange('999'); return }
    onWeightChange(value)
  }

  return (
    <View style={styles.row}>
      {/* Séries */}
      <View style={styles.inputWrapper}>
        {showLabels && <Text style={styles.label}>Séries</Text>}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={sets}
          onChangeText={handleSetsChange}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
          autoFocus={autoFocus}
        />
      </View>

      {/* Reps */}
      <View style={styles.inputWrapper}>
        {showLabels && <Text style={styles.label}>Reps</Text>}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={reps}
          onChangeText={handleRepsChange}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      {/* Poids */}
      <View style={styles.inputWrapperLast}>
        {showLabels && <Text style={styles.label}>Poids (kg)</Text>}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={weight}
          onChangeText={handleWeightChange}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  inputWrapperLast: {
    flex: 1,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: 5,
    fontSize: fontSize.xs,
  },
  input: {
    backgroundColor: colors.cardSecondary,
    color: colors.text,
    padding: 12,
    borderRadius: borderRadius.sm,
    fontSize: fontSize.md,
    marginBottom: 15,
  },
})
