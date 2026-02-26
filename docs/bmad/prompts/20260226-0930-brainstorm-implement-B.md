<!-- v1.0 — 2026-02-26 -->
# Rapport — brainstorm-implement — Groupe B — 20260226-0930
## assistant-ia-ux : S01 → S08

## Objectif
Implémenter les 8 stories UX de l'AssistantScreen dans l'ordre de dépendance.
Objectif : simplifier l'UI (supprimer le mode chat, unifier le wizard), enrichir
le preview du programme généré, et ajouter le choix du type de split.

## Fichiers concernés
- `mobile/src/screens/AssistantScreen.tsx`                      (S01, S02, S03, S04, S06, S07, S08)
- `mobile/src/components/AssistantPreviewSheet.tsx`             (S05)
- `mobile/src/services/ai/types.ts`                             (S06)
- `mobile/src/services/ai/offlineEngine.ts`                     (S06)
- `mobile/src/services/ai/providerUtils.ts`                     (S06)
- Tests associés dans `mobile/src/screens/__tests__/` et `mobile/src/services/ai/__tests__/`

## Contexte technique
- Stack : React Native (Expo 52) + TypeScript + WatermelonDB. Dark mode only.
- L'AssistantScreen supporte 4 providers : offline, claude, gemini, openai
- Patterns :
  - NO `<Modal>` natif → `<AlertDialog>` / `<BottomSheet>` avec Portal
  - Haptics via `useHaptics()` hook
  - Colors via `colors.*` from `theme/index.ts`
  - `<AlertDialog>` pour confirmations (title, message, onConfirm, onCancel)
  - Mutations WatermelonDB → toujours dans `database.write()`

## Étapes dans l'ordre STRICT (dépendances)

### S01 — Supprimer le mode chat (Must, Effort M)
Story : `docs/stories/assistant-ia-ux/S01-suppression-chat.md`

Lire la story complète — elle contient la liste exacte de ce qui doit être supprimé :
- Types : `ChatMsg`, `ChatStepId`
- States : `chatMessages`, `chatStep`, `chatFormData`, `chatScrollRef`, `chatInitRef`
- Variables dérivées : `isConnectedMode`, `providerName`
- Handlers : `toggleChatEquipment`, `handleChatSelect`, `handleEquipmentChatNext`
- useEffects : "Chat init", "Chat scroll to bottom"
- Fonctions de rendu : `renderChatOptions()`, `renderChatUI()`
- Branchement conditionnel `isConnectedMode` → wizard directement
- Dans `handleModify` : supprimer branche `if (isConnectedMode)`
- Styles `chat*` : 20+ styles préfixés chat à supprimer

### S02 — Wizard unifié & nettoyage DRY (Must, Effort S)
Story : `docs/stories/assistant-ia-ux/S02-dry-wizard.md`

Vérifier après S01 qu'il n'y a qu'un seul état formData et une seule fonction toggleEquipment.
Nettoyer les doublons.

### S03 — Transitions de progression (Must, Effort S)
Story : `docs/stories/assistant-ia-ux/S03-progress-transitions.md`

Ajouter animations de transition entre les étapes du wizard (Animated ou Reanimated).

### S04 — Badge provider (Must, Effort XS)
Story : `docs/stories/assistant-ia-ux/S04-badge-provider.md`

Afficher un badge du provider actif (icône ou texte) dans l'UI.

### S05 — PreviewSheet enrichie (Must, Effort S)
Story : `docs/stories/assistant-ia-ux/S05-preview-sheet-enrichie.md`

Modifier `AssistantPreviewSheet.tsx` :
- Afficher poids cibles
- Résumé du plan
- Titre dynamique
- Prop `mode` depuis AssistantScreen

### S06 — Choix du type de split (Must, Effort S)
Story : `docs/stories/assistant-ia-ux/S06-split-type.md`

Ajouter `AISplit = 'auto' | 'fullbody' | 'upperlower' | 'ppl'` dans types.ts.
Ajouter le sélecteur dans le wizard AssistantScreen.
Adapter offlineEngine.ts et providerUtils.ts pour tenir compte du choix.

### S07 — Focus musculaire (Must, Effort S)
Story : `docs/stories/assistant-ia-ux/S07-focus-musculaire.md`

Permettre à l'utilisateur de choisir les groupes musculaires prioritaires dans le wizard.

### S08 — Bouton Recommencer (Should, Effort XS)
Story : `docs/stories/assistant-ia-ux/S08-bouton-recommencer.md`

Ajouter bouton "Recommencer" avec confirmation `<AlertDialog>` pour réinitialiser le wizard.

## Contraintes
- Ne pas casser : `aiService.ts`, `offlineEngine.ts` (logique de génération intacte)
- Respecter : `<AlertDialog>` pour confirmations (not native Alert), Portal pattern
- Ne pas casser les tests existants de AssistantScreen
- Séquentiel strict : S01 → S02 → S03 → S04, S05 peut être parallèle à S03/S04, S06 après S02

## Critères de validation
- `npx tsc --noEmit` → 0 erreur
- `npm test` → 1186+ pass, 0 fail
- Aucune référence `chatMessages`, `chatStep`, `isConnectedMode` dans AssistantScreen
- Le wizard fonctionne avec les 4 providers (offline, claude, gemini, openai)
- AssistantPreviewSheet affiche poids et résumé

## Dépendances
Aucune dépendance sur le Groupe A. Peut être lancé en parallèle.

## Statut
✅ Résolu — 20260226-1100

## Résolution
Rapport do : docs/bmad/do/20260226-1100-feat-assistant-preview.md
