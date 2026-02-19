# Prompt analysé — CI Jest Cache Impl — 2026-02-19

## Demande originale
Accélérer les runs CI à partir de l'analyse précédente (20260219-1400-ci-test-speed.md).
Cause 1 : cache Jest transform absent → ~4-6 min de re-transform Babel.
Cause 2 : workers parallèles inutiles pour 6 fichiers → ~1-2 min overhead.

## Analyse
Deux modifications couplées (même path `/tmp/jest-cache`) → un seul /do.

Fichiers : `mobile/jest.config.js` + `.github/workflows/ci.yml`

## Commandes générées
| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | /do Optimiser workflow CI — Jest cache + runInBand | `mobile/jest.config.js`, `.github/workflows/ci.yml` | seul (couplés) |

## Gain attendu
- 1er run après merge : ~8-10 min (remplissage cache)
- Runs suivants : ~2-3 min
