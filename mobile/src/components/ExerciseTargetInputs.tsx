import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { spacing, borderRadius, fontSize } from '../theme'
import { useColors } from '../contexts/ThemeContext'
import type { ThemeColors } from '../theme'

interface ExerciseTargetInputsProps {
  sets: string
  setsMax?: string
  reps: string
  weight: string
  onSetsChange: (value: string) => void
  onSetsMaxChange?: (value: string) => void
  onRepsChange: (value: string) => void
  onWeightChange: (value: string) => void
  showLabels?: boolean
  autoFocus?: boolean
}

/**
 * ExerciseTargetInputs - Composant réutilisable pour les inputs d'objectifs
 *
 * Affiche 3 inputs côte à côte (mode simple) ou 4 inputs (mode range séries) :
 * - Séries min (+ max optionnel si `onSetsMaxChange` est fourni)
 * - Reps (nombre entier)
 * - Poids en kg (nombre décimal)
 *
 * @param sets - Valeur du champ séries (ou séries min en mode range)
 * @param setsMax - Valeur du champ séries max (mode range uniquement, optionnel)
 * @param reps - Valeur du champ reps
 * @param weight - Valeur du champ poids
 * @param onSetsChange - Callback appelé quand séries (min) change
 * @param onSetsMaxChange - Callback appelé quand séries max change (active le mode range)
 * @param onRepsChange - Callback appelé quand reps change
 * @param onWeightChange - Callback appelé quand poids change
 * @param showLabels - Afficher les labels au-dessus des inputs (défaut: true)
 * @param autoFocus - Auto-focus sur le premier input (défaut: false)
 *
 * @example Mode simple (3 inputs)
 * <ExerciseTargetInputs
 *   sets={targetSets}
 *   reps={targetReps}
 *   weight={targetWeight}
 *   onSetsChange={setTargetSets}
 *   onRepsChange={setTargetReps}
 *   onWeightChange={setTargetWeight}
 *   autoFocus
 * />
 *
 * @example Mode range (4 inputs : min — max — reps — poids)
 * <ExerciseTargetInputs
 *   sets={setsMin}
 *   setsMax={setsMax}
 *   reps={targetReps}
 *   weight={targetWeight}
 *   onSetsChange={setSetsMin}
 *   onSetsMaxChange={setSetsMax}
 *   onRepsChange={setTargetReps}
 *   onWeightChange={setTargetWeight}
 * />
 */
export const ExerciseTargetInputs: React.FC<ExerciseTargetInputsProps> = ({
  sets,
  setsMax,
  reps,
  weight,
  onSetsChange,
  onSetsMaxChange,
  onRepsChange,
  onWeightChange,
  showLabels = true,
  autoFocus = false,
}) => {
  const colors = useColors()
  const styles = useStyles(colors)

  const handleSetsChange = (value: string) => {
    if (value === '') { onSetsChange(value); return }
    const num = parseInt(value, 10)
    if (isNaN(num)) return
    onSetsChange(String(Math.min(Math.max(num, 1), 10)))
  }

  const handleSetsMaxChange = (value: string) => {
    if (!onSetsMaxChange) return
    if (value === '') { onSetsMaxChange(value); return }
    const num = parseInt(value, 10)
    if (isNaN(num)) return
    onSetsMaxChange(String(Math.min(Math.max(num, 1), 10)))
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
      {/* Séries (simple ou range) */}
      <View style={styles.setsWrapper}>
        {showLabels && <Text style={styles.label}>Séries</Text>}
        <View style={styles.setsRangeRow}>
          <TextInput
            style={[styles.input, styles.setsInput]}
            keyboardType="numeric"
            value={sets}
            onChangeText={handleSetsChange}
            placeholder={onSetsMaxChange ? 'min' : '0'}
            placeholderTextColor={colors.placeholder}
            autoFocus={autoFocus}
          />
          {onSetsMaxChange && (
            <>
              <Text style={styles.rangeSeparator}>—</Text>
              <TextInput
                style={[styles.input, styles.setsInput]}
                keyboardType="numeric"
                value={setsMax ?? ''}
                onChangeText={handleSetsMaxChange}
                placeholder="max"
                placeholderTextColor={colors.placeholder}
              />
            </>
          )}
        </View>
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

function useStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    setsWrapper: {
      flex: 1,
      marginRight: spacing.sm,
    },
    setsRangeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    setsInput: {
      flex: 1,
    },
    rangeSeparator: {
      color: colors.textSecondary,
      fontSize: fontSize.md,
      marginBottom: spacing.md,
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
      marginBottom: spacing.xs,
      fontSize: fontSize.xs,
    },
    input: {
      backgroundColor: colors.cardSecondary,
      color: colors.text,
      padding: spacing.ms,
      borderRadius: borderRadius.sm,
      fontSize: fontSize.md,
      marginBottom: spacing.md,
    },
  })
}
