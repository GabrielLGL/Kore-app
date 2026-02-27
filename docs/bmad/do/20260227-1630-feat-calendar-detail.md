# feat(stats) — calendar : masquer hors-mois + carte détail exercices
Date : 2026-02-27 16:30

## Instruction
docs/bmad/prompts/20260227-1630-calendar-detail-A.md

## Rapport source
docs/bmad/prompts/20260227-1630-calendar-detail-A.md

## Classification
Type : feat
Fichiers modifiés :
- `mobile/src/screens/StatsCalendarScreen.tsx`
- `mobile/src/screens/__tests__/StatsCalendarScreen.test.tsx`

## Ce qui a été fait

### 1. Masquer les jours hors mois
- Cellules `!day.isCurrentMonth` → `<View style={styles.daySpacer} />` (transparent, non-pressable, sans testID)
- Nouveau style `daySpacer: { width: DAY_SIZE, height: DAY_SIZE }` pour préserver l'alignement de la grille
- `generateMonthGrid` inchangé (les cellules hors-mois existent toujours pour le layout)

### 2. Carte de détail enrichie (remplacement du tooltip)
- **Nouveaux types** : `SetDetail`, `ExerciseDetail`, `DayDetail` (suppression de `SessionDetail`, `TooltipInfo`)
- **State renommé** : `tooltip` → `detail`, `setTooltip` → `setDetail`
- **handleDayPress** : fetch complet — `History → Session → Program` (programName) + `History → sets.fetch() → exercise.fetch()` (exercices + séries)
- **Logique** : groupement par nom d'exercice via `Map<string, ExerciseDetail>`, tri par `setOrder`
- **Affichage** :
  - Titre : `programName` (ou `sessionName` si pas de programme) + durée alignée à droite
  - Sous-titre : `sessionName` si différent de `programName`
  - Exercices : nom en gras + chips `80 kg × 10` (poids corps = `'PC'`)
  - PR en `colors.warning` (orange)

### 3. Styles
- Ajoutés : `detailCard`, `detailDate`, `detailRest`, `detailHeader`, `detailProgramName`, `detailDuration`, `detailSessionName`, `detailExercise`, `detailExerciseName`, `detailSetsRow`, `detailSetChip`, `detailSetText`, `detailSetPr`, `daySpacer`
- Supprimés : `tooltip`, `tooltipDate`, `tooltipRest`, `tooltipSession`, `tooltipSessionName`, `tooltipSessionDuration`

### 4. Tests (16 tests, tous ✅)
- Mock `makeHistory` enrichi : `session.program.fetch()` + `sets.fetch()`
- Renommages internes : `tooltip` → `detail`
- Nouveau test : `les jours hors mois ne sont pas pressables (pas de testID)`
- Tests programme/session : `queryByText('PPL Push')` + `queryByText('Push Day')`

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 16/16 passed
- Nouveau test créé : oui (hors-mois non pressable)

## Documentation mise à jour
Aucune (patterns déjà documentés dans CLAUDE.md)

## Statut
✅ Résolu — 20260227-1630

## Commit
[à compléter]
