# S03 — StatsScreen + mise à jour navigation

## Description
Créer l'écran `StatsScreen` (dashboard principal) qui remplace `ChartsScreen` comme composant du tab "Stats". Mettre à jour la navigation pour ajouter les 6 nouveaux sous-écrans au Root Stack.

## Fichiers à créer/modifier
- `mobile/src/screens/StatsScreen.tsx` — nouveau
- `mobile/src/navigation/index.tsx` — mise à jour

## Tâches techniques

### 1. navigation/index.tsx
Ajouter à `RootStackParamList` :
```typescript
StatsDuration: undefined
StatsVolume: undefined
StatsCalendar: undefined
StatsRepartition: undefined
StatsExercises: undefined
StatsMeasurements: undefined
```

Changer le tab Stats : `component={ChartsScreen}` → `component={StatsScreen}`

Ajouter dans le Root Stack :
```typescript
<Stack.Screen name="StatsDuration" component={StatsDurationScreen} />
<Stack.Screen name="StatsVolume" component={StatsVolumeScreen} />
<Stack.Screen name="StatsCalendar" component={StatsCalendarScreen} />
<Stack.Screen name="StatsRepartition" component={StatsRepartitionScreen} />
<Stack.Screen name="StatsExercises" component={ChartsScreen} />
<Stack.Screen name="StatsMeasurements" component={StatsMeasurementsScreen} />
```

Importer tous les nouveaux écrans (créer des placeholders vides pour les suivants si pas encore créés).

### 2. StatsScreen.tsx
Composant dashboard avec :
- `withObservables` HOC : observe `histories` (deleted_at null) + `sets` + `users`
- Header card : nom (user.name || "Toi") + phrase d'accroche (`computeMotivationalPhrase`) + 3 KPIs
- Grille 3 colonnes de boutons (7 total)
- Chaque bouton : icône + label + `haptics.onPress()` + `navigation.navigate(...)`
- ScrollView pour accommoder les 7 boutons

Boutons de la grille :
| Icône | Label | Navigation |
|-------|-------|-----------|
| ⏱ | Durée | StatsDuration |
| 🏋 | Volume | StatsVolume |
| 🗓 | Agenda | StatsCalendar |
| 💪 | Muscles | StatsRepartition |
| 📊 | Exercices | StatsExercises |
| 📏 | Mesures | StatsMeasurements |
| 📋 | Historique | (existant HistoryScreen ou ChartsScreen, à confirmer) |

Structure UI (cf UX design Écran 1).

## Critères d'acceptation
- [ ] Tab "Stats" affiche StatsScreen (et non plus ChartsScreen directement)
- [ ] 3 KPIs affichés : séances totales, volume cumulé, PRs
- [ ] Nom de l'utilisateur affiché (ou "Toi" si vide)
- [ ] Phrase d'accroche dynamique
- [ ] 7 boutons présents dans la grille
- [ ] Chaque bouton navigue vers le bon écran
- [ ] Haptic `onPress` sur chaque bouton
- [ ] Pas de native Modal
- [ ] `npx tsc --noEmit` passe
- [ ] Données réactives via `withObservables`

## Estimation : M (2-3h)
## Dépendances : S01, S02
