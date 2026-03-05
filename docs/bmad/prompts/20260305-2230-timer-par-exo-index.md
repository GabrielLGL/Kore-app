<!-- v1.0 — 2026-03-05 -->
# Prompt — Timer par exercice — 20260305-2230

## Demande originale
`MVP` Timer par exercice (repos different par exo)

## Description
Permettre a chaque exercice d'une session d'avoir son propre temps de repos. Si non defini, le timer global (user.restDuration) est utilise comme fallback.

## Groupes generes
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A — Fondation DB | `20260305-2230-timer-par-exo-A.md` | schema.ts, migrations.ts, SessionExercise.ts, Program.ts | 1 | En attente |
| B — WorkoutScreen | `20260305-2230-timer-par-exo-B.md` | WorkoutScreen.tsx | 2 | En attente |
| C — UI Configuration | `20260305-2230-timer-par-exo-C.md` | useSessionManager.ts, SessionDetailScreen.tsx, fr.ts, en.ts | 2 | En attente |

## Ordre d'execution
```
Vague 1 : Groupe A (fondation DB — aucune dependance)
   |
   v
Vague 2 : Groupe B + Groupe C (en parallele — dependent de A)
```

- **Groupe A** doit etre termine en premier car B et C utilisent le champ `restTime` du model
- **Groupe B** (WorkoutScreen) et **Groupe C** (SessionDetail + i18n) touchent des fichiers differents → parallele
