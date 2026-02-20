# Fix Niveau 1 — Critiques — 20260220-2010

**Date :** 2026-02-20
**Opérateur :** Claude Sonnet 4.6
**Périmètre :** Corrections de niveau CRITIQUE uniquement

---

## Critères d'intervention (définition stricte)

| Catégorie | Description |
|-----------|-------------|
| TypeScript | Erreurs de compilation (`npx tsc --noEmit`) |
| Tests | Tests en échec (`npm test`) |
| Bugs silencieux | Mutations hors `database.write()`, fuites mémoire (setTimeout/subscribe sans cleanup), async sans catch |
| WatermelonDB | Incohérences schéma ↔ modèles (champ présent d'un côté, absent de l'autre) |

---

## Résultat : ✅ 0 correction effectuée

**Aucun bug critique confirmé dans les 4 catégories.**
Tous les "critiques" des rapports sont soit des faux positifs, soit hors périmètre Niveau 1.

---

## Analyse de chaque problème "Critique" des rapports

### [bugs-2026] 🔴 databaseHelpers.ts ~314 — `mostRecent.id` sans null check

**Claim :** `histories.sort()[0]` retourne `undefined` sur tableau vide → crash runtime.

**Contre-analyse :**
```
L297 : if (sets.length === 0) return null          ← guard
L301 : historyIdSet = new Set(sets.map(s => s.history.id))  ← size >= 1
L302 : historyIds = Array.from(historyIdSet)        ← length >= 1
L304-306 : histories = await Promise.all(historyIds.map(id => find(id)))
           → length >= 1 (find() throws si non trouvé, ne retourne PAS null)
L309 : histories.sort(...)[0]                       ← jamais undefined
```

