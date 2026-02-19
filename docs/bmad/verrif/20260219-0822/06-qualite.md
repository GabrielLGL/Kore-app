# Code mort & qualité — 2026-02-19 (run 0822)

## Résumé : 9 problèmes trouvés

---

### Logs de production (🟡 Priorité haute)

| Fichier | Ligne | Problème |
|---------|-------|----------|
| `screens/WorkoutScreen.tsx` | 136, 145 | `.catch(console.error)` — 2 occurrences. Logs en prod sans `__DEV__`. |
| `components/WorkoutSummarySheet.tsx` | 58, 66 | `.catch(console.error)` — 2 occurrences. Logs en prod sans `__DEV__`. |
| `services/ai/aiService.ts` | 115 | `console.warn(...)` sans `__DEV__`. Se déclenche à chaque fallback offline en prod. |
| `model/seed.ts` | 96 | `console.error("❌ Erreur Seed:", error)` sans `__DEV__`. Fichier dev-only, mais guard manquant. |

> **Note :** Les `console.error` dans les blocs `catch` des hooks (useProgramManager, useSessionManager, etc.) et écrans (HomeScreen, SettingsScreen, SessionDetailScreen) restent **acceptés** — ce sont des erreurs fonctionnelles qui nécessitent visibilité même en prod pour le débogage utilisateur.

---

### Couleurs hardcodées (🟡 Priorité moyenne)

| Fichier | Ligne | Valeur | Correction |
|---------|-------|--------|------------|
| `components/WorkoutExerciseCard.tsx` | 204 | `'rgba(52, 199, 89, 0.12)'` | `colors.success` (#34C759) avec opacité 12% — ajouter token `colors.successSubtle` ou inline avec RN opacity |
| `components/RestTimer.tsx` | 138 | `'rgba(255,255,255,0.8)'` | Blanc 80% — utiliser `colors.text` + `opacity` sur le style |
| `components/RestTimer.tsx` | 141 | `'rgba(255,255,255,0.6)'` | Blanc 60% — même correction |
| `screens/HomeScreen.tsx` | 362 | `shadowColor: '#000'` | `#000` absent du thème — ajouter `colors.shadow: '#000'` ou accepter comme constante shadow universelle |

---

### Commentaires de migration obsolètes (🔵 Priorité basse)

| Fichier | Ligne | Commentaire |
|---------|-------|-------------|
| `model/models/Session.ts` | 16 | `// <--- AJOUT DU CHAMP POSITION` — migration effectuée, commentaire inutile |
| `model/models/SessionExercise.ts` | 16 | `// <--- AJOUT DU POIDS` — idem |

---

### Code mort
> **Aucun** — le nettoyage du run précédent (strings.ts, commonStyles, fonctions sentry inutilisées) a éliminé le code mort.

### TypeScript `any`
> **Aucun** — le projet reste propre sur ce point.

### Imports inutilisés
> Aucun import inutilisé détecté.

---

## Priorisation

### 🟡 Priorité haute (à corriger maintenant)
1. `.catch(console.error)` sans `__DEV__` — WorkoutScreen (×2) + WorkoutSummarySheet (×2)
2. `console.warn` sans `__DEV__` — aiService.ts:115
3. `console.error` sans `__DEV__` — seed.ts:96

### 🟡 Priorité moyenne
4. Couleurs rgba hardcodées — RestTimer (×2), WorkoutExerciseCard (×1)
5. `shadowColor: '#000'` — HomeScreen

### 🔵 Priorité basse
6. Commentaires migration obsolètes — Session.ts, SessionExercise.ts
