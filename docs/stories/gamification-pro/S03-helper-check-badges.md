# S03 — Helper checkBadges()

## Story
**En tant que** système,
**je veux** un helper qui compare l'état actuel du User avec les seuils des 50 badges et retourne les badges nouvellement débloqués,
**afin que** la logique de déblocage soit centralisée, testée et réutilisable.

## Tâches techniques
1. Créer `mobile/src/model/utils/badgeHelpers.ts`
2. Définir l'interface `CheckBadgesParams`
3. Implémenter `checkBadges(params): BadgeDefinition[]`
   - Pour chaque badge dans BADGES_LIST
   - Si badge déjà dans `existingBadgeIds` → skip
   - Sinon, évaluer selon la catégorie :
     - `sessions` → `params.sessionCount >= badge.threshold`
     - `tonnage` → `params.user.totalTonnage >= badge.threshold`
     - `streak` → `params.user.bestStreak >= badge.threshold`
     - `level` → `params.user.level >= badge.threshold`
     - `pr` → `params.user.totalPrs >= badge.threshold`
     - `session_volume` → `params.sessionVolume >= badge.threshold`
     - `exercises` → `params.distinctExerciseCount >= badge.threshold`
   - Retourner uniquement les badges nouvellement franchis
4. Tests unitaires complets dans `__tests__/badgeHelpers.test.ts`
5. `npx tsc --noEmit` → 0 erreur

## Interface
```ts
interface CheckBadgesParams {
  user: {
    totalTonnage: number
    bestStreak: number
    level: number
    totalPrs: number
  }
  existingBadgeIds: string[]
  sessionCount: number
  sessionVolume: number
  distinctExerciseCount: number
}

function checkBadges(params: CheckBadgesParams): BadgeDefinition[]
```

## Tests unitaires requis
- Retourne [] si tous les badges déjà débloqués
- Retourne [] si aucun seuil atteint
- Catégorie sessions : détecte badge à seuil exact
- Catégorie tonnage : détecte badge (user.totalTonnage inclut déjà la séance)
- Catégorie streak : vérifie best_streak (pas current_streak)
- Catégorie level : détecte passage de niveau
- Catégorie pr : détecte après incrément total_prs
- Catégorie session_volume : détecte sur volume de la séance courante
- Catégorie exercises : détecte sur distinctExerciseCount
- Ne retourne pas un badge déjà dans existingBadgeIds
- Retourne plusieurs badges si plusieurs seuils franchis simultanément

## Critères d'acceptation
- [ ] Fichier `badgeHelpers.ts` créé
- [ ] `checkBadges()` couvre les 7 catégories
- [ ] Tests unitaires : minimum 10 cas
- [ ] Tous les tests passent
- [ ] `npx tsc --noEmit` passe

## Dépend de
- S02

## Estimation
M (~1h)
