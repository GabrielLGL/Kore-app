# Architecture — Dashboard Statistiques Globales — 2026-02-21

## Schéma d'ensemble

```
Tab "Stats" (📈)
     │
     └─▶ StatsScreen (nouveau — dashboard principal)
              │
              ├─▶ StatsDurationScreen     (Root Stack)
              ├─▶ StatsVolumeScreen       (Root Stack)
              ├─▶ StatsCalendarScreen     (Root Stack)
              ├─▶ StatsRepartitionScreen  (Root Stack)
              ├─▶ StatsExercisesScreen    (Root Stack) ← ChartsScreen renommé/réutilisé
              ├─▶ StatsMeasurementsScreen (Root Stack)
              └─▶ ChartsScreen            (Root Stack) ← anciennement le tab Stats
```

## 1. Migration schéma v16 → v17

### Modifications `mobile/src/model/schema.ts`
```typescript
// Version bump
version: 17

// Table users — ajout colonne name
{ name: 'name', type: 'string', isOptional: true }

// Nouvelle table body_measurements
tableSchema({
  name: 'body_measurements',
  columns: [
    { name: 'date', type: 'number' },
    { name: 'weight', type: 'number', isOptional: true },     // poids (kg)
    { name: 'waist', type: 'number', isOptional: true },      // tour de taille (cm)
    { name: 'hips', type: 'number', isOptional: true },       // hanches (cm)
    { name: 'chest', type: 'number', isOptional: true },      // poitrine (cm)
    { name: 'arms', type: 'number', isOptional: true },       // bras (cm)
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ]
})
```

### Nouveau modèle `mobile/src/model/models/BodyMeasurement.ts`
```typescript
import { Model } from '@nozbe/watermelondb'
import { field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class BodyMeasurement extends Model {
  static table = 'body_measurements'

  @field('date') date!: number
  @field('weight') weight!: number | null
  @field('waist') waist!: number | null
  @field('hips') hips!: number | null
  @field('chest') chest!: number | null
  @field('arms') arms!: number | null
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}
```

### Modification `mobile/src/model/models/User.ts`
Ajouter : `@text('name') name!: string | null`

### Modification `mobile/src/model/index.ts`
Ajouter `BodyMeasurement` dans le tableau `modelClasses`.

## 2. Navigation — `mobile/src/navigation/index.tsx`

### Ajouts à `RootStackParamList`
```typescript
StatsDuration: undefined
StatsVolume: undefined
StatsCalendar: undefined
StatsRepartition: undefined
StatsExercises: undefined    // reprend ChartsScreen
StatsMeasurements: undefined
```

### Modification du Tab "Stats"
```typescript
// Avant
component={ChartsScreen}

// Après
component={StatsScreen}
```

### Nouveaux écrans dans le Root Stack
```typescript
<Stack.Screen name="StatsDuration" component={StatsDurationScreen} />
<Stack.Screen name="StatsVolume" component={StatsVolumeScreen} />
<Stack.Screen name="StatsCalendar" component={StatsCalendarScreen} />
<Stack.Screen name="StatsRepartition" component={StatsRepartitionScreen} />
<Stack.Screen name="StatsExercises" component={ChartsScreen} />  // réutilisé
<Stack.Screen name="StatsMeasurements" component={StatsMeasurementsScreen} />
```

## 3. Nouveaux fichiers

### Écrans (`mobile/src/screens/`)
```
StatsScreen.tsx          ← Dashboard principal (remplace ChartsScreen comme tab)
StatsDurationScreen.tsx  ← Vue durée des séances
StatsVolumeScreen.tsx    ← Vue volume total
StatsCalendarScreen.tsx  ← Vue calendrier GitHub-style
StatsRepartitionScreen.tsx ← Vue répartition musculaire
StatsMeasurementsScreen.tsx ← Vue mesures corporelles
```

ChartsScreen.tsx reste inchangé — accessible via `StatsExercises` dans le Root Stack.

### Helpers (`mobile/src/model/utils/statsHelpers.ts`)
Fonctions de calcul pures (pas de HOC) utilisées par tous les écrans stats :

```typescript
// KPIs globaux
computeGlobalKPIs(histories, sets): { totalSessions, totalVolume, totalPRs }

// Phrase d'accroche dynamique
computeMotivationalPhrase(histories, sets): string

// Streak
computeCurrentStreak(histories): number
computeRecordStreak(histories): number

// Durée
computeDurationStats(histories): { avg, total, min, max, perSession }

// Volume
computeVolumeStats(sets, histories, period): { total, perWeek, topExercises }

// Calendrier
computeCalendarData(histories): Map<string, number>  // date → nb séances

// Répartition musculaire
computeMuscleRepartition(sets, exercises, period): Array<{ muscle, volume, pct }>

// PRs centralisés
computePRsByExercise(sets, exercises): Array<{ exercise, weight, reps, date, orm1 }>
```

## 4. Flux de données (WatermelonDB → UI)

### StatsScreen
```
database.collections.get('histories').query(
  Q.where('deleted_at', null)
).observe()
  + sets.query().observe()
  + users.query().observe()
→ withObservables HOC
→ computeGlobalKPIs() + computeMotivationalPhrase()
→ StatsScreen (render)
```

### StatsMeasurementsScreen
```
database.collections.get('body_measurements').query(
  Q.sortBy('date', Q.desc)
).observe()
→ withObservables HOC
→ StatsMeasurementsScreen (render)
```

## 5. Composants réutilisés (existants)
- `BottomSheet` → formulaire de saisie des mesures corporelles
- `AlertDialog` → confirmation suppression d'une mesure
- `Button` → tous les boutons du dashboard (variant: 'secondary')
- `ChipSelector` → sélecteur de période (1 mois / 3 mois / tout) dans les vues Volume et Répartition

## 6. Gestion des settings (nom utilisateur)
- `SettingsScreen.tsx` → nouvelle section "Mon profil" avec input pour le champ `name`
- Update via `database.write(async () => { await user.update(u => { u.name = newName }) })`
- Validé via `isValidText()` de `validationHelpers.ts`

## 7. Ordre d'implémentation recommandé
1. Migration schéma v17 (stories S01)
2. Modèle BodyMeasurement + update User (S02)
3. statsHelpers.ts (fonctions de calcul) (S03)
4. StatsScreen dashboard (S04)
5. Vue Durée + Volume (S05)
6. Vue Calendrier (S06)
7. Vue Répartition (S07)
8. Vue Exercices (S08) — wrapping ChartsScreen
9. Vue Mesures (S09)
10. Champ name dans SettingsScreen (S10)

## 8. Dépendances
- Bibliothèque graphiques : `victory-native` (déjà utilisé dans ChartsScreen pour les line charts)
- Calendrier GitHub-style : composant custom (grille de Views, pas de lib externe)
- Pas de nouvelle dépendance npm nécessaire
