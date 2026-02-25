<!-- v1.0 — 2026-02-22 -->
# Rapport — HomeScreen Dashboard — Groupe C — 20260222-2100

## Objectif
Mettre a jour la navigation pour integrer le nouveau ProgramsScreen, ajuster les tabs et s'assurer que toutes les routes du dashboard fonctionnent correctement.

## Fichiers concernes
- **MODIFIER** : `mobile/src/navigation/index.tsx`

## Contexte technique

### Architecture de navigation actuelle
Le fichier `mobile/src/navigation/index.tsx` contient :

1. **RootStackParamList** : Type des routes
2. **TabNavigator** : Bottom tabs avec 4 onglets
   - Exercices (ExercisesScreen) — icone \ud83c\udfcb\ufe0f
   - Home (HomeScreen) — icone \ud83c\udfe0
   - Assistant (AssistantScreen) — icone \u2728
   - Stats (StatsScreen) — icone \ud83d\udcc8
3. **RootStack** : Stack navigator avec toutes les routes
   - MainTabs, SessionDetail, Settings, Workout
   - StatsDuration, StatsVolume, StatsCalendar, StatsRepartition
   - StatsExercises, StatsMeasurements, StatsHistory

### Ce qui doit changer

1. **Ajouter la route `Programs`** dans RootStackParamList et RootStack
2. **Simplifier les tabs** : Puisque le HomeScreen est maintenant un dashboard qui donne acces a tout, on peut potentiellement reduire les tabs :
   - Option A (recommandee) : Garder 4 tabs mais remplacer Stats par autre chose puisque le dashboard donne deja acces aux stats
   - Option B : Garder les 4 tabs actuels tels quels, le dashboard est juste un raccourci supplementaire
   - **CHOIX : Option B** — garder les 4 tabs identiques pour ne pas casser l'habitude utilisateur. Le dashboard est un hub complementaire, pas un remplacement.

3. **Verifier** que toutes les routes referencees par les tuiles du dashboard existent.

### Routes necessaires pour le dashboard
Les tuiles du nouveau HomeScreen navigueront vers :
- `Programs` (NOUVEAU — a ajouter)
- `Exercices` (tab existante — navigation.navigate('MainTabs', { screen: 'Exercices' }))
- `StatsDuration` (existant)
- `StatsVolume` (existant)
- `StatsCalendar` (existant)
- `StatsRepartition` (existant)
- `StatsExercises` (existant)
- `StatsMeasurements` (existant)
- `StatsHistory` (existant)
- `Assistant` (tab existante)
- `Settings` (existant)

### Stack & Patterns
- React Navigation 7 (Native Stack + Bottom Tabs)
- TypeScript strict — RootStackParamList doit etre a jour
- PortalProvider wraps NavigationContainer
- Tab bar avec animation show/hide (DeviceEventEmitter)
- Dark Mode : headerStyle backgroundColor colors.card, headerTintColor colors.text

## Etapes

1. **Lire** `mobile/src/navigation/index.tsx` en entier.

2. **Ajouter le type `Programs`** dans `RootStackParamList` :
   ```tsx
   Programs: undefined;
   ```

3. **Importer ProgramsScreen** :
   ```tsx
   import ProgramsScreen from '../screens/ProgramsScreen';
   ```

4. **Ajouter la route `Programs`** dans le RootStack :
   ```tsx
   <Stack.Screen
     name="Programs"
     component={ProgramsScreen}
     options={{
       title: 'Programmes',
       headerStyle: { backgroundColor: colors.card },
       headerTintColor: colors.text,
       headerShadowVisible: false,
     }}
   />
   ```
   Placer cette route apres les tabs et avant SessionDetail.

5. **Verifier le header du HomeScreen** dans le TabNavigator :
   - Le titre doit etre "Kore" ou "Accueil" (pas "Programmes" qui est maintenant un ecran separe)
   - Garder le bouton Settings dans le header du Home tab

6. **Tester la compilation** : `npx tsc --noEmit`

7. **Verifier** que le back button depuis ProgramsScreen ramene bien au HomeScreen (comportement par defaut du Stack Navigator).

## Contraintes
- Ne pas modifier les tabs existants (garder Exercices, Home, Assistant, Stats)
- Ne pas modifier d'autres screens
- AUCUNE couleur hardcodee — theme uniquement
- AUCUN `any` TypeScript
- Le header du ProgramsScreen doit avoir un back arrow (comportement natif du Stack)
- Les options du ProgramsScreen doivent matcher le style des autres stack screens

## Criteres de validation
- `npx tsc --noEmit` -> zero erreur
- `npm test` -> zero fail
- La route Programs est accessible via navigation.navigate('Programs')
- Le back button depuis ProgramsScreen fonctionne
- Les 4 tabs restent identiques
- Le header ProgramsScreen est coherent visuellement

## Dependances
**Depend de Groupe A** (ProgramsScreen.tsx doit exister) et **Groupe B** (HomeScreen doit utiliser la route Programs).
Ce groupe doit etre execute en DERNIER.

## Statut
En attente
