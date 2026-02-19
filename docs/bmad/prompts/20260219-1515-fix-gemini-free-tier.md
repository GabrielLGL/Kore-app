# Prompt analysé — fix-gemini-free-tier — 2026-02-19

## Demande originale
Erreur 429 sur gemini-2.0-flash-lite avec `limit: 0` sur tous les quotas free tier. L'utilisateur veut rechercher la dernière méthode pour utiliser l'API.

## Analyse

### Problème identifié
`limit: 0` sur TOUS les modèles testés (gemini-2.0-flash, gemini-2.0-flash-lite) signifie que le projet Google Cloud n'a pas de quota gratuit.

**Cause racine probable :** La clé API a été créée depuis Google Cloud Console (console.cloud.google.com) et non depuis Google AI Studio (aistudio.google.com). Seules les clés AI Studio bénéficient du free tier.

**Contexte Google (décembre 2025) :** Google a réduit les quotas gratuits de 50-92%. Le modèle `gemini-2.0-flash-exp` est le seul avec quota free tier token intact.

### Fichiers concernés
- `mobile/src/services/ai/geminiProvider.ts` — changer modèle vers `gemini-2.0-flash-exp`
- `mobile/src/screens/SettingsScreen.tsx` — mettre à jour le hint 429 pour guider vers aistudio.google.com

## Commandes générées

| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | fix geminiProvider — modèle → gemini-2.0-flash-exp | geminiProvider.ts | avec B |
| B | fix SettingsScreen — hint 429 → mention clé AI Studio | SettingsScreen.tsx | avec A |

## Sources
- https://ai.google.dev/gemini-api/docs/rate-limits
- https://www.aifreeapi.com/en/posts/gemini-api-free-tier-rate-limits
- https://discuss.ai.google.dev/t/has-gemini-api-completely-stopped-its-free-tier/109230
