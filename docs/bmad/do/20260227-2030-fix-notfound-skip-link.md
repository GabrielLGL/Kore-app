# fix(web) — 404 Not-Found — skip link + id="main-content"
Date : 2026-02-27 20:30

## Instruction
`/do docs/bmad/prompts/20260227-2000-audit6-notfound-C.md`

## Rapport source
`docs/bmad/prompts/20260227-2000-audit6-notfound-C.md`

## Classification
Type : fix
Fichiers modifiés : `web/src/app/not-found.tsx`

## Ce qui a été fait
- Enveloppé le composant dans un fragment `<>...</>` pour permettre le skip link avant `<main>`
- Ajouté le skip link (`sr-only`, visible au focus clavier) avant `<main>`
- Ajouté `id="main-content"` sur `<main>` — cible du skip link
- Contenu interne de `<main>` inchangé

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit` depuis `web/`)
- Tests : n/a (HTML/attributs purs)
- Nouveau test créé : non

## Documentation mise à jour
Aucune

## Statut
✅ Résolu — 20260227-2030

## Commit
`8d73d0c` fix(web): 404 not-found — skip link + id=main-content (WCAG)
