<!-- v1.0 — 2026-02-21 -->
# Prompt — Amélioration brainstorming /idee — 20260221-1700

## Demande originale
on va encore l'ameliorer avec le /idee pour brainstormer mieux

## Problème identifié
La Phase 1 (Brainstorming) de `/idee` est trop générique :
- Pas de contexte WEGOGYM injecté dans le brainstormer
- Pas de structure d'output claire pour `01-brainstorm.md`
- Pas d'étape de synthèse / devil's advocate avant de passer en Phase 2
- Les idées générées peuvent être déconnectées du stack ou des features existantes

## Groupes générés

| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `20260221-1700-idee-brainstorm-A.md` | `docs/bmad/wegogym-brainstorm-context.md` (nouveau) | 1 | ⏳ |
| B | `20260221-1700-idee-brainstorm-B.md` | `.claude/commands/idee.md` | 2 | ⏳ |

## Ordre d'exécution

**Vague 1 — Groupe A** : Créer le fichier contexte WEGOGYM (autonome, pas de dépendance)

**Vague 2 — Groupe B** : Améliorer `idee.md` Phase 1 en utilisant le fichier créé par A

Le Groupe B dépend du Groupe A car il référence `docs/bmad/wegogym-brainstorm-context.md`.
