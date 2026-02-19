# Prompt analysé — idee-assistant-ui — 2026-02-19

## Demande originale
"je veux /idee pour modifier l'intégration de l'assistant" → UI/UX du chat assistant

## Analyse

### Contexte technique
**Fichier principal :** `mobile/src/screens/AssistantScreen.tsx`
**Composant preview :** `mobile/src/components/AssistantPreviewSheet.tsx`
**Services AI :** `mobile/src/services/ai/` (aiService, offlineEngine, providers)
**Navigation :** Tab "Assistant IA" avec icône ✨

### UI actuelle (dual-mode)
```
Mode Wizard (offline) :
  Progress bar → Header (back/step counter) → ScrollView (question + options) → Hint provider

Mode Chat (Claude/OpenAI/Gemini) :
  ScrollView (bulles de chat) → Zone d'options dynamiques (chips/boutons)

Commun :
  AssistantPreviewSheet (BottomSheet Portal) → aperçu plan → Modifier/Valider
```

### Problèmes potentiels à explorer (BMAD doit analyser)
- Les deux modes (wizard + chat) partagent un seul fichier de 500+ lignes → complexité
- Le mode chat n'a pas de barre de saisie libre (texte) → expérience guidée mais limitée
- La PreviewSheet est un BottomSheet basique → peu d'affordance pour les exercices
- Pas d'onboarding/tutorial pour expliquer les providers et comment configurer une clé API
- L'icône ✨ dans la tab bar est peu descriptive

## Commande /idee générée

```
/idee Améliorer l'UI/UX de l'assistant IA (AssistantScreen + AssistantPreviewSheet)

Contexte :
- Fichier principal : mobile/src/screens/AssistantScreen.tsx (dual-mode: wizard offline + chat pour providers cloud)
- Composants : mobile/src/components/AssistantPreviewSheet.tsx (BottomSheet de prévisualisation du plan)
- Services : mobile/src/services/ai/ (offlineEngine, claudeProvider, geminiProvider, openaiProvider)
- Le mode wizard : navigation pas-à-pas avec progress bar, questions/options, ChipSelector
- Le mode chat : bulles de conversation (ChatMsg), zone d'options dynamiques, pas de saisie libre
- La PreviewSheet : spinner loading, input nom, liste sessions/exercices, boutons Modifier/Valider

Objectif : Repenser l'UX de l'assistant pour qu'il soit plus engageant, moderne et intuitif :
1. Analyser les friction points actuels des deux modes (wizard et chat)
2. Explorer de nouvelles approches UX : onboarding, transitions, feedback visuel, lisibilité
3. Évaluer si le dual-mode (wizard+chat) est optimal ou si une unification est préférable
4. Proposer des améliorations concrètes pour AssistantPreviewSheet (aperçu du plan généré)
5. Tenir compte des contraintes : Portal (pas de Modal natif), Dark mode (#121212), French, Fabric

Contraintes strictes :
- NO native Modal → utiliser Portal + BottomSheet/AlertDialog
- Dark mode uniquement (#121212 bg, #1C1C1E cards)
- Langue française
- withObservables HOC pour les données DB (pas de Context/Redux)
- Utiliser useHaptics() pour le feedback
- Colors de theme/index.ts uniquement (pas de hardcoded)
```

## Commandes générées

| Groupe | Commande | Fichiers | Mode |
|--------|----------|----------|------|
| A | `/idee` ci-dessus | AssistantScreen.tsx, AssistantPreviewSheet.tsx, services/ai/ | Séquentiel (BMAD pipeline) |

**Note :** Il s'agit d'un seul `/idee` — le pipeline BMAD est séquentiel par nature (brainstorm → PRD → stories → dev → QA). Pas de parallélisation possible sur une même feature.
