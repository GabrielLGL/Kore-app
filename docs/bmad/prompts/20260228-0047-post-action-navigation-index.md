<!-- v1.0 — 2026-02-28 -->
# Prompt — post-action-navigation — 20260228-0047

## Demande originale
Je veux que quand on crée un programme avec l'IA, à la fin il nous renvoie à la liste des programmes.
Quand on crée une séance avec l'IA il nous amène dans la liste des séances dans laquelle la nouvelle séance a été ajoutée.
Quand on termine une séance on est renvoyé dans le homescreen et ensuite les badges débloqués et gains de niveau s'affichent, si il y en a plusieurs on les met les uns après les autres.

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `20260228-0047-post-action-navigation-A.md` | `AssistantScreen.tsx` | 1 | ⏳ |
| B | `20260228-0047-post-action-navigation-B.md` | `navigation/index.tsx`, `WorkoutScreen.tsx`, `HomeScreen.tsx` | 1 | ⏳ |

## Ordre d'exécution
Les deux groupes sont **indépendants** — lancer en parallèle (vague 1 unique).

- Groupe A ne touche que `AssistantScreen.tsx` (redirections post-IA)
- Groupe B ne touche que `WorkoutScreen.tsx`, `HomeScreen.tsx`, `navigation/index.tsx` (célébrations post-séance)

## Résumé des changements

### Groupe A — AssistantScreen.tsx
- Mode 'program' : `navigate('Home')` → `navigate('Programs')`
- Mode 'session' : `navigate('SessionDetail', { sessionId })` → `navigate('ProgramDetail', { programId: currentTargetProgramId })`

### Groupe B — WorkoutScreen + HomeScreen + navigation
- `RootStackParamList.Home` : ajouter param optionnel `celebrations: { milestones, badges }`
- `WorkoutScreen` : naviguer vers Home IMMÉDIATEMENT après fermeture du résumé, en passant les données de célébration, retirer MilestoneCelebration et BadgeCelebration du WorkoutScreen
- `HomeScreen` : recevoir les célébrations via `route.params`, les afficher séquentiellement (milestones d'abord, puis badges, un par un)
