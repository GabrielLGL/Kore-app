# refactor(stats) — split stats utils into dedicated modules and add i18n
Date : 2026-03-07 08:30

## Instruction
docs/bmad/morning/20260307-0800-commit-stats-refactor.md

## Rapport source
docs/bmad/morning/20260307-0800-commit-stats-refactor.md

## Classification
Type : refactor
Fichiers modifiés :
- mobile/src/model/utils/statsContext.ts (new)
- mobile/src/model/utils/statsKPIs.ts
- mobile/src/model/utils/statsMuscle.ts
- mobile/src/model/utils/statsPRs.ts
- mobile/src/model/utils/statsVolume.ts
- mobile/src/model/utils/__tests__/statsMuscle.test.ts
- mobile/src/model/utils/__tests__/statsVolume.test.ts
- mobile/src/screens/HomeScreen.tsx
- mobile/src/screens/StatsExercisesScreen.tsx
- mobile/src/screens/StatsMeasurementsScreen.tsx
- mobile/src/screens/StatsVolumeScreen.tsx
- mobile/src/screens/__tests__/StatsVolumeScreen.test.tsx
- mobile/src/i18n/en.ts
- mobile/src/i18n/fr.ts
- docs/bmad/morning/20260306-0800-i18n-hardcoded.md
- docs/bmad/morning/20260306-0800-raw-unsafe.md
- docs/bmad/morning/20260306-0800-usecallback.md

## Ce qui a été fait
- Commité le refactor stats (split modules + i18n) en 2 commits séparés
- Commit 1 : refactor code (14 fichiers, +211/-222 lignes)
- Commit 2 : docs morning résolus (3 fichiers)

## Vérification
- TypeScript : ✅ 0 erreurs
- Tests : ✅ 1558 passed
- Nouveau test créé : non (tests existants déjà à jour)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260307-0830

## Commit
66a74cf refactor(stats): split stats utils into dedicated modules and add i18n
6cf52fb docs(morning): mark resolved reports for i18n, raw-unsafe, usecallback
