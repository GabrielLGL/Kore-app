<!-- v1.0 — 2026-02-24 -->
# Rapport — Phase 1 Fondations — Groupe D — Composants visuels (Heatmap, Recap, Export)

## Objectif
Creer 3 composants visuels qui enrichissent l'experience gratuite:
1. Heatmap calendrier (#90): Vue annuelle style GitHub des seances colorees par intensite. Addictif a remplir.
2. Recap post-seance simple (#8): Ecran de fin de seance avec resume (volume, PRs, streak). Version simple gratuite (la version animee sera Pro).
3. Export donnees (#92): Exporter toutes les donnees en un tap. Argument "vos donnees vous appartiennent".

## Source
Brainstorming session: `docs/brainstorming/brainstorming-session-2026-02-23.md`
Features: #90 (Heatmap calendrier), #8 (Recap post-seance), #92 (Export donnees)

## Fichiers concernes
- `mobile/src/components/HeatmapCalendar.tsx` — Nouveau composant
- `mobile/src/components/WorkoutRecap.tsx` — Nouveau composant
- `mobile/src/screens/HomeScreen.tsx` — Integrer heatmap
- `mobile/src/screens/SessionDetailScreen.tsx` — Afficher recap en fin de seance
- `mobile/src/model/utils/exportHelpers.ts` — Nouveau helper d'export
- `mobile/src/screens/SettingsScreen.tsx` — Bouton export (ou ProfileScreen)

## Contexte technique
- Stack: React Native Expo 52, TypeScript, WatermelonDB
- Theme: Dark mode only (#121212 bg), colors de theme/index.ts
- Pas de couleurs hardcodees — utiliser colors.*
- Modeles: History (soft-delete deleted_at) pour les seances passees, Set pour les donnees
- Haptics: useHaptics() pour feedback (onSuccess au recap, onPress a l'export)
- L'export doit fonctionner offline (generer JSON/CSV localement)
- Pour le partage de fichier: utiliser expo-sharing ou expo-file-system

## Etapes

### Heatmap calendrier (#90)
1. Creer composant HeatmapCalendar qui affiche les 365 derniers jours en grille
2. Chaque jour colore selon l'intensite (gris = repos, vert clair = leger, vert fonce = intense)
3. Query les History non-deleted groupees par date
4. Calculer l'intensite par jour (volume total ou nombre de series)
5. Integrer sur HomeScreen (scrollable horizontalement)

### Recap post-seance (#8)
1. Creer composant WorkoutRecap affiche apres completion de seance
2. Afficher: duree, nombre de series, volume total, PRs battus, streak mis a jour
3. Version simple (pas d'animation complexe — la version animee viendra en Pro)
4. Bouton "Fermer" qui ramene au HomeScreen
5. Utiliser haptics.onSuccess() a l'affichage

### Export donnees (#92)
1. Creer helper exportAllData() qui query tous les modeles
2. Format JSON structure (programmes, sessions, exercises, history, sets, measurements, user)
3. Sauvegarder en fichier local via expo-file-system
4. Proposer le partage via expo-sharing
5. Ajouter bouton dans Settings/Profile

## Contraintes
- Ne pas casser: HomeScreen existant, flow de fin de seance existant
- Respecter: theme, haptics, WatermelonDB patterns, pas de couleurs hardcodees
- Heatmap doit etre performant (365 cellules)
- Export doit inclure TOUTES les donnees (pas de perte)
- Recap ne doit pas bloquer — bouton fermer toujours accessible

## Criteres de validation
- npx tsc --noEmit → zero erreur
- npm test → zero fail
- Heatmap affiche les seances passees correctement colorees
- Recap s'affiche apres une seance avec les bonnes stats
- Export genere un fichier JSON valide avec toutes les donnees
- Import eventuel des donnees (optionnel, peut etre Phase 2)

## Dependances
- Depend partiellement du Groupe A (si le tonnage/streak sont ajoutes au modele User, le recap peut les afficher). Mais peut commencer independamment avec les donnees existantes.

## Statut
✅ Resolu — 20260225

## Resolution
Rapports do : docs/bmad/do/20260225-feat-heatmap-recap-export.md
QA : docs/bmad/07-qa-report.md (section Composants visuels)
Stories : docs/stories/heatmap-recap-export/
