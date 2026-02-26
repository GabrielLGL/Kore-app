import React, { useState, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { spacing, borderRadius, fontSize } from '../theme'
import { useColors } from '../contexts/ThemeContext'
import type { ThemeColors } from '../theme'

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
 * Affiche 3 inputs côte à côte (séries — reps — poids).
 * Le champ Reps dispose d'un toggle interne **Fixe | Plage** :
 * - Mode Fixe : un seul input numérique (ex: "8")
 * - Mode Plage : deux inputs [min] — [max] composant une range "6-10"
 *
 * @param sets - Valeur du champ séries
 * @param reps - Valeur du champ reps (entier OU range ex: '6-10')
 * @param weight - Valeur du champ poids
 * @param onSetsChange - Callback appelé quand séries change
 * @param onRepsChange - Callback appelé quand reps change — la valeur peut être un entier ou une range 'N-M'
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
  const colors = useColors()
  const styles = useStyles(colors)

  // --- Reps toggle state (local) ---
  const [repsMode, setRepsMode] = useState<'fixed' | 'range'>(() =>
    reps.includes('-') ? 'range' : 'fixed'
  )
  const [repsMin, setRepsMin] = useState(() =>
    reps.includes('-') ? reps.split('-')[0] : reps
  )
  const [repsMax, setRepsMax] = useState(() =>
    reps.includes('-') ? (reps.split('-')[1] ?? '') : ''
  )
  const [localSets, setLocalSets] = useState(sets)
  const [localWeight, setLocalWeight] = useState(weight)

  // Refs pour value props — évite la race condition React Native controlled TextInput.
  // `setLocalState(v)` est async → re-render applique une valeur stale → natif se reset.
  // La ref est mise à jour synchroniquement dans onChangeText : au moment du re-render,
  // ref.current contient la dernière valeur tapée → natif l'affiche déjà → pas de correction.
  const localSetsRef = useRef(sets)
  const localWeightRef = useRef(weight)
  const repsMinRef = useRef(reps.includes('-') ? reps.split('-')[0] : reps)
  const repsMaxRef = useRef(reps.includes('-') ? (reps.split('-')[1] ?? '') : '')

  // --- Handlers ---
  const handleSetsChange = (value: string) => {
    localSetsRef.current = value
    if (value === '') { setLocalSets(''); onSetsChange(''); return }
    setLocalSets(value)
    onSetsChange(value)
  }

  const handleSetsBlur = () => {
    const raw = localSetsRef.current
    if (raw === '') return
    const num = parseInt(raw, 10)
    if (isNaN(num)) { localSetsRef.current = ''; setLocalSets(''); onSetsChange(''); return }
    const v = String(Math.min(Math.max(num, 1), 10))
    if (v !== raw) { localSetsRef.current = v; setLocalSets(v); onSetsChange(v) }
  }

  const handleRepsMinChange = (value: string) => {
    repsMinRef.current = value
    if (value === '') { setRepsMin(''); onRepsChange(''); return }
    setRepsMin(value)
    onRepsChange(repsMode === 'range' && repsMaxRef.current ? `${value}-${repsMaxRef.current}` : value)
  }

  const handleRepsMinBlur = () => {
    const raw = repsMinRef.current
    if (raw === '') return
    const num = parseInt(raw, 10)
    if (isNaN(num)) { repsMinRef.current = ''; setRepsMin(''); onRepsChange(''); return }
    const v = String(Math.min(Math.max(num, 1), 99))
    if (v !== raw) {
      repsMinRef.current = v
      setRepsMin(v)
      onRepsChange(repsMode === 'range' && repsMaxRef.current ? `${v}-${repsMaxRef.current}` : v)
    }
  }

  const handleRepsMaxChange = (value: string) => {
    repsMaxRef.current = value
    if (value === '') { setRepsMax(''); onRepsChange(repsMinRef.current || ''); return }
    setRepsMax(value)
    onRepsChange(repsMinRef.current ? `${repsMinRef.current}-${value}` : value)
  }

  const handleRepsMaxBlur = () => {
    const raw = repsMaxRef.current
    if (raw === '') return
    const num = parseInt(raw, 10)
    if (isNaN(num)) { repsMaxRef.current = ''; setRepsMax(''); onRepsChange(repsMinRef.current || ''); return }
    const v = String(Math.min(Math.max(num, 1), 99))
    if (v !== raw) {
      repsMaxRef.current = v
      setRepsMax(v)
      onRepsChange(repsMinRef.current ? `${repsMinRef.current}-${v}` : v)
    }
  }

  const switchToFixed = () => {
    setRepsMode('fixed')
    repsMaxRef.current = ''
    setRepsMax('')
    onRepsChange(repsMinRef.current)
  }

  const switchToRange = () => {
    setRepsMode('range')
    // repsMin inchangé, repsMax reste vide → parent reçoit repsMin seul
  }

  const handleWeightChange = (value: string) => {
    localWeightRef.current = value
    setLocalWeight(value)
    onWeightChange(value)
  }

  const handleWeightBlur = () => {
    const raw = localWeightRef.current
    if (raw === '' || raw === '.') return
    const num = parseFloat(raw)
    if (isNaN(num) || num < 0) { localWeightRef.current = '0'; setLocalWeight('0'); onWeightChange('0'); return }
    if (num > 999) { localWeightRef.current = '999'; setLocalWeight('999'); onWeightChange('999'); return }
  }

  return (
    <View>
      {/* Ligne 1 : Séries + Poids */}
      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          {showLabels && <Text style={styles.label}>Séries</Text>}
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={localSetsRef.current}
            onChangeText={handleSetsChange}
            onBlur={handleSetsBlur}
            placeholder="0"
            placeholderTextColor={colors.placeholder}
            autoFocus={autoFocus}
          />
        </View>
        <View style={styles.inputWrapperLast}>
          {showLabels && <Text style={styles.label}>Poids (kg)</Text>}
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={localWeightRef.current}
            onChangeText={handleWeightChange}
            onBlur={handleWeightBlur}
            placeholder="0"
            placeholderTextColor={colors.placeholder}
          />
        </View>
      </View>

      {/* Ligne 2 : Reps (pleine largeur) */}
      <View>
        {showLabels && (
          <View style={styles.repsHeader}>
            <Text style={styles.label}>Reps</Text>
            <View style={styles.repsToggle}>
              <TouchableOpacity
                style={[styles.modeBtn, repsMode === 'fixed' && styles.modeBtnActive]}
                onPress={switchToFixed}
              >
                <Text style={[styles.modeBtnText, repsMode === 'fixed' && styles.modeBtnTextActive]}>Fixe</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, repsMode === 'range' && styles.modeBtnActive]}
                onPress={switchToRange}
              >
                <Text style={[styles.modeBtnText, repsMode === 'range' && styles.modeBtnTextActive]}>Plage</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {repsMode === 'fixed' ? (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={repsMinRef.current}
            onChangeText={handleRepsMinChange}
            onBlur={handleRepsMinBlur}
            placeholder="0"
            placeholderTextColor={colors.placeholder}
          />
        ) : (
          <View style={styles.repsRangeRow}>
            <TextInput
              style={[styles.input, styles.repsRangeInput]}
              keyboardType="numeric"
              value={repsMin}
              onChangeText={handleRepsMinChange}
              onBlur={handleRepsMinBlur}
              placeholder="min"
              placeholderTextColor={colors.placeholder}
            />
            <Text style={styles.rangeSeparator}>—</Text>
            <TextInput
              style={[styles.input, styles.repsRangeInput]}
              keyboardType="numeric"
              value={repsMaxRef.current}
              onChangeText={handleRepsMaxChange}
              onBlur={handleRepsMaxBlur}
              placeholder="max"
              placeholderTextColor={colors.placeholder}
            />
          </View>
        )}
      </View>
    </View>
  )
}

function useStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    inputWrapper: {
      flex: 1,
    },
    inputWrapperLast: {
      flex: 1,
    },
    repsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    repsToggle: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    modeBtn: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.cardSecondary,
    },
    modeBtnActive: {
      backgroundColor: colors.primary,
    },
    modeBtnText: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },
    modeBtnTextActive: {
      color: colors.background,
    },
    repsRangeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    repsRangeInput: {
      flex: 1,
    },
    rangeSeparator: {
      color: colors.textSecondary,
      fontSize: fontSize.md,
      marginBottom: spacing.md,
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
