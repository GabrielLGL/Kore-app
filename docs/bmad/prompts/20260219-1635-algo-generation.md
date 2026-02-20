# Prompt analysé — Algorithme génération séance/programme — 2026-02-19

## Demande originale
"ok pour mon application j'ai besoin d'un vrai algorythme pour cree une seance et un programme, faisons un brainsto pour avoir les meilleurs implémentations en ia et offline"

## Analyse

### Bug critique découvert
`offlineEngine.ts` ligne 88 : le split PPL ignore les groupes musculaires.
`const pool = context.exercises.length > 0 ? context.exercises : splitGroups[groupIndex]`
→ Toutes les séances (Push/Pull/Legs) reçoivent le même pool d'exercices.
**Cause racine :** `DBContext.exercises` est `string[]` — pas de métadonnées musculaires.

### Problèmes additionnels
- Exercise selection toujours dans le même ordre (pas de shuffle → même programme à chaque fois)
- `weightTarget` toujours `0` (les PRs dans `context.prs` ne sont jamais utilisés)
- Prompt AI : pas de directives sport science, PRs mal formatés, muscles récents ignorés

### Architecture de la solution

#### Types (Vague 1 — bloquant)
```typescript
// Nouveau dans types.ts
export interface ExerciseInfo { name: string; muscles: string[] }
// Modification DBContext
exercises: ExerciseInfo[]  // était: string[]
```

#### Offline Engine v2 (Vague 2)
- Filter exercises by split muscle groups (fix critical bug)
- Shuffle dans chaque tier (compounds mélangés, isolations mélangées)
- Compound-first : Pecs/Dos/Quadriceps/Ischios/Epaules → score prioritaire
- Weight targets : `PR * percentage(goal, level)` → power: 88%, bodybuilding: 78%, renfo: 70%, cardio: 60%

#### AI Prompt v2 (Vague 2 — parallèle)
- Directives sport science (MEV/MAV, compound-first, progressive overload)
- PRs formatés avec recommandations de % par objectif
- Muscles récents avec indication temps de récupération

#### Sport Science constants (à intégrer)
```
MEV/MAV par muscle/semaine :
- Pecs, Dos, Quadriceps : 10-16 sets
- Ischios, Mollets, Trapèzes : 8-14 sets
- Biceps, Triceps, Abdos : 6-12 sets
- Cardio : 3-6 sessions

% 1RM recommandé :
- Power : débutant 75%, intermédiaire 82%, avancé 88%
- Bodybuilding : débutant 65%, intermédiaire 72%, avancé 78%
- Renfo : débutant 60%, intermédiaire 65%, avancé 70%
- Cardio : débutant 50%, intermédiaire 55%, avancé 60%
```

## Commandes générées

| Groupe | Fichiers | Vague | Parallèle avec |
|--------|----------|-------|----------------|
| A | types.ts, aiService.ts, providerUtils.ts (adaptation) | 1 | seul |
| B | offlineEngine.ts | 2 | avec C |
| C | providerUtils.ts (enrichissement prompt) | 2 | avec B |
| D | __tests__/*.test.ts | 3 | seul |

## Recommandation
Pour une feature plus large (periodisation, mesocycles, progressive overload hebdomadaire), utiliser `/idee algo-periodisation` après cette implémentation.
