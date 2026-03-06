# Passe 2/8 — Tests

**Date :** 2026-03-06
**Commande :** `npx jest --verbose`

## Résultat

- **Test Suites :** 1 failed, 92 passed, 93 total
- **Tests :** 1 failed, 1571 passed, 1572 total

## Test en échec

### ExercisesScreen.test.tsx — "le bouton globe navigue vers ExerciseCatalog"

**Fichier :** `src/screens/__tests__/ExercisesScreen.test.tsx:331`

**Erreur :**
```
expect(jest.fn()).toHaveBeenCalled()
Expected number of calls: >= 1
Received number of calls:    0
```

**Cause :** Le composant `ExercisesContent` utilise `useLayoutEffect` pour appeler `navigation.setOptions()`. Or, React supprime `useLayoutEffect` dans l'environnement JSDOM/test renderer. Le test s'attend à ce que `setOptions` soit appelé après `render()`, mais l'effet ne se déclenche pas.

**Fix :** Envelopper l'assertion dans `act()` + `waitFor()`, ou changer le test pour utiliser `useEffect` dans le test mock, ou utiliser `renderHook` pour tester le side-effect séparément.
