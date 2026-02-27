# REFACTOR(web/page) — aria-busy/aria-disabled button accessibility
Date : 2026-02-27 00:10

## Instruction
docs/bmad/prompts/20260227-0000-aria-busy-button-A.md

## Rapport source
docs/bmad/prompts/20260227-0000-aria-busy-button-A.md

## Classification
Type : refactor
Fichiers modifiés : `web/src/app/page.tsx`

## Ce qui a été fait
Sur le bouton de soumission principal (formulaire `aria-label="Formulaire d'inscription"`, ligne ~409) :
- Supprimé : `disabled={status === "loading"}`
- Ajouté : `aria-busy={status === "loading"}`
- Ajouté : `aria-disabled={status === "loading"}`
- Ajouté : `tabIndex={status === "loading" ? -1 : 0}`
- Classes CSS : `disabled:opacity-50 disabled:cursor-not-allowed` → `aria-disabled:opacity-50 aria-disabled:cursor-not-allowed`

Le bouton du formulaire rapide sticky (ligne ~256) n'a pas été modifié (hors scope du rapport).

## Vérification
- TypeScript : ✅ npx tsc --noEmit — zéro erreur
- Tests : ⚠️ 6/6 échouaient DÉJÀ AVANT cette modification (régressions pré-existantes — 2 formulaires avec labels similaires causent des `getMultipleElementsFoundError`). Mon changement n'introduit aucun nouveau fail.
- Nouveau test créé : non (test pré-existant intact)

## Note sur les tests pré-existants
Les 6 tests de `page.test.tsx` échouent à cause d'un problème de double formulaire (`Formulaire d'inscription rapide` + `Formulaire d'inscription`) introduit avant ce commit dans une autre session. Ce n'est pas une régression de ce refactor.

## Documentation mise à jour
Aucune.

## Statut
✅ Résolu — 20260227-0010

## Commit
[à remplir]
