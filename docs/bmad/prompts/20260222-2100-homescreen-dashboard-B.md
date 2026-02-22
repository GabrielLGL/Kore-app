<!-- v1.0 — 2026-02-22 -->
# Rapport — HomeScreen Dashboard — Groupe B — 20260222-2100

## Objectif
Transformer completement le HomeScreen en un **dashboard hub** avec une grille de tuiles de navigation. L'utilisateur pourra acceder a tous les ecrans principaux depuis cette page d'accueil.

## Fichiers concernes
- **MODIFIER** : `mobile/src/screens/HomeScreen.tsx` (refonte complete)

## Contexte technique

### Design cible
Le HomeScreen doit devenir un dashboard similaire au StatsScreen existant, mais plus complet. Layout :

```
+-------------------------------+
|  Header Card                  |
|  +---------------------------+|
|  |  Salut, [prenom] !       ||
|  |  [phrase motivation]      ||
|  |  ─────────────────────    ||
|  |  KPI: Sessions | Volume | ||
|  |        PRs               ||
|  +---------------------------+|
+-------------------------------+

+-------------------------------+
|  Section "Entrainement"       |
|  +--------+ +--------+       |
|  | icon   | | icon   |       |
|  | Progr. | | Biblio. |      |
|  +--------+ +--------+       |
+-------------------------------+

+-------------------------------+
|  Section "Statistiques"       |
|  +--------+ +--------+ +----+|
|  | Duree  | | Volume | |Agen||
|  +--------+ +--------+ +----+|
|  +--------+ +--------+ +----+|
|  |Muscles | |Exerc.  | |Mesu||
|  +--------+ +--------+ +----+|
|  +--------+                   |
|  |Histo.  |                   |
|  +--------+                   |
+-------------------------------+

+-------------------------------+
|  Section "Outils"             |
|  +--------+ +--------+       |
|  |Assist. | |Reglages|       |
|  +--------+ +--------+       |
+-------------------------------+
```

### Tuiles de navigation (toutes)

| Icone | Label | Route | Description |
|-------|-------|-------|-------------|
| icon | Programmes | Programs (nouveau) | Gestion programmes |
| icon | Exercices | Exercices (tab) | Bibliotheque exercices |
| icon | Duree | StatsDuration | Stats duree sessions |
| icon | Volume | StatsVolume | Stats volume semaine |
| icon | Agenda | StatsCalendar | Calendrier activite |
| icon | Muscles | StatsRepartition | Repartition musculaire |
| icon | Exercices & Records | StatsExercises | Performance exercices |
| icon | Mesures | StatsMeasurements | Mensurations corporelles |
| icon | Historique | StatsHistory | Graphiques historiques |
| icon | Assistant | Assistant (tab) | Assistant IA |
| icon | Reglages | Settings | Parametres app |

