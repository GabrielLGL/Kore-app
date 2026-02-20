# Prompt analysé — Durées + Splits + Preview Sheet — 2026-02-19

## Demande originale
"pour le temps par seance on va mettre 45 min 60 min 90 min 120min et pour les types de programme on va en rajouter d'autre les 10 plus connues selon internet, et je veux pouvoir voir les seances et exercice dans la bottomsheet de fin et pas juste x seance de n exercices"

## Analyse

### Changement 1 — Durées
- Supprimer 30min, ajouter 120min → [45, 60, 90, 120]
- Type AIDuration + DURATION_OPTIONS + exercisesCount()

### Changement 2 — Splits (10 types)
- Actuellement 4 types : auto, fullbody, upperlower, ppl
- Objectif : 10 types (+ brosplit, arnold, phul, fiveday, pushpull, fullbodyhi)
- Type AISplit + SPLIT_OPTIONS + SPLITS + SESSION_NAMES

### Changement 3 — Bottom sheet finale
- Actuellement : texte "x séances · n exercices"
- Objectif : cards par séance avec exercices listés (sets × reps)

## Commandes générées

| Groupe | Description | Fichiers | Parallèle |
|--------|-------------|----------|-----------|
| A | Durées + 10 splits | AssistantScreen.tsx, types.ts, offlineEngine.ts | avec B |
| B | Preview sheet détaillée | AssistantPreviewSheet.tsx | avec A |

## Notes
- Groupe A et B sont entièrement indépendants → lancer en parallèle
- Groupe A touche 3 fichiers mais ils sont tous liés à la même logique → séquentiel dans le même /do
