<!-- v1.0 — 2026-02-26 -->
# Prompt — brainstorm-implement — 20260226-0930

## Demande originale
Implémenter les features du brainstorming-session-2026-02-23.md

## État des lieux (au 26/02/2026)

### Déjà implémenté ✅
| Feature | Brainstorming | Date |
|---------|--------------|------|
| Onboarding personnalisé | #91 | 25/02 |
| Niveaux/XP/Streak/Milestones | #100, #7, #56 | 25/02 |
| Templates intelligents + notes | #23, #22 | 25/02 |
| Heatmap calendrier | #90 | 25/02 |
| Export données | #92 | 25/02 |
| Exercise info sheet | #31 partiel | 25/02 |
| Stats dashboard (7 écrans) | #46 partiel | 21/02 |
| Assistant IA (offline + cloud) | #80, #81 | avant 25/02 |

### Stories existantes, PAS implémentées ⏳
| Groupe | Stories | Rapport |
|--------|---------|---------|
| A | exercice-list-redesign S03+S04+S05 | docs/bmad/prompts/20260226-0930-brainstorm-implement-A.md |
| B | assistant-ia-ux S01→S08 | docs/bmad/prompts/20260226-0930-brainstorm-implement-B.md |

### Pas encore en stories (phases futures)
Phase 2 — Gamification Pro : Skill Tree (#1), Boss Fights (#5), Saisons (#6), Loot (#4),
  Classe athlete (#36), Hexagone stats (#37), Titres (#38), Recap animé (#8)
Phase 3 — Stats & Coaching : Volume tracker complet (#12+67+68), Détection plateau (#27),
  Déload auto (#21), Chrono adaptatif (#24), Session Bounties (#2)
Phase 4 — Social : Wrapped annuel (#11), Timeline photo (#25+26), Export story (#18)
Phase 5 — Polish : Builder drag & drop (#45), Mode cockpit (#79), Widgets (#52)

## Groupes générés
| Groupe | Rapport | Fichiers clés | Vague | Statut |
|--------|---------|--------------|-------|--------|
| A | 20260226-0930-brainstorm-implement-A.md | SessionExerciseItem, WorkoutExerciseCard, WorkoutHeader | 1 | ⏳ |
| B | 20260226-0930-brainstorm-implement-B.md | AssistantScreen, AssistantPreviewSheet, ai/types.ts | 1 | ⏳ |

## Ordre d'exécution
Groupe A et B sont totalement indépendants (fichiers différents) → lancer en PARALLÈLE.
Pour les phases futures, utiliser `/idee [nom-feature]` pour créer les stories.

## Prochains `/idee` recommandés (après A et B)
1. `/idee recap-post-seance` — Écran post-séance animé (#8), Phase 2 priorité haute
2. `/idee gamification-pro` — Skill Tree + Titres + Classe athlete (#1, #36-38)
3. `/idee volume-tracker-complet` — #12+67+68, Phase 3
