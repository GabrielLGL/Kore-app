<!-- v1.0 — 2026-02-27 -->
# Rapport — muscles-volume — Groupe B — 20260227-2215

## Objectif
Enrichir `StatsRepartitionScreen.tsx` (l'écran "Muscles" qui montre la répartition musculaire %) pour y ajouter :
1. Un graphique bar chart "Séries par semaine" avec pagination (4 semaines par défaut, boutons Précédent/Suivant)
2. Un filtre muscle : "Global" (toutes muscles) OU un muscle spécifique
3. La section "Sets par muscle cette semaine" (déplacée depuis `StatsVolumeScreen`)

L'écran devient ainsi un tableau de bord complet "Muscles" qui combine répartition + volume hebdomadaire + sets semaine en cours.

## Fichiers concernés
- `mobile/src/screens/StatsRepartitionScreen.tsx` — modification principale
- `mobile/src/screens/StatsVolumeScreen.tsx` — retirer la section sets par muscle (pour éviter doublon) — OPTIONNEL, à faire seulement si la section est aussi dans le nouveau screen

## Contexte technique
- Stack : React Native + Expo 52, TypeScript strict, WatermelonDB, React Navigation 7
- **Dark Mode Only** — utiliser `useColors()` depuis `../contexts/ThemeContext`, JAMAIS de couleurs hardcodées
- **Composants disponibles** :
  - `<ChipSelector>` — filtres horizontaux défilables
  - `<BarChart>` de `react-native-chart-kit`
  - `<Button>` — `variant="ghost" size="sm"` pour les boutons prev/next
- **Hooks disponibles** :
  - `useHaptics()` — `haptics.onPress()` sur les boutons
  - `useColors()` — couleurs du thème
  - `useWindowDimensions()` — pour la largeur du chart
- **Helpers disponibles** (tous depuis `../model/utils/statsHelpers`) :
  - `computeMuscleRepartition(sets, exercises, histories, period)` — déjà utilisé
  - `computeWeeklySetsChart(sets, exercises, histories, options)` — **NOUVEAU** (Groupe A)
  - `computeSetsPerMuscleWeek(sets, exercises, histories)` — existant
  - `formatVolume(kg)` — déjà importé
  - `PERIOD_LABELS`, `labelToPeriod` — déjà importés
- **Chart config** : `createChartConfig()` depuis `../theme/chartConfig`
- **Theme** : `spacing`, `borderRadius`, `fontSize` depuis `../theme`
- **Pattern données** : `withObservables` HOC (déjà en place, ne pas modifier)
- **JAMAIS** `<Modal>` natif — utiliser Portal si nécessaire (ici pas de modal)

## Structure de l'écran résultant

```
ScrollView
├── ChipSelector (filtre période : "1 mois" / "3 mois" / "Tout")
│
├── Section : Répartition musculaire (EXISTANT, garder tel quel)
│   └── Barres % par muscle
│   └── "Volume analysé : X kg"
│
├── Section : Séries par semaine (NOUVEAU)
│   ├── Titre : "Séries par semaine"
│   ├── ChipSelector inline : ["Global", "Pectoraux", "Dos", ...] (muscles entraînés)
│   ├── BarChart (4 semaines, données de computeWeeklySetsChart)
│   ├── Navigation : [← Précédent]  [weekRangeLabel]  [Suivant →]
│   │   - "← Précédent" toujours visible (hasPrev = true)
│   │   - "Suivant →" désactivé (opacity 0.3) si hasNext = false
│   └── Empty state si data toutes à zéro
│
└── Section : Sets cette semaine (NOUVEAU — déplacé depuis StatsVolumeScreen)
    ├── Titre : "Sets par muscle cette semaine"
    └── Barres horizontales par muscle (comme dans StatsVolumeScreen)
```

## État local à gérer

```typescript
const [periodLabel, setPeriodLabel] = useState<string>('1 mois')  // EXISTANT
const [weekOffset, setWeekOffset] = useState<number>(0)           // NOUVEAU
const [muscleChartFilter, setMuscleChartFilter] = useState<string | null>(null)  // NOUVEAU, null = "Global"
```

## Calculs à ajouter (useMemo)

```typescript
// NOUVEAU — liste des muscles disponibles (pour le filtre du chart)
const availableMuscles = useMemo(() => {
  const muscleSet = new Set<string>()
  exercises.forEach(e => e.muscles.forEach(m => { if (m.trim()) muscleSet.add(m.trim()) }))
  return Array.from(muscleSet).sort()
}, [exercises])

// NOUVEAU — items du ChipSelector muscle chart : ["Global", ...muscles]
const muscleChartItems = useMemo(
  () => ['Global', ...availableMuscles],
  [availableMuscles]
)

// NOUVEAU — données du graphique paginé
const weeklySetsChartData = useMemo(
  () => computeWeeklySetsChart(sets, exercises, histories, {
    muscleFilter: muscleChartFilter,
    weekOffset,
  }),
  [sets, exercises, histories, muscleChartFilter, weekOffset]
)

// NOUVEAU — bar chart data pour react-native-chart-kit
const setsBarChartData = useMemo(() => ({
  labels: weeklySetsChartData.labels,
  datasets: [{ data: weeklySetsChartData.data.map(v => Math.max(v, 0)) }],
}), [weeklySetsChartData])

// NOUVEAU — sets par muscle cette semaine
const setsPerMuscle = useMemo(
  () => computeSetsPerMuscleWeek(sets, exercises, histories),
  [sets, exercises, histories]
)
const maxSetsThisWeek = setsPerMuscle[0]?.sets ?? 1
```

## Étapes

1. Lire le fichier `StatsRepartitionScreen.tsx` en entier
2. Ajouter les imports manquants :
   - `TouchableOpacity` depuis `react-native`
   - `useWindowDimensions` depuis `react-native`
   - `BarChart` depuis `react-native-chart-kit`
   - `computeWeeklySetsChart`, `computeSetsPerMuscleWeek`, `WeeklySetsChartResult` depuis `../model/utils/statsHelpers`
   - `useHaptics` depuis `../hooks/useHaptics`
   - `createChartConfig` depuis `../theme/chartConfig`
3. Ajouter les states `weekOffset` et `muscleChartFilter`
4. Ajouter les `useMemo` décrits ci-dessus
5. Dans le JSX, après la section répartition existante, ajouter la section "Séries par semaine" :
   - ChipSelector avec `['Global', ...availableMuscles]` + `selectedValue` = `muscleChartFilter ?? 'Global'` + `onChange` qui met à jour `muscleChartFilter` (null si "Global")
   - BarChart avec `setsBarChartData`, largeur `screenWidth - spacing.md * 2`, hauteur 180
   - Boutons Précédent / Suivant + label de plage
   - `chartConfig` créé avec `createChartConfig()`
6. Après la section séries, ajouter la section "Sets par muscle cette semaine" (copier le pattern de StatsVolumeScreen)
7. Ajouter les styles nécessaires dans `useStyles`

## Styles clés à ajouter

```typescript
sectionTitle: {
  fontSize: fontSize.md,
  fontWeight: '600',
  color: colors.text,
  marginTop: spacing.lg,
  marginBottom: spacing.sm,
},
weekNavRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: spacing.sm,
},
weekNavBtn: {
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
},
weekNavBtnText: {
  fontSize: fontSize.sm,
  color: colors.primary,
},
weekNavBtnDisabled: {
  opacity: 0.3,
},
weekRangeLabel: {
  fontSize: fontSize.xs,
  color: colors.textSecondary,
},
chartWrapper: {
  backgroundColor: colors.card,
  borderRadius: borderRadius.md,
  overflow: 'hidden',
  marginTop: spacing.sm,
},
setsMuscleCard: {
  backgroundColor: colors.card,
  borderRadius: borderRadius.md,
  padding: spacing.md,
  marginTop: spacing.sm,
  gap: spacing.md,
},
setsMuscleRow: { gap: spacing.xs },
setsMuscleLabel: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
setsMuscleText: { fontSize: fontSize.sm, color: colors.text, fontWeight: '500' },
setsMuscleCnt: { fontSize: fontSize.sm, color: colors.textSecondary },
setsTrack: {
  height: 6,
  backgroundColor: colors.cardSecondary,
  borderRadius: 3,
  overflow: 'hidden',
},
setsFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
```

## Contraintes
- Ne pas modifier `withObservables` en bas du fichier
- Ne pas toucher à la section répartition existante (barres %, totalVolume)
- Ne pas introduire de `<Modal>` natif
- Pas de `any` TypeScript
- Pas de couleurs hardcodées : utiliser `colors.*` uniquement
- Haptics : `haptics.onPress()` sur les boutons prev/next
- Quand `hasNext = false` : bouton "Suivant" affiché avec `opacity: 0.3` et `onPress` bloqué (`disabled`)
- Quand `weekOffset === 0` : `hasNext = false` (implémenté dans le helper Groupe A)
- Réinitialiser `weekOffset` à 0 quand on change `muscleChartFilter`

## Critères de validation
- `npx tsc --noEmit` → zéro erreur TypeScript
- `npm test` → zéro fail
- Le chart s'affiche bien avec 4 barres
- Les boutons Précédent/Suivant changent la fenêtre
- Le filtre "Global" / muscle fonctionne
- La section "Sets par muscle cette semaine" s'affiche sous le chart

## Dépendances
Ce groupe dépend de **Groupe A** (le helper `computeWeeklySetsChart` et le type `WeeklySetsChartResult` doivent exister dans `statsHelpers.ts` avant de commencer ce groupe).

## Statut
✅ Résolu — 20260227-2230

## Résolution
Rapport do : docs/bmad/do/20260227-2230-feat-muscles-screen-volume-chart.md