WatermelonDB `Collection.find(id)` retourne `Promise<Model>` et **throw** si l'enregistrement n'existe pas — il ne retourne pas `null`. Tant que le guard L297 est en place (il l'est), `histories[0]` est toujours un objet `History` valide.

**Verdict : FAUX POSITIF** — corroboré par bugs-20260220-2014.md qui avait déjà statué "safe" avec le même raisonnement.
**Action : Aucune**

---

### [code-review-2023] 🔴 useProgramManager.ts (×7) + useSessionManager.ts (×4) — console.error sans __DEV__

**Claim :** 11 instances de `console.error(...)` sans guard `if (__DEV__)` → fuite de stack traces en production.

**Catégorie réelle :** Violation CLAUDE.md §3.1 (best practice de logging) — **pas un bug silencieux**.

- Pas une erreur TypeScript ✅
- Pas un test qui fail ✅
- Pas une mutation hors write ✅
- Pas une fuite mémoire ✅
- Pas un async sans catch (les fonctions ont toutes un try/catch interne) ✅
- Pas une incohérence WatermelonDB ✅

Note : `Program.duplicate()` vérifié — il contient son propre `db.write()` interne (Program.ts L21). La fonction est appelée sans write extérieur dans `useProgramManager.ts` — correct.

**Verdict : Hors périmètre Niveau 1** — à traiter en Niveau 2 (qualité).
**Action : Aucune**

---

### [code-review-2023] 🔴 WorkoutExerciseCard.tsx (×2) + RestTimer.tsx (×1) — couleurs hardcodées

**Claim :** `rgba(52,199,89,0.12)`, `rgba(0,122,255,0.15)`, `rgba(255,255,255,0.08)` — violation CLAUDE.md §3.1 "No hardcoded colors".

**Catégorie réelle :** Violation de convention de style — **pas un bug silencieux, pas une erreur de build**.

**Verdict : Hors périmètre Niveau 1** — à traiter en Niveau 2.
**Action : Aucune**

---

### [bugs-2026] 🟡 WorkoutSummarySheet.tsx — updateHistoryNote() dans debounce

**Claim :** Appel non-awaited → erreurs silencieusement ignorées en production.

**Contre-analyse :** Le code réel est :
```typescript
updateHistoryNote(historyId, text)
  .catch(e => { if (__DEV__) console.error('[WorkoutSummarySheet] ...', e) })
```
Il y a un `.catch()` — ce n'est **pas** un "async sans catch". L'erreur est capturée. Seul le logging en production est muet (best practice).

**Verdict : Warning, non critique. Gestion d'erreur déjà en place.**
**Action : Aucune**

---

### [bugs-2026] 🟡 RestTimer.tsx — scheduleRestEndNotification

**Claim :** `catch()` log uniquement en `__DEV__`, erreur silencieuse en production.

**Contre-analyse :**
```typescript
scheduleRestEndNotification(duration)
  .then(id => { notificationIdRef.current = id })
  .catch(e => { if (__DEV__) console.warn('[RestTimer] ...', e) })
```
Il y a un `.catch()`. Pas un "async sans catch". La notification est best-effort par nature.

**Verdict : Warning, non critique.**
**Action : Aucune**

---

### [bugs-2014] 🟡 geminiProvider.ts — return sans await sur async (×2)

**Claim :** `return throwGeminiError(response)` devrait être `return await throwGeminiError(response)` — stack trace moins lisible.

**Catégorie réelle :** Cosmétique/style. Fonctionnellement correct, la rejection se propage normalement.

**Verdict : Warning cosmétique, non critique.**
**Action : Aucune**

---

### [bugs-2014] 🟡 HomeScreen.tsx — deleteProgram/deleteSession dans onConfirm sans try/catch

**Claim :** `onConfirm: async () => { await deleteProgram() }` — unhandled rejection si throw.

**Contre-analyse :** `deleteProgram()` (useProgramManager.ts L113-127) et `deleteSession()` (L217-230) ont leur propre try/catch interne — elles retournent `false` en cas d'erreur, **elles ne throw jamais**. Le callback `onConfirm` ne peut pas recevoir de rejection.

**Verdict : FAUX POSITIF** — la gestion d'erreur est dans les hooks.
**Action : Aucune**

---

### [db-2035] ⚠️ Session.position!: number vs schéma isOptional: true

**Claim :** Décorateur `position!: number` (non-null) mais schéma `isOptional: true`.

**Catégorie réelle :** Imprecision TypeScript mineure. Non bloquant runtime (WatermelonDB lit directement SQLite). `Program` gère correctement avec `position?: number`.

**Verdict : Warning mineur, non critique.**
**Action : Aucune** (risque de régression si touché sans tests complets)

---

## Tableau récapitulatif

| # | Source | Problème | Catégorie réelle | Verdict | Action |
|---|--------|----------|-----------------|---------|--------|
| 1 | bugs-2026 🔴 | databaseHelpers.ts mostRecent.id | Faux positif | ✅ Safe | Aucune |
| 2 | code-review-2023 🔴 | console.error sans __DEV__ ×11 | Qualité/Convention | Hors N1 | Aucune |
| 3 | code-review-2023 🔴 | Couleurs hardcodées ×3 | Style/Convention | Hors N1 | Aucune |
| 4 | bugs-2026 🟡 | WorkoutSummarySheet debounce | .catch() présent | ✅ Safe | Aucune |
| 5 | bugs-2026 🟡 | RestTimer notification | .catch() présent | ✅ Safe | Aucune |
| 6 | bugs-2014 🟡 | geminiProvider return sans await | Cosmétique | Warning | Aucune |
| 7 | bugs-2014 🟡 | HomeScreen delete sans try/catch | Faux positif | ✅ Safe | Aucune |
| 8 | db-2035 ⚠️ | Session.position! vs optional | TypeScript mineur | Non bloquant | Aucune |

---

## Bilan des 4 catégories critiques

| Catégorie | Statut |
|-----------|--------|
| Erreurs TypeScript build | ✅ Aucune (SCAN-1 OK) |
| Tests en échec | ✅ Aucun (664/664 passants) |
| Mutations hors write | ✅ Aucune (36 mutations vérifiées, Program.duplicate() a son write interne) |
| Fuites mémoire | ✅ Aucune (5 setTimeout/setInterval avec cleanup, pas de subscribe manuel) |
| Async sans catch | ✅ Aucun (tous les async ont try/catch ou .catch()) |
| Incohérences WatermelonDB | ✅ Aucune critique (2 warnings mineurs non bloquants) |

---

## Fichiers modifiés

**Aucun fichier modifié.**

---

## Prochaines étapes (Niveau 2)

Les problèmes hors périmètre Niveau 1 à traiter en Niveau 2 :

```
→ console.error sans __DEV__ (×11) — useProgramManager.ts + useSessionManager.ts
→ Couleurs hardcodées (×3) — WorkoutExerciseCard.tsx + RestTimer.tsx
→ Session.position! → position? (alignement TypeScript WatermelonDB)
→ return await throwGeminiError() — geminiProvider.ts (×2)
```
