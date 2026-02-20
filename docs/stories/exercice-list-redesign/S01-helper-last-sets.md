# S01 — Helper DB : getLastSetsForExercises
> Feature: exercice-list-redesign | Priorité: Must | Dépendance: —

## Description
Ajouter une fonction helper dans `databaseHelpers.ts` qui retourne les derniers poids par exercice et par set_order, en se basant sur la dernière History de chaque exercice.

## Fichier modifié
`mobile/src/model/utils/databaseHelpers.ts`

## Tâches techniques
1. Query les Sets WHERE exercise_id IN [exerciseIds]
2. Joindre avec History pour trouver la plus récente par exercice
3. Grouper par exerciseId → set_order → weight
4. Retourner `Record<string, Record<number, number>>`

## Signature
```typescript
export async function getLastSetsForExercises(
  exerciseIds: string[]
): Promise<Record<string, Record<number, number>>>
```

## Critères d'acceptation
- [ ] Retourne un objet vide `{}` si exerciseIds est vide
- [ ] Ne retourne que les sets de la DERNIÈRE History par exercice
- [ ] Groupé par exerciseId → { [setOrder]: weight }
- [ ] Pas de `any` TypeScript
- [ ] Mutation dans database.write() si applicable (ici lecture seule)
