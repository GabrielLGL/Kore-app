import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  ScrollView, ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import withObservables from '@nozbe/with-observables'
import { map } from 'rxjs/operators'
import { database } from '../model'
import { generatePlan } from '../services/ai/aiService'
import { AlertDialog } from '../components/AlertDialog'
import { useHaptics } from '../hooks/useHaptics'
import { spacing, fontSize, borderRadius } from '../theme'
import { useColors } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import type { ThemeColors } from '../theme'
import type Program from '../model/models/Program'
import type User from '../model/models/User'
import type { AIFormData, AILevel, AISplit } from '../services/ai/types'
import { useFocusEffect } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import type { RootStackParamList } from '../navigation/index'

// ─── Types ────────────────────────────────────────────────────────────────────

type FormValue = string | number | string[]

interface StepOption {
  value: string | number
  label: string
  sub?: string
  icon?: keyof typeof Ionicons.glyphMap
}

type WizardStepKind = 'single' | 'multi' | 'multi-focus' | 'multi-muscle' | 'multi-injuries'

interface WizardStep {
  id: string
  field: keyof AIFormData
  question: string
  subtitle?: string
  kind: WizardStepKind
  options?: StepOption[]
}

// ─── Static data (values are DB keys — never translate these) ─────────────────

const SPLIT_VALID_DAYS: Record<AISplit, number[]> = {
  auto:       [2, 3, 4, 5, 6],
  fullbody:   [2, 3, 4, 5, 6],
  upperlower: [2, 4],
  ppl:        [3, 6],
  brosplit:   [5],
  arnold:     [3, 6],
  phul:       [4],
  fiveday:    [5],
  pushpull:   [2, 4, 6],
  fullbodyhi: [2, 3, 4, 5, 6],
}

function getDaysForSplit(split: AISplit | undefined): number[] {
  if (split === undefined) return [2, 3, 4, 5, 6]
  return SPLIT_VALID_DAYS[split]
}

