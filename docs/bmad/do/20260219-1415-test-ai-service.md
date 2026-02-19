# test(ai) — Tests unitaires aiService.ts
Date : 2026-02-19 14:15

## Instruction
Ajouter des tests unitaires pour mobile/src/services/ai/aiService.ts dans un nouveau fichier
mobile/src/services/ai/__tests__/aiService.test.ts. Stack: React Native Expo 52 + TypeScript strict + Jest + WatermelonDB mocké.

## Classification
Type : test
Fichiers modifiés : `mobile/src/services/ai/__tests__/aiService.test.ts` (nouveau)

## Ce qui a été fait

### Fichier créé
`mobile/src/services/ai/__tests__/aiService.test.ts` — 7 tests couvrant :

#### generatePlan — sélection du provider (5 tests)
1. **user null → offlineEngine** — generatePlan(form, null) utilise offlineEngine
2. **aiProvider='offline' → offlineEngine** — ignore la clé API si provider=offline
3. **aiApiKey=null → offlineEngine** — pas de provider cloud sans clé
4. **aiProvider='claude' + clé → claudeProvider** — createClaudeProvider appelé avec la bonne clé
5. **fallback offline si API throw** — mockReturnValueOnce avec generate qui rejette → offlineEngine appelé

#### testProviderConnection (2 tests)
6. **provider='offline' → return immédiat** — aucun createXxxProvider appelé
7. **provider='claude' → provider.generate appelé** — test réel de connexion vérifié

### Stratégie de mock
- `@nozbe/watermelondb` mocké (Q.where/gte/oneOf/sortBy/take) → évite les dépendances natives
- `../../../model` mocké → database.get().query().fetch() retourne [] (buildDBContext sans données)
- `../offlineEngine`, `../claudeProvider`, `../openaiProvider`, `../geminiProvider` mockés avec jest.fn()
- `jest.clearAllMocks()` dans beforeEach → call records frais à chaque test, implementations conservées

## Vérification
- TypeScript : ✅ 0 erreur (npx tsc --noEmit)
- Tests : ✅ 633 passed, 41 suites (était 617/39 avant)
- Nouveau test créé : oui (7 tests)

## Commit
test(ai): add unit tests for aiService — provider selection, fallback, connection test
