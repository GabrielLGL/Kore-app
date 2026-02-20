# Passe 3/8 — Code Review Adversarial — 20260220-2303

## Problèmes identifiés

### 🟡 WARNING #1 — HomeScreen drag-drop : pas de feedback en cas d'erreur
**Fichier:** `mobile/src/screens/HomeScreen.tsx:212-214`

```tsx
} catch (error) {
  if (__DEV__) console.error('[HomeScreen] Drag-and-drop batch update failed:', error)
}
```

Si le `database.write()` échoue lors du réordonnement, l'utilisateur voit l'ordre nouveau dans l'UI mais la base n'est pas mise à jour. Au redémarrage, l'ancien ordre est restauré sans explication. Aucun feedback utilisateur en production.

**Fix:** Ajouter `Alert.alert(...)` dans le catch block.

---

### 🟡 WARNING #2 — AssistantScreen : closure sur formData + currentStep
**Fichier:** `mobile/src/screens/AssistantScreen.tsx:246-266`

`handleSelect` capture `formData` dans sa closure. Le pattern est acceptable car `formData` est dans le dep array et React's batched updates garantissent que les clics successifs lisent la valeur fraîche. **FALSE POSITIVE** — le dep array est correct.

**Verdict:** Acceptable, pas de correction nécessaire.

---

### 🔵 SUGGESTION #3 — HomeScreen onboarding : si markOnboardingCompleted() échoue après importPresetProgram()
**Fichier:** `mobile/src/screens/HomeScreen.tsx:125-135`

Si `importPresetProgram` réussit mais `markOnboardingCompleted` échoue :
- Le programme est importé
- L'onboarding ne sera pas marqué comme complété
- Le modal se ferme quand même (`setIsOnboardingVisible(false)` n'est pas atteint) — la modal reste ouverte, bonne sécurité
- Risque: double import si l'utilisateur réessaie

**Verdict:** Risque faible. markOnboardingCompleted() est une simple écriture WDB. Ne pas corriger (risque de sur-ingénierie).

---

### 🟡 WARNING #4 — API key Gemini dans les headers HTTP
**Fichier:** `mobile/src/services/ai/geminiProvider.ts:21`

```tsx
'X-Goog-Api-Key': apiKey,
```

Exposé dans les headers réseau. Pattern standard pour apps mobiles utilisant l'API Gemini directement côté client. L'utilisateur entre sa propre clé API (cf Settings). Ce n'est pas une clé hardcodée appartenant à l'app. **Acceptable** dans ce contexte.

**Verdict:** Design intentionnel (clé utilisateur). Pas de correction.

---

### ✅ Points positifs
- Aucun `console.log`/`warn`/`error` sans garde `__DEV__` ✅
- Aucune couleur hardcodée — tout utilise `colors.*` ✅
- Aucun `any` TypeScript ✅
- Aucun `TODO`/`FIXME`/`@ts-ignore` ✅
- Pattern Portal correctement utilisé (pas de native Modal) ✅
- Mutations WatermelonDB toutes dans `database.write()` ✅
- useHaptics() correctement utilisé ✅
- Validation via helpers centralisés ✅

## Score : 1 problème réel à corriger (🟡 #1)
