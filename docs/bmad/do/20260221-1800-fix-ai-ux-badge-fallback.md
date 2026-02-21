# FIX(ai-ux) — Badge provider + notification fallback silencieux
Date : 2026-02-21 18:00

## Instruction
docs/bmad/prompts/20260221-1800-ai-ux-B.md

## Rapport source
docs/bmad/prompts/20260221-1800-ai-ux-B.md

## Classification
Type : fix
Fichiers modifiés :
- `mobile/src/services/ai/types.ts`
- `mobile/src/services/ai/aiService.ts`
- `mobile/src/components/AssistantPreviewSheet.tsx`
- `mobile/src/screens/AssistantScreen.tsx`
- `mobile/src/services/ai/__tests__/aiService.test.ts`

## Ce qui a été fait

### 1. Bonus : Retry ×1 sur 429 (déjà implémenté)
`openaiProvider.ts` contenait déjà le retry (commit `8302440`). Aucune modification requise.

### 2. Fix badge PROVIDER_LABELS (`AssistantScreen.tsx:148`)
Complété `PROVIDER_LABELS` avec les 3 providers cloud manquants :
```ts
const PROVIDER_LABELS: Record<string, string> = {
  offline: 'Offline',
  openai:  'OpenAI',
  gemini:  'Gemini',
  claude:  'Claude',
}
```

### 3. GeneratePlanResult — Option A (types.ts + aiService.ts)
Ajout dans `types.ts` :
```ts
export interface GeneratePlanResult {
  plan: GeneratedPlan
  usedFallback: boolean
  fallbackReason?: string
}
```
Modification de `generatePlan` :
- Retourne `GeneratePlanResult` au lieu de `GeneratedPlan`
- Provider offline direct → `usedFallback: false`
- Provider cloud réussi → `usedFallback: false`
- Provider cloud échoué → `usedFallback: true, fallbackReason: user.aiProvider`

### 4. Notification UX fallback (`AssistantScreen.tsx`)
- Ajout état `fallbackNotice: string | null`
- `triggerGenerate` détecte `result.usedFallback` et construit le message "Plan généré hors ligne — {Provider} indisponible"
- `fallbackNotice` réinitialisé au retour (`handleModify`)
- Passé à `AssistantPreviewSheet` via prop optionnelle

### 5. Affichage dans AssistantPreviewSheet
- Prop optionnelle `fallbackNotice?: string` ajoutée
- Affiché en `<Text>` discret (`colors.textSecondary`, `fontSize.xs`) juste avant les boutons d'action

### 6. Tests mis à jour (aiService.test.ts)
- `plan.name` → `result.plan.name` pour les 5 tests qui accèdent au retour
- Assertions `usedFallback` ajoutées :
  - Cas offline direct : `usedFallback: false`
  - Cas cloud réussi : `usedFallback: false`
  - Cas fallback : `usedFallback: true`, `fallbackReason: 'claude'`

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 22 passed
- Nouveau test créé : non (tests existants adaptés + assertions enrichies)

## Documentation mise à jour
aucune (pattern déjà documenté)

## Statut
✅ Résolu — 20260221-1832

## Commit
81b1a3e fix(ai-ux): badge provider + notification fallback silencieux
