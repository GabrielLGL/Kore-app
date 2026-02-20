# CHORE(ci) — Ajouter paths-ignore dans workflows GitHub Actions (Groupe A)
Date : 2026-02-20 22:10

## Instruction
docs/bmad/prompts/20260220-2210-ci-reduction-A.md

## Rapport source
docs/bmad/prompts/20260220-2210-ci-reduction-A.md (description directe avec étapes)

## Classification
Type : chore
Fichiers modifiés :
- `.github/workflows/ci.yml`
- `.github/workflows/lint.yml`

## Ce qui a été fait
Ajout de `paths-ignore` sous `on.push` et `on.pull_request` dans les deux workflows :
- `docs/**` — ignore tous les fichiers dans le dossier docs/ (rapports bmad, reviews, git-history)
- `*.md` — ignore les fichiers Markdown à la racine
- `.gitignore` — ignore les modifications du .gitignore

Les blocs `jobs:` et `steps:` n'ont pas été touchés.

## Vérification
- TypeScript : N/A (fichiers YAML)
- Tests : N/A (fichiers YAML)
- YAML : ✅ Indentation 2 espaces, pas de tabs, structure valide
- `paths-ignore` présent sous `push:` et `pull_request:` dans les deux fichiers : ✅

## Documentation mise à jour
Aucune (changement CI uniquement)

## Statut
✅ Résolu — 20260220-2210

## Commit
de952e9 chore(ci): add paths-ignore to skip docs-only CI runs
