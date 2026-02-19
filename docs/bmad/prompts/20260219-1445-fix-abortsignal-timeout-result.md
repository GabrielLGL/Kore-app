# fix(ai) — Remplacer AbortSignal.timeout par AbortController (compatibilité Hermes)
Date : 2026-02-19 14:45

## Instruction
Corriger l'erreur "AbortSignal.timeout is not a function (it is undefined)" dans le projet WEGOGYM.
Hermes (moteur JS de React Native/Expo) ne supporte pas `AbortSignal.timeout(ms)`.

## Classification
Type : fix
Fichiers :
- `mobile/src/services/ai/providerUtils.ts`
- `mobile/src/services/ai/geminiProvider.ts`
- `mobile/src/services/ai/claudeProvider.ts`
- `mobile/src/services/ai/openaiProvider.ts`
- `mobile/src/services/ai/__tests__/providers.test.ts`

## Ce qui a été fait

### providerUtils.ts
Ajout de la helper exportée `withTimeout` :
```typescript
export function withTimeout(ms: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, clear: () => clearTimeout(id) }
}
```

### geminiProvider.ts
- Import de `withTimeout` depuis `./providerUtils`
- Remplacement de `signal: AbortSignal.timeout(30000)` dans `generate()` par le pattern `withTimeout` avec try/finally
- Remplacement de `signal: AbortSignal.timeout(10000)` dans `testGeminiConnection()` par le même pattern (timeout 10000ms)

### claudeProvider.ts
- Import de `withTimeout` depuis `./providerUtils`
- Remplacement de `signal: AbortSignal.timeout(30000)` dans `generate()` par le pattern `withTimeout` avec try/finally

### openaiProvider.ts
- Import de `withTimeout` depuis `./providerUtils`
- Remplacement de `signal: AbortSignal.timeout(30000)` dans `generate()` par le pattern `withTimeout` avec try/finally

### providers.test.ts
- Suppression du polyfill `AbortSignal.timeout` dans `beforeAll` (devenu code mort)

## Vérification
- TypeScript (`npx tsc --noEmit`) : ✅ 0 erreur
- Tests (`npm test -- --testPathPattern=providers`) : ✅ 13 passed
- `AbortSignal.timeout` restant dans `mobile/src/` : ✅ 0 occurrence

## Commit
b418839 fix(ai): remplacer AbortSignal.timeout par AbortController (compatibilité Hermes)
