# Passe 7/8 — Corrections — 20260223-0943

## 7a — Critiques 🔴 (2 corrigés)

### 1. ProgramsScreen.tsx:322 — Timer clear before set (program rename)
- **Avant :** `renameTimerRef.current = setTimeout(...)` sans clear previous
- **Après :** `if (renameTimerRef.current) clearTimeout(renameTimerRef.current);` avant le set

### 2. ProgramsScreen.tsx:339 — Timer clear before set (session rename)
- **Avant :** `renameSessionTimerRef.current = setTimeout(...)` sans clear previous
- **Après :** `if (renameSessionTimerRef.current) clearTimeout(renameSessionTimerRef.current);` avant le set

## 7b — Modifications feature (settings button)

### 3. HomeScreen.tsx — Roue crantée déplacée dans la header card
- Suppression `useLayoutEffect` + `setOptions` headerRight (ne marchait pas sur Android native stack)
- Ajout `TouchableOpacity` avec icône ⚙️ dans la header card, à droite du greeting
- Nouveaux styles: `headerTopRow`, `headerTextBlock`, `settingsBtn`, `settingsIcon`
- Suppression section Outils (plus nécessaire, accès via roue dans la card)

### 4. navigation/index.tsx — Header masqué pour HomeScreen
- `headerShown: false` sur HomeScreen (header vide inutile)
- Nettoyage imports: suppression `Text`, `TouchableOpacity`, `useNavigation`, `NativeStackNavigationProp`
- Suppression composant `SettingsHeaderButton` (inutilisé)

## Vérifications post-correction
- `npx tsc --noEmit` : ✅ 0 erreur
- `npm test` : ✅ 847 passed, 0 failed

## Non corrigés (effort > scope verrif)
- 🟡 50+ hardcoded spacing values → refactor design system (effort: 2h)
- 🟡 geminiProvider.ts:39 response init → risque faible, fetch try/catch en place
- 🟡 WorkoutExerciseCard observable error handler → withObservables gère les erreurs
- 🔵 Test mocks typing → cosmétique, tests fonctionnent
