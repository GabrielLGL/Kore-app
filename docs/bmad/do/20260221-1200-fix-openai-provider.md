# fix(ai) — OpenAI provider : modèle obsolète + test de connexion minimal
Date : 2026-02-21 12:00

## Instruction
docs/bmad/prompts/20260221-1200-openai-fix-A.md

## Rapport source
docs/bmad/prompts/20260221-1200-openai-fix-A.md

## Classification
Type : fix
Fichiers modifiés :
- mobile/src/services/ai/openaiProvider.ts
- mobile/src/services/ai/aiService.ts
- mobile/src/services/ai/__tests__/aiService.test.ts

## Ce qui a été fait
1. **openaiProvider.ts** :
   - Changement de modèle : `gpt-4o-mini` → `gpt-4.1-mini`
   - Extraction de l'URL en constante `OPENAI_URL`
   - Ajout de la fonction exportée `testOpenAIConnection(apiKey)` : prompt minimal (10 tokens, temperature: 0), pattern identique à `testGeminiConnection` (withTimeout 10s + finally clear())

2. **aiService.ts** :
   - Import de `testOpenAIConnection` depuis `./openaiProvider`
   - Ajout du bloc `if (providerName === 'openai')` dans `testProviderConnection` avant le fallback générique — appelle `testOpenAIConnection(apiKey)` et retourne

3. **aiService.test.ts** :
   - Mise à jour du mock `openaiProvider` pour inclure `testOpenAIConnection: jest.fn().mockResolvedValue(undefined)`
   - Import de `testOpenAIConnection` dans le test
   - Correction de l'assertion : le test vérifie désormais que `testOpenAIConnection` est appelée avec la bonne clé (et que `createOpenAIProvider` n'est PAS appelé)

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 776 passed (0 failed)
- Nouveau test créé : non (test existant corrigé)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260221-1200

## Commit
e77345d fix(ai): migrate OpenAI to gpt-4.1-mini and add minimal connection test
