# Bugs silencieux — 2026-02-19

## Résumé : 🔴 3 critiques / 🟡 5 warnings

---

### Critiques

| Fichier | Ligne | Type | Description |
|---------|-------|------|-------------|
| `screens/AssistantScreen.tsx` | 125–137 | Async sans try/catch | `handleValidate` appelle `importGeneratedPlan` et `importGeneratedSession` sans try/catch. Si l'écriture DB échoue, l'exception est non gérée, `previewModal.close()` n'est jamais appelé et la modale reste bloquée ouverte. |
| `screens/AssistantScreen.tsx` | 132 | Null safety — accès tableau | `plan.sessions[0]` est accédé sans vérifier que `plan.sessions.length > 0`. Si l'IA retourne un plan avec `sessions: []`, passe `undefined` à `importGeneratedSession`, qui crash à la ligne `genSession.exercises.map(...)`. |
| `screens/ChartsScreen.tsx` | 75–90 | Async sans try/catch | `handleDeleteStat` appelle `database.write()` sans try/catch. En cas d'échec DB, `setIsAlertVisible(false)` et `setSelectedStat(null)` ne sont jamais appelés → alerte reste visible et `selectedStat` reste dans l'état erreur. |

---

### Warnings

| Fichier | Ligne | Type | Description |
|---------|-------|------|-------------|
| `model/utils/databaseHelpers.ts` | 288 | Division par zéro théorique | `recentSets.reduce(...) / recentSets.length` dans `getLastPerformanceForExercise`. Si `recentSets` est vide (edge case : history présente en DB mais aucun set associé), produit `NaN` qui se propage silencieusement dans `avgReps`. |
| `screens/SettingsScreen.tsx` | 70 | Promesse non awaited | `handleSelectProvider` appelle `handleSaveAI(key, aiApiKey)` sans `await`. La sauvegarde DB est fire-and-forget : un changement rapide de provider peut entraîner des écritures DB dans le mauvais ordre. |
| `screens/SettingsScreen.tsx` | 74 | Promesse non awaited | `handleApiKeyBlur` appelle `handleSaveAI(aiProvider, aiApiKey)` sans `await`. Même problème : si l'utilisateur blur puis re-focus rapidement, deux `database.write()` peuvent se chevaucher. |
| `components/RestTimer.tsx` | 30–36 | Fuite mémoire — notification stale | Le premier `useEffect` planifie une notification via `scheduleRestEndNotification` mais n'a **aucun cleanup**. Si le composant est démonté avant la fin du décompte (ex: l'utilisateur quitte la séance manuellement), la notification continue d'être planifiée et se déclenchera quand même. |
| `components/RestTimer.tsx` | 71, 86 | Promesse non awaited — rejet potentiel | `cancelNotification(notificationIdRef.current)` est appelé sans `await` ni `.catch()` dans `finishTimer` et `closeTimer`. Or `cancelNotification` appelle `cancelScheduledNotificationAsync` sans try/catch — si cette API rejette, le rejet est non géré. |

---

## Détails

### 🔴 AssistantScreen.tsx — handleValidate (lignes 125–137)

```tsx
// ❌ PAS de try/catch
const handleValidate = useCallback(async (plan: GeneratedPlan) => {
  if (mode === 'program') {
    await importGeneratedPlan(plan)      // peut throw (DB write)
    previewModal.close()                 // jamais appelé si throw
    navigation.navigate('Home')
  } else {
    if (!targetProgramId) return
    const session = await importGeneratedSession(plan.sessions[0], targetProgramId) // [0] non sécurisé
    previewModal.close()                 // jamais appelé si throw
    navigation.getParent()?.navigate('SessionDetail', { sessionId: session.id })
  }
}, [mode, targetProgramId, navigation])
```

**Double bug :** pas de try/catch + accès `[0]` non gardé.

---

### 🔴 ChartsScreen.tsx — handleDeleteStat (lignes 75–90)

```tsx
// ❌ PAS de try/catch
const handleDeleteStat = async () => {
  if (!selectedStat) return
  await database.write(async () => {   // peut throw
    // ...
  })
  setIsAlertVisible(false)   // jamais atteint si throw
  setSelectedStat(null)      // jamais atteint si throw
  haptics.onDelete()
}
```

---

### 🟡 RestTimer.tsx — notification non annulée au démontage (lignes 30–36)

```tsx
useEffect(() => {
  if (notificationEnabled) {
    scheduleRestEndNotification(duration).then(id => {
      notificationIdRef.current = id
    })
  }
  // ❌ AUCUN return cleanup → notification jamais annulée au démontage
}, [])
```

Le cleanup du second `useEffect` (lignes 61–66) efface les timers mais pas la notification :
```tsx
return () => {
  if (timerRef.current) clearInterval(timerRef.current)
  if (hapticTimer1Ref.current) clearTimeout(hapticTimer1Ref.current)
  if (hapticTimer2Ref.current) clearTimeout(hapticTimer2Ref.current)
  if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  // ❌ cancelNotification(notificationIdRef.current) manquant
}
```
