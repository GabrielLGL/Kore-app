# S02 — Wizard unifié & nettoyage DRY
> Priorité : Must | Effort : S | Dépend de : S01 | Bloque : S03

## Objectif
S'assurer qu'il ne reste qu'un seul état de formulaire et un seul toggleEquipment.
Vérifier que tout le code dupliqué entre les deux anciens modes a bien été supprimé.

## Fichiers touchés
- `mobile/src/screens/AssistantScreen.tsx`

## Tâches techniques

### Vérifier unicité des états
- `formData` est le seul état de formulaire (plus de `chatFormData`)
- `toggleEquipment` est la seule fonction de toggle équipement

### Nettoyer PROVIDER_DISPLAY
- La constante `PROVIDER_DISPLAY` (utilisée uniquement pour `providerName` dans le chat) peut être supprimée si elle n'est plus référencée
- Garder `PROVIDER_LABELS` (utilisé pour le badge, cf S04)

### Vérifier handleValidate
- `handleValidate` utilise `formData.mode` et `formData.targetProgramId` — doit rester fonctionnel
- Plus de référence à `chatFormData` dans cette fonction

### Vérifier handleModify
- Reset unique : `setCurrentStep(0)` + `setFormData({ equipment: [] })`
- Plus de branche `isConnectedMode`

### Vérifier triggerGenerate
- Appelé depuis `handleSelect` et `handleEquipmentNext` uniquement
- Plus d'appel depuis `handleChatSelect`

## Critères d'acceptation
- [ ] Une seule instance de `toggleEquipment` dans le fichier
- [ ] Un seul état `formData`
- [ ] `PROVIDER_DISPLAY` supprimée si inutilisée
- [ ] `handleModify` ne contient aucun branchement provider
- [ ] `npx tsc --noEmit` passe sans erreur
- [ ] AssistantScreen.tsx < 600 lignes après S01 + S02
