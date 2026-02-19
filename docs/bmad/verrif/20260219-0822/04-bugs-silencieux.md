# Bugs silencieux — 2026-02-19 (run 0822)

## Résumé : 🔴 0 critiques / 🟡 2 warnings

---

### Critiques
Aucun.

---

### Warnings

| Fichier | Ligne | Type | Description |
|---------|-------|------|-------------|
| `screens/WorkoutScreen.tsx` | 136, 145 | `.catch(console.error)` non gardé | `completeWorkoutHistory(...).catch(console.error)` — en production, les rejets sont loggués dans la console prod sans `__DEV__`. Pas de vrai swallow (l'erreur est loggée) mais violation des règles projet. |
| `components/WorkoutSummarySheet.tsx` | 58, 66 | `.catch(console.error)` non gardé | `updateHistoryNote(...).catch(console.error)` — même pattern. Les débounce/flush de la note de séance loguent en prod si la DB échoue. |

---

### Scans supplémentaires

**Subscriptions WatermelonDB** — Tous les `withObservables` gèrent leur cycle via le HOC. Aucun `.observe()` manuel non nettoyé trouvé.

**Mutations hors `database.write()`** — Aucune mutation orpheline détectée. Tous les `create()`, `update()`, `batch()`, `prepareDestroyPermanently()` sont bien à l'intérieur de `database.write()`.

**setTimeout/setInterval sans cleanup** — Tous les timers dans `RestTimer.tsx`, `navigation/index.tsx`, `WorkoutSummarySheet.tsx` ont leur cleanup dans les `useEffect` return.

**Accès array/null non sécurisés** — Aucun nouveau `plan.sessions[0]` non gardé trouvé (corrigé au run précédent).

**Division par zéro** — `databaseHelpers.ts` : guard `if (recentSets.length === 0) return null` en place (corrigé au run précédent).
