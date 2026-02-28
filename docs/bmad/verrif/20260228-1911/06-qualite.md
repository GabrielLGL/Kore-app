# Passe 6 — Code mort & qualité
> Run : 20260228-1911

## Problèmes trouvés

| # | Fichier | Ligne | Type | Description | Sévérité |
|---|---------|-------|------|-------------|----------|
| 1 | `screens/HomeScreen.tsx` | 471,497,502,512 | Hardcoded fontSize | `fontSize: 9/8/7/9` — hors tokens theme | 🟡 |
| 2 | `screens/HomeScreen.tsx` | 490 | Hardcoded borderRadius | `borderRadius: 4` — hors tokens theme | 🟡 |
| 3 | `screens/AssistantScreen.tsx` | 864 | Hardcoded fontSize | `fontSize: 26` — devrait être `fontSize.xxl` | 🟡 |
| 4 | `screens/ProgramDetailScreen.tsx` | 297,314,324,330,331 | Hardcoded | `fontSize: 17`, `borderRadius: 10`, `padding: 14` — hors tokens | 🟡 |
| 5 | `screens/ProgramsScreen.tsx` | 369,375,376,405 | Hardcoded | `borderRadius: 10`, `padding: 14` — hors tokens | 🟡 |
| 6 | `screens/SettingsScreen.tsx` | 819 | Hardcoded borderRadius | `borderRadius: 9` — hors tokens | 🟡 |
| 7 | `screens/OnboardingScreen.tsx` | 234 | Hardcoded borderRadius | `borderRadius: 5` — hors tokens | 🟡 |
| 8 | `components/HeatmapCalendar.tsx` | 152,164,177,180 | Hardcoded | `fontSize: 10`, `borderRadius: 2` — hors tokens | 🟡 |
| 9 | `components/BottomSheet.tsx` | 156 | Hardcoded borderRadius | `borderRadius: 2` — hors tokens | 🟡 |
| 10 | `components/SessionExerciseItem.tsx` | 114 | Hardcoded borderRadius | `borderRadius: 1` | 🟡 |
| 11 | `components/WorkoutExerciseCard.tsx` | 444,454,495,507 | Hardcoded borderRadius | `borderRadius: 14/19` | 🟡 |
| 12 | `components/WorkoutHeader.tsx` | 87 | Hardcoded borderRadius | `borderRadius: 2` | 🟡 |

## Non-problèmes confirmés
- ✅ Zéro `any` TypeScript détecté
- ✅ Zéro import inutilisé détecté
- ✅ Zéro code mort
- ✅ Tous les `console.log` dans services/sentry.ts guardés par `__DEV__`
- ✅ Pas de couleur hexadécimale hardcodée

## Score qualité : 14/20
(-6 pour les ~23 valeurs hardcodées de spacing/borderRadius/fontSize non-token)
