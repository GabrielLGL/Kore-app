# feat(theme) — Infrastructure thème dark/light dynamique
Date : 2026-02-26 15:30

## Instruction
docs/bmad/prompts/20260226-theme-B.md

## Rapport source
docs/bmad/prompts/20260226-theme-B.md (description directe / rapport de tâche)

## Classification
Type : feat
Fichiers modifiés :
- mobile/src/theme/index.ts
- mobile/src/contexts/ThemeContext.tsx (NOUVEAU)
- mobile/src/model/schema.ts
- mobile/src/model/models/User.ts

## Ce qui a été fait

### 1. mobile/src/theme/index.ts
- Ajout de `lightColors` — 22 clés identiques à `colors` avec valeurs neumorphiques light (#e8ecef bg)
- Ajout de `neuShadowLight` — ombres Platform-aware avec shadowColor `#b0b8c1` (light)
- Ajout du type `ThemeColors = typeof colors`
- Ajout du type `ThemeMode = 'dark' | 'light'`
- Ajout de `getThemeColors(mode)` — retourne la palette active
- Ajout de `getThemeNeuShadow(mode)` — retourne les ombres actives
- `Platform` était déjà importé — aucun import supplémentaire nécessaire

### 2. mobile/src/contexts/ThemeContext.tsx (NOUVEAU)
- Créé le répertoire `mobile/src/contexts/`
- `ThemeContextValue` interface : mode, colors, neuShadow, isDark, toggleTheme, setThemeMode
- `ThemeProvider` : useState + persistTheme via `database.write()` (conformité CLAUDE.md)
- `useTheme()` : lance une Error si hors Provider
- `useColors()` : alias pratique pour accéder aux couleurs seulement
- `__DEV__` guard sur console.error

### 3. mobile/src/model/schema.ts
- version: 22 → version: 23 (v23 : thème dynamique dark/light)
- Ajout colonne `{ name: 'theme_mode', type: 'string', isOptional: true }` dans la table `users`

### 4. mobile/src/model/models/User.ts
- Ajout `@text('theme_mode') themeMode!: string | null` après `totalPrs`

## Vérification
- TypeScript : ✅ zéro erreur (EXIT_CODE:0)
- Tests : ⚠️ 4 tests pré-existants cassés (non liés à mes changements)
  - `Exercise › deleteAllAssociatedData` — `Exercise.ts` a `batch(batch)` au lieu de `batch(...batch)` (modif pré-existante)
  - `databaseHelpers › importPresetProgram` — `programImportUtils.ts` modifié pré-existant
  - Ces 4 tests échouaient avant mes changements (confirmé par git stash)
  - 1253 tests passent ✅
- Nouveau test créé : non (infrastructure pure, pas de logique métier)

## Documentation mise à jour
Aucune (ThemeContext est auto-documenté par JSDoc inline et CLAUDE.md ne nécessite pas encore de mise à jour)

## Statut
✅ Résolu — 20260226-1530

## Commit
c6e21b1 feat(theme): infrastructure thème dark/light — lightColors, ThemeContext, schema v23
