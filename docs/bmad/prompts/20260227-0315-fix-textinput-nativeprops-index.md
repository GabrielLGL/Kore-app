<!-- v1.0 — 2026-02-27 -->
# Prompt — fix(ExerciseTargetInputs) Option C : setNativeProps — 20260227-0315

## Demande originale

"on a toujours le problème quand on écrit vite des chiffres dans rep par exemple il en loupe"

## Contexte

Option A (defaultValue) est déjà en place mais le bug persiste.

**Cause racine :** `defaultValue` est passé avec une valeur CHANGEANTE à chaque re-render
(sets/weight/repsMinRef.current changent via le callback → parent re-render → React Native re-applique defaultValue → perte de caractères).

**Seule solution fiable :** TextInput sans AUCUN prop texte (ni `value`, ni `defaultValue`) + `setNativeProps({ text })` au mount via `useEffect([], [])`.

## Groupes générés

| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | [20260227-0315-fix-textinput-nativeprops-A.md](./20260227-0315-fix-textinput-nativeprops-A.md) | ExerciseTargetInputs.tsx + test | 1 | ⏳ |

## Ordre d'exécution

Un seul groupe — tout dans le même fichier.

## Statut

⏳ En attente
