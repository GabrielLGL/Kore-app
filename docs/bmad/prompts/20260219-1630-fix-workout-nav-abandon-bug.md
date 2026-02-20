# Prompt analysé — fix-workout-nav-abandon-bug — 2026-02-19

## Demande originale
quand je lance une seance et que la termine (reviens sur homescreen) ensuite je fais retour il me reaffiche abandonner la seance comme si je n'en etait pas sortit corrige ça

## Analyse

### Cause racine
Dans `mobile/src/screens/WorkoutScreen.tsx`, après avoir terminé ou abandonné une séance :
- `navigation.navigate('MainTabs', { screen: 'Home' })` est utilisé
- Ce pattern laisse `WorkoutScreen` (et `SessionDetailScreen`) **dans le stack React Navigation**
- Le `BackHandler` enregistré dans le `useEffect` de WorkoutScreen reste actif
- Quand l'utilisateur appuie sur retour depuis Home, le BackHandler de WorkoutScreen se déclenche
- Il exécute `setAbandonVisible(true)` → affiche le dialog "Abandonner la séance ?"

### Fix
Remplacer `navigation.navigate('MainTabs', { screen: 'Home' })` par `navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })` dans WorkoutScreen.tsx aux deux points de sortie :
- `handleClose()` (fermeture du WorkoutSummarySheet — fin normale)
- `handleConfirmAbandon()` (confirmation d'abandon)

### Fichiers concernés
- `mobile/src/screens/WorkoutScreen.tsx` (seul fichier à modifier)

## Commandes générées

| Groupe | Description | Fichiers | Parallèle |
|--------|-------------|----------|-----------|
| A | Fix navigation.reset dans WorkoutScreen | WorkoutScreen.tsx | — (seul groupe) |

## Commande /do complète

```
/do Corrige le bug de navigation dans mobile/src/screens/WorkoutScreen.tsx : après avoir terminé ou abandonné une séance, appuyer sur "retour" depuis HomeScreen affiche encore le dialog "Abandonner la séance ?".

CAUSE RACINE :
navigation.navigate('MainTabs', { screen: 'Home' }) laisse WorkoutScreen dans le stack React Navigation. Son BackHandler reste actif même quand l'utilisateur est sur Home.

FIX :
Remplacer toutes les occurrences de navigation.navigate('MainTabs', ...) par navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] }) dans handleClose et handleConfirmAbandon.

Vérifier avec npx tsc --noEmit. Commit : "fix(navigation): reset stack on workout exit to prevent stale back handler"
```
