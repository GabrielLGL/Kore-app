# style(SettingsScreen) — encodage UTF-8 + gradient fond + neumorphisme
Date : 2026-02-26 19:30

## Instruction
Dans mobile/src/screens/SettingsScreen.tsx, faire 3 choses :
1. Remplacer les patterns unicode fragiles par de vrais caractères UTF-8
2. Wrapper le SafeAreaView dans un LinearGradient comme HomeScreen
3. Ajouter des ombres neumorphiques sur les sections via neuShadow

## Rapport source
Description directe (pas de rapport morning/verrif)

## Classification
Type : style
Fichiers modifiés : mobile/src/screens/SettingsScreen.tsx

## Ce qui a été fait

### 1. Encodage UTF-8
Remplacement de 8 occurrences d'échappements unicode :
- L322: `'Exporter mes donn\u00e9es Kore'` → `'Exporter mes données Kore'`
- L501: `{'\u2B50'}` → `⭐`
- L506: `s{'\u00E9'}ances` → `séances`
- L541: `s{'\u00E9'}ances/sem` → `séances/sem`
- L572: `{'\uD83D\uDCBE'} Donn{'\u00e9'}es` → `💾 Données`
- L580: `'Exporter mes donn\u00e9es'` → `'Exporter mes données'`
- L583: `Vos donn{'\u00e9'}es vous appartiennent` → `Vos données vous appartiennent`
- L589: `"Impossible d'exporter les donn\u00e9es. Veuillez r\u00e9essayer."` → version littérale

### 2. Gradient fond
- Ajout import `{ LinearGradient } from 'expo-linear-gradient'`
- Wrapping du `<SafeAreaView>` dans `<LinearGradient colors={[bgGradientStart, bgGradientEnd]} ...>`
- `container.backgroundColor` → `'transparent'`

### 3. Neumorphisme
- Ajout `neuShadow` dans la destructuration `useTheme()`
- `section` : ajout `...neuShadow.elevatedSm`
- `exportButton` : ajout `...neuShadow.elevatedSm`
- `streakTargetBtn` (normal) : ajout `...neuShadow.pressed`
- `streakTargetBtnActive` (actif) : ajout `...neuShadow.elevatedSm`

## Vérification
- TypeScript : ✅ zéro erreur (`npx tsc --noEmit`)
- Tests : ✅ 1255 passed (4 failures pré-existantes dans models.test.ts, non liées)
- Nouveau test créé : non (changement style pur)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260226-1930

## Commit
[sera rempli après commit]
