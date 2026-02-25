# feat(visual-components) — Heatmap, Recap enrichi, Export donnees

Date : 2026-02-25

## Feature
Phase 1 Fondations — Groupe D : Composants visuels
- #90 Heatmap calendrier annuel (style GitHub)
- #8 Recap post-seance enrichi (XP, niveau, streak)
- #92 Export donnees (JSON via partage systeme)

## Stories implementees

| Story | Description |
|-------|-------------|
| S01 | Helper `buildHeatmapData` + 6 tests unitaires |
| S02 | Composant `HeatmapCalendar` (React.memo, ScrollView, intensityColors) |
| S03 | Integration heatmap sur HomeScreen (card Activite) |
| S04 | Recap enrichi — section gamification dans WorkoutSummarySheet |
| S05 | Installation expo-file-system + expo-sharing |
| S06 | Helper `exportAllData` (9 tables, ai_api_key exclu) |
| S07 | Bouton export dans SettingsScreen + partage natif |

## Fichiers nouveaux
- `mobile/src/components/HeatmapCalendar.tsx`
- `mobile/src/model/utils/exportHelpers.ts`

## Fichiers modifies
- `mobile/src/model/utils/statsHelpers.ts` — +HeatmapDay type, +buildHeatmapData()
- `mobile/src/model/utils/__tests__/statsHelpers.test.ts` — +6 tests heatmap
- `mobile/src/screens/HomeScreen.tsx` — +heatmap card entre gamification et tuiles
- `mobile/src/screens/__tests__/HomeScreen.test.tsx` — +mock buildHeatmapData
- `mobile/src/components/WorkoutSummarySheet.tsx` — +section gamification (XP, niveau, streak)
- `mobile/src/components/__tests__/WorkoutSummarySheet.test.tsx` — +3 props defaultProps
- `mobile/src/screens/WorkoutScreen.tsx` — +3 useState gamification, +setters dans handleConfirmEnd
- `mobile/src/screens/SettingsScreen.tsx` — +section Donnees, +handleExport, +AlertDialog erreur
- `mobile/package.json` — +expo-file-system ~18.0.12, +expo-sharing ~13.0.1

## Ce qui a ete fait

### Heatmap (S01-S03)
- Helper `buildHeatmapData()` reutilise `computeCalendarData()` et `toDateKey()` existants pour generer 365 HeatmapDay[] (date, count, dayOfWeek ISO)
- Composant `HeatmapCalendar` : ScrollView horizontal, ~53 colonnes x 7 lignes, cellules 12x12 colorees via `intensityColors` du theme, labels mois, legende, scroll initial a droite
- Optimise avec React.memo + useMemo pour colonnes et labels
- Integre sur HomeScreen dans une card "Activite" entre gamification et sections

### Recap enrichi (S04)
- Section gamification ajoutee dans WorkoutSummarySheet entre statsGrid et separator
- Affiche : XP gagnes, niveau actuel, streak actuel
- Donnees calculees dans WorkoutScreen.handleConfirmEnd(), stockees en useState, passees en props
- Flow navigation inchange (summary → milestone → Home)

### Export donnees (S05-S07)
- `exportAllData()` : query 9 tables via `record._raw`, exclut `ai_api_key` des users via destructuring, genere JSON avec metadata (date, version, schema, counts)
- Ecrit dans `FileSystem.documentDirectory` avec nom `wegogym-export-YYYY-MM-DD.json`
- Section "Donnees" dans Settings avec bouton, loading state, erreur AlertDialog, hint
- Partage via `Sharing.shareAsync()` avec mimeType JSON

## Verification
- TypeScript : 0 erreur
- Tests : 66 suites, 1186 passed, 0 failed
- Criteres d'acceptation : 7/7 stories PASSED (voir docs/bmad/07-qa-report.md)
