<!-- v1.0 — 2026-02-21 -->
# Rapport — Idee Brainstorm — Groupe A : Fichier contexte WEGOGYM — 20260221-1700

## Objectif
Créer un fichier de contexte WEGOGYM spécifique au brainstorming. Ce fichier sera passé
comme `context_file` au workflow BMAD brainstorming pour que les sessions génèrent des idées
cohérentes avec le projet : stack technique, fonctionnalités existantes, contraintes, personas.

## Fichiers concernés
- `docs/bmad/wegogym-brainstorm-context.md` (à créer)

## Contexte technique
- Stack : React Native (Expo 52) + TypeScript + WatermelonDB + Fabric
- Target : Android Priority. Dark Mode Only. App en français.
- CLAUDE.md section 1 (Stack) et 2 (Architecture) pour les contraintes techniques
- Stories existantes dans `docs/stories/` — lire pour éviter les doublons
- Voir `docs/bmad/verrif/` (le plus récent) pour l'état du schéma DB

## Contenu attendu du fichier à créer

### Structure du fichier `docs/bmad/wegogym-brainstorm-context.md` :

```markdown
# WEGOGYM — Contexte projet pour brainstorming

## Qu'est-ce que WEGOGYM ?
[Description courte — app de suivi de musculation offline-first]

## Stack technique (contraintes)
- React Native Expo 52 / TypeScript / Fabric (New Arch)
- WatermelonDB (SQLite/JSI) — offline-first, PAS de Redux/Context
- React Navigation 7 — Native Stack + Bottom Tabs
- Android priority / Dark Mode uniquement
- Language UI : français (fr-FR)

## Fonctionnalités existantes (ne pas dupliquer)
[Lire docs/stories/ et lister ce qui est déjà implémenté]
- Programmes & Sessions d'entraînement
- Exercices avec métadonnées (SFR, injuryRisk, stretchFocus)
- Historique des performances (PerformanceLog)
- Moteur IA offline (offlineEngine) — génère des plans personnalisés
- ...

## Personas utilisateurs
- **Débutant** : commence la musculation, besoin de guidage, peu de connaissances
- **Intermédiaire** : pratique régulière, veut progresser, compare ses perfs
- **Avancé** : sait ce qu'il fait, veut du contrôle granulaire + analytics
- Tranche d'âge principale : 18-45 ans
- Utilisation : seul en salle ou à domicile, offline possible

## Contraintes à respecter dans les idées
- Pas de native <Modal> (crashes Fabric) → Portal pattern
- Toutes les mutations DB dans database.write()
- Pas de console.log sans __DEV__
- Pas de any TypeScript
- No hardcoded colors → theme/index.ts

## Patterns recommandés
- Composants existants : AlertDialog, BottomSheet, Button, ChipSelector
- Hooks existants : useModalState, useHaptics, useKeyboardAnimation
- Helpers DB : databaseHelpers.ts, validationHelpers.ts

## Questions guide pour le brainstorming WEGOGYM
1. Comment cette idée améliore-t-elle l'expérience d'entraînement ?
2. L'utilisateur peut-il s'en servir sans connexion internet ?
3. Quelles données WatermelonDB sont impliquées ?
4. Est-ce cohérent avec le Dark Mode et l'UI française ?
5. Quelle value apporte cette feature par rapport à ce qui existe ?
```

## Étapes
1. Lire `docs/stories/` — liste toutes les stories existantes
2. Lire `docs/bmad/verrif/` le plus récent — état du schéma
3. Créer `docs/bmad/wegogym-brainstorm-context.md` avec le contenu ci-dessus, complété avec les vraies données
4. Valider que le fichier est autonome (Claude Code peut le lire sans autre contexte)

## Contraintes
- Ne pas casser : rien (nouveau fichier)
- Respecter : format markdown clair, sections bien délimitées
- Le fichier doit être lisible par le workflow BMAD brainstorming comme `context_file`

## Critères de validation
- Le fichier existe et contient les 6 sections listées
- La liste des fonctionnalités existantes est exacte (issue des stories)
- Aucune info technique incorrecte par rapport à CLAUDE.md

## Dépendances
Aucune dépendance — premier groupe.

## Statut
✅ Résolu — 20260221-1702

## Résolution
Rapport do : docs/bmad/do/20260221-1700-feat-brainstorm-context.md
