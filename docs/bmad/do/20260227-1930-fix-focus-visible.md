# fix(web) — Focus-visible styles — navigation clavier accessible
Date : 2026-02-27 19:30

## Instruction
`/do docs/bmad/prompts/20260227-1900-audit5-focus-C.md`

## Rapport source
`docs/bmad/prompts/20260227-1900-audit5-focus-C.md`

## Classification
Type : fix
Fichiers modifiés : `web/src/app/globals.css`

## Ce qui a été fait
Ajout d'une section `/* === FOCUS VISIBLE === */` dans globals.css, placée avant `/* === REDUCED MOTION === */` :

1. `*:focus:not(:focus-visible) { outline: none }` — supprime l'outline par défaut sur les clics souris/touch sans affecter le clavier
2. `*:focus-visible` — outline `2px solid var(--accent)` avec offset 3px et border-radius 4px (fonctionne en dark ET light via CSS var)
3. `input:focus-visible, textarea:focus-visible` — border-radius 999px pour correspondre au `rounded-full` des inputs neumorphiques
4. `button:focus-visible, a:focus-visible` — border-radius 8px cohérent avec le design

Utilise `var(--accent)` → violet en light (#6c5ce7), teal en dark (#00cec9) — toujours visible dans les deux thèmes.

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit` depuis `web/`)
- Tests : n/a (CSS pur)
- Nouveau test créé : non

## Documentation mise à jour
Aucune

## Statut
✅ Résolu — 20260227-1930

## Commit
`b5f92eb` fix(web): focus-visible styles — navigation clavier accessible (WCAG 2.4.7)
