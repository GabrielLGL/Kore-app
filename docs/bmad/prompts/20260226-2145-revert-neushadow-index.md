<!-- v1.0 — 2026-02-26 -->
# Prompt — Revert NeuShadow → neuShadow natif simple — 20260226-2145

## Demande originale
"Ça marche pas bien, les ombres sont mal faites et les objets se marchent les uns sur les
autres. peut-être qu'on va juste repasser au truc d'avant faire juste un truc très épuré
pas de neumorphisme trop poussé"

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `20260226-2145-revert-neushadow-A.md` | Button.tsx, NeuShadow.tsx | 1 | ⏳ |
| B | `20260226-2145-revert-neushadow-B.md` | SettingsScreen.tsx | 1 | ⏳ |

## Ordre d'exécution
**Vague 1 : A et B en parallèle** — aucune dépendance entre eux.
(Les deux suppriment NeuShadow de leur côté indépendamment.)

## Ce qui reste après le revert
- `react-native-shadow-2` reste installé (harmless, pour usage futur éventuel)
- `neuShadowParams` reste dans `theme/index.ts` (référence future)
- `lightColors.card === lightColors.background` reste (bonne pratique)
- Ombres : `neuShadow.*` ViewStyle spread — natif, stable, épuré
- Gradient LinearGradient sur Button primary : conservé
