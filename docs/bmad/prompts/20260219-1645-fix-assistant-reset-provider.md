# Prompt analysé — fix-assistant-reset-provider — 2026-02-19 16h45

## Demande originale
"il faut que quand on valide le programme ou qu'on quitte assistant ia qui nous amene vers homescreen et qu'on revient sur assistant ia il revient a l'etape 1, aussi gemini ou offline doit etre mis a jour selon les setting mit pas quand on change de 'page d'options de programme'"

## Analyse

### Fichier ciblé
`mobile/src/screens/AssistantScreen.tsx` (seul fichier touché, 1 seul /do)

### Bug 1 — Wizard ne reset pas au step 1 après validation

**Root cause :** Dans `handleValidate` (lignes 300-320), après un import réussi, le code navigue vers `Home` ou `SessionDetail` **sans** réinitialiser le state du wizard (`currentStep`, `formData`, `generatedPlan`, `contentAnim`). React Navigation maintient le composant monté sur les onglets, donc quand l'utilisateur revient sur l'onglet Assistant, il voit l'état précédent.

**Fix :** Ajouter le reset du wizard state dans `handleValidate`, juste après le `previewModal.close()` et avant le `navigation.navigate(...)`.

State à reset :
- `setCurrentStep(0)`
- `setFormData({ equipment: [], musclesFocus: [] })`
- `setGeneratedPlan(null)`
- `contentAnim.setValue(1)`

Pour les deux branches (mode `program` et mode `session`).

### Bug 2 — Badge provider (Gemini/Offline) doit être réactif aux settings uniquement

**Situation actuelle :** La ligne 166 :
```typescript
const providerLabel = PROVIDER_LABELS[user?.aiProvider ?? 'offline'] ?? 'Offline'
```
Lit `user?.aiProvider` via `withObservables` (WatermelonDB observable). C'est **déjà correctement réactif** aux changements dans SettingsScreen.

**Ce qui NE doit PAS changer le badge :** Les transitions de steps du wizard (changements de `currentStep`, `formData`) ne touchent pas `user?.aiProvider`, donc le badge ne devrait pas varier lors de la navigation entre steps. C'est déjà correct dans le code actuel.

**Action à vérifier :** S'assurer que `withObservables` observe bien `user.aiProvider` de manière réactive (l'observable `.query().observe()` sur la collection `users` émet bien sur chaque update de champ). Si le badge ne se met pas à jour quand les settings changent, c'est un problème d'observation WatermelonDB — mais le code actuel est structurellement correct.

**Pas de changement de code requis pour Bug 2 sauf** : ajouter un commentaire explicatif pour clarifier que la réactivité du badge vient uniquement de `user` (withObservables), pas du state local.

## Commandes générées

| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | /do fix wizard reset + provider badge (voir ci-dessous) | AssistantScreen.tsx | seul |

---

## Commande finale

```
/do Dans mobile/src/screens/AssistantScreen.tsx, apporter 2 corrections :

**Bug 1 — Reset wizard après validation**
Dans la fonction `handleValidate` (lignes ~300-320) :
- Branche `mode === 'program'` : après `await importGeneratedPlan(plan)`, avant `navigation.navigate('Home')`, ajouter :
  setCurrentStep(0)
  setFormData({ equipment: [], musclesFocus: [] })
  setGeneratedPlan(null)
  contentAnim.setValue(1)
- Branche `mode === 'session'` : après `const session = await importGeneratedSession(...)`, avant la navigation vers SessionDetail, ajouter le même reset.

Objectif : quand l'utilisateur revient sur l'onglet Assistant après avoir validé un plan, le wizard repart à l'étape 1.

**Bug 2 — Badge provider (vérification + commentaire)**
Ligne 166 : `const providerLabel = PROVIDER_LABELS[user?.aiProvider ?? 'offline'] ?? 'Offline'`
- NE PAS modifier cette ligne — elle est déjà correctement réactive via withObservables
- Ajouter un commentaire au-dessus : `// Réactif via withObservables — mise à jour depuis les settings uniquement`
- VÉRIFIER qu'aucun state local ne shadow user.aiProvider dans le composant

Contraintes :
- Ne modifier QUE la fonction handleValidate et la ligne 166 (commentaire)
- Ne pas toucher les animations (contentAnim.setValue doit être appelé directement, pas via Animated.timing)
- Ne pas modifier le comportement de handleModify (déjà reset à l'étape 0)
- Respecter CLAUDE.md : no any, no console.log, mutations WatermelonDB dans database.write()
- Vérifier TypeScript : npx tsc --noEmit depuis mobile/
- Commit : fix(assistant): reset wizard to step 1 after plan validation
- Rapport dans docs/bmad/do/20260219-1645-fix-assistant-reset-provider.md
```
