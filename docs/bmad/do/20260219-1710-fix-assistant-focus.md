# fix(assistant) — fix badge provider stale + reset wizard on tab focus
Date : 2026-02-19 17:10

## Instruction
Corriger 2 bugs dans AssistantScreen.tsx (badge provider stale + reset wizard au retour)

## Classification
Type : fix
Fichiers : mobile/src/screens/AssistantScreen.tsx

## Ce qui a été fait
1. Ajout de l'import `useFocusEffect` depuis `@react-navigation/native` (import de valeur séparé du type existant).
2. Ajout d'un state `const [, forceUpdate] = useState(0)` dans `AssistantScreenInner`.
3. Ajout d'un `useFocusEffect(useCallback(..., [contentAnim]))` après le useEffect de la progress bar :
   - `setCurrentStep(0)` → revient à l'étape 1 à chaque retour sur l'onglet
   - `setFormData({ equipment: [], musclesFocus: [] })` → reset le formulaire
   - `contentAnim.setValue(1)` → reset l'animation de fade
   - `forceUpdate(n => n + 1)` → force un re-render pour que le badge provider lise la valeur WatermelonDB fraîche

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit`)
- Tests : ✅ 643 passed, 41 suites
- Nouveau test créé : non (comportement UI/navigation, non testé unitairement)

## Commit
feat(assistant): fix badge provider stale + reset wizard on tab focus
