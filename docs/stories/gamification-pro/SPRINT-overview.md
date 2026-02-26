# Sprint — Gamification Pro (Badges) — 2026-02-26

## Objectif
Implémenter un système de 50 badges collectionnables débloqués automatiquement en fin de séance, accessibles depuis le HomeScreen dans un écran dédié.

## Prérequis
- gamification-base (S01-S09) implémenté : champs level, total_tonnage, current_streak, best_streak sur User

## Stories ordonnées

| # | Story | Dépend de | Taille | Priorité |
|---|-------|-----------|--------|----------|
| S01 | Schema migration v19 (user_badges + total_prs) | — | S | MUST |
| S02 | Constantes 50 badges (BADGES_LIST) | S01 | M | MUST |
| S03 | Helper checkBadges() + tests | S02 | M | MUST |
| S04 | Incrément total_prs en fin de séance | S01 | S | MUST |
| S05 | Intégration fin de séance (checkBadges + insert) | S03, S04 | L | MUST |
| S06 | Composant BadgeCard | S02 | S | MUST |
| S07 | Écran BadgesScreen | S01, S06 | M | MUST |
| S08 | BottomSheet célébration badge | S05, S06 | M | MUST |
| S09 | Entrée HomeScreen (lien + compteur) | S07 | S | SHOULD |

## Graphe de dépendances
```
S01 → S02 → S03 → S05 → S08
S01 → S04 → S05
S02 → S06 → S07 → S09
                S08
```

## Estimations
- S01 : ~30min
- S02 : ~45min
- S03 : ~1h
- S04 : ~30min
- S05 : ~2h
- S06 : ~30min
- S07 : ~1h30
- S08 : ~1h
- S09 : ~30min
**Total estimé : ~8h15**

## Fichiers impactés
### Nouveaux
- `mobile/src/model/models/UserBadge.ts`
- `mobile/src/model/utils/badgeConstants.ts`
- `mobile/src/model/utils/badgeHelpers.ts`
- `mobile/src/model/utils/__tests__/badgeHelpers.test.ts`
- `mobile/src/components/BadgeCard.tsx`
- `mobile/src/screens/BadgesScreen.tsx`

### Modifiés
- `mobile/src/model/schema.ts` (v19)
- `mobile/src/model/models/User.ts` (+total_prs)
- `mobile/src/model/index.ts` (+UserBadge collection)
- `mobile/src/screens/HomeScreen.tsx` (+lien badges)
- `mobile/src/navigation/index.tsx` (+route BadgesScreen)
- `[fin-de-séance handler]` (+checkBadges + insert + total_prs)
