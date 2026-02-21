# UX Design — Dashboard Statistiques Globales — 2026-02-21

> Dark Mode uniquement · fr-FR · tokens `theme/index.ts`

---

## Écran 1 — StatsScreen (Dashboard principal)

```
┌─────────────────────────────────────────┐
│ StatusBar                               │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Gabriel                          │  │  ← colors.text (xl, bold)
│  │  "🔥 7 jours consécutifs !"       │  │  ← colors.primary (sm, italic)
│  │                                   │  │
│  │  47 séances   12 420 kg   8 PRs   │  │  ← KPIs row (3 colonnes)
│  └───────────────────────────────────┘  │  ← colors.card, borderRadius.lg, padding.md
│                                         │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐  │
│  │  ⏱       │ │  🏋      │ │  🗓     │  │  ← Ligne 1 : 3 boutons
│  │  Durée   │ │  Volume  │ │ Agenda  │  │
│  └──────────┘ └──────────┘ └─────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐  │
│  │  💪      │ │  📊      │ │  📏     │  │  ← Ligne 2 : 3 boutons
│  │  Muscles │ │Exercices │ │ Mesures │  │
│  └──────────┘ └──────────┘ └─────────┘  │
│  ┌──────────┐                            │
│  │  📋      │                            │  ← Ligne 3 : 1 bouton (même style)
│  │Historique│                            │
│  └──────────┘                            │
└─────────────────────────────────────────┘
```

