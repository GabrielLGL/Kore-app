<!-- v1.0 — 2026-02-27 -->
# Prompt — contrast-textmuted — 20260227-0900

## Demande originale
fixons le Contraste couleur text-muted

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | docs/bmad/prompts/20260227-0900-contrast-textmuted-A.md | mobile/src/theme/index.ts | 1 | ⏳ |

## Ordre d'exécution
Un seul groupe — tout dans `mobile/src/theme/index.ts`, aucune parallélisation.

## Note
`text-muted` n'existe pas en tant que tel. Les équivalents dans le theme sont :
- `textSecondary` (128 refs) — problème en light mode (3.62:1 vs WCAG 4.5:1)
- `placeholder` (21 refs) — problème en dark (3.71:1) et light (2.22:1)
