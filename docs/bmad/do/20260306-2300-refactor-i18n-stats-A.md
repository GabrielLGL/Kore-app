# refactor(i18n) — Clés agnostiques stats Groupe A
Date : 2026-03-06 23:00

## Instruction
docs/bmad/prompts/20260306-2300-i18n-stats-A.md

## Rapport source
docs/bmad/prompts/20260306-2300-i18n-stats-A.md

## Classification
Type : refactor
Fichiers modifiés :
- mobile/src/model/utils/statsTypes.ts
- mobile/src/model/utils/statsDateUtils.ts
- mobile/src/model/utils/statsHelpers.ts (commentaire)
- mobile/src/screens/StatsVolumeScreen.tsx
- mobile/src/model/utils/__tests__/statsDateUtils.test.ts
- mobile/src/model/utils/__tests__/statsHelpers.test.ts

## Ce qui a été fait
1. **statsTypes.ts** : `PERIOD_LABELS` (`['1 mois', '3 mois', 'Tout']`) remplacé par `PERIOD_KEYS` (`['1m', '3m', 'all']`) + export du type `PeriodKey`
2. **statsDateUtils.ts** : Suppression de `labelToPeriod()` (conversion FR → StatsPeriod devenue inutile)
3. **StatsVolumeScreen.tsx** :
   - `BAR_PERIOD_LABELS` (`['Semaine', '1 mois', '3 mois', 'Tout']`) → `BAR_PERIOD_KEYS` (`['week', '1m', '3m', 'all']`)
   - State : `periodLabel/barPeriodLabel` → `periodKey/barPeriodKey` avec types stricts
   - Maps de traduction : clés agnostiques au lieu de clés FR
   - `computeBarWindow` : param et comparaisons internes mis à jour
   - Plus besoin de `labelToPeriod()` — `periodKey` EST directement un `StatsPeriod`
4. **Tests** : Suppression des tests `labelToPeriod`, mise à jour de `PERIOD_LABELS` → `PERIOD_KEYS` dans statsHelpers.test.ts et statsDateUtils.test.ts

## Vérification
- TypeScript : 0 erreur
- Tests : 1558 passed, 0 failed (93 suites)
- Nouveau test créé : non (tests existants mis à jour)

## Documentation mise à jour
- statsHelpers.ts : commentaire barrel mis à jour

## Statut
Fait — 20260306-2300

## Commit
e79985c refactor(i18n): replace FR hardcoded period keys with language-agnostic keys
