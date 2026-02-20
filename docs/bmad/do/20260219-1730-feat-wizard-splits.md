# FEAT(assistant) — Durées 45-120min + 10 splits musculation
Date : 2026-02-19 17:30

## Instruction
Wizard assistant : remplacer durées [30,45,60,90] par [45,60,90,120] et ajouter les 10 splits les plus populaires.

## Classification
Type : feat
Fichiers principaux : AssistantScreen.tsx, types.ts, offlineEngine.ts
Fichiers supplémentaires (TypeScript) : aiService.ts, __tests__/aiService.test.ts, __tests__/offlineEngine.test.ts, __tests__/providers.test.ts

## Ce qui a été fait

### Modification A — Durées
- `DURATION_OPTIONS` : 30min retiré, 120min (label "2h") ajouté
- `AIDuration` : `30 | 45 | 60 | 90` → `45 | 60 | 90 | 120`
- `exercisesCount()` : `<=30→4` retiré, `<=90→8` et `else→10` ajoutés
- `aiService.ts` default form : `durationMin: 30` → `durationMin: 45`

### Modification B — 10 Splits
- `SPLIT_OPTIONS` : 4 → 10 options (brosplit, arnold, phul, fiveday, pushpull, fullbodyhi)
- `AISplit` : 4 → 10 valeurs
- `SPLITS` : 6 nouveaux splits avec groupes musculaires corrects
- `SESSION_NAMES` : 6 nouveaux noms de séances

### Fix silencieux — generateProgram
Bug existant corrigé : `splitGroups` utilisait toujours `getSplit(days)` même quand un split était sélectionné manuellement.
```
// Avant (bug)
const splitGroups = getSplit(days)

// Après (fix)
const splitGroups = (form.split && form.split !== 'auto') ? SPLITS[splitName] : getSplit(days)
```
Sans ce fix, sélectionner "Bro Split" avec 3 jours générait 3 séances Full Body au lieu de Poitrine/Dos/Épaules.

### Tests mis à jour
- Test `30min → 4` remplacé par `120min → 10` (nouveau cas de durée)
- Toutes les occurrences `durationMin: 30` dans les tests → `durationMin: 45`

## Cycles par split (référence)
| Split       | Groupe min | Cycle complet | Exemple 4j        |
|-------------|-----------|---------------|-------------------|
| PPL         | 3 séances | 6 (A/B)       | Push/Pull/Legs/Push|
| Bro Split   | 5 séances | 5             | Poitrine→Bras     |
| Arnold      | 3 séances | 6 (A/B)       | P+D/É+B/J         |
| PHUL        | 4 séances | 4             | Force+Hypertrophie|
| 5 Jours     | 5 séances | 5             | Poitrine→Bras     |
| Push/Pull   | 2 séances | 2+            | Push/Pull/Push... |
| Full Body Hi| 1 séance  | cycle libre   | FB×n              |

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 94 passed (0 failed)
- Nouveau test créé : oui (120min → 10 exercices)

## Commit
8c17bd7 feat(assistant): update durations to 45-120min and add 10 workout splits
