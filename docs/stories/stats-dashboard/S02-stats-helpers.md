# S02 — statsHelpers.ts — Fonctions de calcul

## Description
Créer le fichier `mobile/src/model/utils/statsHelpers.ts` contenant toutes les fonctions de calcul pures utilisées par les écrans stats. Ces fonctions prennent des tableaux de données WatermelonDB et retournent des valeurs calculées.

## Fichiers à créer
- `mobile/src/model/utils/statsHelpers.ts`

## Fonctions à implémenter

### KPIs globaux
```typescript
interface GlobalKPIs {
  totalSessions: number
  totalVolumKg: number
  totalPRs: number
}
function computeGlobalKPIs(histories: History[], sets: Set[]): GlobalKPIs
```

### Phrase d'accroche (priorité : streak > PR > retour > début mois > régularité > défaut)
```typescript
function computeMotivationalPhrase(histories: History[], sets: Set[]): string
```
Logique :
- streak ≥ 3 → `"🔥 X jours consécutifs — ne lâche rien !"`
- PR cette semaine (7 derniers jours) → `"💥 Nouveau record cette semaine — tu progresses !"`
- Dernière séance > 4 jours → `"😤 De retour après X jours — l'important c'est de revenir."`
- Jour 1 du mois → `"🎯 Nouveau mois, nouvelles perfs. C'est parti !"`
- Moyenne ≥ 4 séances/semaine (sur 4 semaines) → `"⚡ X séances/semaine — niveau sérieux."`
- Défaut → `"🚀 Ce mois : X kg soulevés."` (volume mois courant, formaté)

### Streaks
```typescript
function computeCurrentStreak(histories: History[]): number
function computeRecordStreak(histories: History[]): number
```
Un "jour actif" = au moins 1 history avec start_time ce jour-là (UTC, deleted_at null).
Streak courant = nb jours consécutifs en remontant depuis aujourd'hui.

### Durée
```typescript
interface DurationStats {
  avgMin: number
  totalHours: number
  minMin: number
  maxMin: number
  perSession: Array<{ date: number; durationMin: number }>
}
function computeDurationStats(histories: History[]): DurationStats
```
Ignorer les histories sans end_time.

### Volume
```typescript
type Period = '1m' | '3m' | 'all'
interface VolumeStats {
  total: number
  perWeek: Array<{ weekLabel: string; volume: number }>
  topExercises: Array<{ exerciseId: string; name: string; volume: number }>
  comparedToPrevious: number  // % de variation
}
function computeVolumeStats(sets: Set[], exercises: Exercise[], period: Period): VolumeStats
```
Volume = weight × reps pour chaque set.

### Calendrier
```typescript
// Retourne Map<'YYYY-MM-DD', number> — nombre de séances par jour
function computeCalendarData(histories: History[]): Map<string, number>
```

### Répartition musculaire
```typescript
interface MuscleRepartition {
  muscle: string
  volume: number
  pct: number
}
function computeMuscleRepartition(
  sets: Set[],
  exercises: Exercise[],
  period: Period
): MuscleRepartition[]
```
Parsing : `exercise.muscles.split(',').map(m => m.trim())`
Max 7 muscles + regrouper le reste en "Autres".

### PRs centralisés
```typescript
interface ExercisePR {
  exerciseId: string
  exerciseName: string
  weight: number
  reps: number
  date: number
  orm1: number  // Epley : Math.round(weight * (1 + reps / 30))
}
function computePRsByExercise(sets: Set[], exercises: Exercise[]): ExercisePR[]
```
Prendre le set `is_pr = true` avec le poids max par exercice.

### Top exercices par fréquence
```typescript
interface ExerciseFrequency {
  exerciseId: string
  exerciseName: string
  count: number
}
function computeTopExercisesByFrequency(sets: Set[], exercises: Exercise[], limit?: number): ExerciseFrequency[]
```

### Helpers de formatage
```typescript
function formatDuration(minutes: number): string  // "47 min" ou "1h 24min"
function formatVolume(kg: number): string          // "12 420 kg"
function formatRelativeDate(timestamp: number): string  // "il y a 3 jours"
```

## Critères d'acceptation
- [ ] Pas de `any` TypeScript
- [ ] Toutes les fonctions sont pures (pas d'effet de bord)
- [ ] `computeMotivationalPhrase` couvre les 6 cas dans l'ordre de priorité
- [ ] `computeCurrentStreak` gère correctement les jours sans séance
- [ ] `computeMuscleRepartition` parse correctement les muscles séparés par virgule
- [ ] `computePRsByExercise` utilise la formule Epley correcte
- [ ] `npx tsc --noEmit` passe

## Estimation : M (2-3h)
## Dépendances : S01
