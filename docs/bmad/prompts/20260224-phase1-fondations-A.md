<!-- v1.0 — 2026-02-24 -->
# Rapport — Phase 1 Fondations — Groupe A — Systeme de Niveaux & Gamification de base

## Objectif
Implementer le systeme de niveaux global (XP) qui est le SOCLE de toute la gamification future. Chaque seance donne de l'XP. L'utilisateur monte de niveau (1 a 100). Inclut aussi les streaks hebdomadaires, le tonnage lifetime, et les milestone anniversaires. Ce sont les elements de gamification GRATUITS qui creent l'habitude.

## Source
Brainstorming session: `docs/brainstorming/brainstorming-session-2026-02-23.md`
Features: #100 (Niveaux/XP), #7 (Streak hebdo), #86 (Tonnage lifetime), #56 (Anniversaires)

## Fichiers concernes
- `mobile/src/model/schema.ts` — Ajouter colonnes/tables pour XP, niveau, streak, tonnage
- `mobile/src/model/models/` — Nouveaux modeles ou extension du modele User
- `mobile/src/model/utils/` — Helpers pour calcul XP, niveaux, streaks
- `mobile/src/components/` — Composants visuels (barre XP, badge niveau, indicateur streak)
- `mobile/src/screens/HomeScreen.tsx` — Afficher niveau, streak, tonnage sur le dashboard

## Contexte technique
- Stack: React Native Expo 52, TypeScript, WatermelonDB (schema v17)
- Pattern: Offline-first, withObservables HOC pour data reactif
- Mutations TOUJOURS dans database.write()
- Schema/Model sync obligatoire
- Theme: Dark mode only (#121212 bg, #1C1C1E cards), utiliser theme/index.ts
- Pas de Redux/Context pour la data — WatermelonDB uniquement
- Langue app: Francais (fr-FR)

## Etapes
1. Definir le systeme de calcul XP (combien par seance, par serie, par PR, etc.)
2. Schema migration v18: ajouter champs xp, level, current_streak, best_streak, total_tonnage au modele User + table optionnelle pour historique XP
3. Creer les modeles WatermelonDB correspondants
4. Creer helpers: calculateXP(), calculateLevel(), updateStreak(), updateTonnage()
5. Integrer le calcul XP dans le flow de fin de seance existant
6. Creer composants visuels: XPBar, LevelBadge, StreakIndicator, TonnageCounter
7. Afficher sur HomeScreen
8. Detecter et celebrer les milestones (anniversaires de seances, tonnage)

## Contraintes
- Ne pas casser: le flow de seance existant, le schema actuel (migration propre)
- Respecter: WatermelonDB patterns, schema/model sync, withObservables, theme
- Le systeme doit fonctionner offline (pas de backend)
- Progression lente en gratuit (le Pro accelerera plus tard)

## Criteres de validation
- npx tsc --noEmit → zero erreur
- npm test → zero fail
- XP et niveau se mettent a jour apres chaque seance
- Streak se calcule correctement sur base hebdomadaire
- Tonnage lifetime s'incremente a chaque seance
- Tout persiste dans WatermelonDB apres restart

## Dependances
Aucune dependance — c'est le socle, tout le reste en depend.

## Statut
⏳ En attente
