# Prompt analysé — fix-assistant-focus — 2026-02-19

## Demande originale
1. Badge provider reste "Offline" après changement dans les settings — se met à jour seulement au clic
2. Quand on quitte l'assistant (autre onglet) et qu'on revient, le wizard doit revenir à l'étape 1

## Analyse technique

### Bug 1 — Badge stale
- `providerLabel` est dérivé de `user?.aiProvider` (prop injectée par `withObservables`)
- WatermelonDB réutilise la même instance de modèle (référence JS identique)
- `withObservables` peut ignorer l'émission si la référence n'a pas changé
- React Native diffère les renders des onglets non-visibles
- Résultat : `user.aiProvider` est à jour en mémoire mais l'écran ne se re-rend pas
- Fix : `useFocusEffect` force un re-render au retour sur l'onglet

### Bug 2 — Wizard ne reset pas
- `formData` et `currentStep` persistent entre navigations (état local React)
- Comportement voulu : retour sur l'onglet Assistant = revenir à l'étape 1
- Fix : dans le même `useFocusEffect`, reset `formData` et `currentStep`

### Fichier concerné
- `mobile/src/screens/AssistantScreen.tsx` uniquement

## Commandes générées

| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | /do ci-dessous | AssistantScreen.tsx | seul |
