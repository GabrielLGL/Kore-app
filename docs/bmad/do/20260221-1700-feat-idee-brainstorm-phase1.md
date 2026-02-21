# feat(idee) — Enrichissement Phase 1 Brainstorming
Date : 2026-02-21 17:00

## Instruction
docs/bmad/prompts/20260221-1700-idee-brainstorm-B.md

## Rapport source
docs/bmad/prompts/20260221-1700-idee-brainstorm-B.md

## Classification
Type : feat
Fichiers modifiés :
- `.claude/commands/idee.md` (Phase 1, lignes 40-51 → 40-97)

## Ce qui a été fait
Remplacement de la Phase 1 (brainstorming) dans `idee.md` par une structure enrichie en 3 sous-étapes :

- **1a. Chargement du contexte** : charge `docs/bmad/wegogym-brainstorm-context.md` (Groupe A) + liste `docs/stories/` pour éviter les doublons. Affiche le compte des stories existantes.
- **1b. Session de brainstorming** : appel `/bmad-brainstorming` avec `context_file=docs/bmad/wegogym-brainstorm-context.md`, reformulation en 1 phrase utilisateur, identification du persona, exploration SCAMPER + mind mapping, minimum 10 idées générées.
- **1c. Synthèse & Devil's Advocate** : 5 insights clés avec 1 risque/contre-argument chacun, validation interactive par l'utilisateur.

Ajout du template structuré pour `docs/bmad/01-brainstorm.md` (sections : Idée reformulée, Persona cible, Idées explorées, Top 5 Insights, Questions ouvertes, Contraintes techniques identifiées, Prêt pour Phase 2).

## Vérification
- TypeScript : N/A (fichier markdown)
- Tests : N/A (fichier markdown)
- Nouveau test créé : non
- Critères de validation :
  - ✅ Syntaxe markdown valide
  - ✅ Phase 1 contient les 3 sous-étapes : 1a (contexte), 1b (brainstorm), 1c (synthèse)
  - ✅ Template `01-brainstorm.md` documenté dans la phase
  - ✅ Phases 2-11 inchangées
  - ✅ Lecture complète du fichier effectuée

## Documentation mise à jour
aucune (modification d'une commande interne, pas d'impact CLAUDE.md)

## Statut
✅ Résolu — 20260221-1700

## Commit
c99a6db feat(idee): enrich Phase 1 brainstorming — context + persona + insights
