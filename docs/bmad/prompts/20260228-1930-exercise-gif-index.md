<!-- v1.0 — 2026-02-28 -->
# Prompt — GIF exercice dans la bibliothèque — 20260228-1930

## Demande originale
> "dans la bibliotheque d'exercice quand on clique sur un exercice j'aimerais un gif qui montre l'exercice"

## Décisions d'architecture
- **Source GIFs** : wger.de CDN (gratuit, sans clé API, ~200 exercices)
- **Composant image** : `expo-image` (Fabric-compatible — react-native-fast-image incompatible New Arch)
- **Cache** : `cachePolicy="memory-disk"` — offline après premier chargement
- **Mapping** : fichier statique `animationMap.ts` (30 exercices initiaux, enrichissement progressif)
- **UX** : clic → ExerciseInfoSheet (GIF + info), bouton "Voir l'historique" dans le sheet

## Groupes générés

| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `20260228-1930-exercise-gif-A.md` | animationMap.ts (NEW), ExerciseInfoSheet.tsx, fr.ts, en.ts | 1 | ⏳ |
| B | `20260228-1930-exercise-gif-B.md` | ExercisesScreen.tsx, ExerciseInfoSheet.tsx (prop onViewHistory) | 2 | ⏳ |

## Ordre d'exécution
1. **Vague 1** — Groupe A : installe expo-image, crée le mapping URLs wger.de, met à jour ExerciseInfoSheet
2. **Vague 2** — Groupe B : connecte ExercisesScreen pour ouvrir le sheet au clic

Groupe B dépend de Groupe A (ExerciseInfoSheet doit être mis à jour avant l'intégration dans ExercisesScreen).
