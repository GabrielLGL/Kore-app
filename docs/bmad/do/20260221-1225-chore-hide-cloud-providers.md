# chore(settings) — Masquer providers cloud IA + badge Prochainement
Date : 2026-02-21 12:25

## Instruction
docs/bmad/prompts/20260221-1215-hide-cloud-providers-A.md

## Rapport source
docs/bmad/prompts/20260221-1215-hide-cloud-providers-A.md

## Classification
Type : chore/style
Fichiers modifiés :
- mobile/src/screens/SettingsScreen.tsx
- mobile/src/screens/AssistantScreen.tsx
- mobile/src/screens/__tests__/SettingsScreen.test.tsx

## Ce qui a été fait

### SettingsScreen.tsx
- Supprimé les imports `ActivityIndicator`, `Alert`, `testProviderConnection`, `AIProviderName`
- Supprimé les states `aiProvider`, `aiApiKey`, `isTesting`
- Supprimé les fonctions `handleSaveAI`, `handleSelectProvider`, `handleApiKeyBlur`, `handleTestConnection`
- Supprimé la constante `PROVIDERS` (Claude/OpenAI/Gemini)
- Remplacé la liste de radio buttons + API key input + bouton test par :
  - View statique "Offline — Génération locale" (actif, radio filled)
  - View statique "IA cloud" + badge "Prochainement" (non-cliquable, opacité 0.4)
- Supprimé les styles orphelins : `apiKeyInput`, `testButton`, `testButtonDisabled`, `testButtonText`
- Ajouté les styles : `providerRowDisabled`, `providerRowContent`, `providerLabelDisabled`, `providerComingSoon`

### AssistantScreen.tsx
- Nettoyé `PROVIDER_LABELS` : ne garde que `offline: 'Offline'` (claude/openai/gemini inutilisés supprimés)
- Badge provider dans le header affiche toujours "🔌 Offline" — aucune logique changée

### SettingsScreen.test.tsx
- Supprimé l'import `Alert` et le mock `testProviderConnection` (plus nécessaires)
- Remplacé le describe 'section IA' : supprimé les 11 tests de l'ancienne UI (providers, API key, test connexion)
- Ajouté 4 nouveaux tests couvrant la nouvelle UI :
  - "affiche le provider offline actif"
  - "affiche le badge Prochainement pour l'IA cloud"
  - "n'affiche pas de champ clé API"
  - "n'affiche pas de bouton Tester la connexion"

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 768 passed (0 failed)
- Nouveau test créé : oui (4 tests remplacent 11)

## Documentation mise à jour
Aucune (pas de nouveau pattern ou pitfall)

## Statut
✅ Résolu — 20260221-1225

## Commit
[sera rempli après commit]
