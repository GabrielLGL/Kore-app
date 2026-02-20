# Prompt analysé — multi-select muscles séance — 2026-02-19 17h15

## Demande originale
"il faudrait pouvoir repondre plusieurs muscles a quel groupe musculaire"

## Analyse
Dans le wizard AssistantScreen (mode "session"), l'étape "Quel groupe musculaire ?" est
actuellement en single-select (muscleGroup: string). La demande est de passer en multi-select
(muscleGroups: string[]), en suivant le pattern déjà existant pour musclesFocus (mode program).

### Fichiers impactés
| Fichier | Changement |
|---------|-----------|
| mobile/src/services/ai/types.ts | muscleGroup?: string → muscleGroups?: string[] |
| mobile/src/screens/AssistantScreen.tsx | kind 'single' → 'multi-muscle', toggle handler, UI chips |
| mobile/src/services/ai/aiService.ts | filtre array au lieu de string |
| mobile/src/services/ai/offlineEngine.ts | muscleGroup → muscleGroups?.join(' + ') |
| mobile/src/services/ai/providerUtils.ts | texte prompt session |
| Tests (4 fichiers) | fixtures muscleGroup → muscleGroups |

## Commandes générées
| Groupe | Tâche | Fichiers | Parallèle |
|--------|-------|----------|-----------|
| A | Tout en séquentiel (fichiers liés) | types.ts, AssistantScreen.tsx, aiService.ts, offlineEngine.ts, providerUtils.ts + 4 tests | Non |

## /do complet

/do Convertir le champ muscleGroup (string) en muscleGroups (string[]) dans le wizard Assistant — mode session

CONTEXTE PROJET :
- Stack : React Native Expo 52 + TypeScript + WatermelonDB. Dark mode. Pas de Redux.
- Règles CLAUDE.md : pas de `any`, pas de couleurs hardcodées (utiliser `colors.*`), haptics via `useHaptics()`.
- Langue UI : français.

OBJECTIF :
Dans le wizard AssistantScreen (mode "session"), l'étape "Quel groupe musculaire ?" est
actuellement single-select (valeur string unique). Il faut la passer en multi-select (tableau
string[]), en suivant exactement le pattern déjà existant pour `musclesFocus` (mode program).

ÉTAPES NUMÉROTÉES :

1. TYPES — mobile/src/services/ai/types.ts ligne 14 :
   - Remplacer `muscleGroup?: string` par `muscleGroups?: string[]`
   - Garder `musclesFocus?: string[]` intact

2. ASSISTANT SCREEN — mobile/src/screens/AssistantScreen.tsx :

   a) Ligne 35 : ajouter 'multi-muscle' à WizardStepKind :
      type WizardStepKind = 'single' | 'multi' | 'programs' | 'multi-focus' | 'multi-muscle'

   b) Ligne 122 : dans buildSteps(), changer le step muscle :
      De : { id: 'muscle', field: 'muscleGroup', question: 'Quel groupe musculaire ?', kind: 'single', options: MUSCLE_OPTIONS }
      Vers : { id: 'muscle', field: 'muscleGroups', question: 'Quels groupes musculaires ?', kind: 'multi-muscle' }

   c) Dans le formData initial (ligne 158) et tous les reset (handleReset, handleModify,
      handleValidate, useFocusEffect) : ajouter `muscleGroups: []` dans l'objet initial

   d) Ajouter handler toggleMuscleGroup (après toggleMusclesFocus) :
      const toggleMuscleGroup = useCallback((muscle: string) => {
        haptics.onSelect()
        setFormData(prev => {
          const current = prev.muscleGroups ?? []
          const isSelected = current.includes(muscle)
          return {
            ...prev,
            muscleGroups: isSelected ? current.filter(m => m !== muscle) : [...current, muscle],
          }
        })
      }, [haptics])

   e) Dans renderStepContent(), ajouter le cas 'multi-muscle' AVANT le cas 'programs' :
      Chips avec MUSCLE_OPTIONS, bouton "Suivant →" désactivé si vide,
      onPress={() => toggleMuscleGroup(String(opt.value))

3. AI SERVICE — mobile/src/services/ai/aiService.ts lignes 47-49 :
   - Remplacer le filtre form.muscleGroup par :
     const byMuscle = form.muscleGroups && form.muscleGroups.length > 0
       ? filtered.filter(ex => !ex.muscles || form.muscleGroups!.some(mg => ex.muscles.includes(mg)))
       : filtered
   - Ligne 140 (testForm dans validateProvider) : muscleGroup: 'Pecs' → muscleGroups: ['Pecs']

4. OFFLINE ENGINE — mobile/src/services/ai/offlineEngine.ts ligne 166 :
   - const muscle = form.muscleGroup ?? 'Full Body' →
     const muscleLabel = form.muscleGroups && form.muscleGroups.length > 0
       ? form.muscleGroups.join(' + ')
       : 'Full Body'
   - Adapter pool et session buildSession en conséquence

5. PROVIDER UTILS — mobile/src/services/ai/providerUtils.ts ligne 32 :
   - form.muscleGroup ?? 'Full Body' →
     form.muscleGroups && form.muscleGroups.length > 0 ? form.muscleGroups.join(', ') : 'Full Body'

6. TESTS — mettre à jour fixtures dans 4 fichiers :
   - __tests__/aiService.test.ts ligne 61 : muscleGroup: 'Pecs' → muscleGroups: ['Pecs']
   - __tests__/providers.test.ts ligne 18 : muscleGroup: 'Pecs' → muscleGroups: ['Pecs']
   - __tests__/offlineEngine.test.ts lignes 224, 232, 249, 266 : muscleGroup: 'X' → muscleGroups: ['X']
   - __tests__/providerUtils.test.ts ligne 72 : muscleGroup: 'Pecs' → muscleGroups: ['Pecs']

CONTRAINTES :
- Ne pas toucher au mode 'program' (musclesFocus reste intact)
- Ne pas modifier les kinds existants — seulement ajouter 'multi-muscle'
- Pas de couleurs hardcodées — utiliser styles.chip / styles.chipActive existants
- Pas de `any` TypeScript

VÉRIFICATION :
1. cd mobile && npx tsc --noEmit → 0 erreurs
2. npm test -- --testPathPattern="ai" → tous verts

RAPPORT : docs/bmad/do/[YYYYMMDD-HHmm]-feat-multi-muscle-session.md

COMMIT (si tout vert) :
git add les fichiers modifiés + rapport
git commit -m "feat(assistant): multi-select muscle groups for session wizard"
