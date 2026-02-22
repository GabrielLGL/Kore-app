# feat(stats) — Ajout filtres muscle/équipement/recherche dans Exercices & Records
Date : 2026-02-22 15:00

## Instruction
docs/bmad/prompts/20260222-1430-stats-ux-D.md

## Rapport source
docs/bmad/prompts/20260222-1430-stats-ux-D.md

## Classification
Type : feat
Fichiers modifiés : mobile/src/screens/StatsExercisesScreen.tsx

## Ce qui a été fait
- Ajout d'un `TextInput` de recherche en haut de l'écran ("Rechercher un exercice...")
- Ajout d'un `ChipSelector` pour filtrer par muscle (MUSCLES_LIST, noneLabel="Tous muscles")
- Ajout d'un `ChipSelector` pour filtrer par équipement (EQUIPMENT_LIST, noneLabel="Tout équipement")
- Réutilisation du hook `useExerciseFilters` existant pour la logique de filtrage
- Les 3 filtres se combinent en AND et s'appliquent aux 2 sections (PRs + fréquence)
- Affichage "Aucun résultat pour ces filtres." quand aucun exercice ne matche
- Retirer tous les filtres restaure la vue complète
- Style du TextInput cohérent avec le reste de l'app (colors.card, borderRadius.md, colors.border)
- Ajout de `keyboardShouldPersistTaps="handled"` sur le ScrollView

## Vérification
- TypeScript : ✅ (zéro erreur sur ce fichier ; erreurs pré-existantes dans StatsCalendarScreen.tsx non liées)
- Tests : ✅ 847 passed
- Nouveau test créé : non (pas de logique métier nouvelle, le hook useExerciseFilters est déjà testé)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260222-1500

## Commit
a654655 feat(stats): add muscle/equipment/search filters to Exercises & Records screen
