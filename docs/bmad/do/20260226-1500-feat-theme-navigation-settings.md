# FEAT(theme) — ThemeProvider navigation + toggle dark/light Settings
Date : 2026-02-26 15:00

## Instruction
docs/bmad/prompts/20260226-theme-C.md

## Rapport source
Description directe (prompt Groupe C)

## Classification
Type : feat
Fichiers modifiés :
- mobile/src/navigation/index.tsx
- mobile/src/screens/SettingsScreen.tsx
- mobile/src/screens/__tests__/SettingsScreen.test.tsx

## Ce qui a été fait

### navigation/index.tsx
- Suppression de l'import statique `colors` depuis `../theme`
- Ajout des imports `ThemeProvider`, `useTheme` depuis `../contexts/ThemeContext` et `type ThemeMode` depuis `../theme`
- Suppression de la constante statique `MyDarkTheme`
- Extraction d'un composant `AppContent` (enfant de ThemeProvider) qui :
  - Consomme `useTheme()` pour les couleurs et le mode dynamiques
  - Possède le `navigationRef` et le `initialRoute` (état onboarding)
  - Calcule `navTheme` dynamiquement (réactif au changement de mode)
  - `statusBarStyle` bascule : `'light'` en dark, `'dark'` en light
- `AppNavigator` :
  - Charge la préférence de thème depuis DB au démarrage (`users[0].themeMode`)
  - Fournit `<ThemeProvider initialMode={initialMode}>` autour de `AppContent`
  - Écran vide (`null`) pendant le chargement de la préférence

### SettingsScreen.tsx
- Import `colors` retiré de `../theme`, ajout `useTheme` depuis `../contexts/ThemeContext`
- `const { colors, isDark, toggleTheme } = useTheme()` ajouté dans `SettingsContent`
- `StyleSheet.create({...})` déplacé à l'intérieur du composant (couleurs dynamiques)
- Section **🎨 Apparence** ajoutée après "Section Mon profil" :
  - Label dynamique : "Mode sombre" / "Mode clair"
  - Description : fond neumorphique selon le mode
  - `Switch` qui appelle `toggleTheme()` avec haptic feedback

### SettingsScreen.test.tsx
- Mock `useTheme` ajouté (retourne `colors` dark + `mockToggleTheme`)
- `getByRole('switch')` → `getAllByRole('switch')[1]` pour les tests du Minuteur (index 0 = Apparence, index 1 = Minuteur)
- 2 nouveaux tests dans `describe('SettingsContent — section Apparence')` :
  - Affichage du switch et du titre
  - Appel de `toggleTheme` au changement

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 28 passed (26 + 2 nouveaux Apparence)
- Nouveau test créé : oui (2 tests section Apparence)

## Documentation mise à jour
aucune (comportement décrit dans CLAUDE.md section 2.2 — ThemeContext déjà documenté)

## Statut
✅ Résolu — 20260226-1500

## Commit
[à remplir]
