# Prompt analysé — amélioration algo séances — 2026-02-20

## Demande originale
"notre algorithme pour faire les seance n'est pas assez bon il faut l'améliorer faisons le ensemble"

## Problèmes identifiés par l'utilisateur
- Mauvaise sélection d'exercices
- Pas de prise en compte de la fatigue

## Analyse technique

### Fichiers concernés
- `mobile/src/services/ai/offlineEngine.ts` — Engine déterministe principal
- `mobile/src/services/ai/providerUtils.ts` — Prompt cloud (Claude/OpenAI/Gemini)
- `mobile/src/services/ai/aiService.ts` — Orchestration (lecture seulement)
- `mobile/src/services/ai/types.ts` — Types (lecture seulement)

### Bug 1 : recentMuscles ignoré (offlineEngine.ts)
`context.recentMuscles` est populé par `buildDBContext()` avec tous les muscles
travaillés ces 7 derniers jours, mais `buildSession()` ne l'utilise jamais.
→ L'engine offline retravaile les mêmes muscles sans aucune considération de fatigue.

**Fix** :
- Passer `recentMuscles` à `allocateExercises()` pour réordonner le round-robin
- Supprimer le bonus focus pour les muscles récemment travaillés
- Round-robin : distribuer les exercices supplémentaires aux muscles NON-récents d'abord

### Bug 2 : Round-robin biaisé (offlineEngine.ts)
`allocateExercises()` boucle toujours de `muscles[0]`, ce qui favorise
systématiquement le premier muscle du split.
Ex: PPL Push ['Pecs','Epaules','Triceps'] + 8 exos → Pecs=3, Epaules=3, Triceps=2 à chaque fois.

**Fix** :
- Décaler le début du round-robin selon `sessionIndex` pour équilibrer entre sessions

### Amélioration 3 : Prompt cloud trop générique (providerUtils.ts)
- Exercices envoyés dans l'ordre arbitraire (slice(0,60)) sans pertinence au muscle ciblé
- La distinction de fatigue "éviter < 48h" est binaire et imprécise
- Pas de directives anti-duplication entre sessions d'un même programme
- Pas de paramètres spécifiques par objectif (tempo, repos, etc.)

## Commandes générées

| Groupe | Fichier | Tâche | Parallèle |
|--------|---------|-------|-----------|
| A | `mobile/src/services/ai/offlineEngine.ts` | Intégrer recentMuscles + fix round-robin | avec B |
| B | `mobile/src/services/ai/providerUtils.ts` | Améliorer prompt cloud | avec A |

## Impact attendu
- Sessions générées évitent les muscles récemment sollicités (engine offline)
- Meilleure répartition des exercices entre les muscles d'une même session
- Programmes avec plus de variété entre sessions (Full Body A ≠ Full Body B)
- Providers cloud génèrent des séances plus pertinentes et variées
