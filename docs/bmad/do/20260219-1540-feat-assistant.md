# FEAT(assistant) — Wizard interactif step-by-step
Date : 2026-02-19 15:40

## Instruction
Refactorer AssistantScreen.tsx en wizard interactif step-by-step.

## Classification
Type : feat
Fichiers : mobile/src/screens/AssistantScreen.tsx

## Ce qui a été fait
- Supprimé le formulaire scrollable unique
- Ajouté un wizard à 6 steps (programme) ou 7 steps (séance)
- Progress bar animée (Animated.Value, 0% → 100%)
- Header avec bouton retour (←) et compteur (1/6)
- Auto-avance sur single-choice, bouton "Suivant" pour équipement (multi-select)
- Steps dynamiques selon mode : program = +daysPerWeek, session = +muscleGroup +targetProgramId
- Reset complet au clic "Modifier" dans la preview
- withObservables HOC, AssistantPreviewSheet, handleValidate inchangés

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 638 passed
- Nouveau test créé : non (UI only)

## Commit
48202ee feat(assistant): refactor form into interactive step-by-step wizard
