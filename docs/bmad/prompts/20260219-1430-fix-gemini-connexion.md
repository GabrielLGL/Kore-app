# Prompt analysé — fix-gemini-connexion — 2026-02-19

## Demande originale
"quand je met ma clé et que je teste il me met erreur de connexion alors que j'ai la bonne clé api de google"

## Analyse

### Problème identifié
Le test de connexion Gemini/Google affiche toujours une erreur générique ("Impossible de joindre gemini. Vérifie ta clé API.") même quand la clé est valide. La vraie cause est masquée car :
1. `geminiProvider.ts` throw une erreur avec le status HTTP mais sans lire le body JSON de l'erreur (qui contient le message réel de Google)
2. `SettingsScreen.tsx` catch l'erreur mais affiche toujours un message fixe, sans montrer `error.message`

### Causes probables
- API "Generative Language" non activée dans Google Cloud Console → 403
- Format de requête invalide → 400 INVALID_ARGUMENT
- Quota dépassé → 429
- Clé associée à un mauvais projet → 403 API_KEY_INVALID

### Fichiers concernés
- `mobile/src/services/ai/geminiProvider.ts` — améliorer la lecture du body d'erreur HTTP
- `mobile/src/services/ai/aiService.ts` — vérifier si le test peut être allégé
- `mobile/src/screens/SettingsScreen.tsx` — afficher error.message dans l'Alert

## Commandes générées

| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | fix geminiProvider + aiService — lire body erreur, améliorer test connexion | geminiProvider.ts, aiService.ts | avec B |
| B | fix SettingsScreen — afficher erreur réelle dans Alert catch | SettingsScreen.tsx | avec A |

## Notes
- Les deux groupes sont indépendants (fichiers différents) → lancer en parallèle
- Groupe A corrige la source de l'erreur, Groupe B améliore l'affichage
- Le vrai diagnostic passera par le message d'erreur enrichi (Groupe A + B ensemble)
