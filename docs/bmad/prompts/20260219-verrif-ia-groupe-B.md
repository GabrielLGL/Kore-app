# fix(providerUtils) — normalisation weightTarget manquante dans parseGeneratedPlan
Date : 2026-02-19 14:xx

## Instruction
Vérifier les providers IA de WEGOGYM. Stack: React Native Expo 52 + TypeScript strict.
Lire claudeProvider.ts, openaiProvider.ts, geminiProvider.ts, providerUtils.ts.
Si bug trouvé: corriger directement.

## Classification
Type : fix
Fichiers modifiés :
- `mobile/src/services/ai/providerUtils.ts`
- `mobile/src/services/ai/__tests__/providerUtils.test.ts`

---

## Audit par fichier

### 1. `claudeProvider.ts` — ✅ Correct
| Critère | Résultat |
|---------|----------|
| Endpoint | ✅ `https://api.anthropic.com/v1/messages` |
| Header `x-api-key` | ✅ présent |
| Header `anthropic-version` | ✅ `2023-06-01` |
| Model | ✅ `claude-haiku-4-5-20251001` |
| Timeout | ✅ `AbortSignal.timeout(30000)` |
| Parsing | ✅ `data.content?.find(c => c.type === 'text')?.text ?? ''` |
| Types | ✅ aucun `any` |

### 2. `openaiProvider.ts` — ✅ Correct
| Critère | Résultat |
|---------|----------|
| Endpoint | ✅ `https://api.openai.com/v1/chat/completions` |
| Header Authorization | ✅ `Bearer ${apiKey}` |
| Parsing | ✅ `data.choices?.[0]?.message?.content ?? ''` |
| Timeout | ✅ `AbortSignal.timeout(30000)` |
| Types | ✅ aucun `any` |

### 3. `geminiProvider.ts` — ✅ Correct
| Critère | Résultat |
|---------|----------|
| Endpoint | ✅ `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` |
| Header `X-Goog-Api-Key` | ✅ présent |
| Parsing | ✅ `data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''` |
| Timeout | ✅ `AbortSignal.timeout(30000)` |
| Types | ✅ aucun `any` |

### 4. `providerUtils.ts` — 🔴 Bug trouvé → ✅ Corrigé

#### `buildPrompt`
- ✅ Retourne un prompt structuré en string
- ✅ Types corrects (AIFormData, DBContext)
- ✅ Pas de `any`

#### `parseGeneratedPlan`
- ✅ `JSON.parse` dans try/catch
- ✅ Pas de `any` (utilise `unknown` + type narrowing)
- ❌ **BUG** : `weightTarget` non validé/normalisé alors que `GeneratedExercise.weightTarget: number` est requis

**Détail du bug :**
Le type `GeneratedExercise` (dans `types.ts` l. 21) déclare `weightTarget: number` comme champ requis.
La fonction `parseGeneratedPlan` valide `exerciseName`, `setsTarget`, `repsTarget`, mais **omet complètement `weightTarget`**.
Le double cast `as unknown as GeneratedPlan` (l. 91) contourne TypeScript et laisse passer `undefined` au runtime si l'IA omet ce champ.

**Correction appliquée :**
```ts
if (typeof e.weightTarget !== 'number') {
  e.weightTarget = 0
}
```
Cohérent avec la directive du prompt : "weightTarget doit être 0 si inconnu".

---

## Vérification
- TypeScript : ✅ zéro erreur nouvelle (erreurs pré-existantes dans `models.test.ts` sans lien)
- Tests : ✅ 29 passed (28 existants + 1 nouveau)
- Nouveau test créé : **oui** — `normalise weightTarget à 0 si absent ou non-number`

## Commit
fix(providerUtils): normalize weightTarget to 0 when missing in parseGeneratedPlan