// MUSCLES_FOCUS_OPTIONS: values are data keys used in the form — do not translate values
const MUSCLES_FOCUS_OPTIONS = ['Équilibré', 'Pecs', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Abdos']

const PROVIDER_LABELS: Record<string, string> = {
  offline: 'Offline',
  openai:  'OpenAI',
  gemini:  'Gemini',
  claude:  'Claude',
}

// ─── Composant interne ────────────────────────────────────────────────────────

interface AssistantScreenInnerProps {
  programs: Program[]
  user: User | null
  navigation: NativeStackNavigationProp<RootStackParamList, 'Assistant'>
  route: RouteProp<RootStackParamList, 'Assistant'>
}

export function AssistantScreenInner({ programs, user, navigation, route }: AssistantScreenInnerProps) {
  const colors = useColors()
  const styles = useStyles(colors)
  const haptics = useHaptics()
  const { t } = useLanguage()

  const sessionMode = route.params?.sessionMode

  const emptyForm: Partial<AIFormData> = {
    equipment: [],
    musclesFocus: [],
    muscleGroups: [],
    injuries: [],
    mode: sessionMode ? 'session' : 'program',
    targetProgramId: sessionMode?.targetProgramId,
  }

  // ── Translated option arrays (defined inside component to access t) ─────────

  const GOAL_OPTIONS: StepOption[] = useMemo(() => [
    { value: 'bodybuilding', label: t.assistant.goals.bodybuilding.label, sub: t.assistant.goals.bodybuilding.sub, icon: 'body-outline'    },
    { value: 'power',        label: t.assistant.goals.power.label,        sub: t.assistant.goals.power.sub,        icon: 'barbell-outline' },
    { value: 'renfo',        label: t.assistant.goals.renfo.label,        sub: t.assistant.goals.renfo.sub,        icon: 'flame-outline'   },
    { value: 'cardio',       label: t.assistant.goals.cardio.label,       sub: t.assistant.goals.cardio.sub,       icon: 'walk-outline'    },
  ], [t])

  const EQUIPMENT_OPTIONS: string[] = useMemo(() => [
    t.assistant.equipment.bodyweight,
    t.assistant.equipment.dumbbells,
    t.assistant.equipment.barbell,
    t.assistant.equipment.machines,
  ], [t])

  const DURATION_OPTIONS: StepOption[] = useMemo(() => [
    { value: 45,  label: t.assistant.durations.d45.label,  sub: t.assistant.durations.d45.sub  },
    { value: 60,  label: t.assistant.durations.d60.label,  sub: t.assistant.durations.d60.sub  },
    { value: 90,  label: t.assistant.durations.d90.label,  sub: t.assistant.durations.d90.sub  },
    { value: 120, label: t.assistant.durations.d120.label, sub: t.assistant.durations.d120.sub },
  ], [t])

  const MUSCLE_OPTIONS: StepOption[] = useMemo(() => [
    { value: 'Pecs',       label: t.assistant.muscles.Pecs       },
    { value: 'Dos',        label: t.assistant.muscles.Dos        },
    { value: 'Quadriceps', label: t.assistant.muscles.Quadriceps },
    { value: 'Ischios',    label: t.assistant.muscles.Ischios    },
    { value: 'Epaules',    label: t.assistant.muscles.Epaules    },
    { value: 'Biceps',     label: t.assistant.muscles.Biceps     },
    { value: 'Triceps',    label: t.assistant.muscles.Triceps    },
    { value: 'Abdos',      label: t.assistant.muscles.Abdos      },
    { value: 'Full Body',  label: t.assistant.muscles['Full Body'] },
  ], [t])

  const SPLIT_OPTIONS: StepOption[] = useMemo(() => [
    { value: 'auto',       label: t.assistant.splits.auto.label,       sub: t.assistant.splits.auto.sub,       icon: 'refresh-outline'         },
    { value: 'fullbody',   label: t.assistant.splits.fullbody.label,   sub: t.assistant.splits.fullbody.sub,   icon: 'grid-outline'            },
    { value: 'upperlower', label: t.assistant.splits.upperlower.label, sub: t.assistant.splits.upperlower.sub, icon: 'swap-vertical-outline'   },
    { value: 'ppl',        label: t.assistant.splits.ppl.label,        sub: t.assistant.splits.ppl.sub,        icon: 'repeat-outline'          },
    { value: 'brosplit',   label: t.assistant.splits.brosplit.label,   sub: t.assistant.splits.brosplit.sub,   icon: 'barbell-outline'         },
    { value: 'arnold',     label: t.assistant.splits.arnold.label,     sub: t.assistant.splits.arnold.sub,     icon: 'star-outline'            },
    { value: 'phul',       label: t.assistant.splits.phul.label,       sub: t.assistant.splits.phul.sub,       icon: 'flash-outline'           },
    { value: 'fiveday',    label: t.assistant.splits.fiveday.label,    sub: t.assistant.splits.fiveday.sub,    icon: 'calendar-outline'        },
    { value: 'pushpull',   label: t.assistant.splits.pushpull.label,   sub: t.assistant.splits.pushpull.sub,   icon: 'swap-horizontal-outline' },
    { value: 'fullbodyhi', label: t.assistant.splits.fullbodyhi.label, sub: t.assistant.splits.fullbodyhi.sub, icon: 'flame-outline'           },
  ], [t])

  const PHASE_OPTIONS: StepOption[] = useMemo(() => [
    { value: 'prise_masse',   label: t.assistant.phases.prise_masse.label,   sub: t.assistant.phases.prise_masse.sub   },
    { value: 'seche',         label: t.assistant.phases.seche.label,         sub: t.assistant.phases.seche.sub         },
    { value: 'recomposition', label: t.assistant.phases.recomposition.label, sub: t.assistant.phases.recomposition.sub },
    { value: 'maintien',      label: t.assistant.phases.maintien.label,      sub: t.assistant.phases.maintien.sub      },
  ], [t])

  const RECOVERY_OPTIONS: StepOption[] = useMemo(() => [
    { value: 'rapide',  label: t.assistant.recoveries.rapide.label,  sub: t.assistant.recoveries.rapide.sub  },
    { value: 'normale', label: t.assistant.recoveries.normale.label, sub: t.assistant.recoveries.normale.sub },
    { value: 'lente',   label: t.assistant.recoveries.lente.label,   sub: t.assistant.recoveries.lente.sub   },
  ], [t])

  const INJURIES_OPTIONS: StepOption[] = useMemo(() => [
    { value: 'none',     label: t.assistant.injuries.none     },
    { value: 'epaules',  label: t.assistant.injuries.epaules  },
    { value: 'genoux',   label: t.assistant.injuries.genoux   },
    { value: 'bas_dos',  label: t.assistant.injuries.bas_dos  },
    { value: 'poignets', label: t.assistant.injuries.poignets },
    { value: 'nuque',    label: t.assistant.injuries.nuque    },
  ], [t])

  // ── buildSteps (inside component to access t and option arrays) ────────────

  const buildSteps = useCallback((data: Partial<AIFormData>, isSession: boolean): WizardStep[] => {
    const goalStep: WizardStep = {
      id: 'goal',
      field: 'goal',
      question: t.assistant.steps.goal.question,
      subtitle: t.assistant.steps.goal.subtitle,
      kind: 'single',
      options: GOAL_OPTIONS,
    }

    const equipmentStep: WizardStep = {
      id: 'equipment',
      field: 'equipment',
      question: t.assistant.steps.equipment.question,
      subtitle: t.assistant.steps.equipment.subtitle,
      kind: 'multi',
    }

    const durationStep: WizardStep = {
      id: 'duration',
      field: 'durationMin',
      question: t.assistant.steps.duration.question,
      subtitle: t.assistant.steps.duration.subtitle,
      kind: 'single',
      options: DURATION_OPTIONS,
    }

    if (isSession) {
      return [
        goalStep,
        equipmentStep,
        durationStep,
        {
          id: 'muscle',
          field: 'muscleGroups',
          question: t.assistant.steps.muscle.question,
          subtitle: t.assistant.steps.muscle.subtitle,
          kind: 'multi-muscle',
        },
      ]
    }

    const daysOptions: StepOption[] = getDaysForSplit(data.split).map(d => ({
      value: d,
      label: `${d} ${d > 1 ? t.assistant.days : t.assistant.day}`,
    }))

    return [
      goalStep,
      equipmentStep,
      durationStep,
      {
        id: 'split',
        field: 'split',
        question: t.assistant.steps.split.question,
        subtitle: t.assistant.steps.split.subtitle,
        kind: 'single',
        options: SPLIT_OPTIONS,
      },
      {
        id: 'phase',
        field: 'phase',
        question: t.assistant.steps.phase.question,
        subtitle: t.assistant.steps.phase.subtitle,
        kind: 'single',
        options: PHASE_OPTIONS,
      },
      {
        id: 'recovery',
        field: 'recovery',
        question: t.assistant.steps.recovery.question,
        subtitle: t.assistant.steps.recovery.subtitle,
        kind: 'single',
        options: RECOVERY_OPTIONS,
      },
      {
        id: 'injuries',
        field: 'injuries',
        question: t.assistant.steps.injuries.question,
        subtitle: t.assistant.steps.injuries.subtitle,
        kind: 'multi-injuries',
      },
      {
        id: 'days',
        field: 'daysPerWeek',
        question: t.assistant.steps.days.question,
        subtitle: t.assistant.steps.days.subtitle,
        kind: 'single',
        options: daysOptions,
      },
      {
        id: 'musclesFocus',
        field: 'musclesFocus',
        question: t.assistant.steps.priority.question,
        subtitle: t.assistant.steps.priority.subtitle,
        kind: 'multi-focus',
      },
    ]
  }, [t, GOAL_OPTIONS, DURATION_OPTIONS, SPLIT_OPTIONS, PHASE_OPTIONS, RECOVERY_OPTIONS])

  // ── Wizard state ──────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep]               = useState(0)
  const [formData, setFormData]                     = useState<Partial<AIFormData>>(emptyForm)
  const [isGenerating, setIsGenerating]             = useState(false)
  const [isResetAlertVisible, setIsResetAlertVisible] = useState(false)
  const [errorAlertVisible, setErrorAlertVisible]   = useState(false)
  const [errorAlertMessage, setErrorAlertMessage]   = useState('')

  const progressAnim  = useRef(new Animated.Value(0)).current
  const contentAnim   = useRef(new Animated.Value(1)).current
  const pendingFadeIn = useRef(false)

  // ── Derived ───────────────────────────────────────────────────────────────
  const providerLabel = PROVIDER_LABELS[user?.aiProvider ?? 'offline'] ?? 'Offline'
  const isSession     = Boolean(sessionMode)

  const steps      = useMemo(() => buildSteps(formData, isSession), [buildSteps, formData, isSession])
  const totalSteps = steps.length
  const step       = steps[currentStep]

  // ── Wizard progress animation ─────────────────────────────────────────────
  useEffect(() => {
    const progress = totalSteps > 1 ? currentStep / (totalSteps - 1) : 0
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 250,
      useNativeDriver: false,
    }).start()
  }, [currentStep, totalSteps, progressAnim])

  // ── Reset au retour sur l'onglet ─────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      setCurrentStep(0)
      setFormData({
        equipment: [],
        musclesFocus: [],
        muscleGroups: [],
        injuries: [],
        mode: sessionMode ? 'session' : 'program',
        targetProgramId: sessionMode?.targetProgramId,
      })
      contentAnim.setValue(1)
    }, [contentAnim, sessionMode])
  )

  // ── Transition fade entre étapes ─────────────────────────────────────────
  const goToStep = useCallback((nextIndex: number, newData?: Partial<AIFormData>) => {
    contentAnim.setValue(0)
    pendingFadeIn.current = true
    if (newData !== undefined) setFormData(newData)
    setCurrentStep(nextIndex)
  }, [contentAnim])

  useEffect(() => {
    if (!pendingFadeIn.current) return
    pendingFadeIn.current = false
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [currentStep, contentAnim])

  // ─── Génération ───────────────────────────────────────────────────────────

  const levelMap: Record<string, AILevel> = {
    beginner:     'débutant',
    intermediate: 'intermédiaire',
    advanced:     'avancé',
  }

  const triggerGenerate = useCallback(async (data: AIFormData) => {
    haptics.onPress()
    setIsGenerating(true)
    try {
      const formWithLevel: AIFormData = {
        ...data,
        level: levelMap[user?.userLevel ?? ''] ?? 'intermédiaire',
      }
      const result = await generatePlan(formWithLevel, user)
      let fallbackNotice: string | undefined
      if (result.usedFallback) {
        const providerName = PROVIDER_LABELS[result.fallbackReason ?? ''] ?? result.fallbackReason ?? 'cloud'
        fallbackNotice = `Plan généré hors ligne — ${providerName} indisponible`
      }
      setCurrentStep(0)
      setFormData({
        equipment: [],
        musclesFocus: [],
        muscleGroups: [],
        injuries: [],
        mode: sessionMode ? 'session' : 'program',
        targetProgramId: sessionMode?.targetProgramId,
      })
      contentAnim.setValue(1)
      navigation.navigate('AssistantPreview', {
        plan: result.plan,
        mode: (formWithLevel.mode ?? 'program') as 'program' | 'session',
        targetProgramId: formWithLevel.targetProgramId,
      })
      void fallbackNotice
    } catch {
      setErrorAlertMessage(t.assistant.errorMessage)
      setErrorAlertVisible(true)
    } finally {
      setIsGenerating(false)
    }
  }, [user, haptics, navigation, contentAnim, sessionMode, t])

  // ─── Navigation wizard ────────────────────────────────────────────────────

  const handleSelect = useCallback((field: keyof AIFormData, value: FormValue) => {
    let newData: Partial<AIFormData> = { ...formData, [field]: value }

    // Auto-corriger daysPerWeek si le split change et que le nombre de jours courant n'est plus valide
    if (field === 'split') {
      const validDays = getDaysForSplit(value as AISplit)
      if (validDays.length > 0 && newData.daysPerWeek !== undefined && !validDays.includes(newData.daysPerWeek)) {
        newData = { ...newData, daysPerWeek: validDays[0] }
      }
    }

    haptics.onSelect()

    const currentSteps = buildSteps(newData, isSession)
    if (currentStep === currentSteps.length - 1) {
      setFormData(newData)
      triggerGenerate(newData as AIFormData)
    } else {
      goToStep(currentStep + 1, newData)
    }
  }, [formData, currentStep, haptics, triggerGenerate, goToStep, isSession, buildSteps])

  const toggleEquipment = useCallback((item: string) => {
    haptics.onSelect()
    setFormData(prev => {
      const eq = prev.equipment ?? []
      return {
        ...prev,
        equipment: eq.includes(item) ? eq.filter(e => e !== item) : [...eq, item],
      }
    })
  }, [haptics])

  const toggleMusclesFocus = useCallback((muscle: string) => {
    haptics.onSelect()
    setFormData(prev => {
      const current = prev.musclesFocus ?? []
      if (muscle === 'Équilibré') {
        return { ...prev, musclesFocus: [] }
      }
      const isSelected = current.includes(muscle)
      const next = isSelected
        ? current.filter(m => m !== muscle)
        : [...current, muscle]
      return { ...prev, musclesFocus: next }
    })
  }, [haptics])

  const toggleMuscleGroup = useCallback((muscle: string) => {
    haptics.onSelect()
    setFormData(prev => {
      const current = prev.muscleGroups ?? []
      const isSelected = current.includes(muscle)
      return {
        ...prev,
        muscleGroups: isSelected ? current.filter(m => m !== muscle) : [...current, muscle],
      }
    })
  }, [haptics])

  const toggleInjuries = useCallback((value: string) => {
    haptics.onSelect()
    setFormData(prev => {
      const current = prev.injuries ?? []
      if (value === 'none') {
        return { ...prev, injuries: ['none'] }
      }
      const withoutNone = current.filter(v => v !== 'none')
      const isSelected = withoutNone.includes(value)
      return {
        ...prev,
        injuries: isSelected ? withoutNone.filter(v => v !== value) : [...withoutNone, value],
      }
    })
  }, [haptics])

  const handleMultiNext = useCallback(() => {
    haptics.onPress()
    const currentSteps = buildSteps(formData, isSession)
    if (currentStep === currentSteps.length - 1) {
      triggerGenerate(formData as AIFormData)
    } else {
      goToStep(currentStep + 1)
    }
  }, [formData, currentStep, haptics, triggerGenerate, goToStep, isSession, buildSteps])

  const handleBack = useCallback(() => {
    if (currentStep === 0) return
    goToStep(currentStep - 1)
  }, [currentStep, goToStep])

  const resetForm = useCallback(() => {
    setFormData({
      equipment: [],
      musclesFocus: [],
      muscleGroups: [],
      injuries: [],
      mode: sessionMode ? 'session' : 'program',
      targetProgramId: sessionMode?.targetProgramId,
    })
    setCurrentStep(0)
    contentAnim.setValue(1)
  }, [contentAnim, sessionMode])

  const handleReset = useCallback(() => {
    haptics.onDelete()
    setIsResetAlertVisible(false)
    resetForm()
  }, [haptics, resetForm])

  const handleResetRequest = useCallback(() => {
    if (currentStep > 2) {
      haptics.onPress()
      setIsResetAlertVisible(true)
    } else {
      haptics.onDelete()
      resetForm()
    }
  }, [currentStep, haptics, resetForm])

  // ─── Rendu du step courant (wizard) ──────────────────────────────────────

  const renderStepContent = () => {
    if (!step) return null

    if (step.kind === 'multi') {
      const selected     = formData.equipment ?? []
      const hasSelection = selected.length > 0
      return (
        <View>
          <View style={styles.chipsWrap}>
            {EQUIPMENT_OPTIONS.map(eq => {
              const isSelected = selected.includes(eq)
              return (
                <TouchableOpacity
                  key={eq}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => toggleEquipment(eq)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{eq}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <TouchableOpacity
            style={[styles.nextBtn, !hasSelection && styles.nextBtnDisabled]}
            disabled={!hasSelection}
            onPress={handleMultiNext}
          >
            <Text style={styles.nextBtnText}>{t.assistant.next}</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (step.kind === 'multi-focus') {
      const selected    = formData.musclesFocus ?? []
      const isEquilibre = selected.length === 0
      return (
        <View>
          <View style={styles.chipsWrap}>
            {MUSCLES_FOCUS_OPTIONS.map(muscle => {
              const isActive = muscle === 'Équilibré' ? isEquilibre : selected.includes(muscle)
              const label = t.assistant.musclesFocus[muscle as keyof typeof t.assistant.musclesFocus] ?? muscle
              return (
                <TouchableOpacity
                  key={muscle}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => toggleMusclesFocus(muscle)}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleMultiNext}
          >
            <Text style={styles.nextBtnText}>{t.assistant.next}</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (step.kind === 'multi-muscle') {
      const selected     = formData.muscleGroups ?? []
      const hasSelection = selected.length > 0
      return (
        <View>
          <View style={styles.chipsWrap}>
            {MUSCLE_OPTIONS.map(opt => {
              const isActive = selected.includes(String(opt.value))
              return (
                <TouchableOpacity
                  key={String(opt.value)}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => toggleMuscleGroup(String(opt.value))}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <TouchableOpacity
            style={[styles.nextBtn, !hasSelection && styles.nextBtnDisabled]}
            disabled={!hasSelection}
            onPress={handleMultiNext}
          >
            <Text style={styles.nextBtnText}>{t.assistant.next}</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (step.kind === 'multi-injuries') {
      const selected = formData.injuries ?? []
      return (
        <View>
          <View style={styles.chipsWrap}>
            {INJURIES_OPTIONS.map(opt => {
              const isActive = selected.includes(String(opt.value))
              return (
                <TouchableOpacity
                  key={String(opt.value)}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => toggleInjuries(String(opt.value))}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={handleMultiNext}>
            <Text style={styles.nextBtnText}>{t.assistant.next}</Text>
          </TouchableOpacity>
        </View>
      )
    }

    // Single choice
    const selectedValue = formData[step.field]
    return (
      <View style={styles.optionsList}>
        {step.options?.map(opt => {
          const isSelected = opt.value === selectedValue
          return (
            <TouchableOpacity
              key={String(opt.value)}
              style={[styles.optionCard, isSelected && styles.optionCardActive]}
              onPress={() => handleSelect(step.field, opt.value)}
            >
              <View style={styles.optionRow}>
                {opt.icon !== undefined && (
                  <Ionicons name={opt.icon} size={24} color={colors.primary} />
                )}
                <View style={styles.optionTextWrap}>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                    {opt.label}
                  </Text>
                  {opt.sub !== undefined && (
                    <Text style={styles.optionSub}>{opt.sub}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  // ─── Main render ──────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* ── Barre de progression ── */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange:  [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* ── Header : retour + compteur + badge provider ── */}
      <View style={styles.header}>
        {currentStep > 0 ? (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}
        <Text style={styles.stepCounter}>{currentStep + 1} / {totalSteps}</Text>
        <View style={[styles.badge, styles.badgeContent]}>
          <Ionicons
            name={providerLabel === 'Offline' ? 'cloud-offline-outline' : 'flash-outline'}
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.badgeText}>{providerLabel}</Text>
        </View>
      </View>

      {/* ── Contenu ── */}
      {isGenerating ? (
        <View style={styles.generatingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.generatingText}>{t.assistant.generating}</Text>
        </View>
      ) : (
        <Animated.View style={[styles.contentWrapper, { opacity: contentAnim }]}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.question}>{step?.question}</Text>
            {step?.subtitle !== undefined && (
              <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            )}
            {renderStepContent()}
          </ScrollView>
        </Animated.View>
      )}

      {/* ── Bouton recommencer ── */}
      {currentStep > 0 && (
        <TouchableOpacity style={styles.resetFooterBtn} onPress={handleResetRequest}>
          <Text style={styles.resetFooterBtnText}>{t.assistant.restart}</Text>
        </TouchableOpacity>
      )}

      <AlertDialog
        visible={isResetAlertVisible}
        title={t.assistant.restartTitle}
        message={t.assistant.restartMessage}
        onConfirm={handleReset}
        onCancel={() => setIsResetAlertVisible(false)}
        confirmText={t.assistant.restart}
        cancelText={t.common.cancel}
      />

      <AlertDialog
        visible={errorAlertVisible}
        title={t.assistant.errorTitle}
        message={errorAlertMessage}
        onConfirm={() => setErrorAlertVisible(false)}
        onCancel={() => setErrorAlertVisible(false)}
        confirmText={t.common.ok}
        confirmColor={colors.primary}
        hideCancel
      />
    </View>
  )
}

// ─── withObservables — injecte programs et user ───────────────────────────────

export default withObservables([], () => ({
  programs: database.get<Program>('programs').query().observe(),
  user: database.get<User>('users').query().observe().pipe(map(list => list[0] || null)),
}))(AssistantScreenInner)

// ─── Styles ───────────────────────────────────────────────────────────────────

function useStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // ── Progress ────────────────────────────────────────────────────────────
    progressTrack: {
      height: 6,
      backgroundColor: colors.card,
      width: '100%',
    },
    progressFill: {
      height: 6,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.sm,
    },

    // ── Header ──────────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    backBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.md,
      backgroundColor: colors.card,
    },
    backBtnText: {
      color: colors.text,
      fontSize: fontSize.lg,
      fontWeight: '600',
    },
    backBtnPlaceholder: {
      width: 40,
      height: 40,
    },
    stepCounter: {
      color: colors.text,
      fontSize: fontSize.md,
      fontWeight: '600',
    },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
    },
    badgeContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    badgeText: {
      color: colors.text,
      fontSize: fontSize.sm,
      fontWeight: '600',
    },

    // ── Generating spinner ───────────────────────────────────────────────────
    generatingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.md,
    },
    generatingText: {
      color: colors.textSecondary,
      fontSize: fontSize.md,
      fontWeight: '500',
    },

    // ── Content wrapper (fade animation) ────────────────────────────────────
    contentWrapper: {
      flex: 1,
    },

    // ── Scroll ──────────────────────────────────────────────────────────────
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
    },

    // ── Question ────────────────────────────────────────────────────────────
    question: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.sm,
      lineHeight: 34,
    },

    // ── Step subtitle ────────────────────────────────────────────────────────
    stepSubtitle: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
      marginBottom: spacing.lg,
      lineHeight: 20,
    },

    // ── Options single-choice ────────────────────────────────────────────────
    optionsList: {
      gap: spacing.sm,
    },
    optionCard: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    optionCardActive: {
      borderColor: colors.primary,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    optionTextWrap: {
      flex: 1,
    },
    optionLabel: {
      color: colors.text,
      fontSize: fontSize.md,
      fontWeight: '600',
    },
    optionLabelActive: {
      color: colors.primary,
    },
    optionSub: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
      marginTop: 2,
    },

    // ── Chips multi-select ───────────────────────────────────────────────────
    chipsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    chipActive: {
      borderColor: colors.primary,
    },
    chipText: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
      fontWeight: '500',
    },
    chipTextActive: {
      color: colors.text,
      fontWeight: '600',
    },

    // ── Bouton Suivant ───────────────────────────────────────────────────────
    nextBtn: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    nextBtnDisabled: {
      opacity: 0.4,
    },
    nextBtnText: {
      color: colors.primaryText,
      fontSize: fontSize.md,
      fontWeight: '700',
    },

    // ── Bouton recommencer (footer) ──────────────────────────────────────────
    resetFooterBtn: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    resetFooterBtnText: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
      fontWeight: '500',
    },
  })
}
