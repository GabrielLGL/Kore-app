# TEST(ai) — Mise à jour des tests unitaires après refactor ExerciseInfo
Date : 2026-02-19 17:00

## Instruction
Mettre à jour les tests unitaires du module AI dans WEGOGYM après refactor ExerciseInfo.
DBContext.exercises est maintenant ExerciseInfo[] ({ name: string; muscles: string[] }).
Ajouter des tests pour les nouvelles fonctionnalités : split filtering, weight targets, shuffle.

## Classification
Type : test
Fichiers modifiés :
- mobile/src/services/ai/__tests__/offlineEngine.test.ts
- mobile/src/services/ai/__tests__/providerUtils.test.ts

## Ce qui a été fait

### Constat initial
Les fichiers de test étaient déjà correctement typés (ExerciseInfo avec `muscles: []`) grâce aux
refactors précédents. Aucune migration de mock n'était nécessaire.

### Tests ajoutés dans offlineEngine.test.ts (3 nouveaux tests)

1. **"doit filtrer les exercices par muscles du split PPL (session Push)"**
   - Mock : exercices Push (Pecs/Triceps/Epaules) + Pull (Dos/Biceps), daysPerWeek: 5
   - Vérifie que la session Push (index 0) ne contient que des exercices Push
   - Valide le filtrage par muscles du split dans `generateProgram`

2. **"doit retourner des exercices dans un ordre différent entre deux générations (shuffle)"**
   - 10 exercices Quadriceps, daysPerWeek: 1, durationMin: 30
   - Jest.spyOn(Math, 'random') → mockReturnValue(0) pour call1 (shuffle → [Ex1..Ex9,Ex0])
   - mockReturnValue(0.9999) pour call2 (pas de swap, ordre original [Ex0..Ex9])
   - Compare que les deux listes de 4 exercices sont différentes

3. **"doit calculer weightTarget depuis les PRs (bodybuilding + intermédiaire → 72% du PR)"**
   - Mock : { name: 'Squat', muscles: ['Quadriceps', 'Ischios'] }, prs: { 'Squat': 100 }
   - goal: 'bodybuilding', level: 'intermédiaire' → pct = 0.72
   - Vérifie weightTarget = round(100 * 0.72 * 2) / 2 = 72

### Tests ajoutés dans providerUtils.test.ts (2 nouveaux tests)

4. **"inclut les directives sport science dans le prompt"**
   - Vérifie que buildPrompt() contient la section 'DIRECTIVES SPORT SCIENCE'

5. **"formate les PRs avec kg et indique le pourcentage recommandé"**
   - prs: { 'Squat': 100, 'Développé couché': 80 }
   - Vérifie 'Squat: 100kg', 'Développé couché: 80kg', et '%' présents dans le prompt

## Vérification
- TypeScript : ✅ (aucun type `any` introduit, ExerciseInfo et DBContext explicitement typés)
- Tests : ✅ 83/83 passed (0 failing, 0 régression)
- Nouveau test créé : oui (5 nouveaux tests)

## Commit
test(ai): update mocks for ExerciseInfo and add tests for new offline engine features
