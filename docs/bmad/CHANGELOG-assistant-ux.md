# Changelog — Assistant IA Refonte Wizard — 2026-02-19

## Résumé
Refonte complète de l'UX de l'assistant IA : suppression du mode chat, wizard unifié premium,
nouvelles options de personnalisation (split type + focus musculaire).

## Décisions prises

| Phase | Décision |
|-------|---------|
| Brainstorm | Supprimer le mode chat — un seul wizard pour tous les providers |
| Product Brief | Positionnement premium — même qualité offline et cloud |
| PRD | 8 stories (7 Must + 1 Should) |
| Architecture | 5 fichiers modifiés, 0 nouvelle dépendance |
| UX Design | Fade transitions, badge provider, preview enrichie |

## Stories implémentées

| Story | Description | Fichiers |
|-------|-------------|---------|
| S01 | Suppression du mode chat (-249 lignes) | AssistantScreen.tsx |
| S02 | DRY wizard — un seul toggleEquipment | AssistantScreen.tsx |
| S03 | Progress bar 6px + fade transitions | AssistantScreen.tsx |
| S04 | Badge provider dans le header | AssistantScreen.tsx |
| S05 | PreviewSheet — poids + résumé + titre dynamique | AssistantPreviewSheet.tsx |
| S06 | Choix du split (Auto/Full Body/Upper-Lower/PPL) | types.ts, offlineEngine.ts, providerUtils.ts, AssistantScreen.tsx |
| S07 | Focus musculaire — priorité de volume dans l'engine | types.ts, offlineEngine.ts, providerUtils.ts, AssistantScreen.tsx |
| S08 | Bouton Recommencer avec confirmation AlertDialog | AssistantScreen.tsx |

## Résultat QA
- TypeScript : 0 erreur
- Tests Jest : 94/94 passent
- Régressions : aucune

## Métriques
- AssistantScreen.tsx : 980 → 731 lignes (-25%)
- Code dupliqué supprimé : ~250 lignes
- Nouveaux champs AIFormData : `split`, `musclesFocus`
- Nouvelles étapes wizard programme : 6 → 8 étapes
