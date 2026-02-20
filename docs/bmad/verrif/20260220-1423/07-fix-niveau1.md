# Fix Niveau 1 — Critiques — 2026-02-20

**Run :** 20260220-1423
**Exécuté le :** 2026-02-20
**Basé sur :** rapports 01-build.md, 02-tests.md, 04-bugs-silencieux.md, 05-watermelondb.md (racine verrif/)

---

## Résumé

| # | Fichier | Problème | Statut |
|---|---------|----------|--------|
| 1 | `components/__tests__/WorkoutSummarySheet.test.tsx` | 12 tests en échec — désynchronisation suite au redesign du composant | ✅ Corrigé |
| 2 | `components/RestTimer.tsx` | `.then()` sans `.catch()` → rejet silencieux + fuite notification | ✅ Corrigé |
| 3 | `screens/HomeScreen.tsx` | `handleSkipOnboarding` async sans try/catch → onboarding bloqué indéfiniment | ✅ Corrigé |

**TypeScript après corrections :** `npx tsc --noEmit` → exit 0, aucune erreur. ✅

---

## Détail des corrections

### ✅ 1 — WorkoutSummarySheet.test.tsx — 12 tests resynchronisés

**Fichier :** `mobile/src/components/__tests__/WorkoutSummarySheet.test.tsx`

**Cause :** Le composant `WorkoutSummarySheet.tsx` a été redesigné (commit `ed74808`) sans mise à jour des tests. Trois désynchronisations :

| Désynchronisation | Ancienne attente (test) | Nouvelle réalité (composant) | Correction |
|---|---|---|---|
| Stats avec emoji | `getByText('61:01')` | `StatBlock` rend `"{emoji} {value}"` dans un seul `<Text>` → `"⏱ 61:01"` | Regex `getByText(/61:01/)` |
| Bouton fermeture | `getByText('Fermer')` | `<Button>Terminer</Button>` | `getByText('Terminer')` |
| Placeholder note | `getByPlaceholderText('Ajouter une note (optionnel)...')` | `placeholder="Ressenti, conditions, progrès..."` | `getByPlaceholderText('Ressenti, conditions, progrès...')` |

**Changements appliqués :**
- `getByText('61:01')` → `getByText(/61:01/)` (durée formatée)
- `getByText('00:00')` → `getByText(/00:00/)` (durée zéro)
- `getByText('2500.5 kg')` → `getByText(/2500\.5 kg/)` (volume)
- `getByText('12 validées')` → `getByText(/12 validées/)` (séries)
- `getByText('3 PR')` → `getByText(/3 PR/)` (records)
- `getByText('Fermer')` → `getByText('Terminer')` (3 occurrences : describe + press tests)
- Description du test `'affiche le bouton Fermer'` → `'affiche le bouton Terminer'`
- Description `'appelle onClose quand le bouton Fermer est pressé'` → `'appelle onClose quand le bouton Terminer est pressé'`
- `getByPlaceholderText('Ajouter une note (optionnel)...')` → `getByPlaceholderText('Ressenti, conditions, progrès...')` (6 occurrences)

**Comportement fonctionnel :** inchangé. Seuls les sélecteurs de test sont mis à jour pour refléter l'UI actuelle.

---

### ✅ 2 — RestTimer.tsx — `.catch()` ajouté sur la promesse de notification

**Fichier :** `mobile/src/components/RestTimer.tsx` — ligne 34

**Avant :**
```typescript
scheduleRestEndNotification(duration).then(id => {
  notificationIdRef.current = id
})
// Pas de .catch() → rejet silencieux
```

**Après :**
```typescript
scheduleRestEndNotification(duration)
  .then(id => { notificationIdRef.current = id })
  .catch(e => { if (__DEV__) console.error('[RestTimer] scheduleRestEndNotification:', e) })
```

**Impact corrigé :** Si les permissions de notification ne sont pas accordées ou si le module est indisponible, l'erreur est maintenant capturée. Sans ce catch, `notificationIdRef.current` restait `null`, rendant le cleanup `cancelNotification` inatteignable → fuite potentielle de notification planifiée.

---

### ✅ 3 — HomeScreen.tsx — `handleSkipOnboarding` protégé par try/catch/finally

**Fichier :** `mobile/src/screens/HomeScreen.tsx` — ligne 137

**Avant :**
```typescript
const handleSkipOnboarding = async () => {
  await markOnboardingCompleted()
  setIsOnboardingVisible(false)
}
```

**Après :**
```typescript
const handleSkipOnboarding = async () => {
  try {
    await markOnboardingCompleted()
  } catch (e) {
    if (__DEV__) console.error('[HomeScreen] markOnboardingCompleted:', e)
  } finally {
    setIsOnboardingVisible(false)
  }
}
```

**Impact corrigé :** En cas d'échec DB, `setIsOnboardingVisible(false)` est garanti d'être appelé via `finally`. Sans ce fix, un échec laissait l'onboarding affiché indéfiniment + unhandled promise rejection en production.

---

## Ce qui n'a PAS été corrigé (niveau warnings — hors scope niveau 1)

| Fichier | Problème | Raison de non-correction |
|---------|----------|--------------------------|
| `hooks/useProgramManager.ts` (7 occurences) | `console.error` sans `__DEV__` | Warning niveau 2, pas critique |
| `hooks/useSessionManager.ts` (4 occurrences) | `console.error` sans `__DEV__` | Warning niveau 2, pas critique |
| `screens/ChartsScreen.tsx:89` | Catch vide silencieux | Warning niveau 2, pas critique |
| `model/utils/databaseHelpers.ts:304` | Promise.all race condition | Warning niveau 2, risque faible en pratique |

---

## Vérification post-correction

- **TypeScript :** `npx tsc --noEmit` → exit 0 ✅
- **Comportement fonctionnel :** aucun changement de logique métier ✅
- **Known Pitfalls CLAUDE.md §3.1 :** aucune violation introduite ✅
