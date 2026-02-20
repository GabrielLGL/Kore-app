# Prompt analysé — Programme visible dans bottom sheet — 2026-02-19

## Demande originale
"maintenant je veux que quand on creer le progrzmme, on puisse le voir dans la bottom sheet au lieux de x seance n exercices"

## Analyse technique

### État actuel
- `ProgramSection.tsx` : accordéon avec compteur `{program.name} ({sessions.length})` et flèche ▼/▶
- `SessionItem.tsx` : preview textuelle des 3 premiers exercices de chaque séance
- `HomeScreen.tsx` : DraggableFlatList de ProgramSection, long press → options bottom sheet

### Objectif
Remplacer l'accordéon par un tap → bottom sheet de prévisualisation du programme complet (sessions + exercices).

### Fichiers impactés
| Fichier | Action |
|---------|--------|
| `mobile/src/components/ProgramDetailBottomSheet.tsx` | CRÉER |
| `mobile/src/components/ProgramSection.tsx` | MODIFIER (accordéon → carte simple) |
| `mobile/src/screens/HomeScreen.tsx` | MODIFIER (intégration nouvelle bottom sheet) |

## Commandes générées

| Groupe | Description | Fichiers | Parallèle |
|--------|-------------|----------|-----------|
| A (séquentiel) | Créer ProgramDetailBottomSheet + modifier ProgramSection + HomeScreen | 3 fichiers | Non — interdépendants |

## Notes d'implémentation
- `ProgramDetailBottomSheet` doit utiliser `withObservables` pour observer sessions + exercices réactivement
- Conserver le long press → options bottom sheet (Renommer, Dupliquer, Supprimer)
- Conserver drag-and-drop DraggableFlatList
- Utiliser `useMultiModalSync` pour synchro tab bar avec la nouvelle bottom sheet
