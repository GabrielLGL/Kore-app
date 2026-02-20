# feat(session) — add reorderExercises to useSessionManager
Date : 2026-02-19 18:40

## Instruction
Dans mobile/src/hooks/useSessionManager.ts, ajouter une fonction reorderExercises(items: SessionExercise[]) qui met à jour le champ position de chaque SessionExercise selon l'ordre du tableau reçu. Règles strictes : (1) toute mutation WatermelonDB DOIT être dans database.write() et utiliser database.batch() pour grouper les updates, (2) chaque item.prepareUpdate(se => { se.position = index }) pour i de 0 à items.length-1, (3) importer database depuis mobile/src/model/index.ts si pas encore importé, (4) typer correctement avec SessionExercise, (5) pas de any TypeScript. Exporter la fonction depuis le hook.

## Classification
Type : feat
Fichiers : mobile/src/hooks/useSessionManager.ts

## Ce qui a été fait
- Ajout de la fonction `reorderExercises(items: SessionExercise[]): Promise<boolean>` dans useSessionManager
- Utilise `database.write()` wrappant `database.batch()` (pattern existant du hook)
- Chaque item est mis à jour via `item.prepareUpdate(se => { se.position = index })` avec son index dans le tableau
- database et SessionExercise étaient déjà importés — aucun import ajouté
- Fonction exposée dans le return du hook

## Vérification
- TypeScript : ✅ npx tsc --noEmit → 0 erreur
- Tests : non lancés (pas de logique métier complexe, pure mise à jour de positions)
- Nouveau test créé : non

## Commit
cd391e1 feat(session): add reorderExercises function to useSessionManager
