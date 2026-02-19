# Prompt analysé — Vérification Assistant IA + Clé API — 2026-02-19

## Demande originale
"je veux vérifier si le mode assistant ia fonctionne avec la clé api"

## Analyse

### Contexte technique
Le projet WEGOGYM (React Native Expo 52 + WatermelonDB) possède un système complet d'assistant IA :

**Fichiers concernés :**
- `mobile/src/services/ai/aiService.ts` — Orchestrateur principal (selectProvider, generatePlan, testProviderConnection)
- `mobile/src/services/ai/claudeProvider.ts` — Provider Claude (Anthropic API)
- `mobile/src/services/ai/openaiProvider.ts` — Provider OpenAI
- `mobile/src/services/ai/geminiProvider.ts` — Provider Gemini
- `mobile/src/services/ai/providerUtils.ts` — buildPrompt, parseGeneratedPlan
- `mobile/src/services/ai/types.ts` — Types TypeScript
- `mobile/src/services/ai/offlineEngine.ts` — Moteur offline (fallback)
- `mobile/src/screens/SettingsScreen.tsx` — UI : sélection provider + saisie clé API + test connexion
- `mobile/src/screens/AssistantScreen.tsx` — UI : génération de plans
- `mobile/src/model/models/User.ts` — Modèle : aiProvider, aiApiKey (schema v16)
- `mobile/src/model/schema.ts` — Schéma v16 : colonnes ai_provider, ai_api_key

**État connu :**
- Schema v16 ✅ (colonnes ai_provider + ai_api_key présentes)
- User model v16 ✅ (@text decorators corrects)
- claudeProvider : endpoint `https://api.anthropic.com/v1/messages`, modèle `claude-haiku-4-5-20251001`
- Fallback offline automatique si API échoue (catch dans aiService.ts:114)
- testProviderConnection fait un vrai appel API pour valider la clé

### Objectif de vérification
Vérifier que tout le pipeline fonctionne sans bug :
1. La clé API est sauvegardée correctement en base (User.aiApiKey)
2. La sélection du provider est persistée (User.aiProvider)
3. Le testProviderConnection retourne une erreur claire si la clé est invalide
4. Le generatePlan utilise le bon provider selon la config user
5. Le fallback offline se déclenche si l'API échoue
6. Pas de fuite de clé API (pas de log en production)
7. Pas de `any` TypeScript dans les providers
8. L'UI Settings affiche bien les alertes de succès/erreur

## Commandes générées

| Groupe | Tâche | Fichiers | Parallèle |
|--------|-------|----------|-----------|
| A | Vérifier cohérence schema/model + types | schema.ts, User.ts, types.ts | avec B |
| B | Vérifier providers (Claude/OpenAI/Gemini) + parsing réponse | claudeProvider.ts, openaiProvider.ts, geminiProvider.ts, providerUtils.ts | avec A |
| C | Vérifier aiService.ts (orchestration + fallback) + SettingsScreen (UI) | aiService.ts, SettingsScreen.tsx | après A+B |
| D | Vérifier AssistantScreen (génération + import plan) | AssistantScreen.tsx, AssistantPreviewSheet.tsx | après C |

---

## /do complets — Vague 1 (PARALLÈLE)

### Groupe A — Schema / Model / Types
```
/do Vérifier la cohérence du système IA de WEGOGYM côté données. Stack: React Native Expo 52 + WatermelonDB + TypeScript strict. Fichiers à lire et analyser:

1. mobile/src/model/schema.ts — table 'users' : vérifier que ai_provider (string isOptional) et ai_api_key (string isOptional) sont bien déclarés et que la version est 16
2. mobile/src/model/models/User.ts — vérifier que @text('ai_provider') aiProvider!: string | null et @text('ai_api_key') aiApiKey!: string | null sont présents et que les décorateurs @text sont corrects (pas @field)
3. mobile/src/services/ai/types.ts — vérifier: AIProviderName = 'offline'|'claude'|'openai'|'gemini', AIFormData avec tous les champs, DBContext, GeneratedPlan, GeneratedSession, GeneratedExercise, AIProvider interface avec méthode generate()

Checklist à vérifier:
- [ ] Schema v16 avec ai_provider + ai_api_key isOptional
- [ ] User model: @text (pas @field) pour les deux champs IA
- [ ] Types TypeScript stricts (pas de `any`)
- [ ] AIProviderName inclut tous les providers (offline/claude/openai/gemini)
- [ ] AIProvider.generate() signature correcte
- [ ] Pas de console.log sans __DEV__ guard

Si bug trouvé: corriger directement. Sauvegarder rapport dans docs/bmad/prompts/20260219-verrif-ia-groupe-A.md. Ne pas commit.
```

