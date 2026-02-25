# S03 — Integration Heatmap sur HomeScreen

## Description
En tant qu'utilisateur, je veux que la heatmap s'affiche sur mon dashboard entre la card gamification et les sections de tuiles, afin de voir ma regularite sans quitter l'ecran principal.

## Dependance
S02 (composant HeatmapCalendar)

## Fichiers concernes
- `mobile/src/screens/HomeScreen.tsx` (MODIFIE)

## Taches techniques

### 1. Import
```typescript
import { HeatmapCalendar } from '../components/HeatmapCalendar'
import { buildHeatmapData } from '../model/utils/statsHelpers'
```

### 2. Calcul des donnees
```typescript
const heatmapData = useMemo(() => buildHeatmapData(histories), [histories])
```
`histories` est deja observe par le `withObservables` existant (filtre `deleted_at === null`). Aucun query supplementaire.

### 3. JSX — apres la gamificationCard
```tsx
{/* Card Heatmap */}
<View style={styles.heatmapCard}>
  <Text style={styles.sectionTitle}>Activite</Text>
  <HeatmapCalendar data={heatmapData} />
</View>
```

### 4. Style
```typescript
heatmapCard: {
  backgroundColor: colors.card,
  borderRadius: borderRadius.lg,
  padding: spacing.md,
  marginBottom: spacing.md,
}
```
Meme pattern que `gamificationCard`.

## Criteres d'acceptation
- [ ] Heatmap card entre gamificationCard et sections de tuiles
- [ ] Titre "Activite"
- [ ] Donnees issues de `histories` deja observees
- [ ] Style coherent avec les autres cards
- [ ] Ne casse pas le layout existant
- [ ] Performant au scroll (pas de jank)
- [ ] `npx tsc --noEmit` → 0 erreur

## Estimation
S (15-30 min)
