# S01 — Helper buildHeatmapData + tests

## Description
En tant que systeme, je veux un helper qui agrege les seances par jour sur les 365 derniers jours, afin que le composant Heatmap ait des donnees pretes a afficher.

## Fichiers concernes
- `mobile/src/model/utils/statsHelpers.ts` (MODIFIE)
- `mobile/src/model/utils/__tests__/statsHelpers.test.ts` (MODIFIE)

## Taches techniques

### 1. Type HeatmapDay
Ajouter dans `statsHelpers.ts` :
```typescript
export interface HeatmapDay {
  date: string       // 'YYYY-MM-DD'
  count: number      // 0 = repos, 1+ = nombre de seances
  dayOfWeek: number  // 0=lundi ... 6=dimanche (ISO)
}
```

### 2. Fonction buildHeatmapData
```typescript
export function buildHeatmapData(histories: History[]): HeatmapDay[]
```
- Reutiliser `computeCalendarData(histories)` pour la Map date->count
- Generer 365 jours (today - 364 ... today)
- Pour chaque jour : `{ date: toDateKey(d), count: map.get(key) ?? 0, dayOfWeek }`
- `dayOfWeek` : `(d.getDay() + 6) % 7` (lundi=0 ... dimanche=6)
- Retourne un tableau de 365 HeatmapDay ordonne chronologiquement

### 3. Tests unitaires
- 0 histories → 365 jours tous a count=0
- 1 history aujourd'hui → 364 jours a 0, 1 jour a 1
- 2 histories le meme jour → count=2 pour ce jour
- Verifier que dayOfWeek est correct (lundi=0)
- Verifier que le tableau a exactement 365 elements
- Verifier que le premier element est le plus ancien et le dernier est aujourd'hui

## Criteres d'acceptation
- [ ] Type `HeatmapDay` exporte
- [ ] `buildHeatmapData()` retourne 365 jours
- [ ] Reutilise `computeCalendarData` et `toDateKey` existants
- [ ] Jours sans seance inclus avec count=0
- [ ] dayOfWeek aligne ISO (lundi=0)
- [ ] Tests unitaires passent
- [ ] `npx tsc --noEmit` → 0 erreur

## Estimation
S (15-30 min)
