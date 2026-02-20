# feat(home) — Programme visible dans bottom sheet au lieu de l'accordéon
Date : 2026-02-19 17:25

## Instruction
Refonte UX programmes — affichage dans bottom sheet au lieu de l'accordéon.
Quand l'utilisateur tape sur un programme, une bottom sheet s'ouvre montrant le contenu complet (sessions + exercices).

## Classification
Type : feat
Fichiers :
- `mobile/src/components/ProgramDetailBottomSheet.tsx` (CRÉÉ)
- `mobile/src/components/ProgramSection.tsx` (MODIFIÉ)
- `mobile/src/screens/HomeScreen.tsx` (MODIFIÉ)

## Ce qui a été fait

### ProgramDetailBottomSheet.tsx (nouveau)
- Composant principal avec props : `program | null`, `visible`, `onClose`, `onOpenSession`, `onAddSession`, `onSessionOptions`
- `SessionPreviewRowInner` : affiche nom séance + preview exercices (3 premiers), bouton `•••` pour options
- `SessionPreviewRow` : HOC `withObservables` qui injecte `session` + `exercises` via `Q.on('session_exercises', ...)`
- `ProgramDetailContent` : HOC `withObservables` qui injecte `sessions` triées par position
- ScrollView avec `maxHeight: screenHeight * 0.55` pour éviter les débordements
- Message vide si aucune séance, bouton "+ Ajouter une séance" toujours visible
- Pas de couleurs hardcodées, utilise `colors.*`, `spacing.*`, `borderRadius.*`, `fontSize.*`

### ProgramSection.tsx (simplifié)
- Suppression : accordéon, `isExpanded`, `fadeAnim`, `SessionItem`, animation fade, flèche ▼/▶
- Suppression props : `onOpenSession`, `onAddSession`, `onSessionOptionsPress`
- Ajout prop : `onPress: () => void` (tap → bottom sheet de détail)
- Affichage : nom du programme + sous-titre "N séance(s)" en `colors.textSecondary`
- Long press → `onLongPressProgram` (drag, conservé)
- Bouton `•••` → `onOptionsPress` (conservé)
- Card avec `colors.card` background + `colors.border` bordure

### HomeScreen.tsx (intégré)
- Import `ProgramDetailBottomSheet`
- Ajout states : `selectedProgramForDetail: Program | null`, `isDetailVisible: boolean`
- Ajout `handleProgramPress(program)` avec `haptics.onPress()`
- `renderItem` simplifié : `onPress`, `onLongPressProgram`, `onOptionsPress` uniquement
- `useMultiModalSync` mis à jour avec `isDetailVisible`
- `BackHandler` mis à jour avec case `isDetailVisible`
- `ProgramDetailBottomSheet` ajouté dans le JSX avec handlers complets :
  - `onOpenSession` → ferme détail + navigate SessionDetail
  - `onAddSession` → ferme détail + ouvre modal séance
  - `onSessionOptions` → ferme détail + ouvre options séance

## Comportement final
- **Tap** sur programme → bottom sheet avec sessions + exercices
- **Long press** → drag & drop (inchangé)
- **•••** → options (Renommer, Dupliquer, Supprimer) (inchangé)
- **Session dans bottom sheet** → tap navigue vers SessionDetail
- **•••** sur session dans bottom sheet → options séance (Renommer, Dupliquer, Déplacer, Supprimer)

## Vérification
- TypeScript : ✅ zéro erreur (`npx tsc --noEmit`)
- Tests : ✅ 643/643 passed
- Nouveau test créé : non (feat UI, pas de logique métier nouvelle)

## Commit
`404cf0e` feat(home): show program detail in bottom sheet instead of accordion
