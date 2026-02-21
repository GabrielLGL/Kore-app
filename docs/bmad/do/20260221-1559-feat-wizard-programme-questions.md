# feat(wizard) — 4 nouvelles questions + extension AIFormData
Date : 2026-02-21 16:10

## Instruction
docs/bmad/prompts/20260221-1559-algo-programme-A.md

## Rapport source
Description directe (prompt Groupe A)

## Classification
Type : feat
Fichiers modifiés :
- `mobile/src/services/ai/types.ts`
- `mobile/src/screens/AssistantScreen.tsx`

## Ce qui a été fait

### `types.ts`
- Ajout de 4 champs optionnels dans `AIFormData` :
  - `phase?: 'prise_masse' | 'seche' | 'recomposition' | 'maintien'`
  - `recovery?: 'rapide' | 'normale' | 'lente'`
  - `injuries?: string[]`
  - `ageGroup?: '18-25' | '26-35' | '36-45' | '45+'`
- Rendu optionnels les champs Groupe C (`sfr`, `stretchFocus`, `injuryRisk`, `progressionType`) dans `ExerciseMetadata` pour corriger un conflit de travail parallèle (les données exerciseMetadata.ts n'étaient pas encore peuplées par Groupe C)

### `AssistantScreen.tsx`
- Ajout de `'multi-injuries'` au type `WizardStepKind`
- Ajout de 4 constantes d'options : `PHASE_OPTIONS`, `RECOVERY_OPTIONS`, `INJURIES_OPTIONS`, `AGE_GROUP_OPTIONS`
- Insertion de 4 steps dans `buildSteps()` après `split`, avant `days` :
  1. `phase` (single)
  2. `recovery` (single)
  3. `injuries` (multi-injuries avec logique XOR pour 'none')
  4. `ageGroup` (single)
- Ajout du callback `toggleInjuries` avec logique XOR : sélectionner 'none' vide les autres; sélectionner n'importe quoi d'autre retire 'none'
- Ajout du rendu `multi-injuries` dans `renderStepContent()` (chips + bouton Suivant toujours actif)
- Mise à jour de toutes les initialisations de `formData` pour inclure `injuries: []` (7 endroits)

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 768 passed
- Nouveau test créé : non (UI wizard, pas de logique métier isolable)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260221-1610

## Commit
225e414 feat(wizard): add 4 new program questions + extend AIFormData
