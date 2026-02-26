# feat(ExerciseTargetInputs) — Sets range UI (Groupe B)
Date : 2026-02-26 22:00

## Instruction
docs/bmad/prompts/20260226-2200-sets-range-B.md

## Rapport source
Description directe (prompt sets-range Groupe B)

## Classification
Type : feat
Fichiers modifiés :
- mobile/src/components/ExerciseTargetInputs.tsx
- mobile/src/components/__tests__/ExerciseTargetInputs.test.tsx

## Ce qui a été fait
- Ajout des props optionnelles `setsMax?: string` et `onSetsMaxChange?: (value: string) => void` à l'interface
- Ajout du handler `handleSetsMaxChange` avec clamping 1–10
- Refactoring du layout séries : `inputWrapper` remplacé par `setsWrapper` + `setsRangeRow`
- Mode range conditionnel : si `onSetsMaxChange` fourni → deux inputs (min — max) avec séparateur "—"
- Si `onSetsMaxChange` absent → layout identique à avant (backward compatible)
- Nouveaux styles : `setsWrapper`, `setsRangeRow`, `setsInput`, `rangeSeparator`
- JSDoc mis à jour avec documentation des nouvelles props + exemple mode range
- 7 nouveaux tests couvrant le mode range (affichage, clamping, callbacks croisés)

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 26 passed (dont 7 nouveaux)
- Nouveau test créé : oui

## Documentation mise à jour
Aucune (JSDoc dans le composant uniquement)

## Statut
✅ Résolu — 20260226-2200

## Commit
[sera rempli après commit]
