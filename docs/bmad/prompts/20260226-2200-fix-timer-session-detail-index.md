<!-- v1.0 — 2026-02-26 -->
# Prompt — fix timer session detail — 20260226-2200

## Demande originale

"quand on ajoute un exercice a une seance le timer se lance, il ne dois se lancer que quans l'entraineent est lancé"

## Groupes générés

| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `docs/bmad/prompts/20260226-2200-fix-timer-session-detail-A.md` | `SessionDetailScreen.tsx` | 1 | ⏳ |

## Ordre d'exécution

Un seul groupe — fix isolé dans un seul fichier. Pas de dépendances inter-groupes.

## Analyse du bug

Le `RestTimer` est déclenché dans `SessionDetailScreen` (écran planning) quand on ajoute ou modifie un exercice.
Il ne doit apparaître que dans `WorkoutScreen` (écran entraînement actif) après validation d'une série.

5 suppressions à faire dans `SessionDetailScreen.tsx` :
1. `if (user?.timerEnabled) setShowRestTimer(true)` × 2 (lignes 81, 89)
2. `useState(false)` pour `showRestTimer` (ligne 69)
3. `{showRestTimer && <RestTimer ... />}` rendu conditionnel (ligne 134)
4. `setShowRestTimer(false)` × 2 appels (lignes 117, 149)
5. `import RestTimer` (ligne 11)
