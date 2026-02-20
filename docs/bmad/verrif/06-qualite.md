# Code mort & qualité — 2026-02-20

## Résumé : 57 problèmes trouvés

| Catégorie | Problèmes |
|-----------|-----------|
| Code mort | 3 |
| TypeScript (`as any` en tests) | ~50 (low priority) |
| Logs de production non gardés | 11 |
| Valeurs hardcodées (couleurs) | 9 |
| Valeurs hardcodées (magic numbers) | 30+ |
| Conventions | 0 |

---

### Code mort

| Fichier | Type | Élément |
|---------|------|---------|
| `components/SetItem.tsx` | Fichier orphelin | Composant exporté mais jamais importé en production (seulement dans les tests) |
| `services/ai/aiService.ts` | Export inutilisé | `testProviderConnection` — exportée mais jamais appelée |
| `services/ai/geminiProvider.ts` | Export inutilisé | `testGeminiConnection` — exportée mais jamais appelée |

> ✅ Aucun import inutilisé, variable non-lue, style non-référencé détecté en production.

---

### TypeScript

| Fichier | Ligne | Problème |
|---------|-------|----------|
| `hooks/__tests__/useWorkoutState.test.ts` | ~50 occurrences | `as any` pour les mocks (`se1 as any`) — acceptable en tests mais masse importante |
| `hooks/__tests__/useSessionManager.test.ts` | ~40 occurrences | `as any` pour les mocks (`mockSession as any`) |
| `hooks/__tests__/useProgramManager.test.ts` | ~30 occurrences | `as any` pour les mocks (`mockProgram as any`) |
| `services/ai/__tests__/aiService.test.ts` | 80, 90, 100, 115 | `as any` avec `eslint-disable` (intentionnel) |
| `model/utils/__tests__/databaseHelpers.test.ts` | 504–556 | `as any` pour les mocks de données |

> ⚠️ Aucun `any` ni paramètre sans type détecté en code de **production**. Les `as any` sont tous en fichiers de tests.

---

### Logs de production

| Fichier | Ligne | Code |
|---------|-------|------|
| `hooks/useProgramManager.ts` | 85 | `console.error('Failed to save program:', error)` |
| `hooks/useProgramManager.ts` | 104 | `console.error('Failed to duplicate program:', error)` |
| `hooks/useProgramManager.ts` | 124 | `console.error('Failed to delete program:', error)` |
| `hooks/useProgramManager.ts` | 159 | `console.error('Failed to save session:', error)` |
| `hooks/useProgramManager.ts` | 208 | `console.error('Failed to duplicate session:', error)` |
| `hooks/useProgramManager.ts` | 227 | `console.error('Failed to delete session:', error)` |
| `hooks/useProgramManager.ts` | 253 | `console.error('Failed to move session:', error)` |
| `hooks/useSessionManager.ts` | 108 | `console.error('Failed to add exercise:', error)` |
| `hooks/useSessionManager.ts` | 148 | `console.error('Failed to update targets:', error)` |
| `hooks/useSessionManager.ts` | 170 | `console.error('Failed to remove exercise:', error)` |
| `hooks/useSessionManager.ts` | 213 | `console.error('Failed to reorder exercises:', error)` |

> Fix : envelopper avec `if (__DEV__)` ou router vers Sentry en prod.

---

### Valeurs hardcodées

#### Couleurs (hex/rgba hors thème)

| Fichier | Ligne | Valeur |
|---------|-------|--------|
| `components/AlertDialog.tsx` | 145 | `shadowColor: '#000'` |
| `components/BottomSheet.tsx` | 137 | `shadowColor: '#000'` |
| `components/CustomModal.tsx` | 87 | `shadowColor: '#000'` |
| `screens/HomeScreen.tsx` | 389 | `shadowColor: '#000'` |
| `components/RestTimer.tsx` | 175 | `backgroundColor: 'rgba(255,255,255,0.08)'` |
| `components/WorkoutExerciseCard.tsx` | 249 | `backgroundColor: 'rgba(52, 199, 89, 0.12)'` |
| `components/WorkoutExerciseCard.tsx` | 321 | `backgroundColor: 'rgba(0,122,255,0.15)'` |
| `screens/ChartsScreen.tsx` | 277 | `(opacity) => rgba(0, 122, 255, opacity)` |
| `screens/ChartsScreen.tsx` | 278 | `(opacity) => rgba(255, 255, 255, opacity)` |

#### Magic numbers (spacing / fontSize hors tokens)

| Fichier | Lignes | Valeurs problématiques |
|---------|--------|------------------------|
| `screens/ExercisesScreen.tsx` | 171, 285–308 | `height: 45`, `fontSize: 13/15/17`, `marginTop: 3/10`, `marginBottom: 15`, `paddingHorizontal: 15` |
| `components/ErrorBoundary.tsx` | 87–134 | `padding: 20`, `borderRadius: 16`, `fontSize: 48/15`, `marginBottom: 12` |
| `components/RestTimer.tsx` | 144–180 | `marginHorizontal: 20`, `borderRadius: 15`, `fontSize: 10/22`, `paddingVertical: 4`, `paddingHorizontal: 10` |
| `screens/ChartsScreen.tsx` | 279–331 | `borderRadius: 16`, `fontSize: 11/13/15`, `marginTop: 25`, `marginBottom: 15`, `marginTop: 2` |
| `components/CustomModal.tsx` | 85–100 | `padding: 24`, `fontSize: 20`, `marginBottom: 16/20` |

> Ces valeurs devraient utiliser `spacing.*`, `borderRadius.*` et `fontSize.*` du thème.

---

### Conventions

| Fichier | Problème |
|---------|----------|
| — | Aucun problème détecté |

> ✅ Pas de TODO/FIXME/HACK, pas de code commenté, pas de snake_case hors DB, pas d'incohérence de nommage.

---

## Priorités de correction

### 🔴 Critique
1. **11 `console.error` non gardés** — `useProgramManager.ts` (7) + `useSessionManager.ts` (4)
   → Ajouter `if (__DEV__)` ou intégrer Sentry

### 🟡 Modéré
2. **`SetItem.tsx` orphelin** — supprimer ou intégrer dans le workflow d'historique
3. **`testProviderConnection` / `testGeminiConnection`** — déplacer dans les tests ou supprimer

### 🟢 Faible
4. **Couleurs rgba hardcodées** (5 occurrences) → ajouter des tokens `colors.successOverlay12`, `colors.primaryOverlay15`, `colors.whiteOverlay08`
5. **`shadowColor: '#000'`** (4 fichiers) → `colors.shadow: '#000'` dans le thème
6. **Magic numbers** dans `ExercisesScreen`, `ErrorBoundary`, `RestTimer`, `ChartsScreen` → utiliser les tokens existants ou en ajouter
7. **`as any` en tests** → progressivement typer les mocks avec des factories typées
