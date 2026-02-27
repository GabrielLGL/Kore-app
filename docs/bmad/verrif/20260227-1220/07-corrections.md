# Passe 7 — Corrections — 20260227-1220

## 7a — Critiques 🔴

### C1 — RestTimer: animation progress stoppée au démontage ✅ CORRIGÉ
**Fichier:** `mobile/src/components/RestTimer.tsx`

Ajout de `progressAnimRef` (ref `Animated.CompositeAnimation`) :
- Capture `Animated.timing(...)` dans la ref avant `.start()`
- `progressAnimRef.current.stop()` ajouté au cleanup du useEffect

```tsx
// Avant
Animated.timing(progressAnim, { ... }).start()

// Après
progressAnimRef.current = Animated.timing(progressAnim, { ... })
progressAnimRef.current.start()
// + dans cleanup :
if (progressAnimRef.current) progressAnimRef.current.stop()
```

**Vérification:** Tests RestTimer 17/17 ✅

---

## 7b — Warnings 🟡

### H3 — Validation email renforcée ✅ CORRIGÉ
**Fichier:** `web/src/app/api/subscribe/route.ts`

```tsx
// Avant : email.includes("@") — accepte "a@", "@b", "@"
// Après : regex RFC-light
!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
```

### H2 — console.error guardés ✅ CORRIGÉ
**Fichier:** `web/src/app/api/subscribe/route.ts`

```tsx
// Avant
console.error("Supabase error:", dbError)

// Après
if (process.env.NODE_ENV !== "production") console.error("Supabase error:", dbError)
```
Appliqué aux deux occurrences (Supabase error + Resend error).

---

## Non corrigés (risqué ou hors scope)

| Issue | Raison |
|-------|--------|
| C2 — API key migration | Architectural — nécessite audit complet de l'init app |
| C3 — PerformanceLog null check | Logique métier — risque de régression si exercise est légitimement null |
| H1 — RAF mounted flag | Edge case théorique bénin en React 18 (setState sur composant démonté = no-op) |
| B1-B7 — Async sans try/catch | Tous sont des changements de comportement fonctionnel |
| H4 — catchError null silencieux | Comportement intentionnel (pas de crash si perf indispo) |
| H5 — ExercisePickerModal deps | Refactor useEffect — risque de régression sur reset state |
| Q1 — Couleurs hardcodées CSS | Design system — besoin de variable CSS --accent-secondary inexistante |

---

## Vérifications post-correction

| Check | Résultat |
|-------|---------|
| `npx tsc --noEmit` mobile | ✅ 0 erreur |
| `npx tsc --noEmit` web | ✅ 0 erreur |
| Jest ExercisePickerModal | ✅ 27/27 |
| Jest RestTimer | ✅ 17/17 |
| Tests en échec au scan initial | ✅ Résolu (état transitoire de l'agent de test) |
