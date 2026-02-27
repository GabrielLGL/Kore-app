import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, FlatList, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import withObservables from '@nozbe/with-observables'
import { Q } from '@nozbe/watermelondb'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp } from '@react-navigation/native'
import { database } from '../model/index'
import Program from '../model/models/Program'
import Session from '../model/models/Session'
import { SessionPreviewRow } from '../components/ProgramDetailBottomSheet'
import { BottomSheet } from '../components/BottomSheet'
import { CustomModal } from '../components/CustomModal'
import { AlertDialog } from '../components/AlertDialog'
import { useProgramManager } from '../hooks/useProgramManager'
import { useHaptics } from '../hooks/useHaptics'
import { useColors } from '../contexts/ThemeContext'
import { RootStackParamList } from '../navigation/index'
import { fontSize, spacing, borderRadius } from '../theme'
import type { ThemeColors } from '../theme'

interface Props {
  program: Program
  sessions: Session[]
  programs: Program[]
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProgramDetail'>
  route: RouteProp<RootStackParamList, 'ProgramDetail'>
}

const ProgramDetailScreenInner: React.FC<Props> = ({ program, sessions, programs, navigation }) => {
  const colors = useColors()
  const styles = useStyles(colors)
  const haptics = useHaptics()

  const {
    sessionNameInput,
    setSessionNameInput,
    isRenamingSession,
    setIsRenamingSession,
    selectedSession,
    setSelectedSession,
    setTargetProgram,
    saveSession,
    duplicateSession,
    deleteSession,
    moveSession,
    prepareRenameSession,
  } = useProgramManager(haptics.onSuccess)

  const [isSessionModalVisible, setIsSessionModalVisible] = useState(false)
  const [isSessionOptionsVisible, setIsSessionOptionsVisible] = useState(false)
  const [isAlertVisible, setIsAlertVisible] = useState(false)
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', onConfirm: async () => {} })

  const renameSessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    navigation.setOptions({ title: program.name })
  }, [navigation, program.name])

  useEffect(() => {
    return () => {
      if (renameSessionTimerRef.current) clearTimeout(renameSessionTimerRef.current)
    }
  }, [])

  const handleAddSession = useCallback(() => {
    haptics.onPress()
    setTargetProgram(program)
    setIsRenamingSession(false)
    setSessionNameInput('')
    setIsSessionModalVisible(true)
  }, [haptics, program, setTargetProgram, setIsRenamingSession, setSessionNameInput])

  const handleSaveSession = async () => {
    const success = await saveSession()
    if (success) {
      setIsSessionModalVisible(false)
    }
  }

  const handleSessionOptions = useCallback((session: Session) => {
    haptics.onSelect()
    setSelectedSession(session)
    setIsSessionOptionsVisible(true)
  }, [haptics, setSelectedSession])

  const handleDuplicateSession = async () => {
    setIsSessionOptionsVisible(false)
    await duplicateSession()
  }

  const handleMoveSession = async (targetProg: Program) => {
    await moveSession(targetProg)
    setIsSessionOptionsVisible(false)
  }

  const renderSession = useCallback(({ item }: { item: Session }) => (
    <SessionPreviewRow
      session={item}
      onPress={() => {
        haptics.onPress()
        navigation.navigate('SessionDetail', { sessionId: item.id })
      }}
      onOptionsPress={() => handleSessionOptions(item)}
    />
  ), [haptics, navigation, handleSessionOptions])

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={item => item.id}
        renderItem={renderSession}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune séance pour l'instant</Text>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={handleAddSession}>
            <Text style={styles.addButtonText}>+ Ajouter une séance</Text>
          </TouchableOpacity>
        }
      />

      {/* Options Séance BottomSheet */}
      <BottomSheet
        visible={isSessionOptionsVisible}
        onClose={() => setIsSessionOptionsVisible(false)}
        title={selectedSession?.name}
      >
        <TouchableOpacity
          style={styles.sheetOption}
          onPress={() => {
            if (selectedSession) prepareRenameSession(selectedSession)
            setIsSessionOptionsVisible(false)
            if (renameSessionTimerRef.current) clearTimeout(renameSessionTimerRef.current)
            renameSessionTimerRef.current = setTimeout(() => {
              setIsSessionModalVisible(true)
              renameSessionTimerRef.current = null
            }, 300)
          }}
        >
          <Ionicons name="pencil-outline" size={20} color={colors.text} style={{ marginRight: 20, width: 30 }} />
          <Text style={styles.sheetOptionText}>Renommer la Séance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sheetOption} onPress={handleDuplicateSession}>
          <Ionicons name="copy-outline" size={20} color={colors.text} style={{ marginRight: 20, width: 30 }} />
          <Text style={styles.sheetOptionText}>Dupliquer la Séance</Text>
        </TouchableOpacity>
        {programs.length > 1 && (
          <>
            <Text style={styles.sectionLabel}>Déplacer vers :</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moveRow}>
              {programs.filter(p => p.id !== program.id).map(p => (
                <TouchableOpacity key={p.id} style={styles.moveChip} onPress={() => handleMoveSession(p)}>
                  <Text style={styles.moveChipText}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
        <TouchableOpacity
          style={styles.sheetOption}
          onPress={() => {
            setIsSessionOptionsVisible(false)
            setAlertConfig({
              title: `Supprimer ${selectedSession?.name} ?`,
              message: 'Supprimer cette séance ?',
              onConfirm: async () => { await deleteSession() },
            })
            setIsAlertVisible(true)
          }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} style={{ marginRight: 20, width: 30 }} />
          <Text style={[styles.sheetOptionText, { color: colors.danger }]}>Supprimer la Séance</Text>
        </TouchableOpacity>
      </BottomSheet>

      {/* Session Modal (Création / Renommage) */}
      <CustomModal
        visible={isSessionModalVisible}
        title={isRenamingSession ? 'Renommer la séance' : 'Ajouter une séance'}
        onClose={() => setIsSessionModalVisible(false)}
        buttons={
          <>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.secondaryButton }]}
              onPress={() => setIsSessionModalVisible(false)}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveSession}
            >
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
          </>
        }
      >
        <TextInput
          style={styles.input}
          value={sessionNameInput}
          onChangeText={setSessionNameInput}
          autoFocus
          placeholderTextColor={colors.textSecondary}
          placeholder="ex : Push ou Pull"
        />
      </CustomModal>

      {/* AlertDialog Suppression */}
      <AlertDialog
        visible={isAlertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={async () => {
          await alertConfig.onConfirm()
          setIsAlertVisible(false)
        }}
        onCancel={() => setIsAlertVisible(false)}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </SafeAreaView>
  )
}

function useStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    listContent: { padding: spacing.md, paddingBottom: 100 },
    emptyText: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
      textAlign: 'center',
      paddingVertical: spacing.lg,
    },
    addButton: {
      marginTop: spacing.sm,
      padding: spacing.md,
      backgroundColor: colors.cardSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
    addButtonText: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: fontSize.sm,
    },
    sheetOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.cardSecondary,
    },
    sheetOptionText: { color: colors.text, fontSize: 17, fontWeight: '500' },
    sectionLabel: {
      color: colors.textSecondary,
      fontSize: fontSize.xs,
      marginTop: 20,
      marginBottom: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginLeft: 5,
    },
    moveRow: { flexDirection: 'row', marginBottom: 10 },
    moveChip: {
      backgroundColor: colors.cardSecondary,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    moveChipText: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600' },
    input: {
      backgroundColor: colors.cardSecondary,
      color: colors.text,
      padding: spacing.ms,
      borderRadius: 10,
      fontSize: fontSize.md,
      textAlign: 'center',
    },
    modalButton: {
      flex: 0.47,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: { color: colors.text, fontWeight: 'bold', fontSize: fontSize.bodyMd },
  })
}

const EnhancedProgramDetailScreen = withObservables(
  ['route'],
  ({ route }: { route: RouteProp<RootStackParamList, 'ProgramDetail'> }) => ({
    program: database.get<Program>('programs').findAndObserve(route.params.programId),
    sessions: database.get<Session>('sessions').query(
      Q.where('program_id', route.params.programId),
      Q.sortBy('position', Q.asc)
    ).observe(),
    programs: database.get<Program>('programs').query(Q.sortBy('position', Q.asc)).observe(),
  })
)(ProgramDetailScreenInner)

export default EnhancedProgramDetailScreen
