# S02 — Composant HeatmapCalendar

## Description
En tant qu'utilisateur sur le HomeScreen, je veux voir une grille annuelle coloree de mes seances, afin de visualiser ma regularite d'entrainement d'un coup d'oeil.

## Dependance
S01 (helper buildHeatmapData)

## Fichiers concernes
- `mobile/src/components/HeatmapCalendar.tsx` (NOUVEAU)

## Taches techniques

### 1. Props
```typescript
interface HeatmapCalendarProps {
  data: HeatmapDay[]  // 365 jours depuis buildHeatmapData()
}
```

### 2. Organisation en colonnes (semaines)
- `useMemo` : transformer `data[]` en colonnes de 7 jours
- La premiere colonne peut etre incomplete (si le jour -364 n'est pas un lundi)
- Chaque colonne = 1 semaine, 7 lignes (lun en haut, dim en bas)
- ~53 colonnes au total

### 3. Labels des mois
- Calculer la position horizontale de la premiere semaine de chaque mois
- Afficher les labels (Jan, Fev, Mar...) au-dessus de la grille
- `fontSize: 10`, `colors.textSecondary`

### 4. Grille de cellules
- Chaque cellule = `View` de 12x12 avec `borderRadius: 2`
- `backgroundColor` = `intensityColors[Math.min(count, 3)]`
- Gap de 2px entre cellules (via `gap` ou margin)
- Colonnes disposees horizontalement dans un `ScrollView`

### 5. ScrollView horizontal
- `horizontal={true}`, `showsHorizontalScrollIndicator={false}`
- Scroll initial a droite via `ref.current?.scrollToEnd({ animated: false })` dans `onLayout`
- Largeur totale : ~53 * (12 + 2) = ~742px

### 6. Legende
- 4 carres colores + texte explicatif en bas
- `intensityColors[0-3]` + labels "repos", "1x", "2x", "3+"
- `fontSize: 10`, `colors.textSecondary`

### 7. Memoisation
- `React.memo(HeatmapCalendar)` pour eviter les re-renders
- `useMemo` pour le calcul des colonnes

## Criteres d'acceptation
- [ ] Grille 53 colonnes x 7 lignes, scrollable horizontalement
- [ ] Couleurs : `intensityColors` du theme
- [ ] Labels des mois visibles
- [ ] Cellules 12x12, gap 2px
- [ ] Scroll initial a droite (semaine courante)
- [ ] `React.memo` + `useMemo`
- [ ] Pas de couleurs hardcodees
- [ ] `npx tsc --noEmit` → 0 erreur

## Estimation
M (30-60 min)
