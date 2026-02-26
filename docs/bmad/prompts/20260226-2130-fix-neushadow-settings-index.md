<!-- v1.0 — 2026-02-26 -->
# Prompt — Fix NeuShadow SettingsScreen — 20260226-2130

## Demande originale
"c'est tout désorganisé, des choses par-dessus les unes par-dessus les autres. Réorganiser
le SettingsScreen. Si c'est bien organisé on essaiera d'implémenter ça partout."

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `20260226-2130-fix-neushadow-settings-A.md` | NeuShadow.tsx, SettingsScreen.tsx | 1 | ⏳ |

## Ordre d'exécution
Un seul groupe — tout dans les mêmes fichiers, séquentiel.

## Contexte décision
Le problème vient de l'implémentation double-Shadow imbriqué dans NeuShadow.tsx :
les deux couches SVG s'annulent / se coupent dans ScrollView. La solution recommandée
est un Shadow unique + borderColor (1 seule couche SVG, stable).

Si le résultat visuel n'est pas satisfaisant → le rapport contient un fallback complet
vers l'ancien neuShadow (ViewStyle spread).
