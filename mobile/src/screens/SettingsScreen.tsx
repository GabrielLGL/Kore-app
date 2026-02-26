import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, SafeAreaView, ScrollView, Switch, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import withObservables from '@nozbe/with-observables'
import { map } from 'rxjs/operators'
import { LinearGradient } from 'expo-linear-gradient'
import * as Sharing from 'expo-sharing'
import { database } from '../model/index'
import User from '../model/models/User'
import { useHaptics } from '../hooks/useHaptics'
import { useTheme } from '../contexts/ThemeContext'
import { OnboardingCard } from '../components/OnboardingCard'
import { AlertDialog } from '../components/AlertDialog'
import { exportAllData } from '../model/utils/exportHelpers'
import { spacing, borderRadius, fontSize } from '../theme'
import {
  USER_LEVELS,
  USER_GOALS,
  USER_LEVEL_LABELS,
  USER_LEVEL_DESCRIPTIONS,
  USER_GOAL_LABELS,
  USER_GOAL_DESCRIPTIONS,
  type UserLevel,
  type UserGoal,
} from '../model/constants'

interface Props {
  user: User | null
}

const SettingsContent: React.FC<Props> = ({ user }) => {
  const haptics = useHaptics()
  const { colors, isDark, toggleTheme, neuShadow } = useTheme()
  const [restDuration, setRestDuration] = useState(user?.restDuration?.toString() ?? '90')
  const [timerEnabled, setTimerEnabled] = useState(user?.timerEnabled ?? true)
  const [userName, setUserName] = useState(user?.name ?? '')
  const [editingLevel, setEditingLevel] = useState(false)
  const [editingGoal, setEditingGoal] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(false)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    content: {
      padding: spacing.lg,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      ...neuShadow.elevatedSm,
    },
    sectionTitleRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: fontSize.xl,
      fontWeight: 'bold',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardSecondary,
    },
    settingInfo: {
      flex: 1,
      marginRight: spacing.md,
    },
    settingLabel: {
      color: colors.text,
      fontSize: fontSize.md,
      fontWeight: '600',
      marginBottom: 4,
    },
    settingDescription: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
    },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      backgroundColor: colors.cardSecondary,
      color: colors.text,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      fontSize: fontSize.md,
      fontWeight: 'bold',
      width: 80,
      textAlign: 'center',
    },
    inputUnit: {
      color: colors.textSecondary,
      fontSize: fontSize.md,
      marginLeft: spacing.sm,
    },
    nameInput: {
      width: 140,
      textAlign: 'right',
    },
    profileCards: {
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardSecondary,
    },
    infoLabel: {
      color: colors.textSecondary,
      fontSize: fontSize.md,
      marginRight: spacing.sm,
    },
    infoValue: {
      color: colors.text,
      fontSize: fontSize.md,
      fontWeight: '600',
      flexShrink: 1,
      textAlign: 'right',
    },
    helpText: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
      lineHeight: 22,
    },
    helpBold: {
      color: colors.text,
      fontWeight: 'bold',
    },
    aiSubLabel: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },
    providerList: {
      gap: spacing.xs,
    },
    providerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.sm,
      gap: spacing.md,
    },
    providerRowActive: {
      backgroundColor: colors.cardSecondary,
    },
    radioCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: colors.textSecondary,
    },
    radioCircleActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    providerLabel: {
      color: colors.textSecondary,
      fontSize: fontSize.md,
    },
    providerLabelActive: {
      color: colors.text,
      fontWeight: '600',
    },
    providerRowDisabled: {
      opacity: 0.4,
    },
    providerRowContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    providerLabelDisabled: {
      color: colors.textSecondary,
    },
    providerComingSoon: {
      fontSize: fontSize.caption,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    streakTargetRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
    },
    streakTargetBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.cardSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      ...neuShadow.pressed,
    },
    streakTargetBtnActive: {
      backgroundColor: colors.primary,
      ...neuShadow.elevatedSm,
    },
    streakTargetText: {
      fontSize: fontSize.md,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    streakTargetTextActive: {
      color: colors.text,
    },
    streakTargetLabel: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginLeft: spacing.xs,
    },
    exportButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      alignItems: 'center' as const,
      ...neuShadow.elevatedSm,
    },
    exportButtonDisabled: {
      opacity: 0.6,
    },
    exportButtonText: {
      color: colors.text,
      fontSize: fontSize.md,
      fontWeight: '600' as const,
    },
    exportHint: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
      textAlign: 'center' as const,
      marginTop: spacing.sm,
    },
  })

  useEffect(() => {
    if (!user) return
    setRestDuration(user.restDuration?.toString() ?? '90')
    setTimerEnabled(user.timerEnabled ?? true)
    setUserName(user.name ?? '')
  }, [user])

  const handleSaveRestDuration = async () => {
    if (!user) return

    const duration = parseInt(restDuration, 10)
    if (isNaN(duration) || duration < 10 || duration > 600) {
      // Validation : entre 10 et 600 secondes
      return
    }

    try {
      await database.write(async () => {
        await user.update((u) => {
          u.restDuration = duration
        })
      })
      haptics.onSuccess()
    } catch (error) {
      if (__DEV__) console.error('Failed to update rest duration:', error)
    }
  }

  const handleSaveName = async () => {
    if (!user) return
    try {
      await database.write(async () => {
        await user.update(u => {
          u.name = userName.trim() || null
        })
      })
      haptics.onSuccess()
    } catch (error) {
      if (__DEV__) console.error('Failed to update name:', error)
    }
  }

  const handleUpdateLevel = async (level: UserLevel) => {
    if (!user) return
    try {
      await database.write(async () => {
        await user.update(u => { u.userLevel = level })
      })
      haptics.onSuccess()
      setEditingLevel(false)
    } catch (error) {
      if (__DEV__) console.error('Failed to update level:', error)
    }
  }

  const handleUpdateGoal = async (goal: UserGoal) => {
    if (!user) return
    try {
      await database.write(async () => {
        await user.update(u => { u.userGoal = goal })
      })
      haptics.onSuccess()
      setEditingGoal(false)
    } catch (error) {
      if (__DEV__) console.error('Failed to update goal:', error)
    }
  }

  const handleExport = async () => {
    haptics.onPress()
    setExporting(true)
    try {
      const filePath = await exportAllData()
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Exporter mes données Kore',
      })
    } catch (error) {
      if (__DEV__) console.error('Export failed:', error)
      setExportError(true)
    } finally {
      setExporting(false)
    }
  }

  const handleToggleTimer = async (enabled: boolean) => {
    if (!user) return

    setTimerEnabled(enabled)

    try {
      await database.write(async () => {
        await user.update((u) => {
          u.timerEnabled = enabled
        })
      })
      haptics.onPress()
    } catch (error) {
      if (__DEV__) console.error('Failed to toggle timer:', error)
      setTimerEnabled(!enabled) // Revert on error
    }
  }

  return (
    <LinearGradient
      colors={[colors.bgGradientStart, colors.bgGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Section Mon profil */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Mon profil</Text>
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Prénom</Text>
              <Text style={styles.settingDescription}>
                Affiché sur votre dashboard stats
              </Text>
            </View>
            <TextInput
              style={[styles.input, styles.nameInput]}
              value={userName}
              onChangeText={setUserName}
              onBlur={handleSaveName}
              onSubmitEditing={handleSaveName}
              placeholder="Toi"
              placeholderTextColor={colors.placeholder}
              maxLength={30}
            />
          </View>

          {/* Niveau */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setEditingLevel(!editingLevel)}
            activeOpacity={0.7}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Niveau</Text>
              <Text style={styles.settingDescription}>
                Influence la difficulté des exercices suggérés
              </Text>
            </View>
            <Text style={styles.infoValue}>
              {user?.userLevel ? USER_LEVEL_LABELS[user.userLevel as UserLevel] : 'Non défini'}
            </Text>
          </TouchableOpacity>
          {editingLevel && (
            <View style={styles.profileCards}>
              {USER_LEVELS.map(level => (
                <OnboardingCard
                  key={level}
                  label={USER_LEVEL_LABELS[level]}
                  description={USER_LEVEL_DESCRIPTIONS[level]}
                  selected={user?.userLevel === level}
                  onPress={() => handleUpdateLevel(level)}
                />
              ))}
            </View>
          )}

          {/* Objectif */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setEditingGoal(!editingGoal)}
            activeOpacity={0.7}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Objectif</Text>
              <Text style={styles.settingDescription}>
                Influence les plages de répétitions recommandées
              </Text>
            </View>
            <Text style={styles.infoValue}>
              {user?.userGoal ? USER_GOAL_LABELS[user.userGoal as UserGoal] : 'Non défini'}
            </Text>
          </TouchableOpacity>
          {editingGoal && (
            <View style={styles.profileCards}>
              {USER_GOALS.map(goal => (
                <OnboardingCard
                  key={goal}
                  label={USER_GOAL_LABELS[goal]}
                  description={USER_GOAL_DESCRIPTIONS[goal]}
                  selected={user?.userGoal === goal}
                  onPress={() => handleUpdateGoal(goal)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Section Apparence */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="color-palette-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Apparence</Text>
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Mode {isDark ? 'sombre' : 'clair'}</Text>
              <Text style={styles.settingDescription}>
                {isDark ? 'Neumorphisme dark — fond #21242b' : 'Neumorphisme light — fond #e8ecef'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={async () => {
                haptics.onPress()
                await toggleTheme()
              }}
              trackColor={{ false: colors.cardSecondary, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        {/* Section Minuteur */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Minuteur de repos</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Activer le minuteur</Text>
              <Text style={styles.settingDescription}>
                Affiche un timer après chaque exercice ajouté
              </Text>
            </View>
            <Switch
              value={timerEnabled}
              onValueChange={handleToggleTimer}
              trackColor={{ false: colors.cardSecondary, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Durée de repos</Text>
              <Text style={styles.settingDescription}>
                Temps de repos par défaut (en secondes)
              </Text>
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={restDuration}
                onChangeText={setRestDuration}
                keyboardType="numeric"
                onBlur={handleSaveRestDuration}
                onSubmitEditing={handleSaveRestDuration}
                placeholderTextColor={colors.placeholder}
              />
              <Text style={styles.inputUnit}>sec</Text>
            </View>
          </View>
        </View>

        {/* Section Gamification */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="star-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Gamification</Text>
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Objectif hebdomadaire</Text>
              <Text style={styles.settingDescription}>
                Nombre de séances par semaine pour maintenir le streak
              </Text>
            </View>
          </View>
          <View style={styles.streakTargetRow}>
            {[2, 3, 4, 5].map(target => (
              <TouchableOpacity
                key={target}
                style={[
                  styles.streakTargetBtn,
                  (user?.streakTarget ?? 3) === target && styles.streakTargetBtnActive,
                ]}
                onPress={async () => {
                  if (!user || user.streakTarget === target) return
                  haptics.onSelect()
                  try {
                    await database.write(async () => {
                      await user.update(u => { u.streakTarget = target })
                    })
                  } catch (error) {
                    if (__DEV__) console.error('Failed to update streak target:', error)
                  }
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.streakTargetText,
                    (user?.streakTarget ?? 3) === target && styles.streakTargetTextActive,
                  ]}
                >
                  {target}
                </Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.streakTargetLabel}>séances/sem</Text>
          </View>
        </View>

        {/* Section Intelligence Artificielle */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="hardware-chip-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Intelligence Artificielle</Text>
          </View>

          <Text style={styles.aiSubLabel}>Provider</Text>
          <View style={styles.providerList}>
            <View style={[styles.providerRow, styles.providerRowActive]}>
              <View style={[styles.radioCircle, styles.radioCircleActive]} />
              <Text style={[styles.providerLabel, styles.providerLabelActive]}>
                Offline — Génération locale
              </Text>
            </View>

            <View style={[styles.providerRow, styles.providerRowDisabled]}>
              <View style={styles.radioCircle} />
              <View style={styles.providerRowContent}>
                <Text style={[styles.providerLabel, styles.providerLabelDisabled]}>
                  IA cloud
                </Text>
                <Text style={styles.providerComingSoon}>Prochainement</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section Données */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="save-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Données</Text>
          </View>
          <TouchableOpacity
            style={[styles.exportButton, exporting && styles.exportButtonDisabled]}
            onPress={handleExport}
            disabled={exporting}
            activeOpacity={0.7}
          >
            <Text style={styles.exportButtonText}>
              {exporting ? 'Export en cours...' : 'Exporter mes données'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.exportHint}>Vos données vous appartiennent</Text>
        </View>

        <AlertDialog
          visible={exportError}
          title="Erreur d'export"
          message="Impossible d'exporter les données. Veuillez réessayer."
          confirmText="OK"
          confirmColor={colors.primary}
          onConfirm={() => setExportError(false)}
          onCancel={() => setExportError(false)}
          hideCancel
        />

        {/* Section À propos */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>À propos</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Application</Text>
            <Text style={styles.infoValue}>Kore</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Développé avec</Text>
            <Text style={styles.infoValue}>React Native + WatermelonDB</Text>
          </View>
        </View>

        {/* Section Aide */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="help-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Aide</Text>
          </View>

          <Text style={styles.helpText}>
            <Text style={styles.helpBold}>Navigation :{'\n'}</Text>
            • Onglet Bibliothèque : Gérer vos exercices{'\n'}
            • Onglet Prog : Créer des programmes et séances{'\n'}
            • Onglet Stats : Voir votre progression{'\n\n'}
            <Text style={styles.helpBold}>Programmes :{'\n'}</Text>
            • Appuyez longuement pour réorganiser{'\n'}
            • Utilisez ⋮ pour renommer/dupliquer/supprimer{'\n\n'}
            <Text style={styles.helpBold}>Exercices :{'\n'}</Text>
            • Ajoutez des exercices dans une séance{'\n'}
            • Modifiez les objectifs (séries × reps à poids){'\n'}
            • Le PR (Personal Record) s'affiche automatiquement
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
    </LinearGradient>
  )
}

export { SettingsContent }

export default withObservables([], () => ({
  user: database.get<User>('users').query().observe().pipe(
    map((list: User[]) => list[0] || null)
  ),
}))(SettingsContent)
