<!-- v1.0 — 2026-02-21 -->
# Prompt — keyboard-flicker-real-fix — 20260221-1130

## Demande originale
Le fix InteractionManager n'a pas résolu le flickering clavier.
Cause réelle : BottomSheet utilise useNativeDriver:true (thread natif),
InteractionManager ne la track pas → fire immédiatement.
Proposé : setTimeout(300ms) avec ref cleanup, ou supprimer autoFocus.

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | docs/bmad/prompts/20260221-1130-keyboard-flicker-real-fix-A.md | HomeScreen.tsx | 1 | ⏳ |

## Ordre d'exécution
Un seul groupe, tout dans HomeScreen.tsx.
