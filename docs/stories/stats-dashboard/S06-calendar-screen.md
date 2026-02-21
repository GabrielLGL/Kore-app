# S06 — StatsCalendarScreen

## Description
Créer l'écran calendrier d'activité style GitHub (grille de carrés colorés par intensité).

## Fichiers à créer
- `mobile/src/screens/StatsCalendarScreen.tsx`

## UI (cf UX Design Écran 4)
- Grille custom : 6 mois glissants, 7 lignes (jours semaine), colonnes = semaines
- Cases colorées par intensité (0/1/2/3+ séances)
- Tap sur une case → tooltip inline (View absolue) avec date + nb séances
- Streak actuel + streak record affichés en haut
- Labels mois au-dessus des colonnes

## Spécifications techniques
- Grille implémentée avec Views imbriquées (pas de lib externe)
- Case : 11×11px, gap 2px
- Couleurs : 0→`#2C2C2E`, 1→`#1E4D2B`, 2→`#2D7A47`, 3+→`#34C759`
- `computeCalendarData()` retourne `Map<'YYYY-MM-DD', number>`
- `computeCurrentStreak()` et `computeRecordStreak()` pour les badges

## Critères d'acceptation
- [ ] Grille affiche 6 mois glissants
- [ ] Couleurs correctes selon intensité
- [ ] Tap sur case affiche tooltip (sans modal)
- [ ] Streak actuel et record corrects
- [ ] `npx tsc --noEmit` passe

## Estimation : L (3-4h — grille custom complexe)
## Dépendances : S02, S03
