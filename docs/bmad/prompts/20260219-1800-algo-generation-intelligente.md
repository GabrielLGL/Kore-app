# Prompt analysé — algo-generation-intelligente — 2026-02-19

## Demande originale
"on est bien sur la partie IA mais j'aimerais vraiment faire des programmes plus complexes : le nombre de series et de rep et le choix des exercice est toujours le meme il faut qu'on est un algorythme qui est tous nos choix en parametre et qui fasse un vrai bon programme, faisons le ensemble pose moi des questions"

## Décisions prises (co-design avec l'utilisateur)

### Structure de séance
- Compound Heavy → Compound → Accessory → Isolation
- Reps TOUJOURS en ranges : '6-8', '8-10', '10-12', '12-15', '15-20', '20-25'
- Sets/reps varient par TYPE d'exercice × OBJECTIF

### Niveau (inclusif)
- avancé ⊇ intermédiaire ⊇ débutant
- Chaque exercice a un minLevel (niveau minimum requis)

### musclesFocus
- Session focus en 1ère position dans le programme
- +1 série sur tous les exercices du muscle priorisé
- +1 exo (split long), +1 ou +2 exo (fullbody long selon nombre de muscles focus), +1 (fullbody court)

### Anti-répétition
- Best-effort : préférer exercices non utilisés dans le programme
- Fallback autorisé si pool insuffisant (ex: trapèzes)

## Architecture

### Fichiers
1. `mobile/src/services/ai/types.ts` — ajout ExerciseType + ExerciseMetadata
2. `mobile/src/services/ai/exerciseMetadata.ts` (NOUVEAU) — classification 143 exercices
3. `mobile/src/services/ai/offlineEngine.ts` — réécriture complète algorithme

### Table sets/reps
| Type | Bodybuilding | Power | Renfo | Cardio |
|------|---|---|---|---|
| compound_heavy | 4-5 sets × '6-8' | 5 sets × '4-6' | 4 sets × '8-10' | 3 sets × '10-12' |
| compound | 4 sets × '8-10' | 4 sets × '6-8' | 3 sets × '10-12' | 3 sets × '12-15' |
| accessory | 3 sets × '10-12' | 3 sets × '8-10' | 3 sets × '12-15' | 3 sets × '15-20' |
| isolation | 3 sets × '12-15' | 3 sets × '10-12' | 3 sets × '15-20' | 2-3 sets × '20-25' |

## Commandes générées
| Groupe | /do | Fichiers | Ordre |
|--------|-----|----------|-------|
| A | feat: exerciseMetadata types | types.ts + exerciseMetadata.ts | Vague 1 |
| B | feat: offlineEngine rewrite | offlineEngine.ts | Vague 2 (après A) |
