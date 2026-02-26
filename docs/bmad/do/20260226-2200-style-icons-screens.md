# style(icons) — Remplacer emojis par Ionicons dans 5 écrans principaux
Date : 2026-02-26 22:00

## Instruction
docs/bmad/prompts/20260226-2200-ui-polish-B.md

## Rapport source
description directe (prompt de tâche)

## Classification
Type : style
Fichiers modifiés :
- `mobile/src/screens/HomeScreen.tsx`
- `mobile/src/screens/SettingsScreen.tsx`
- `mobile/src/screens/StatsScreen.tsx`
- `mobile/src/screens/StatsCalendarScreen.tsx`
- `mobile/src/screens/AssistantScreen.tsx`
- `mobile/src/screens/__tests__/SettingsScreen.test.tsx`
- `mobile/src/screens/__tests__/AssistantScreen.test.tsx`
- `mobile/__mocks__/vectorIconsMock.js` (nouveau)
- `mobile/jest.config.js`

## Ce qui a été fait

### HomeScreen.tsx
- Ajout `import { Ionicons } from '@expo/vector-icons'`
- `Tile.icon: string` → `keyof typeof Ionicons.glyphMap`
- SECTIONS : emoji → noms Ionicons (`library-outline`, `barbell-outline`, `time-outline`, `calendar-outline`, `body-outline`, `trophy-outline`, `resize-outline`, `list-outline`)
- Grille : `<Text emoji>` → `<Ionicons name={tile.icon} size={28} color={colors.primary} />`
- Bouton settings : `⚙️` → `<Ionicons name="settings-outline" size={22} />`
- Badges row : `🏅 Mes Badges` → `<View row><Ionicons name="medal-outline" /><Text>Mes Badges</Text></View>`
- Suppression styles `btnIcon` et `settingsIcon`, ajout `badgesLabelRow`

### SettingsScreen.tsx
- Ajout `import { Ionicons } from '@expo/vector-icons'`
- Ajout style `sectionTitleRow` (flexRow + gap)
- Remplacement de TOUS les titres de section emoji par `<View sectionTitleRow><Ionicons /><Text /></View>` :
  - 👤 Mon profil → `person-outline`
  - 🎨 Apparence → `color-palette-outline`
  - ⏱️ Minuteur → `time-outline`
  - ⭐ Gamification → `star-outline`
  - ✨ IA → `hardware-chip-outline`
  - 💾 Données → `save-outline`
  - ℹ️ À propos → `information-circle-outline`
  - ❓ Aide → `help-circle-outline`

### StatsScreen.tsx
- Ajout `import { Ionicons } from '@expo/vector-icons'`
- `StatButton.icon: string` → `keyof typeof Ionicons.glyphMap`
- STAT_BUTTONS : emoji → noms Ionicons (`time-outline`, `barbell-outline`, `calendar-outline`, `body-outline`, `stats-chart-outline`, `resize-outline`, `list-outline`)
- Rendu : `<Text emoji>` → `<Ionicons name={btn.icon} size={28} />`
- Suppression style `btnIcon`

### StatsCalendarScreen.tsx
- Ajout `import { Ionicons } from '@expo/vector-icons'`
- `🔥` → `<Ionicons name="flame-outline" size={24} color={colors.danger} />`
- `🏆` → `<Ionicons name="trophy-outline" size={24} color={colors.warning} />`
- Suppression style `streakIcon`

### AssistantScreen.tsx
- Ajout `import { Ionicons } from '@expo/vector-icons'`
- `StepOption.icon?: string` → `keyof typeof Ionicons.glyphMap`
- MODE_OPTIONS : `📅` → `calendar-outline`, `⚡` → `flash-outline`
- GOAL_OPTIONS : emojis → `body-outline`, `barbell-outline`, `flame-outline`, `walk-outline`
- LEVEL_OPTIONS : emojis → `leaf-outline`, `trending-up-outline`, `rocket-outline`
- SPLIT_OPTIONS : emojis → `refresh-outline`, `grid-outline`, `swap-vertical-outline`, `repeat-outline`, `barbell-outline`, `star-outline`, `flash-outline`, `calendar-outline`, `swap-horizontal-outline`, `flame-outline`
- PHASE_OPTIONS : suppression emojis des labels (`'Prise de masse 🍖'` → `'Prise de masse'`, etc.)
- RECOVERY_OPTIONS : suppression emojis (`'Normale 😊'` → `'Normale'`, etc.)
- INJURIES_OPTIONS : suppression emojis (`'Aucune ✅'` → `'Aucune'`, etc.)
- AGE_GROUP_OPTIONS : suppression emojis (`'26–35 ans 💪'` → `'26–35 ans'`, etc.)
- Programmes step : `📋` → `<Ionicons name="document-text-outline" size={24} />`
- Single-choice : `<Text emoji>` → `<Ionicons name={opt.icon} size={24} />`
- Badge provider : `🔌/⚡ label` → `<Ionicons cloud-offline-outline|flash-outline size={14} /> label`
- Suppression style `optionIcon`, ajout `badgeContent` (flexRow)

### Tests adaptés
- `SettingsScreen.test.tsx` : `'🎨 Apparence'` → `'Apparence'`
- `AssistantScreen.test.tsx` : 4 labels d'emojis remplacés (`Prise de masse`, `Normale`, `Aucune`, `26–35 ans`)

### Jest config
- `__mocks__/vectorIconsMock.js` : mock Ionicons → `View` avec `testID` (évite `loadedNativeFonts` en env Jest)
- `jest.config.js` : ajout `'@expo/vector-icons': '<rootDir>/__mocks__/vectorIconsMock.js'`

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit`)
- Tests SettingsScreen + AssistantScreen : ✅ 53 passed, 0 failed
- Tests complets : ✅ 1243 passed — 16 failed PRÉ-EXISTANTS (WorkoutExerciseCard, SessionExerciseItem, StatsMeasurementsScreen — autres fichiers modifiés en parallèle, non liés à ce travail)
- Nouveau test créé : non (pas nécessaire pour du style)

## Documentation mise à jour
aucune (pas de nouveau pattern/composant)

## Statut
✅ Résolu — 20260226-2200

## Commit
3dce1db style(icons): replace emojis with Ionicons in 5 main screens
