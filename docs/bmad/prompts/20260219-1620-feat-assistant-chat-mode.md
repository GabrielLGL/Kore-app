# Prompt analysé — feat-assistant-chat-mode — 2026-02-19

## Demande originale
"je veux changer le mode de fonctionnement de l'assistant IA : en mode offline on reste comme ça, mais en mode ia connected on va faire un chat interactif simple pour avoir les informations"
+ Labels objectifs : Bodybuilding / Power / Cardio / Renfo (pas de labels abstraits)

## Analyse

### Objectif
- Offline : wizard step-by-step inchangé
- Connected (Gemini/Claude/OpenAI) : interface chat — messages AI + chips réponse utilisateur
- Nouveau AIGoal : 'bodybuilding' | 'power' | 'cardio' | 'renfo'

### Fichiers concernés
- types.ts — AIGoal type
- offlineEngine.ts — SETS_REPS keys + goalLabels
- providerUtils.ts — mapping goal → texte prompt
- AssistantScreen.tsx — chat UI mode + nouveaux labels

## Commandes générées

| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | update AIGoal type + offline engine + prompt | types.ts, offlineEngine.ts, providerUtils.ts | avec B |
| B | add chat UI mode in AssistantScreen | AssistantScreen.tsx | avec A |
