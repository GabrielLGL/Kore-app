# STYLE(workout) — Redesign exercise card with targets, completion indicator, and improved validated state
Date : 2026-02-19 18:50

## Instruction
Redesign UI de WorkoutExerciseCard et LastPerformanceBadge (chip badge, objectif cible, indicateur de complétion borderLeft, cercle série validée, PR chip, bouton disabled redesigné).

## Classification
Type : style
Fichiers : mobile/src/components/LastPerformanceBadge.tsx, mobile/src/components/WorkoutExerciseCard.tsx, mobile/src/components/__tests__/LastPerformanceBadge.test.tsx

## Ce qui a été fait

### LastPerformanceBadge.tsx
- Remplacement du simple `<Text>` par un chip `<View>` (backgroundColor: colors.cardSecondary, borderRadius: borderRadius.sm, padding vertical xs / horizontal sm, alignSelf: 'flex-start')
- Cas null : "Première fois" en colors.warning, fontStyle italic, fontSize xs
- Cas non-null : format "↑ {setsCount}×{avgReps} @ {maxWeight} kg  •  {formatRelativeDate(date)}" réparti en 3 `<Text>` (values en colors.text, separator et date en colors.textSecondary)

### WorkoutExerciseCard.tsx
- **WorkoutSetRowProps** : ajout de `weightTarget?: string` et `repsTarget?: string` (props optionnelles, interfaces INCHANGÉES pour les autres props)
- **WorkoutExerciseCardContent** :
  - Ligne cible affichée sous le nom si `setsTarget != null` : "Objectif : {N}× {reps} reps @ {weight} kg" (style `target` : textSecondary, fontSize xs, marginBottom sm)
  - `completedCount` calculé dynamiquement ; `borderLeftWidth: 3, borderLeftColor: success | transparent` ajouté à la card (inline style pour la valeur dynamique)
  - `weightTarget` et `repsTarget` passés à `WorkoutSetRow` comme placeholders
- **WorkoutSetRow état VALIDÉ** :
  - Numéro de série : cercle coloré (26×26, borderRadius 13, rgba(52,199,89,0.2), texte en colors.success fontSize xs) remplace "Série N"
  - Badge PR : chip `<View>` (rgba(0,122,255,0.15), borderRadius sm, padding 6/2) autour du texte colors.primary fontSize xs fontWeight 800
- **WorkoutSetRow bouton VALIDATE** :
  - `validateBtnDisabled` : suppression de `opacity: 0.35` → remplacé par `backgroundColor: colors.cardSecondary`

### LastPerformanceBadge.test.tsx
- Mise à jour des assertions pour correspondre au nouveau format :
  - `getByText('Première fois sur cet exercice')` → `getByText('Première fois')`
  - `getByText(/Dernière fois/)` → `getByText(/↑/)`

## Vérification
- TypeScript : ✅ 0 erreurs (npx tsc --noEmit depuis mobile/)
- Tests : ✅ 7/7 LastPerformanceBadge passed (WorkoutSummarySheet pré-existant — 12 fails avant mes changements)
- Nouveau test créé : non (tests existants mis à jour)

## Commit
57149b8 style(workout): redesign exercise card with targets, completion indicator, and improved validated state
