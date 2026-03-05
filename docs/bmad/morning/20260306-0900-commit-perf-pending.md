# Commit les optimisations FlatList non commitees

## Statut : En attente

## Contexte
Le perf audit groupe A (FlatList optimization) a ete execute et a modifie 8 screens + cree ScreenLoader.tsx. Ces changements ne sont pas encore commites.

## Fichiers concernes
- `mobile/src/components/ScreenLoader.tsx` (nouveau)
- `mobile/src/navigation/index.tsx`
- `mobile/src/screens/ChartsScreen.tsx`
- `mobile/src/screens/ExerciseCatalogScreen.tsx`
- `mobile/src/screens/ExercisesScreen.tsx`
- `mobile/src/screens/ProgramDetailScreen.tsx`
- `mobile/src/screens/ProgramsScreen.tsx`
- `mobile/src/screens/SessionDetailScreen.tsx`
- `mobile/src/screens/SettingsScreen.tsx`
- `mobile/src/screens/WorkoutScreen.tsx`

## Actions
1. Verifier que les changements sont coherents (`git diff` sur chaque fichier)
2. Verifier que le build passe (`npx tsc --noEmit`)
3. Verifier que les tests passent (`npm test`)
4. Commit : `perf(screens): FlatList optimization — ScreenLoader + getItemLayout`
5. Push

## Risques
- Faible : les changements sont deja testes localement
- Verifier qu'aucun autre travail n'a ete melange dans les fichiers modifies

## Priorite : BLOQUANT
Les autres taches dependent d'un working tree propre.