### Groupe B — Providers API
```
/do Vérifier les implémentations des providers IA de WEGOGYM. Stack: React Native Expo 52 + TypeScript strict. Fichiers à lire et analyser:

1. mobile/src/services/ai/claudeProvider.ts — vérifier:
   - endpoint: https://api.anthropic.com/v1/messages
   - headers: 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01'
   - model: 'claude-haiku-4-5-20251001' (vérifier si c'est le bon modèle actuel)
   - max_tokens: 2048
   - timeout: AbortSignal.timeout(30000)
   - parsing: data.content?.find(c => c.type === 'text')?.text
   - types corrects (pas de `any` sur data)

2. mobile/src/services/ai/openaiProvider.ts — vérifier:
   - endpoint: https://api.openai.com/v1/chat/completions
   - header Authorization: Bearer {apiKey}
   - model: gpt-4o-mini
   - parsing: choices[0].message.content
   - timeout présent

3. mobile/src/services/ai/geminiProvider.ts — vérifier:
   - endpoint correct pour gemini-1.5-flash
   - header X-Goog-Api-Key
   - parsing de la réponse Gemini (candidates[0].content.parts[0].text)
   - timeout présent

4. mobile/src/services/ai/providerUtils.ts — vérifier:
   - buildPrompt(form, context): génère un prompt JSON structuré avec tous les champs AIFormData + DBContext
   - parseGeneratedPlan(text): parse le JSON retourné par l'IA, retourne GeneratedPlan valide
   - Gestion des erreurs de parsing (JSON.parse dans try/catch)
   - Pas de `any` TypeScript

Checklist:
- [ ] Tous les headers d'authentification corrects
- [ ] Timeouts présents sur tous les fetch()
- [ ] Types corrects sur les réponses JSON (pas de `any`)
- [ ] parseGeneratedPlan gère les erreurs JSON
- [ ] Pas de console.log sans __DEV__

Si bug trouvé: corriger directement. Sauvegarder rapport dans docs/bmad/prompts/20260219-verrif-ia-groupe-B.md. Ne pas commit.
```

---

## /do complets — Vague 2 (SÉQUENTIELLE — après vague 1)

### Groupe C — Orchestration + Settings UI
```
/do Vérifier l'orchestration IA et l'UI Settings de WEGOGYM. Stack: React Native Expo 52 + WatermelonDB + TypeScript. Fichiers à lire:

1. mobile/src/services/ai/aiService.ts — vérifier:
   - selectProvider(aiProvider, apiKey): retourne offlineEngine si !apiKey ou !aiProvider ou aiProvider==='offline'
   - generatePlan(form, user): utilise user?.aiProvider et user?.aiApiKey, fallback offline dans catch
   - testProviderConnection(providerName, apiKey): ne teste pas si offline (return immédiat), fait un vrai appel generate() sur données minimales
   - Pas de console.log sans __DEV__
   - Typage strict (User importé correctement)

2. mobile/src/screens/SettingsScreen.tsx — vérifier:
   - handleSaveAI: dans database.write(), user.update() avec aiProvider + aiApiKey
   - handleSelectProvider: met à jour state ET sauvegarde en base
   - handleApiKeyBlur: sauvegarde au blur du TextInput
   - handleTestConnection: appelle testProviderConnection, Alert.alert sur succès ET erreur
   - withObservables: observe users table, passe user[0] ou null
   - aiApiKey.trim() || null: les clés vides sont sauvegardées comme null
   - secureTextEntry sur le TextInput de la clé API

Checklist:
- [ ] Fallback offline automatique si API échoue
- [ ] testProviderConnection retourne void (throw = erreur)
- [ ] Alertes UI claires (succès vert, erreur rouge)
- [ ] Pas de fuite de clé (pas de log avec la clé)
- [ ] database.write() autour de toutes les mutations WatermelonDB
- [ ] aiApiKey.trim() || null pour éviter les chaînes vides

Si bug trouvé: corriger directement. Sauvegarder rapport dans docs/bmad/prompts/20260219-verrif-ia-groupe-C.md. Ne pas commit.
```

### Groupe D — AssistantScreen
```
/do Vérifier l'écran AssistantScreen et AssistantPreviewSheet de WEGOGYM. Stack: React Native Expo 52 + WatermelonDB + TypeScript strict. Fichiers à lire:

1. mobile/src/screens/AssistantScreen.tsx — vérifier:
   - Appel generatePlan(form, user) — user passé correctement depuis withObservables
   - Loading state pendant la génération (ActivityIndicator)
   - Gestion d'erreur: try/catch autour de generatePlan, message d'erreur UI
   - AIFormData correctement construite depuis les inputs utilisateur
   - Pas de console.log sans __DEV__
   - Types stricts (pas de `any`)

2. mobile/src/components/AssistantPreviewSheet.tsx — vérifier:
   - Affiche le GeneratedPlan avec nom + sessions + exercices
   - Bouton "Importer" qui crée le programme/séance en base
   - Toutes les créations WatermelonDB dans database.write() + database.batch()
   - Gestion correcte des exercices non trouvés en base (création ou skip)
   - Fermeture du sheet après import (onClose appelé)

Checklist:
- [ ] generatePlan appelé avec user correct (pas null crash)
- [ ] Loading/error states présents dans l'UI
- [ ] Import plan: toutes mutations dans database.write()
- [ ] AssistantPreviewSheet: utilise Portal (pas native Modal — Fabric crash)
- [ ] Pas de `any` TypeScript

Si bug trouvé: corriger directement. Sauvegarder rapport dans docs/bmad/prompts/20260219-verrif-ia-groupe-D.md.
Après corrections: npx tsc --noEmit depuis mobile/. Si 0 erreurs, commit avec message:
fix(ai): vérification complète mode assistant IA + corrections

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```
