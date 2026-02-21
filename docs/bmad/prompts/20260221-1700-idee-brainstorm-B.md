<!-- v1.0 — 2026-02-21 -->
# Rapport — Idee Brainstorm — Groupe B : Amélioration Phase 1 idee.md — 20260221-1700

## Objectif
Enrichir la Phase 1 (Brainstorming) de `.claude/commands/idee.md` pour obtenir des sessions
de brainstorming plus riches, plus ancrées dans le contexte WEGOGYM, et mieux structurées
pour alimenter la Phase 2 (Product Brief).

## Fichiers concernés
- `.claude/commands/idee.md` — Phase 1 uniquement (lignes 40-51)

## Contexte technique
- La Phase 1 appelle actuellement `/bmad-brainstorming` (workflow BMAD)
- Le workflow BMAD brainstorming accepte un `context_file` optionnel (cf. `_bmad/core/workflows/brainstorming/workflow.md`)
- Le fichier contexte WEGOGYM a été créé par Groupe A : `docs/bmad/wegogym-brainstorm-context.md`
- L'output actuel va dans `docs/bmad/01-brainstorm.md` sans template structuré
- Phase 2 (Product Brief) a besoin : problème, utilisateurs cibles, solution proposée

## Améliorations à implémenter dans Phase 1

### A. Pré-brainstorm — Chargement du contexte projet

Avant d'appeler `/bmad-brainstorming`, ajouter :
```
- Charge `docs/bmad/wegogym-brainstorm-context.md` comme contexte projet
- Passe ce fichier comme context_file au brainstormer
- Charge `docs/stories/` — liste les features existantes pour éviter les doublons
- Affiche : "📚 Contexte WEGOGYM chargé — [X] stories existantes"
```

### B. Brainstorming enrichi

Remplacer la liste actuelle par :
```
- Reformule l'idée en 1 phrase du point de vue utilisateur
- Identifie le persona principal concerné (débutant / intermédiaire / avancé)
- Explore avec SCAMPER + mind mapping + questions guide WEGOGYM
- Génère minimum 10 idées avant d'organiser
- Pose des questions : problème réel, valeur ajoutée, contraintes techniques, alternatives
- Itère jusqu'à validation
```

### C. Synthèse post-brainstorm (nouveau step)

Après le brainstorm libre, avant la validation de Phase 1 :
```
- Résume en 5 insights clés (format : "Insight : [titre] — [1 phrase]")
- Pour chaque insight : identifie 1 risque ou contre-argument (devil's advocate)
- Présente les insights + risques à l'utilisateur
- Demande : "Ces insights capturent-ils bien l'idée ? (valide / ajuste)"
```

### D. Template structuré pour 01-brainstorm.md

L'output sauvegardé doit suivre ce template :
```markdown
# Brainstorm — [Titre de l'idée] — [Date]

## Idée reformulée
[1 phrase du point de vue utilisateur]

## Persona cible
[débutant / intermédiaire / avancé — pourquoi]

## Idées explorées
[liste complète des idées générées]

## Top 5 Insights
1. **[Titre]** — [Description] | Risque : [contre-argument]
2. ...

## Questions ouvertes
- [question 1]
- [question 2]

## Contraintes techniques identifiées
- [contrainte liée au stack WEGOGYM]

## Prêt pour Phase 2 ?
[OUI / NON — raison si NON]
```

## Structure finale de Phase 1 dans idee.md

Remplacer les lignes 40-51 actuelles par :

```markdown
## Phase 1 — Brainstorming

### 1a. Chargement du contexte
- Charge `docs/bmad/wegogym-brainstorm-context.md`
- Charge `docs/stories/` — liste les features existantes
- Affiche : "📚 Contexte WEGOGYM chargé — [X] stories existantes"

### 1b. Session de brainstorming
Exécute /bmad-brainstorming avec context_file=docs/bmad/wegogym-brainstorm-context.md
Agent : cis-brainstorming-coach

- Reformule l'idée en 1 phrase utilisateur
- Identifie le persona principal
- Explore avec SCAMPER + mind mapping + questions guide WEGOGYM
- Génère minimum 10 idées avant d'organiser
- Itère jusqu'à saturation des idées

### 1c. Synthèse & Devil's Advocate
- Résume en 5 insights clés
- Pour chaque insight : 1 risque / contre-argument
- Présente les 5 insights + risques
- Attend validation : "Ces insights capturent-ils bien l'idée ?"

→ Sauvegarde dans `docs/bmad/01-brainstorm.md` (template structuré ci-dessous)
→ Annonce "✅ Phase 1 terminée → Phase 2 : Product Brief"
```

## Contraintes
- Ne pas modifier les Phases 2-11 (hors scope)
- Ne pas casser la logique de transition (validation → phase suivante)
- Garder le format "✅ Phase X terminée → Phase Y"
- Respecter la règle "Chaque phase INTERACTIVE" des règles générales

## Critères de validation
- Le fichier `idee.md` modifié est syntaxiquement correct (markdown valide)
- Phase 1 contient les 3 sous-étapes : 1a (contexte), 1b (brainstorm), 1c (synthèse)
- Le template `01-brainstorm.md` est documenté dans la phase
- Les autres phases (2-11) sont inchangées
- Faire une lecture complète du fichier final pour vérifier la cohérence

## Dépendances
Dépend de **Groupe A** — le fichier `docs/bmad/wegogym-brainstorm-context.md` doit exister.

## Statut
✅ Résolu — 20260221-1700

## Résolution
Rapport do : docs/bmad/do/20260221-1700-feat-idee-brainstorm-phase1.md