### Stack & Patterns
- React Native (Expo 52) + TypeScript + Fabric
- WatermelonDB + withObservables (pour les KPIs du header)
- Theme : colors/spacing/borderRadius/fontSize de theme/index.ts
- Dark Mode Only (#121212 bg, #1C1C1E cards)
- Langue : Francais (fr-FR)
- Haptics : useHaptics() pour onPress des tuiles
- NO `<Modal>` natif, NO Redux/Context, NO couleurs hardcodees, NO `any`

### Pattern de grille existant (StatsScreen)
Le StatsScreen utilise deja ce pattern de grille :
```tsx
// Grille 3 colonnes avec gap de 8px
grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: spacing.sm,  // 8px
}
gridBtn: {
  width: '31%',     // ~3 colonnes
  backgroundColor: colors.card,
  borderRadius: borderRadius.md,  // 12px
  padding: spacing.md,            // 16px vertical
  alignItems: 'center',
}
btnIcon: { fontSize: 28 }
btnLabel: { fontSize: fontSize.xs, color: colors.textSecondary }
```

### Header Card existant (StatsScreen)
```tsx
headerCard: {
  backgroundColor: colors.card,
  borderRadius: borderRadius.lg,  // 20px
  padding: spacing.md,            // 16px
}
// Title: 24px bold, Motivation: small italic primary color
// KPIs: 3 colonnes (sessions, volume, PRs) avec separateurs
```

### Donnees KPI
Pour alimenter les KPIs du header, utiliser withObservables pour observer :
- Collection 'history' (comptage sessions, calcul volume)
- Collection 'sets' (pour le volume total)
- Collection 'performance_logs' (pour les PRs)
- Collection 'users' (pour le prenom)

Tu peux t'inspirer du StatsScreen existant qui fait deja ces queries.

## Etapes

1. **Lire** le StatsScreen.tsx pour comprendre le pattern de grille et header card existant.

2. **Lire** le HomeScreen.tsx actuel pour comprendre les imports et le setup withObservables.

3. **Reecrire completement** HomeScreen.tsx :

   a. **Imports** : React, View, Text, ScrollView, TouchableOpacity, StyleSheet + theme, hooks, navigation types

   b. **Constantes** : Definir les sections et tuiles comme un tableau d'objets :
   ```tsx
   const SECTIONS = [
     {
       title: 'Entrainement',
       tiles: [
         { icon: '...', label: 'Programmes', route: 'Programs' },
         { icon: '...', label: 'Exercices', route: 'Exercices' },
       ]
     },
     {
       title: 'Statistiques',
       tiles: [
         { icon: '...', label: 'Duree', route: 'StatsDuration' },
         { icon: '...', label: 'Volume', route: 'StatsVolume' },
         // etc.
       ]
     },
     {
       title: 'Outils',
       tiles: [
         { icon: '...', label: 'Assistant', route: 'Assistant' },
         { icon: '...', label: 'Reglages', route: 'Settings' },
       ]
     },
   ]
   ```

   c. **Header Card** : Reprendre le pattern du StatsScreen (prenom + phrase motivation + KPIs).

   d. **Sections avec titres** : Chaque section a un titre (style heading) suivi d'une grille de tuiles.

   e. **Tuiles** : Grid 3 colonnes, chaque tuile = icone + label, onPress navigue vers la route.

   f. **withObservables** : Observer les collections necessaires pour les KPIs.

   g. **Haptics** : useHaptics().onPress() sur chaque tuile.

   h. **ScrollView** : Le contenu est scrollable avec paddingBottom pour la tab bar.

4. **Choisir les icones** : Utiliser des emojis coherents et visuellement distincts pour chaque tuile. Suggestions :
   - Programmes : `\ud83d\udcda` (livres empiles)
   - Exercices : `\ud83c\udfcb\ufe0f` (halterophilie)
   - Duree : `\u23f1` (chronometre)
   - Volume : `\ud83c\udfd7\ufe0f` (poids/barres)
   - Agenda : `\ud83d\udcc5` (calendrier)
   - Muscles : `\ud83d\udcaa` (biceps)
   - Exercices & Records : `\ud83c\udfc6` (trophee)
   - Mesures : `\ud83d\udccf` (regle)
   - Historique : `\ud83d\udcca` (graphique)
   - Assistant : `\u2728` (etoiles)
   - Reglages : `\u2699\ufe0f` (engrenage)

5. **Styles** : Utiliser uniquement colors/spacing/borderRadius/fontSize du theme. Pas de valeurs hardcodees.

6. **Bouton "Demarrer seance"** : Optionnel mais recommande — un gros bouton primary en haut de la page ou sous le header card pour lancer rapidement un workout. A implementer si le flow est clair (navigation vers quel programme/session?). Si pas clair, ne pas l'ajouter.

## Contraintes
- Ne pas modifier d'autres fichiers (navigation sera dans Groupe C)
- AUCUNE couleur hardcodee — theme/index.ts uniquement
- AUCUN `any` TypeScript
- AUCUN `<Modal>` natif
- Pas de console.log sans __DEV__
- Le composant DOIT utiliser withObservables pour les donnees
- Respecter le pattern reused du StatsScreen pour la grille
- Le composant doit etre 100% fonctionnel meme si ProgramsScreen n'est pas encore route (les tuiles qui naviguent vers des routes non encore enregistrees peuvent utiliser un try/catch ou un check)

## Criteres de validation
- `npx tsc --noEmit` -> zero erreur
- L'ecran affiche un header card avec KPIs
- L'ecran affiche 3 sections avec des tuiles cliquables
- Chaque tuile utilise haptics au press
- Le design est coherent avec le StatsScreen existant
- Tout le styling utilise le theme centralise
- ScrollView avec padding correct pour la tab bar

## Dependances
Groupe A doit etre termine (ProgramsScreen.tsx doit exister pour que la navigation soit coherente), MAIS ce groupe peut techniquement etre execute en parallele car il ne modifie pas les memes fichiers.

## Statut
En attente
