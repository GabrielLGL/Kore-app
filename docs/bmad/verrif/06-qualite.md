# Code mort & qualité — 2026-02-19

## Résumé : 21 problèmes trouvés

---

### Code mort

| Fichier | Type | Élément |
|---------|------|---------|
| `src/constants/strings.ts` | Fichier orphelin | `STRINGS` — jamais importé nulle part dans le projet |
| `src/theme/index.ts` | Export inutilisé | `commonStyles` — exporté mais jamais importé dans aucun fichier |
| `src/services/sentry.ts` | Fonctions inutilisées | `captureMessage`, `setUser`, `clearUser`, `addBreadcrumb` — exportées, jamais utilisées hors du fichier (`captureError` seul est importé par ErrorBoundary) |

---

### TypeScript

| Fichier | Ligne | Problème |
|---------|-------|----------|
| `src/services/sentry.ts` | 11 | `(process.env as Record<string, string \| undefined>)` — cast contournable si la variable est déclarée dans `types/env.d.ts` |
| `src/services/ai/providerUtils.ts` | 91 | `return obj as unknown as GeneratedPlan` — double cast `as unknown as` = signal d'insécurité de type ; préférer une validation explicite |
| `src/screens/SettingsScreen.tsx` | 27 | `(user?.aiProvider as AIProviderName)` — cast qui masque le fait que WatermelonDB stocke en `string` ; une type guard ou un helper `toProviderName()` serait plus sûr |

> **Aucun `any` trouvé** — le projet est propre sur ce point.

---

### Logs de production

| Fichier | Ligne | Problème |
|---------|-------|----------|
| `src/services/sentry.ts` | 26 | `console.warn('[Sentry] DSN not configured...')` — PAS gardé par `__DEV__`, s'exécute en production si le DSN est absent |
| `src/model/utils/databaseHelpers.ts` | 444 | `console.warn('[importPresetProgram] Exercice introuvable...')` — PAS gardé par `__DEV__` |
| `src/model/index.ts` | 18 | `console.error("Erreur chargement DB:", error)` — dans le callback `onSetUpError` (cas limite), mais non gardé par `__DEV__` |

> Les `console.error` des hooks (useProgramManager, useSessionManager, useWorkoutState, useExerciseManager) et des screens (HomeScreen, SettingsScreen, SessionDetailScreen) sont tous dans des blocs `catch` légitimes → **acceptés**.

---

### Valeurs hardcodées

| Fichier | Ligne | Valeur |
|---------|-------|--------|
| `src/components/WorkoutExerciseCard.tsx` | 204 | `'rgba(52, 199, 89, 0.12)'` — `colors.success` (#34C759) avec opacité 12% ; pas de token disponible |
| `src/screens/ChartsScreen.tsx` | 269 | `` `rgba(0, 122, 255, ${opacity})` `` — `colors.primary` en rgba dynamique (contrainte API chart-kit) |
| `src/screens/ChartsScreen.tsx` | 270 | `` `rgba(255, 255, 255, ${opacity})` `` — `colors.text` en rgba dynamique (contrainte API chart-kit) |
| `src/components/RestTimer.tsx` | 131 | `'rgba(255,255,255,0.8)'` — blanc 80% ; devrait utiliser `colors.text` + opacité |
| `src/components/RestTimer.tsx` | 133 | `'rgba(255,255,255,0.6)'` — blanc 60% ; même problème |
| `src/components/WorkoutHeader.tsx` | 32 | `fontSize: 40` — nombre magique pour le chrono ; devrait être une constante (`TIMER_FONT_SIZE = 40`) |
| `src/screens/HomeScreen.tsx` | 362 | `shadowColor: '#000'` — idem dans CustomModal:87, BottomSheet:137, AlertDialog:141 — `#000` absent du thème |

---

### Conventions

| Fichier | Problème |
|---------|----------|
| `src/components/SessionItem.tsx:61` | Utilise `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)` directement — CLAUDE.md impose `useHaptics()` |
| `src/components/RestTimer.tsx:76-78` | Utilise `Haptics.impactAsync` directement (×3) — doit passer par `useHaptics()` |
| `src/navigation/index.tsx:83,97,179` | Utilise `Haptics.impactAsync` directement (×3 appels) — doit passer par `useHaptics()` |
| `src/components/CustomModal.tsx` | Commentaires de style "tutoriel" excessifs laissés (lignes 15-16, 27, 36-37, 40, 43-44, 53-54, 69, 74) — ne décrivent pas la logique, parasitent la lecture |
| `src/components/SessionItem.tsx` | Commentaires tutoriel excessifs sur toutes les lignes (lignes 1-6, 18-25, 31-35, 39-40…) |
| `src/screens/AssistantScreen.tsx:93,114` | `Alert.alert()` natif utilisé pour feedback utilisateur — cohérence avec `<AlertDialog>` à évaluer |

---

## Priorisation

### 🔴 Priorité haute
1. **`constants/strings.ts`** — fichier mort (150 lignes inutiles), supprimer
2. **Logs de production non gardés** — `sentry.ts:26`, `databaseHelpers.ts:444`, `model/index.ts:18` — envelopper dans `if (__DEV__)`
3. **Haptics directs** — `SessionItem`, `RestTimer`, `navigation/index` — 7 appels à migrer vers `useHaptics()`

### 🟡 Priorité moyenne
4. **`commonStyles` inutilisé** — supprimer de `theme/index.ts` ou commencer à l'utiliser
5. **Fonctions sentry inutilisées** — supprimer `captureMessage`, `setUser`, `clearUser`, `addBreadcrumb`
6. **Couleurs rgba hardcodées** — `RestTimer` (2 occurrences), `WorkoutExerciseCard` (1)

### 🟢 Priorité basse
7. **`as` casts** — `providerUtils.ts:91` (double cast), `SettingsScreen.tsx:27`
8. **Nombre magique** — `WorkoutHeader:32` `fontSize: 40`
9. **Commentaires tutoriel** — nettoyer `CustomModal` et `SessionItem`
