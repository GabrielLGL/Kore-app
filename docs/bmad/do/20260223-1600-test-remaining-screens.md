# test(screens) — add coverage for ProgramsScreen, AssistantScreen, ChartsScreen (+14 tests)
Date : 2026-02-23 16:00

## Instruction
docs/bmad/prompts/20260223-1400-coverage-C.md

## Rapport source
docs/bmad/prompts/20260223-1400-coverage-C.md

## Classification
Type : test
Fichiers modifies :
- mobile/src/screens/AssistantScreen.tsx (ajout export AssistantScreenInner)
- mobile/src/screens/ChartsScreen.tsx (ajout export ChartsContent)
- mobile/src/screens/__tests__/ProgramsScreen.test.tsx (nouveau, 5 tests)
- mobile/src/screens/__tests__/AssistantScreen.test.tsx (nouveau, 6 tests)
- mobile/src/screens/__tests__/ChartsScreen.test.tsx (nouveau, 3 tests)

## Ce qui a ete fait
1. Ajout `export` sur `AssistantScreenInner` et `ChartsContent` pour tester les composants Base hors HOC
2. Cree ProgramsScreen.test.tsx (5 tests) : render vide, user null, bouton Creer visible, render avec programmes, BottomSheet ouvre au clic
3. Cree AssistantScreen.test.tsx (6 tests) : render user+programs, user null, premiere question wizard, options visibles, badge provider, compteur etapes
4. Cree ChartsScreen.test.tsx (3 tests) : render vide, message selection, liste exercices
5. Fix iteration 1 : AssistantScreen useFocusEffect mock causait infinite re-renders -> change en jest.fn()
6. Fix iteration 1 : ProgramsScreen BottomSheet animations causaient timer leaks -> mock BottomSheet component

## Verification
- TypeScript : zero erreur
- Tests : 935 passed (921 + 14 nouveaux)
- Nouveau test cree : oui (3 fichiers, 14 tests)

## Documentation mise a jour
aucune

## Statut
Resolu — 20260223-1600

## Commit
ae2064c test(screens): add coverage for ProgramsScreen, AssistantScreen, ChartsScreen (+14 tests)
