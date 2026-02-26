# Passe 7 — Corrections — 20260226-0938

## 7a — Critiques 🔴
**0 critique réel confirmé.**

Les 3 bugs "critiques" signalés par le scanner étaient des faux positifs :
- `response` undefined dans gemini/openaiProvider → faux positif TypeScript (control flow correct)
- `ai_api_key` SQLite → déjà géré par `secureKeyStore.migrateKeyFromDB()`

Aucune correction 7a nécessaire.

---

## 7b — Warnings 🟡 — 1 correction appliquée

### ✅ handleSkipOnboarding — try/catch ajouté
**Fichier:** `src/screens/ProgramsScreen.tsx:143-150`

**Avant:**
```tsx
const handleSkipOnboarding = async () => {
  await markOnboardingCompleted()
  setIsOnboardingVisible(false)
}
```

**Après:**
```tsx
const handleSkipOnboarding = async () => {
  try {
    await markOnboardingCompleted()
    setIsOnboardingVisible(false)
  } catch (error) {
    if (__DEV__) console.error('[ProgramsScreen] handleSkipOnboarding:', error)
    setIsOnboardingVisible(false)
  }
}
```

**Raison:** Cohérence avec `handleProgramSelected` (même pattern), robustesse si database.write() échoue.

---

## 7c — Suggestions 🔵
**Non appliquées — travaux d'architecture futurs:**

1. **databaseHelpers.ts** (863 lignes) → split en modules spécialisés
   - Risque: 1336 lignes de tests à mettre à jour
   - Recommandation: `/do` dédié

2. **statsHelpers.ts** (602 lignes) → split en durationStats/volumeStats/repartitionStats
   - Risque: nombreux imports à mettre à jour
   - Recommandation: `/do` dédié

3. **Magic numbers** (timing, elevation) → constants dans theme
   - Faible urgence, travail cosmétique

---

## Vérification post-correction

- `npx tsc --noEmit` : ✅ 0 erreur
- `npx jest ProgramsScreen` : ✅ 26/26 tests passés
