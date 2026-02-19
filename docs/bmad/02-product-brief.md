# Product Brief — Assistant IA Refonte Wizard — 2026-02-19

## Problème
L'écran Assistant a deux modes (wizard offline + chat cloud) avec des UX radicalement différentes,
du code dupliqué, et une PreviewSheet qui cache des informations utiles (poids cibles).
La feature est amenée à devenir payante — elle doit refléter ce positionnement premium.

## Solution
Supprimer le mode chat. Transformer le wizard en expérience unique, soignée, identique pour tous
les providers. La qualité du plan généré varie selon le provider (offline vs IA cloud),
mais le parcours utilisateur est le même.

## Utilisateurs cibles
- Utilisateur sans clé API → wizard offline → plan algorithmique
- Utilisateur avec clé API (Claude/Gemini/GPT) → même wizard → plan enrichi par l'IA

## Métriques de succès
- AssistantScreen.tsx passe de 980 → ~450 lignes
- Zéro code dupliqué (un seul toggleEquipment)
- La PreviewSheet affiche le poids cible de chaque exercice
- Transitions animées entre étapes du wizard
- Les deux flows (offline / cloud) passent par exactement le même code UI

## Contraintes techniques
- NO native Modal → Portal + BottomSheet/AlertDialog
- Dark mode uniquement (#121212 bg, #1C1C1E cards)
- Langue française
- useHaptics() pour le feedback
- Colors de theme/index.ts uniquement
- withObservables HOC pour les données DB
