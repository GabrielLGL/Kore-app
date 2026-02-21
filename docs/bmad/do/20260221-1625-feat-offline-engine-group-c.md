# feat(offlineEngine) — Moteur algorithmique avancé — Groupe C
Date : 2026-02-21 16:25

## Instruction
docs/bmad/prompts/20260221-1559-algo-programme-C.md

## Rapport source
Description directe (prompt Groupe C)

## Classification
Type : feat
Fichiers modifiés :
- `mobile/src/services/ai/types.ts`
- `mobile/src/services/ai/offlineEngine.ts`
- `mobile/src/services/ai/__tests__/offlineEngine.test.ts`

## Ce qui a été fait

### A. Filtrage par zones sensibles (injuries)
- `buildSession()` : `activeInjuries = form.injuries?.filter(z => z !== 'none') ?? []`
- Fonction interne `filterByInjuries(candidates)` : exclut les exercices dont `injuryRisk` contient une zone déclarée
- Appliqué sur `allCandidates` (pool complet) et sur les candidats par muscle

### B. `getVolumeMultiplier(form)` — ajustement sets selon récupération + âge
- recovery 'rapide' → +0.15 | 'lente' → -0.15
- ageGroup '18-25' → +0.05 | '36-45' → -0.10 | '45+' → -0.20
- Clamp [0.6, 1.4]

### C. `computeSets(type, goal, isFocus, form)` — calcul unifié des séries
- Intègre volumeMultiplier, prise_masse +1 set sur composés, maintien ×0.8
- Clamps : compound_heavy [3-6], compound/accessory [2-5], isolation [2-4]
- Remplace l'ancienne logique `isFocus ? Math.min(baseSets+1, 5) : baseSets`

### D. `getPhaseAdjustment(phase, baseReps)` — ajustement reps selon phase
- seche → +2 low / +4 high (ex: '8-10' → '10-14')
- prise_masse → +1 low / +1 high
- recomposition, maintien → reps inchangées

### E. `getRestAndRPE(type, goal, phase?)` — repos et RPE adaptatifs
- compound_heavy → 210s / RPE 9
- compound bodybuilding → 105s / RPE 8
- isolation/accessory bodybuilding → 75s / RPE 9
- cardio → 38s / RPE 7
- seche → repos ×0.8 | prise_masse → repos ×1.15
- Ajouté `restSeconds?` et `rpe?` à `GeneratedExercise` dans types.ts

### F. `ensureStretchBalance(exercises, allCandidates, usedNames, form, context)`
- Vérifie que ≥30% des exercices de la séance ont `stretchFocus: true`
- Si insuffisant : remplace l'exercice avec le SFR le plus faible par un alternatif stretchFocus
- Appelé après le tri final dans `buildSession()`

### G. Flag décharge dans `generateProgram()`
- `includeDeload = daysPerWeek >= 4 && recovery !== 'rapide' && ageGroup in ['36-45','45+']`
- Ajouté `includeDeload?: boolean` à `GeneratedPlan` dans types.ts
- Suffix "(avec décharge)" dans le nom du programme si actif

## Vérification
- TypeScript : ✅ zéro erreur (`npx tsc --noEmit`)
- Tests : ✅ 774 passed (45 suites) — dont 6 nouveaux tests Groupe C
- Nouveaux tests : oui (6 tests dans `describe('Groupe C')`)

## Cas validés
- `injuries: ['bas_dos']` → Soulevé de Terre + Good Morning absents ✅
- `recovery: 'lente'`, `ageGroup: '45+'` → volume réduit (multiplicateur 0.65) ✅
- `phase: 'seche'` → Tirage Poitrine '8-10' → '10-14' ✅
- `daysPerWeek: 4`, `ageGroup: '45+'` → `includeDeload: true` ✅
- `recovery: 'rapide'` → pas de flag décharge ✅
- `restSeconds > 0` et `rpe ∈ [6, 10]` sur tous les exercices ✅

## Documentation mise à jour
Aucune (patterns déjà documentés dans CLAUDE.md sections 3.1 et 2)

## Statut
✅ Résolu — 20260221-1625

## Commit
a2a2325 feat(offlineEngine): advanced algorithmic engine — group C
