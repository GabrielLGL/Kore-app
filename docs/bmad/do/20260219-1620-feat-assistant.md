# feat(assistant) — add chat UI mode for connected AI providers
Date : 2026-02-19 16:20

## Instruction
Ajouter un mode chat interactif dans AssistantScreen.tsx pour les providers IA connectés (claude/openai/gemini). Le wizard existant reste inchangé pour le mode offline.

## Classification
Type : feat
Fichiers : mobile/src/screens/AssistantScreen.tsx

## Ce qui a été fait

### Nouveaux types
- `ChatMsg { id, role: 'ai'|'user', text }` — message de conversation
- `ChatStepId` — union type pour les étapes du chat

### Nouveaux états
- `chatMessages: ChatMsg[]` — historique de la conversation
- `chatStep: ChatStepId` — étape courante du chat
- `chatFormData: Partial<AIFormData>` — formulaire côté chat
- `chatScrollRef` — ref pour scroll automatique
- `chatInitRef` — ref pour éviter double-init

### Nouvelle logique
- `isConnectedMode` : true si aiProvider est claude/openai/gemini
- `providerName` via `PROVIDER_DISPLAY` (Claude / GPT-4o / Gemini)
- `toggleChatEquipment` — multi-sélection équipement en chat
- `handleChatSelect(field, value, userLabel)` — progression séquentielle du chat avec messages IA
- `handleEquipmentChatNext` — validation multi-select équipement
- useEffect init : message de bienvenue au montage (avec guard chatInitRef)
- useEffect scroll : scrollToEnd après chaque nouveau message (setTimeout avec cleanup)
- `handleModify` : reset chat si isConnectedMode, reset wizard sinon

### GOAL_OPTIONS mis à jour
- Anciens : masse / force / perte / cardio (ne correspondaient pas au type AIGoal)
- Nouveaux : bodybuilding / power / renfo / cardio ✅ (sync avec `AIGoal` type)

### renderChatUI()
- ScrollView de messages avec bulles gauche (IA, colors.card) et droite (user, colors.primary)
- Avatar 🤖 pour les messages IA
- Zone de chips fixe en bas avec séparateur
- Support single-choice et multi-select (équipement)

### Séquence de chat
goal → level → equipment → duration → mode → [daysPerWeek|muscleGroup → targetProgram] → done (trigger generate)

### Sync formData
Quand triggerGenerate est déclenché depuis le chat, `setFormData(chatFormData)` est appelé pour que handleValidate lise le bon mode/targetProgramId.

## Vérification
- TypeScript : ✅ npx tsc --noEmit — zéro erreur
- Tests : ✅ 638 passed (41 suites)
- Nouveau test créé : non (feat UI, pas de logique métier critique non couverte)

## Commit
e7ef14b feat(assistant): add chat UI mode for connected AI providers
