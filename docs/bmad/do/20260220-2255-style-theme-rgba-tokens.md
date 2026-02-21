# style(theme) — Remplacer rgba hardcodés par des tokens theme + @field→@text
Date : 2026-02-20 22:55

## Instruction
qualite-2245 rgba + @field fixes

## Rapport source
docs/bmad/verrif/qualite-20260220-2245.md — Groupes B et C

## Classification
Type : style
Fichiers modifiés :
- mobile/src/theme/index.ts
- mobile/src/components/WorkoutExerciseCard.tsx
- mobile/src/components/RestTimer.tsx
- mobile/src/model/models/Program.ts

## Ce qui a été fait

### Groupe B — 3 rgba hardcodés → tokens theme
Ajout dans `theme/index.ts` (section "Transparent tints") :
- `successBg: 'rgba(52, 199, 89, 0.12)'`
- `primaryBg: 'rgba(0, 122, 255, 0.15)'`
- `surfaceOverlay: 'rgba(255, 255, 255, 0.08)'`

Remplacement dans les composants :
- `WorkoutExerciseCard.tsx:289` : `'rgba(52, 199, 89, 0.12)'` → `colors.successBg`
- `WorkoutExerciseCard.tsx:361` : `'rgba(0,122,255,0.15)'` → `colors.primaryBg`
- `RestTimer.tsx:177` : `'rgba(255,255,255,0.08)'` → `colors.surfaceOverlay`

### Groupe C — @field → @text dans Program.ts
- Import `text` ajouté dans les décorateurs WatermelonDB
- `@field('name')` → `@text('name')` (cohérent avec tous les autres modèles)

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 674 passed / 41 suites
- Nouveau test créé : non (changements purement stylistiques/cosmétiques)

## Documentation mise à jour
- `mobile/src/theme/index.ts` : 3 tokens ajoutés avec commentaire "Transparent tints"

## Statut
✅ Résolu — 20260220-2255

## Commit
f767612 style(theme): replace hardcoded rgba with theme tokens + @field→@text
