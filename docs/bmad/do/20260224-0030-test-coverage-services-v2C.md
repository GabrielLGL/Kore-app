# test(services) — Coverage vague 2 groupe C (+30 tests, 4 services)
Date : 2026-02-24 00:30

## Instruction
docs/bmad/prompts/20260223-2200-coverage2-C.md

## Rapport source
docs/bmad/prompts/20260223-2200-coverage2-C.md

## Classification
Type : test
Fichiers modifiés :
- mobile/src/services/ai/__tests__/providers.test.ts
- mobile/src/services/__tests__/secureKeyStore.test.ts
- mobile/src/services/ai/__tests__/offlineEngine.test.ts
- mobile/src/services/ai/programGenerator/__tests__/splitStrategy.test.ts

## Ce qui a été fait
Enrichi les 4 fichiers de test des services/utilitaires du groupe C :

### openaiProvider (50% → 100%, +50pts)
- 6 tests ajoutés : retry après HTTP 429 (succès au 2e essai), retry 429 puis erreur 500, double 429, testOpenAIConnection succès, testOpenAIConnection erreur 401, testOpenAIConnection erreur 500
- Couverture complète du flow retry avec setTimeout réel (5s timeout)

### secureKeyStore (63% → 88.23%, +25pts)
- 6 tests ajoutés : deleteApiKey store disabled, migrateKeyFromDB (migration, already migrated, no user, no aiApiKey, error handling)
- Mock database.get/write pour simuler les cas de migration
- Couverture du catch block non-blocking (line 94)

### offlineEngine (78% → 96.35%, +18pts)
- 10 tests ajoutés : phase prise_masse (reps +1/+1), prise_masse rest +15% compound_heavy, compound_heavy metadata (rest 210s, rpe 9), goal cardio (Cardio exercise append), musclesFocus reordering (program mode), split brosplit explicite, stretchBalance swap, 6 muscles allocation, phase maintien volume réduit
- Coverage ensureStretchBalance (lines 311-342) via Math.random mock

### splitStrategy (73% → 100%, +27pts)
- 8 tests ajoutés : beginner 5j fallback, intermediate 6j, daysPerWeek hors table fallback, daysPerWeek 2, strength+advanced+5j, push_pull schedule, split schedule (4j et 5j rotation), unknown split fallback
- Couverture complète de toutes les branches de determineSplit et buildWeeklySchedule

## Vérification
- TypeScript : ✅ zero errors
- Tests : ✅ 1072 passed (1042 → 1072, +30 new tests)
- Nouveau test créé : oui (enrichi 4 fichiers existants)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260224-0030

## Commit
1ec9b88 test(services): increase coverage for 4 services group C (+30 tests, 1042→1072)
