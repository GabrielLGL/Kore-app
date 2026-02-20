# feat(ai) — Intelligent program generation with compound/isolation structure

Date : 2026-02-19 18:25

## Instruction
Réécrire offlineEngine.ts pour implémenter un algorithme de génération intelligent : structure compound→isolation, sets/reps variables par type×objectif, niveau inclusif, musclesFocus avec volume bonus, anti-répétition best-effort.

## Classification
Type : feat
Fichiers :
- `mobile/src/services/ai/offlineEngine.ts` (réécrit)
- `mobile/src/services/ai/__tests__/offlineEngine.test.ts` (3 tests mis à jour)

## Ce qui a été fait

### Supprimé
- `COMPOUND_MUSCLES` (liste grossière)
- `SETS_REPS` (valeurs fixes identiques pour tous les exercices)

### Ajouté

**Constantes intelligentes :**
- `SETS_BY_TYPE_GOAL` : sets variables par type × objectif (ex: compound_heavy + power = 5 sets)
- `REPS_BY_TYPE_GOAL` : reps en ranges par type × objectif (ex: isolation + bodybuilding = '12-15')
- `TYPE_ORDER` : ordre de tri compound_heavy(0) → compound(1) → accessory(2) → isolation(3)
- `LEVEL_ORDER` : filtre inclusif débutant(0) → intermédiaire(1) → avancé(2)
- `SPLIT_LABELS` : labels lisibles pour le nom du programme

**Fonctions :**
- `isLevelEligible()` : filtre exercices par niveau minimum requis
- `toCandidate()` : attache les métadonnées EXERCISE_METADATA à un ExerciseInfo
- `allocateExercises()` : distribution intelligente — 1 minimum par muscle, +1 pour focus muscles, round-robin pour le reste
- `selectExercises()` : sélection best-effort — non-utilisés en premier, triés par type, shuffle pour tie-breaking

**Algorithme buildSession (entièrement réécrit) :**
1. Alloue les slots d'exercices par muscle
2. Pour chaque muscle : filtre les candidats par muscle + niveau
3. Fallback : si 0 candidats pour ce muscle → utilise tous les exercices niveau-filtrés
4. Volume bonus : isFocus → min(baseSets + 1, 5)
5. Tri final de la séance : compound_heavy → compound → accessory → isolation

**generateProgram :**
- Réordonne les sessions : focus muscles en premier (stable sort)
- Nom : `${goal} ${level} – ${splitLabel} ${days}j/sem`

**generateSession :**
- Utilise buildSession avec muscles issus de muscleGroups (ou fullbody si absent)

### Conservé intact
- `getWeightTarget()` : logique PR % inchangée
- `SPLITS`, `SESSION_NAMES`, `getSplit()`, `getSplitName()`
- `exercisesCount()` : 45→5, 60→6, 90→8, 120→10
- `shuffleArray()` : utilisé dans selectExercises pour randomiser les ex æquo
- Export `offlineEngine: AIProvider`

### Tests mis à jour (ancien format fixe → nouveau ranges)
- `objectif force: 5×5` → `4 séries, reps '6-8'` (compound sans métadonnée + power)
- `objectif renfo: 3×12` → `3 séries, reps '10-12'`
- `objectif cardio: 3×15` → `3 séries, reps '12-15'`

## Exemple d'une session générée (PPL Push, bodybuilding, intermédiaire, 60min)

Muscles: ['Pecs', 'Epaules', 'Triceps'] — alloc: {Pecs:2, Epaules:2, Triceps:2}

| Exercice | Type | Sets | Reps |
|----------|------|------|------|
| Développé Couché Barre | compound_heavy | 4 | 6-8 |
| Développé Incliné Haltères | compound | 4 | 8-10 |
| Développé Haltères Assis | compound | 4 | 8-10 |
| Développé Arnold | compound | 4 | 8-10 |
| Extensions Poulie Haute | isolation | 3 | 12-15 |
| Barre au front | isolation | 3 | 12-15 |

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 643 passed, 41 suites (31 offlineEngine)
- Nouveau test créé : non (tests existants adaptés)

## Commit
affad28 feat(ai): intelligent program generation with compound/isolation structure and variable sets/reps
