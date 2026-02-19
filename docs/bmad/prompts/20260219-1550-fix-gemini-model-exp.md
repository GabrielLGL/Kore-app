# Prompt analysé — fix-gemini-model-exp — 2026-02-19

## Demande originale
Erreur 404 gemini-2.0-flash-exp : "is not found for API version v1beta". Revenir en arrière.

## Analyse
- gemini-2.0-flash-exp a été retiré de l'API Google
- L'utilisateur a maintenant la facturation activée ($300 crédit) → plus de restriction free tier
- gemini-2.0-flash est le modèle production stable à utiliser avec billing activé

### Fichiers concernés
- `mobile/src/services/ai/geminiProvider.ts` — ligne 4, constante GEMINI_URL

## Commandes générées

| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | fix geminiProvider — modèle gemini-2.0-flash-exp → gemini-2.0-flash | geminiProvider.ts | seul |
