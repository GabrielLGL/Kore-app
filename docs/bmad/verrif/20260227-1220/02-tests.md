# Passe 2 — Tests Jest — 20260227-1220

## Résultat : 🔴 7 FAILURES

| Métrique | Valeur |
|----------|--------|
| Suites   | 1 fail / 74 pass / 75 total |
| Tests    | 7 fail / 1260 pass / 1267 total |
| Temps    | 42.3s |

## Suite en échec

**`src/components/__tests__/ExercisePickerModal.test.tsx`** — 7 failures

### Erreur commune
```
TypeError: (0 , _databaseHelpers.parseIntegerInput) is not a function
  at ExercisePickerModal.tsx:103
```

### Cause racine
`ExercisePickerModal.tsx:103` appelle `parseIntegerInput` importé de `databaseHelpers`.
La fonction existe dans `parseUtils.ts` (export correct), mais le mock Jest du test
ne l'incluait pas au moment de l'exécution.

### Tests failés
1. `sélection d'un exercice > sélectionne un exercice et active le bouton Ajouter`
2. `validation du formulaire > appelle onAdd quand un exercice est sélectionné`
3. `bouton Ajouter > appelle onAdd avec les bons arguments`
4. `bouton Ajouter > passe les valeurs saisies dans les inputs à onAdd`
5. `réinitialisation à la fermeture > efface la sélection quand visible passe à false puis true`
6. `valeurs initiales > utilise les valeurs initiales fournies`
7. `valeurs initiales > utilise des chaînes vides par défaut`

## Action
Vérifier/corriger le mock dans `ExercisePickerModal.test.tsx`.
