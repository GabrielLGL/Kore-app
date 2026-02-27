# Passe 3 — Code Review — 20260227-1220

## 10 problèmes trouvés (3🔴 5🟡 2🔵)

### 🔴 CRITIQUES

#### C1 — RestTimer: animation non stoppée au démontage
**Fichier:** `mobile/src/components/RestTimer.tsx:84`
`Animated.timing(progressAnim, { toValue: 0, duration: duration * 1000 }).start()` jamais stoppé.
Si le composant est démonté avant la fin, l'animation continue de consumer des ressources.
**Fix:** Capturer le résultat dans un ref et `.stop()` dans le cleanup.

#### C2 — API Key encore dans le schéma SQLite
**Fichier:** `mobile/src/model/schema.ts:79`
La colonne `ai_api_key` est toujours dans le schéma users (v25).
`migrateKeyFromDB()` existe dans `secureKeyStore.ts` mais on ne sait pas si elle est appelée au démarrage.
**Fix:** Vérifier que `migrateKeyFromDB()` est bien appelée à l'init de l'app.

#### C3 — PerformanceLog créé sans null check de l'exercice
**Fichier:** `mobile/src/hooks/useSessionManager.ts:96-101`
`log.exercise.set(exercise)` est appelé sans vérifier que `exercise` n'est pas null avant.
**Fix:** Ajouter `if (!exercise) return false` avant la création du log.

### 🟡 HAUTS

#### H1 — HeroSection: raf2 peut firer après démontage
**Fichier:** `web/src/components/sections/HeroSection.tsx:40-42`
Le double RAF (`raf1 → raf2`) est annulé dans cleanup, mais si le composant est
démonté entre raf1 et raf2, raf2Ref n'est pas encore assigné au moment du cancel.
**Fix:** Ajouter un flag `mounted` dans le useEffect.

#### H2 — console.error en production (route web)
**Fichier:** `web/src/app/api/subscribe/route.ts:51,68`
Logs non gardés par `process.env.NODE_ENV`.

#### H3 — Validation email trop permissive
**Fichier:** `web/src/app/api/subscribe/route.ts:31`
`email.includes("@")` accepte `"@"`, `"a@"`, `"@b"`. Utiliser un regex.

#### H4 — WorkoutExerciseCard: catchError retourne null silencieusement
**Fichier:** `mobile/src/components/WorkoutExerciseCard.tsx:337-347`
Le pipeline RxJS `catchError` retourne `of(null)`, l'erreur est avalée sans log.

#### H5 — ExercisePickerModal: useEffect deps trop larges
**Fichier:** `mobile/src/components/ExercisePickerModal.tsx:77-87`
Le reset s'exécute aussi quand `initialSets/Reps/Weight` changent (pas seulement à la fermeture).

### 🔵 SUGGESTIONS

#### S1 — TypeScript: types implicites dans useSessionManager
**Fichier:** `mobile/src/hooks/useSessionManager.ts:96-101`
Typage plus explicite sur les mutations PerformanceLog.

#### S2 — Email validation: double logique client+serveur
**Fichier:** `web/src/app/page.tsx` + `route.ts`
Validation côté client basique (`required` HTML), côté serveur minimal.
Envisager une lib de validation partagée.
