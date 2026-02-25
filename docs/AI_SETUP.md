# Configuration des Providers IA — Guide

## Providers disponibles

- **Offline** (défaut) — aucune clé requise, génération locale basique
- **Gemini** (Google) — recommandé, gemini-2.0-flash
- **Claude** (Anthropic) — haute qualité
- **OpenAI** (GPT-4o) — alternative

---

## Gemini — Configuration

### Prérequis

1. Compte Google avec facturation activée
2. Billing Google Cloud activé sur le projet de la clé API

### Étapes

1. Aller sur https://console.cloud.google.com
2. Créer ou sélectionner un projet
3. Menu Facturation → lier un compte de facturation
4. APIs & Services → Bibliothèque → activer "Generative Language API"
5. APIs & Services → Identifiants → Créer une clé API
6. Dans Kore Settings → sélectionner Gemini → coller la clé → Tester

### Problèmes fréquents

| Erreur | Cause | Solution |
|--------|-------|----------|
| 404 model not found | Modèle retiré par Google | Utiliser gemini-2.0-flash |
| 429 limit: 0 (EU) | Free tier non dispo en EU | Activer billing sur le projet |
| 429 limit: 0 (billing actif) | Billing sur mauvais projet | Recréer la clé dans le projet avec billing |
| 403 API_NOT_ENABLED | API non activée | Activer Generative Language API dans Cloud Console |

### Notes techniques

- Endpoint : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- Header : `X-Goog-Api-Key`
- Timeout : 30s (génération), 10s (test connexion)
- Compatibilité Hermes : utiliser AbortController (pas AbortSignal.timeout)

---

## Claude — Configuration

1. Créer un compte sur https://console.anthropic.com
2. API Keys → Create Key
3. Dans Kore Settings → sélectionner Claude → coller la clé → Tester

---

## OpenAI — Configuration

1. Créer un compte sur https://platform.openai.com
2. API Keys → Create new secret key
3. Dans Kore Settings → sélectionner OpenAI → coller la clé → Tester
