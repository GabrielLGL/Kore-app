<!-- v1.0 — 2026-02-21 -->
# Prompt — fix-bottomsheet-animation — 20260221-0940

## Demande originale
quand j'ouvre une bottom sheet je ne peux pas tout de suite cliquer sur une option, il faut attendre la fin de l'animation, j'aimerais corriger cela si possible en rendant cliquable plus tôt, sinon en modifiant l'animation

## Cause identifiée
`Animated.spring` avec `bounciness: 4, speed: 12` → ~400-600ms avant stabilisation.
Sur Android/Fabric, les touches sur une `Animated.View` en mouvement ne sont pas interceptées avant le settle.

## Solution
Remplacer le spring par `Animated.timing` (250ms, `Easing.out(Easing.cubic)`) → settle instantané, cliquable immédiatement.

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `docs/bmad/prompts/20260221-0940-fix-bottomsheet-animation-A.md` | `mobile/src/components/BottomSheet.tsx` | 1 | ⏳ |

## Ordre d'exécution
Un seul groupe — aucune dépendance.
