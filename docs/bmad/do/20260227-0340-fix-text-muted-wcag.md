# fix(web/css) — WCAG AA contrast for --text-muted light theme
Date : 2026-02-27 03:40

## Instruction
docs/bmad/prompts/20260227-0340-site-completion-A.md

## Rapport source
docs/bmad/prompts/20260227-0340-site-completion-A.md

## Classification
Type : fix
Fichiers modifiés : web/src/app/globals.css

## Ce qui a été fait
Ligne 9 dans le bloc `:root`, remplacé `--text-muted: #636e72` (contraste 4.26:1 — FAIL WCAG AA)
par `--text-muted: #545c61` (contraste ≈ 5.5:1 — PASS WCAG AA).
Le bloc `[data-theme="dark"]` n'a pas été touché (`#b2bec3` déjà OK).

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit` dans web/)
- Tests : N/A (changement CSS uniquement)
- Nouveau test créé : non

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260227-0340

## Commit
b8aca88 fix(web/css): increase --text-muted contrast to pass WCAG AA