### Spécifications
- **Card header** : `colors.card` (#1C1C1E), `borderRadius.lg`, `spacing.md` padding, `spacing.lg` margin horizontal
- **Nom** : `fontSize: 24`, `fontWeight: '700'`, `colors.text`
- **Phrase d’accroche** : `fontSize: 14`, `fontStyle: 'italic'`, `colors.primary`, `marginTop: spacing.xs`
- **KPIs row** : 3 colonnes flex, séparateur vertical `colors.border`, valeur en bold + label en `colors.textSecondary` dessous
- **Boutons de la grille** :
  - Background : `colors.card`, `borderRadius.md`
  - Icône : 28px, centré, `colors.primary`
  - Label : `fontSize: 13`, `colors.textSecondary`, `marginTop: spacing.xs`
  - Padding : `spacing.md` vertical, `spacing.sm` horizontal
  - Grille : 3 colonnes avec `gap: spacing.sm`
  - Press : `opacity: 0.7` + haptic `onPress`
- **ScrollView** vertical pour accommoder les 7 boutons
- **Header** : pas de titre de navigation (fullscreen card)

---
## Écran 2 — StatsDurationScreen

```
┌─────────────────────────────────────────┐
│ ← Durée des séances                     │
│                                         │
│  ┌────────────┐  ┌────────────┐         │
│  │ Moyenne    │  │ Total      │         │
│  │  47 min    │  │  38h 20min │         │
│  └────────────┘  └────────────┘         │
│  ┌────────────┐  ┌────────────┐         │
│  │ Min        │  │ Max        │         │
│  │  22 min    │  │  1h 24min  │         │
│  └────────────┘  └────────────┘         │
│                                         │
│  Évolution (30 dernières séances)        │
│  ┌─────────────────────────────────┐    │
│  │  [Line chart - durée/séance]    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Spécifications
- 4 KPI cards en grille 2×2, `colors.card`, `borderRadius.md`
- Line chart : `victory-native` VictoryLine, couleur `colors.primary`, 30 derniers points
- Durée formatée : < 60min → "X min", ≥ 60min → "Xh Ymin"
- Séances sans `end_time` ignorées silencieusement

---

## Écran 3 — StatsVolumeScreen

```
┌─────────────────────────────────────────┐
│ ← Volume d'entraînement                 │
│                                         │
│  [Chips: 1 mois | 3 mois | Tout]        │
│                                         │
│  Volume total : 47 320 kg               │  ← grand nombre, colors.primary
│  vs période précédente : +12%  ↑        │  ← vert si +, rouge si -
│                                         │
│  Volume par semaine (barres)            │
│  ┌─────────────────────────────────┐    │
│  │  [Bar chart - 12 semaines]      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Top exercices par volume               │
│  ┌─────────────────────────────┐        │
│  │ 1. Squat          8 420 kg │        │
│  │ 2. Développé c.   6 180 kg │        │
│  │ 3. Soulevé terre  5 900 kg │        │
│  └─────────────────────────────┘        │
└─────────────────────────────────────────┘
```

### Spécifications
- ChipSelector existant pour la période (3 options)
- Comparaison % : vert (#34C759) si positif, rouge (colors.danger) si négatif
- VictoryBar pour le graphique semaines, couleur `colors.primary`
- Top 3 exercices en liste simple avec rang numéroté

---
## Écran 4 — StatsCalendarScreen

```
┌─────────────────────────────────────────┐
│ ← Calendrier d'activité                 │
│                                         │
│  Série actuelle : 🔥 7 jours            │
│  Record : 🏆 23 jours                   │
│                                         │
│  Sept Oct  Nov  Déc  Jan  Fév           │
│  L ░░▒▒░░███░░▒▒░░███░░▒▒░░███░░        │
│  M ▒▒░░███░░▒▒░░███░░▒▒░░███░░▒▒        │
│  Me░░▒▒░░███░░▒▒░░███░░▒▒░░███░░▒       │
│  J ░░▒▒░░███░░▒▒░░███░░▒▒░░███░░▒       │
│  V ███░░▒▒░░███░░▒▒░░███░░▒▒░░███       │
│  S ░░███░░▒▒░░███░░▒▒░░███░░▒▒░░█       │
│  D ▒▒░░░░▒▒░░░░▒▒░░░░▒▒░░░░▒▒░░░       │
│                                         │
│  Légende: ░ Repos  ▒ 1 séance  █ 2+    │
│                                         │
│  [Tap sur carré → tooltip date + nb]    │
└─────────────────────────────────────────┘
```

### Spécifications
- **Grille custom** : View + FlatList, 6 mois glissants (26 colonnes × 7 lignes)
- **Couleurs des cases** :
  - 0 séance : `#2C2C2E` (neutre sombre)
  - 1 séance : `#1E4D2B` (vert très sombre)
  - 2 séances : `#2D7A47` (vert moyen)
  - 3+ séances : `#34C759` (vert vif)
- **Taille case** : 11×11px, gap 2px
- **Tap** : affiche une petite bulle (View absolue) avec date + "X séance(s)"
- **Headers mois** : labels au-dessus des colonnes, `fontSize: 10`, `colors.textSecondary`
- **Streak** : calculé depuis `computeCurrentStreak()` et `computeRecordStreak()`

---

## Écran 5 — StatsRepartitionScreen

```
┌─────────────────────────────────────────┐
│ ← Répartition musculaire                │
│                                         │
│  [Chips: 1 mois | 3 mois | Tout]        │
│                                         │
│  ████████████████░░░░░  Quadriceps 42%  │
│  █████████████░░░░░░░  Pectoraux  31%  │
│  ████████░░░░░░░░░░░░░  Dorsaux    19%  │
│  █████░░░░░░░░░░░░░░░░  Épaules   12%  │
│  ████░░░░░░░░░░░░░░░░░  Triceps   10%  │
│  ███░░░░░░░░░░░░░░░░░░  Biceps     7%  │
│  ██░░░░░░░░░░░░░░░░░░░  Autres     4%  │
│                                         │
│  Volume total analysé : 47 320 kg       │
└─────────────────────────────────────────┘
```

### Spécifications
- Barres horizontales custom (View avec width en %) — pas de lib chart nécessaire
- Couleur barre : `colors.primary` (fond : `#2C2C2E`)
- Parsing `exercises.muscles` : split par ',' → trim → grouper
- Max 7 lignes + "Autres" pour le reste
- `ChipSelector` pour la période

---
## Écran 6 — StatsExercisesScreen (PRs + fréquence)

```
┌─────────────────────────────────────────┐
│ ← Exercices & Records                   │
│                                         │
│  Records personnels                     │
│  ┌─────────────────────────────────┐    │
│  │ 🏆 Squat       100kg × 5  →1RM 117kg│    │
│  │    il y a 3 jours               │    │
│  │ 🏆 Développé   85kg × 8  →1RM 111kg │    │
│  │    il y a 1 semaine              │   │
│  └─────────────────────────────────┘    │
│                                         │
│  Exercices les plus pratiqués           │
│  ┌─────────────────────────────────┐    │
│  │ 1. Squat            47 fois     │    │
│  │ 2. Développé c.     43 fois     │    │
│  │ 3. Soulevé de terre 38 fois     │    │
│  │ 4. Rowing barre     31 fois     │    │
│  │ 5. Curl biceps      28 fois     │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Spécifications
- PRs : liste depuis `sets` (is_pr = true), 1 ligne par exercice (meilleur set)
- 1RM Epley : `Math.round(weight * (1 + reps / 30))` affiché en secondaire
- Date relative : "il y a X jours/semaines/mois"
- Top 5 fréquence en liste numérotée

---
## Écran 7 — StatsMeasurementsScreen

```
┌─────────────────────────────────────────┐
│ ← Mesures corporelles     [+ Ajouter]   │
│                                         │
│  Dernière mesure — 18 fév 2026          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 78kg │ │ 82cm │ │ 95cm │ │ 37cm │   │
│  │Poids │ │Taille│ │Hanch.│ │ Bras │   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
│  ┌──────┐                               │
│  │ 95cm │                               │
│  │Poitr.│                               │
│  └──────┘                               │
│                                         │
│  [Chips: Poids|Taille|Hanches|Bras|Poitrine]
│                                         │
│  Évolution                              │
│  ┌─────────────────────────────────┐    │
│  │  [Line chart - mesure sélectée] │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Historique des mesures                 │
│  ┌─────────────────────────────────┐    │
│  │ 18 fév — 78kg, 82cm, 95cm... 🗑 │   │
│  │ 11 fév — 79kg, 82cm, 95cm... 🗑 │   │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### BottomSheet "Ajouter une mesure"
```
┌─────────────────────────────────────────┐
│  Nouvelle mesure                        │
│                                         │
│  Poids (kg)          [___]              │
│  Tour de taille (cm) [___]              │
│  Hanches (cm)        [___]              │
│  Bras (cm)           [___]              │
│  Poitrine (cm)       [___]              │
│                                         │
│  [Annuler]        [Enregistrer]         │
└─────────────────────────────────────────┘
```

### Spécifications
- Bouton "+ Ajouter" : dans le header, `Button` variant "ghost", size "sm"
- Cards mesures : grille 2 colonnes + 1 seul sur la 3ème ligne, `colors.card`
- ChipSelector pour sélectionner la mesure à afficher dans le graphique
- Line chart : VictoryLine, couleur `colors.primary`
- Suppression : `AlertDialog` "Supprimer cette mesure ?" avec haptic `onDelete`
- Inputs : `keyboardType="decimal-pad"`, tous optionnels
- Validation : au moins 1 champ rempli avant d'autoriser l'enregistrement
- Mutations : `database.write()` obligatoire
- Tri : plus récente en premier

---

## Interactions globales

| Action | Feedback |
|--------|----------|
| Tap bouton dashboard | `haptics.onPress()` + navigation |
| Tap case calendrier | tooltip inline (pas de modal) |
| Ajouter mesure | `haptics.onSuccess()` après save |
| Supprimer mesure | `haptics.onDelete()` + AlertDialog |
| Chip période | `haptics.onSelect()` |

## Tokens utilisés
```typescript
colors.background  // #121212 - fond écrans
colors.card        // #1C1C1E - cards et boutons
colors.primary     // accent vert - icônes, valeurs clés
colors.text        // blanc - texte principal
colors.textSecondary // gris - labels, sous-textes
colors.danger      // #FF3B30 - comparaisons négatives
colors.border      // séparateurs
spacing.xs / sm / md / lg / xl
borderRadius.sm / md / lg
```
