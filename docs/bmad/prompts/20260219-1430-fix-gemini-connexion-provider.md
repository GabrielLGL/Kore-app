# feat(ai) — Améliorer messages d'erreur Gemini et robustesse test connexion
Date : 2026-02-19 14:30

## Instruction
Déboguer et améliorer le test de connexion Gemini/Google dans le projet WEGOGYM.
L'utilisateur entre sa clé Google Gemini, clique "Tester la connexion", et obtient
toujours "Erreur de connexion" même avec une clé valide. L'erreur réelle de l'API
(ex: 403 API_NOT_ENABLED, 400 INVALID_ARGUMENT) est perdue.

## Classification
Type : feat (amélioration + fix bug message d'erreur perdu)
Fichiers modifiés :
- `mobile/src/services/ai/geminiProvider.ts`
- `mobile/src/services/ai/aiService.ts`
- `mobile/src/services/ai/__tests__/aiService.test.ts`
- `mobile/src/services/ai/__tests__/providers.test.ts`

## Ce qui a été fait

### 1. geminiProvider.ts — Lecture du body d'erreur HTTP
**Avant :**
```typescript
if (!response.ok) {
  throw new Error(`Gemini API erreur ${response.status}`)
}
```
**Après :**
```typescript
async function throwGeminiError(response: Response): Promise<never> {
  const errorBody = await response.json().catch(() => ({})) as { error?: { message?: string } }
  throw new Error(`Gemini API erreur ${response.status}: ${errorBody?.error?.message ?? 'Erreur inconnue'}`)
}
```
Appliqué à la fois dans `generate()` et dans la nouvelle `testGeminiConnection()`.

### 2. geminiProvider.ts — Nouvelle fonction testGeminiConnection()
Exportée séparément, envoie un prompt minimal ("Réponds uniquement "ok".") avec :
- `maxOutputTokens: 10` → consomme quasi zéro quota
- `temperature: 0`
- `AbortSignal.timeout(10000)` → timeout 10s au lieu de 30s

### 3. aiService.ts — testProviderConnection() optimisée pour Gemini
**Avant :** appelait `provider.generate()` avec un formulaire complet → génération
d'un plan entier pour tester la clé (lourd, timeout probable, quota consommé).

**Après :** détecte `providerName === 'gemini'` AVANT `selectProvider()` et appelle
`testGeminiConnection(apiKey)` directement. Les autres providers (claude, openai)
conservent le comportement existant via `provider.generate()`.

### 4. Tests mis à jour
- `providers.test.ts` : ajout test message enrichi (403 + API_NOT_ENABLED) + 3 tests
  pour `testGeminiConnection` (ok, 403+message, 400+body vide)
- `aiService.test.ts` : mock `testGeminiConnection` dans geminiProvider + test
  "appelle testGeminiConnection si provider='gemini'"

## Décisions techniques
- **Pas de modification de l'interface `AIProvider`** : `testGeminiConnection` est
  une fonction exportée séparément, évitant de toucher claude/openai providers.
- **Timeout 10s pour le test** : suffisant pour un test de clé, évite les attentes
  inutiles en cas de clé invalide.
- **Helper privé `throwGeminiError`** : DRY — utilisé par `generate()` et
  `testGeminiConnection()`.

## Vérification
- TypeScript (`npx tsc --noEmit`) : ✅ zéro erreur
- Tests (`npm test`): ✅ 78 passed (77 existants + 1 nouveau Gemini)

## Commit
`16b393e` feat(ai): améliorer messages d'erreur Gemini et robustesse test connexion
