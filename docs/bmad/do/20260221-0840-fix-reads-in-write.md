# fix(hooks) — Reads inside database.write() — WatermelonDB undefined behavior
Date : 2026-02-21 08:40

## Instruction
docs/bmad/morning/20260221-0830-fix-reads-in-write.md

## Rapport source
docs/bmad/verrif/20260221-0223/07-fix-niveau1.md

## Classification
Type : fix
Fichiers modifiés :
- `mobile/src/hooks/useProgramManager.ts`
- `mobile/src/hooks/useSessionManager.ts`

## Ce qui a été fait

### useProgramManager.ts (4 corrections)

**`saveProgram()`**
- `getNextPosition('programs')` sorti du `database.write()`
- `const position = isRenamingProgram ? 0 : await getNextPosition('programs')` calculé avant le write()

**`saveSession()`**
- `getNextPosition('sessions', ...)` sorti du `database.write()`
- `const position = (!isRenamingSession && targetProgram) ? await getNextPosition(...) : 0` calculé avant le write()

**`duplicateSession()`**
- `selectedSession.program.fetch()`, `getNextPosition()`, `session_exercises.fetch()`, `se.exercise.fetch()` × N — tous sortis du `database.write()`
- Lectures pré-calculées avant le write() avec `Promise.all(originalExos.map(se => se.exercise.fetch()))`
- Boucle dans write() itère sur `exoRecords[i]` déjà fetchés (index-based loop remplace `for...of`)

**`moveSession()`**
- `getNextPosition('sessions', ...)` sorti du `database.write()`

### useSessionManager.ts (1 correction)

**`addExercise()`**
- `getNextPosition('session_exercises', ...)` sorti du `database.write()`

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit`)
- Tests : ✅ 773 passed, 0 failed
- Nouveau test créé : non (logique identique, seul ordre d'exécution change)

## Documentation mise à jour
aucune (pitfall déjà listé en section 3.1 CLAUDE.md)

## Statut
✅ Résolu — 20260221-0840

## Commit
8302972 fix(hooks): move reads outside database.write() blocks
