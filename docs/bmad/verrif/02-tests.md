# Tests — 2026-02-20

## Résultat : ✅ 632 passed / 🔴 12 failed / ⏭️ 0 skipped

**Test Suites : 1 failed, 40 passed, 41 total**
**Durée : ~23s**
**Run :** `npm test -- --verbose --coverage` (exécuté le 2026-02-20)

---

### Tests en échec

Tous les 12 échecs sont dans **un seul fichier** : `WorkoutSummarySheet.test.tsx`

**Cause racine :** Le composant `WorkoutSummarySheet.tsx` a été redesigné (commit `ed74808 — style(workout): redesign summary sheet`) mais les tests n'ont pas été mis à jour. Trois désynchronisations :

| Divergence | Test attend | Composant rend réellement |
|------------|-------------|--------------------------|
| Valeurs stats | `'61:01'`, `'2500.5 kg'`, `'12 validées'`, `'3 PR'` | `'⏱ 61:01'`, `'🏋️ 2500.5 kg'`, `'✅ 12 validées'`, `'🏆 3 PR'` (emoji dans le même `<Text>`) |
| Bouton fermeture | `'Fermer'` | `'Terminer'` |
| Placeholder note | `'Ajouter une note (optionnel)...'` | `'Ressenti, conditions, progrès...'` |

| Test | Fichier | Erreur |
|------|---------|--------|
| `affiche la durée formatée correctement` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with text: 61:01` |
| `affiche la durée zéro` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with text: 00:00` |
| `affiche le volume total avec décimale` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with text: 2500.5 kg` |
| `affiche le nombre de séries validées` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with text: 12 validées` |
| `affiche le nombre de PR` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with text: 3 PR` |
| `affiche le bouton Fermer` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with text: Fermer` |
| `affiche le champ de note avec placeholder` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with placeholder: Ajouter une note (optionnel)...` |
| `met à jour la note quand on tape du texte` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with placeholder: Ajouter une note (optionnel)...` |
| `appelle updateHistoryNote après le délai de debounce` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with placeholder: Ajouter une note (optionnel)...` |
| `ne déclenche pas updateHistoryNote si on tape rapidement (debounce)` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with placeholder: Ajouter une note (optionnel)...` |
| `appelle onClose quand le bouton Fermer est pressé` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with text: Fermer` |
| `flush la note immédiatement à la fermeture si une note est en cours` | `WorkoutSummarySheet.test.tsx` | `Unable to find an element with placeholder: Ajouter une note (optionnel)...` |

**Correction requise :** Mettre à jour `WorkoutSummarySheet.test.tsx` :
- `getByText('61:01')` → `getByText(/61:01/)` (regex pour ignorer l'emoji préfixe)
- `getByText('Fermer')` → `getByText('Terminer')`
- `getByPlaceholderText('Ajouter une note (optionnel)...')` → `getByPlaceholderText('Ressenti, conditions, progrès...')`
- Emoji PR : le composant rend `🏆` (trophée) et non `🏅` (médaille) — vérifier la cohérence

---

### Couverture

| Métrique | Global | Hooks | Utils | Screens | Components |
|----------|--------|-------|-------|---------|------------|
| Statements | **66.98%** | 98.07% | 96.00% | 34.87% | 66.13% |
| Branches | **58.33%** | 89.83% | 93.26% | 28.34% | 58.64% |
| Functions | **59.05%** | 95.78% | 96.38% | 28.94% | 59.04% |
| Lines | **68.65%** | 97.81% | 97.07% | 37.18% | 68.80% |

---

### Fichiers critiques sans tests (ou couverture 0%)

#### 0% — Aucun test fonctionnel

| Fichier | Impact |
|---------|--------|
| `src/components/AssistantPreviewSheet.tsx` | Élevé — UI complexe avec state |
| `src/components/ExercisePickerModal.tsx` | Élevé — Modal critique de sélection d'exercices |
| `src/components/ProgramSection.tsx` | Moyen — Composant liste de programmes |
| `src/screens/AssistantScreen.tsx` | Élevé — Écran IA complet (~600 lignes) |
| `src/screens/ChartsScreen.tsx` | Moyen — Écran stats/graphiques |
| `src/services/ai/claudeProvider.ts` | Moyen — Provider IA Claude |
| `src/services/ai/openaiProvider.ts` | Moyen — Provider IA OpenAI |
| `src/services/ai/geminiProvider.ts` | Moyen — Provider IA Gemini |
| `src/services/ai/exerciseMetadata.ts` | Moyen — Métadonnées exercices pour moteur offline |
| `src/navigation/index.tsx` | Faible — Navigation (difficile à unit-tester) |

#### < 15% — Couverture très faible

| Fichier | Stmts | Branches | Commentaire |
|---------|-------|----------|-------------|
| `src/model/models/Program.ts` | 8% | 0% | Modèle WatermelonDB principal — méthodes `duplicate()` non testées |
| `src/model/seed.ts` | 8.33% | 0% | Logique de seed — lignes 147-182 non couvertes |

#### < 50% — Couverture insuffisante

| Fichier | Stmts | Branches | Commentaire |
|---------|-------|----------|-------------|
| `src/components/ProgramDetailBottomSheet.tsx` | 39.13% | 12.5% | Nouveau composant — peu testé |
| `src/services/sentry.ts` | 36.84% | 31.81% | Service crash reporting |
| `src/components/WorkoutSummarySheet.tsx` | 48.38% | 10% | Tests cassés (cf. section ci-dessus) |
| `src/screens/HomeScreen.tsx` | 33.33% | 24.39% | Écran principal — nombreuses branches non testées |
| `src/screens/SessionDetailScreen.tsx` | 47.76% | 29.16% | |
| `src/services/ai/aiService.ts` | 60% | 48.07% | Orchestrateur IA — branches d'erreur non testées |

---

### Fichiers bien couverts (>= 90%)

- `src/hooks/` — **98.07% stmts** — excellent
- `src/model/utils/` — **96.00% stmts** — excellent
- `src/components/BottomSheet.tsx`, `ChipSelector.tsx`, `CustomModal.tsx`, `ExerciseTargetInputs.tsx`, `LastPerformanceBadge.tsx`, `WorkoutHeader.tsx` — **100%**
- `src/services/ai/offlineEngine.ts` — bien couvert (test suite complète)
- `src/services/ai/providerUtils.ts` — bien couvert

---

### Priorités de correction

1. **URGENT** — Mettre à jour `WorkoutSummarySheet.test.tsx` (2 chaînes de texte à corriger, 5 min de travail)
2. **Moyen** — Ajouter tests pour `ExercisePickerModal.tsx` et `AssistantPreviewSheet.tsx`
3. **Moyen** — Couvrir les providers IA (`claudeProvider`, `openaiProvider`, `geminiProvider`)
4. **Faible** — Améliorer couverture `HomeScreen.tsx`, `SessionDetailScreen.tsx`

