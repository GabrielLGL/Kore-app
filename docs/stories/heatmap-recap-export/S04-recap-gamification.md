# S04 — Recap enrichi (gamification dans WorkoutSummarySheet)

## Description
En tant qu'utilisateur venant de terminer une seance, je veux voir mes XP gagnes, mon niveau et mon streak dans le resume de fin, afin de ressentir une satisfaction immediate apres l'effort.

## Dependance
Aucune (independant du heatmap et de l'export)

## Fichiers concernes
- `mobile/src/components/WorkoutSummarySheet.tsx` (MODIFIE)
- `mobile/src/screens/WorkoutScreen.tsx` (MODIFIE)

## Taches techniques

### 1. Nouvelles props sur WorkoutSummarySheet
```typescript
interface WorkoutSummarySheetProps {
  // ... props existantes (visible, onClose, durationSeconds, totalVolume, totalSets, totalPrs, historyId)
  xpGained: number
  level: number
  currentStreak: number
}
```

### 2. Section gamification dans le JSX
Inserer entre la grille de stats (`statsGrid`) et le separateur :
```tsx
<View style={styles.gamificationSection}>
  <View style={styles.gamRow}>
    <Text style={styles.gamItem}>
      <Text style={{ color: colors.warning }}>⭐</Text> +{xpGained} XP
    </Text>
    <Text style={styles.gamItem}>
      <Text style={{ color: colors.primary }}>🎯</Text> Niveau {level}
    </Text>
  </View>
  <Text style={[styles.gamItem, styles.gamCenter]}>
    <Text style={{ color: currentStreak > 0 ? colors.success : colors.textSecondary }}>🔥</Text> Streak {currentStreak}
  </Text>
</View>
```

### 3. Styles gamification
```typescript
gamificationSection: {
  backgroundColor: colors.cardSecondary,
  borderRadius: borderRadius.sm,
  padding: spacing.md,
  marginBottom: spacing.md,
}
gamRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: spacing.xs,
}
gamItem: {
  color: colors.text,
  fontSize: fontSize.md,
  fontWeight: '600',
}
gamCenter: {
  textAlign: 'center',
}
```

### 4. WorkoutScreen — stocker les resultats gamification
Ajouter 3 useState :
```typescript
const [sessionXPGained, setSessionXPGained] = useState(0)
const [newLevelResult, setNewLevelResult] = useState(1)
const [newStreakResult, setNewStreakResult] = useState(0)
```

Dans `handleConfirmEnd()`, apres les calculs existants de sessionXP/newLevel/streakResult :
```typescript
setSessionXPGained(sessionXP)
setNewLevelResult(newLevel)
setNewStreakResult(streakResult.currentStreak)
```

### 5. Passer les props au sheet
```tsx
<WorkoutSummarySheet
  visible={summaryVisible}
  onClose={handleClose}
  durationSeconds={durationSeconds}
  totalVolume={totalVolume}
  totalSets={completedSets}
  totalPrs={totalPrs}
  historyId={historyId}
  xpGained={sessionXPGained}
  level={newLevelResult}
  currentStreak={newStreakResult}
/>
```

### 6. Cas ou gamification n'a pas ete calculee
Si l'utilisateur termine sans aucune serie validee (`completedSets === 0`), la gamification n'est pas calculee. Les valeurs restent a 0/1/0 (valeurs initiales des useState). Le sheet affiche quand meme la section mais avec +0 XP / Niveau 1 / Streak 0. C'est acceptable.

## Criteres d'acceptation
- [ ] Section gamification visible dans le WorkoutSummarySheet
- [ ] Affiche XP gagnes, niveau, streak
- [ ] Donnees passees en props depuis WorkoutScreen
- [ ] State gamification stocke dans useState (pas de query supplementaire)
- [ ] Flow de navigation inchange (summary → milestone → Home)
- [ ] Styles coherents avec le theme (cardSecondary, pas de hardcoded)
- [ ] `npx tsc --noEmit` → 0 erreur

## Estimation
M (30-60 min)
