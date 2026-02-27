<!-- v1.0 — 2026-02-27 -->
# Prompt — muscles-volume — 20260227-2215

## Demande originale
"dans l'ecran muscles ou on voit la repartition musculaire va etre fusionné avec volume il faudrait : le graphique volume de series par semaine (par muscles, ou overall) (les 4 dernieres de base) avec un bouton pour voir les semaines d'apres et celle d'avant, les sets par muscle(deja fait)"

## Analyse
- **Écran cible** : `StatsRepartitionScreen.tsx` (répartition % musculaire)
- **Ajouts** :
  1. Section "Séries par semaine" — bar chart 4 semaines, paginé prev/next, filtrable par muscle ou "Global"
  2. Section "Sets par muscle cette semaine" — barres horizontales (pattern déjà dans `StatsVolumeScreen`)
- **Helper nécessaire** : `computeWeeklySetsChart()` à créer dans `statsMuscle.ts`

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `20260227-2215-muscles-volume-A.md` | `statsTypes.ts`, `statsMuscle.ts` | 1 | ⏳ |
| B | `20260227-2215-muscles-volume-B.md` | `StatsRepartitionScreen.tsx` | 2 | ⏳ |

## Ordre d'exécution
1. **Vague 1** — Groupe A : créer le helper `computeWeeklySetsChart` et le type `WeeklySetsChartResult`
2. **Vague 2** — Groupe B : enrichir `StatsRepartitionScreen` avec le chart + navigation + sets par muscle

Le Groupe B dépend du Groupe A car il importe `computeWeeklySetsChart` depuis `statsHelpers.ts`.
