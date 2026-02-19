# Prompt analysé — feat-assistant-wizard — 2026-02-19

## Demande originale
"ok c'est good gemini a réussi à être connecté, il faudrait modifier l'écran pour que quand on est connecté à une ia on ait des questions de bases, on y répond et hop il génère de façon un peu plus interactive"

## Analyse

### Objectif
Transformer AssistantScreen.tsx d'un formulaire unique en un wizard interactif step-by-step.
- Afficher une question à la fois
- Auto-avancer sur sélection (single-choice) ou bouton "Suivant" (multi-select)
- Progress indicator en haut
- Le flow génération/preview (AssistantPreviewSheet) ne change pas

### Fichiers concernés
- `mobile/src/screens/AssistantScreen.tsx` — refactor complet du UI (logique form inchangée)

## Commandes générées

| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | feat AssistantScreen — refactor formulaire en wizard interactif step-by-step | AssistantScreen.tsx | seul |
