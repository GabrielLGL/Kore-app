<!-- v1.0 — 2026-02-21 -->
# Prompt — bottomsheet-tab-bar — 20260221-1400

## Demande originale
"j'aimerais que quand une bottom sheet s'ouvre, les bouton de navigation ne s'enleve pas mais que la bottom sheet soit au 1 er plan, car quand on lance une option de la bottom sheet, elle se ferme, remet les boutons de nav puis fais l'option ce qui n'est pas tres fluide"

## Analyse
La BottomSheet utilise `<Portal>` depuis `@gorhom/portal`. Le `PortalProvider` est à la racine de l'app (avant `NavigationContainer`), donc le Portal rend déjà les BottomSheets AU-DESSUS de la tab bar visuellement (zIndex: 999).

Le problème : `useMultiModalSync` inclut des états BottomSheet dans son tableau, ce qui émet `HIDE_TAB_BAR` inutilement. À la fermeture, `SHOW_TAB_BAR` crée l'animation de retour visible avant l'action.

**Fix :** retirer les états BottomSheet de `useMultiModalSync` dans les screens concernés. Ne garder que les états AlertDialog (overlay fullscreen) qui justifient de cacher la tab bar.

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `docs/bmad/prompts/20260221-1400-bottomsheet-tab-bar-A.md` | HomeScreen.tsx, ExercisesScreen.tsx, useModalState.ts | 1 | ⏳ |

## Ordre d'exécution
Un seul groupe — pas de dépendances inter-groupes.
