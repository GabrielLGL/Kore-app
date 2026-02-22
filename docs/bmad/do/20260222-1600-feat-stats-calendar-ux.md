# feat(stats-calendar) — Agrandir le calendrier et afficher les détails des séances
Date : 2026-02-22 16:00

## Instruction
docs/bmad/prompts/20260222-1430-stats-ux-C.md

## Rapport source
docs/bmad/prompts/20260222-1430-stats-ux-C.md

## Classification
Type : feat
Fichiers modifiés : mobile/src/screens/StatsCalendarScreen.tsx

## Ce qui a été fait
1. **Calendrier agrandi** :
   - `DAY_SIZE` : 12 → 20
   - `DAY_GAP` : 2 → 3
   - `dayLabel.fontSize` : 9 → 11
   - `dayLabel.width` : 10 → 14
   - `dayBox.borderRadius` : 2 → 3
   - `legendBox.borderRadius` : 2 → 3

2. **Tooltip enrichi avec détails des séances** :
   - `handleDayPress` est maintenant async et résout les noms de session via `h.session.fetch()`
   - Pour chaque séance du jour cliqué : affiche le nom (depuis la relation Session) et la durée (startTime → endTime, formatée via `formatDuration`)
   - Jour sans séance : affiche "Repos"
   - Toggle : cliquer à nouveau sur le même jour ferme le tooltip
   - Import de `formatDuration` depuis `statsHelpers.ts`

3. **Nouveaux styles tooltip** :
   - `tooltipDate` : date en textSecondary, centré, capitalize
   - `tooltipRest` : "Repos" en textSecondary, centré
   - `tooltipSession` : row avec nom (flex:1) + durée à droite
   - `tooltipSessionName` : texte blanc, tronqué à 1 ligne
   - `tooltipSessionDuration` : textSecondary, fontSize xs

## Vérification
- TypeScript : ✅
- Tests : ✅ 847 passed
- Nouveau test créé : non (changement UI uniquement)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260222-1600

## Commit
76438bc feat(stats-calendar): enlarge calendar grid and show session details in tooltip
