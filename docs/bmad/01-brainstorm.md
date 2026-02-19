# Brainstorm — Amélioration UI/UX Assistant IA — 2026-02-19

## Idée originale
Améliorer l'UI/UX de l'assistant IA (AssistantScreen + AssistantPreviewSheet)

## Décision clé
**Supprimer le mode chat.** Un seul wizard premium, identique pour offline et cloud.
Le provider (Claude/Gemini/OpenAI) enrichit le résultat en arrière-plan, l'UX est identique.

## Friction points identifiés

### Mode Wizard (actuel)
- Progress bar 3px — quasi invisible
- Aucune animation de transition entre étapes
- Provider hint = texte gris xs illisible
- Pas de bouton "Recommencer"
- `toggleEquipment` dupliqué (wizard + chat)

### Mode Chat (supprimé)
- UX radicalement différente du wizard → incohérence
- Options chips dupliquées
- 5 refs/states inutiles (chatMessages, chatStep, chatFormData, chatScrollRef, chatInitRef)

### AssistantPreviewSheet
- `weightTarget` calculé mais jamais affiché
- maxHeight 320 trop petit pour les grands programmes
- Pas de résumé (nb séances, nb exercices)
- Boutons Modifier/Valider sans hiérarchie visuelle claire

## Direction retenue — "Premium Unified Feel"

```
Avant                          Après
──────                         ─────
Wizard (offline only)    →     Wizard premium (offline + cloud)
Chat (cloud only)        →     SUPPRIMÉ
AssistantPreviewSheet    →     PreviewSheet enrichie
```

## Améliorations concrètes

| Zone | Avant | Après |
|------|-------|-------|
| AssistantScreen.tsx | 980 lignes, dual-mode | ~400 lignes, wizard only |
| Détection provider | Branching isConnectedMode | Transparent — même wizard |
| Equipment toggle | Dupliqué ×2 | Un seul toggleEquipment |
| Chat state | 5 états + refs | Tout supprimé |
| Progress bar | 3px, sobre | 6px, animée |
| Transitions steps | Aucune | Slide/fade entre étapes |
| Provider hint | Texte xs gris en bas | Badge élégant (ex: ⚡ Gemini) |
| PreviewSheet | sets×reps only | sets×reps · ~45 kg + résumé |

## Estimation
4-5 stories — scope ciblé et maîtrisé
