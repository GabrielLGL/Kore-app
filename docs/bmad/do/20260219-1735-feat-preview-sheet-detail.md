# feat(assistant) — Refonte bottom sheet preview : sessions + exercices en détail

Date : 2026-02-19 17:35

## Instruction
Refonte bottom sheet finale du wizard — afficher sessions + exercices au lieu du résumé "x séances n exercices".

## Classification
Type : feat
Fichiers : mobile/src/components/AssistantPreviewSheet.tsx

## Ce qui a été fait
1. **Suppression de la ligne résumé** (IIFE "x séances · n exercices") — plus nécessaire car la liste est visible directement
2. **ScrollView** : remplacement de `flex: 1` par `maxHeight: Dimensions.get('window').height * 0.45` pour éviter tout débordement
3. **Format exercices** : ajout d'un helper `formatExerciseSets(ex)` qui retourne :
   - `"X séries × Y"` (+ ` · ~Z kg` si poids > 0) quand setsTarget > 0 et repsTarget défini
   - `"× Y"` si seulement repsTarget
   - `""` sinon
4. **Bullet point** `•` ajouté devant chaque nom d'exercice
5. **sessionName** : couleur changée de `colors.primary` → `colors.text`, fontSize `sm` → `md`, fontWeight `'600'` → `'700'`
6. **Suppression** du style `summary` devenu inutilisé
7. Import de `Dimensions` et `GeneratedExercise` ajoutés

## Vérification
- TypeScript : ✅ Zéro erreur dans AssistantPreviewSheet.tsx (erreurs préexistantes dans aiService.ts et tests, non liées)
- Tests : ✅ 642 passed / 1 failed (offlineEngine.test.ts — préexistant, non lié)
- Nouveau test créé : non (composant UI pur)

## Commit
feat(assistant): show sessions and exercises detail in preview bottom sheet
