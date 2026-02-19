# S01 — Suppression du mode chat
> Priorité : Must | Effort : M | Dépend de : — | Bloque : S02, S03, S04

## Objectif
Supprimer entièrement le mode chat de AssistantScreen.tsx. Un seul wizard,
identique pour tous les providers.

## Fichiers touchés
- `mobile/src/screens/AssistantScreen.tsx`

## Tâches techniques

### Supprimer les types
- `ChatMsg` interface
- `ChatStepId` type

### Supprimer les states
- `chatMessages`, `setChatMessages`
- `chatStep`, `setChatStep`
- `chatFormData`, `setChatFormData`
- `chatScrollRef`
- `chatInitRef`

### Supprimer les variables dérivées
- `isConnectedMode`
- `providerName`

### Supprimer les handlers
- `toggleChatEquipment`
- `handleChatSelect`
- `handleEquipmentChatNext`

### Supprimer les useEffects
- useEffect "Chat init" (vérifie `chatInitRef`)
- useEffect "Chat scroll to bottom"

### Supprimer les fonctions de rendu
- `renderChatOptions()`
- `renderChatUI()`

### Supprimer dans le rendu principal
- Le branchement `{isConnectedMode ? renderChatUI() : (<>...</>)}`
- Remplacer par le contenu wizard directement (sans le fragment conditionnel)

### Supprimer dans handleModify
- La branche `if (isConnectedMode)` — garder uniquement le reset wizard

### Supprimer les styles
Tous les styles préfixés `chat` :
`chatContainer`, `chatScroll`, `chatScrollContent`, `chatMsgRow`, `chatMsgRowAi`,
`chatMsgRowUser`, `chatAvatar`, `chatAvatarText`, `chatBubble`, `chatBubbleAi`,
`chatBubbleUser`, `chatBubbleText`, `chatOptionsZone`, `chatChipsWrap`, `chatChip`,
`chatChipActive`, `chatChipIcon`, `chatChipText`, `chatChipTextActive`,
`chatNextBtn`, `chatNextBtnDisabled`, `chatNextBtnText`

### Vérifier
- `generatePlan()` est toujours appelé dans `triggerGenerate` — aucun changement
- Le provider cloud continue de fonctionner via `aiService.ts` — l'UI ne change pas son comportement

## Critères d'acceptation
- [ ] Aucune référence à `chatMessages`, `chatStep`, `chatFormData` dans le fichier
- [ ] Aucun style `chat*` dans le StyleSheet
- [ ] Le wizard s'affiche pour tous les providers (offline, claude, gemini, openai)
- [ ] `handleModify` remet simplement `formData` et `currentStep` à zéro
- [ ] `npx tsc --noEmit` passe sans erreur
