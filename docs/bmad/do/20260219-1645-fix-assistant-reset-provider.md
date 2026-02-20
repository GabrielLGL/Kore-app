# fix(assistant) — reset wizard to step 1 after plan validation
Date : 2026-02-19 16:45

## Instruction
Dans mobile/src/screens/AssistantScreen.tsx, apporter 2 corrections :
- Bug 1 : reset wizard après validation (program + session)
- Bug 2 : commentaire badge provider + vérification shadow

## Classification
Type : fix
Fichiers : mobile/src/screens/AssistantScreen.tsx

## Ce qui a été fait

### Bug 1 — Reset wizard après validation
Dans `handleValidate` (branche `program` et branche `session`) :
- Ajout de `setCurrentStep(0)`, `setFormData({ equipment: [], musclesFocus: [] })`,
  `setGeneratedPlan(null)`, `contentAnim.setValue(1)` juste après `previewModal.close()`
  et avant la navigation.
- Résultat : quand l'utilisateur revient sur l'onglet Assistant après avoir validé
  un plan, le wizard repart à l'étape 1 (état vierge).

### Bug 2 — Badge provider (vérification + commentaire)
- Vérifié : aucun state local ne shadow `user?.aiProvider` dans le composant.
- `providerLabel` est uniquement dérivé de `user?.aiProvider` via `withObservables`.
- Commentaire ajouté au-dessus de la ligne :
  `// Réactif via withObservables — mise à jour depuis les settings uniquement`

## Vérification
- TypeScript : ✅ (npx tsc --noEmit — 0 erreur)
- Tests : ✅ (no tests found — pas de test AssistantScreen existant)
- Nouveau test créé : non (composant UI, pas de logique métier testable isolément)

## Commit
8f9290d fix(assistant): reset wizard to step 1 after plan validation
