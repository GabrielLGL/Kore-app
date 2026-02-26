# Architecture — Gamification Pro (Badges) — 2026-02-26

## Nouveaux fichiers
```
mobile/src/
├── model/
│   ├── schema.ts                     ← v18 → v19 (user_badges + total_prs)
│   ├── models/
│   │   └── UserBadge.ts              ← NOUVEAU Model WatermelonDB
│   └── utils/
│       ├── badgeConstants.ts         ← NOUVEAU 50 badges (BADGES_LIST)
│       └── badgeHelpers.ts           ← NOUVEAU checkBadges(), getBadgeById()
├── components/
│   └── BadgeCard.tsx                 ← NOUVEAU
└── screens/
    └── BadgesScreen.tsx              ← NOUVEAU
```

## Modifications fichiers existants
```
mobile/src/
├── model/
│   ├── models/User.ts                ← + @field('total_prs')
│   └── index.ts                      ← + UserBadge dans collections
├── screens/
│   └── [fin-de-séance handler]       ← + checkBadges() + insert user_badges + total_prs
├── screens/HomeScreen.tsx            ← + bouton "Mes Badges" + compteur
└── navigation/index.tsx              ← + route BadgesScreen
```

## Modèle de données

### Table user_badges (nouvelle)
- id (string, auto)
- badge_id (string) — ex: "sessions_100"
- unlocked_at (number/date)

### Table users (ajout)
- total_prs (number, default 0)

## Interface checkBadges()
```ts
interface CheckBadgesParams {
  user: User                     // total_xp, level, best_streak, total_tonnage, total_prs
  existingBadgeIds: string[]
  sessionCount: number
  sessionVolume: number
  distinctExerciseCount: number
}
function checkBadges(params: CheckBadgesParams): BadgeDefinition[]
```

## Flux fin de séance (augmenté)
```
Fin de séance
  → [existant] calculer XP, tonnage, streak
  → [nouveau]  prCount → total_prs += prCount
  → [nouveau]  sessionVolume (sum sets)
  → [nouveau]  distinctExerciseCount (distinct exercise_ids)
  → [nouveau]  sessionCount (histories non-deleted)
  → [nouveau]  existingBadgeIds (user_badges)
  → [nouveau]  checkBadges(params) → newBadges[]
  → database.write(() => {
      // [existant] history, sets, user XP/streak/tonnage
      // [nouveau]  user.total_prs += prCount
      // [nouveau]  insert user_badges pour chaque newBadge
    })
  → [existant] WorkoutSummarySheet
  → [existant] célébration milestones (S09)
  → [nouveau]  BottomSheet badge si newBadges.length > 0
```

## Réutilisation
- BottomSheet célébration → `<BottomSheet>` existant
- Haptic → `useHaptics().onSuccess()`
- Bouton → `<Button variant="primary">`
- Données réactives → `withObservables` sur `userBadges`

## Corrections PRD (phase 4)
- Badges streak vérifient `best_streak` (pas current_streak)
- total_prs incrémenté dans le même database.write() que S05
- Schema version : v19
