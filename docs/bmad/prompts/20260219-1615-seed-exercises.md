# Prompt analysé — seed-exercises — 2026-02-19 16:15

## Demande originale
dans src/model/seeds ajoute plein d'exercices, si tu veux cherche sur internet pour en ajouter

## Analyse

### Quoi
Enrichir le tableau `BASIC_EXERCISES` dans `mobile/src/model/seed.ts` avec ~60 exercices supplémentaires couvrant tous les groupes musculaires.

### Où
- **Fichier cible unique** : `mobile/src/model/seed.ts`
- **Tableau** : `BASIC_EXERCISES` (ligne 6), 51 entrées actuelles
- **Référence muscles** : `mobile/src/model/constants.ts` → MUSCLES_LIST
- **Référence équipements** : `mobile/src/model/constants.ts` → EQUIPMENT_LIST

### Contraintes identifiées
- Muscles valides : `Pecs`, `Dos`, `Quadriceps`, `Ischios`, `Mollets`, `Trapèzes`, `Epaules`, `Biceps`, `Triceps`, `Abdos`, `Cardio` (+ `Fessiers` déjà utilisé)
- Equipment valides : `Poids libre`, `Machine`, `Poulies`, `Poids du corps`
- Ne pas modifier `seedExercises()` ni les imports
- Noms en français (convention existante)
- Pas de doublons avec les 51 exercices existants

### Parallélisation
Fichier unique → 1 seul /do, pas de parallélisation nécessaire.

## Commandes générées

| Groupe | Fichiers | Parallèle |
|--------|----------|-----------|
| A | mobile/src/model/seed.ts | — |

### /do complet (Groupe A)

```
/do Dans mobile/src/model/seed.ts, enrichir le tableau BASIC_EXERCISES avec ~60 exercices supplémentaires.
[...voir output dans conversation]
```

## Résultat attendu
- ~111 exercices dans BASIC_EXERCISES
- TypeScript propre (npx tsc --noEmit sans erreur)
- Commit : feat(seed): add 60+ exercises to BASIC_EXERCISES
