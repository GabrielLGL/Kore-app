# Prompt analysé — fix-gemini-eu-hint — 2026-02-19

## Demande originale
Erreur 429 limit: 0 avec seulement 4 requêtes. AI Studio confirme usage très faible.

## Analyse

### Problème identifié
**Ce n'est PAS un bug de code.** C'est une restriction régionale Google :
- Depuis décembre 2025, le free tier Gemini est bloqué pour les utilisateurs EU/UK/Suisse
- `limit: 0` avec seulement 4 requêtes = la limite est littéralement 0 (pas de free tier disponible)
- Aucun modèle ne fonctionnera sans facturation pour les utilisateurs EU

### Seul fix possible en code
Mettre à jour le hint 429 dans SettingsScreen.tsx pour expliquer la vraie cause (restriction EU/billing requis) au lieu du message trompeur actuel.

### Fichiers concernés
- `mobile/src/screens/SettingsScreen.tsx` — hint 429 dans handleTestConnection

## Commandes générées

| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | fix SettingsScreen — hint 429 → message restriction EU | SettingsScreen.tsx | seul |

## Sources
- https://www.aifreeapi.com/en/posts/gemini-api-free-tier-rate-limits (restriction EU confirmée)
