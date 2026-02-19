# Code Review — 2026-02-19

## Résultat : 13 problèmes trouvés

---

### 🔴 Critiques

| # | Fichier | Ligne | Problème | Impact |
|---|---------|-------|----------|--------|
| 1 | `screens/SettingsScreen.tsx` | 25–28 | **Local state désynchronisé du prop réactif `user`** : les states `restDuration`, `timerEnabled`, `aiProvider`, `aiApiKey` sont initialisés depuis `user` mais jamais mis à jour si le prop `user` évolue (WatermelonDB peut pousser une nouvelle valeur à tout moment). L'écran affiche des valeurs obsolètes jusqu'au remontage. | L'utilisateur peut sauvegarder en croyant modifier une valeur, alors qu'une mise à jour concurrente a déjà changé le state en base — la valeur en mémoire écrase silencieusement la nouvelle valeur. |
| 2 | `services/ai/aiService.ts` | 87 | **Fetch de TOUS les PerformanceLogs sans filtre ni limite** : `database.get<PerformanceLog>('performance_logs').query().fetch()`. En production, avec des mois d'historique, ce fetch peut charger des dizaines de milliers de lignes en mémoire pour un simple calcul de PR. | Freeze UI, OOM potentiel, latence de génération IA dégradée. |
| 3 | `screens/ChartsScreen.tsx` | 174–180 | **`ObservableExerciseStats` observe `histories` et `sessions` entières** : chaque séance enregistrée (insertion dans `histories` ou `sessions`) déclenche un re-render complet du composant de stats, même si l'exercice sélectionné n'est pas concerné. | Re-renders parasites pendant une séance active, recalcul inutile de `buildExerciseStatsFromData` sur toutes les données. |

---

### 🟡 Warnings

| # | Fichier | Ligne | Problème | Impact |
|---|---------|-------|----------|--------|
| 4 | `screens/AssistantScreen.tsx` | 134 | **`// @ts-ignore` non justifié** : `navigation.getParent()?.navigate('SessionDetail', ...)` échappe au typage TypeScript. Violation directe de la règle « No `any` » du CLAUDE.md. Si la hiérarchie de navigation change, l'erreur sera silencieuse à la compilation et crashera à l'exécution. | Bug runtime invisible à la CI. |
| 5 | `screens/HomeScreen.tsx` | 165–191 | **`renderItem` : `useCallback` neutralisé par des inline functions et une dépendance `haptics` instable** : (a) les handlers `onAddSession`, `onOptionsPress`, `onSessionOptionsPress` sont créés inline à chaque appel de `renderItem` — `ProgramSection` reçoit de nouvelles références à chaque render. (b) `haptics` est un objet recréé par `useHaptics()` à chaque render du parent, ce qui invalide le cache `useCallback` à chaque render. | `ProgramSection` re-rende inutilement sur chaque changement d'état du parent (ouverture de modale, etc.), incluant la liste complète de programmes. |
| 6 | `screens/SessionDetailScreen.tsx` | 72–84 | **Rechargement de la liste d'exercices à chaque toggle de modale** : le `useEffect` se déclenche quand `isAddModalVisible` change — soit à l'ouverture ET à la fermeture. Les exercices sont refetchés inutilement à la fermeture de la modale. | Double fetch réseau/DB à chaque interaction avec la modale d'ajout d'exercice. |
| 7 | `screens/ChartsScreen.tsx` | 58 | **`chartStats` non mémorisé invalide le `useMemo` de `chartData`** : `const chartStats = statsForSelectedExo.slice(-15)` crée un nouveau tableau à chaque render (`.slice()` retourne toujours une nouvelle référence). Le `useMemo` de `chartData` dépend de `chartStats` et se recalcule donc à chaque render, même si les données n'ont pas changé. | `useMemo` inopérant sur `chartData` — recalcul et re-render du graphique à chaque render. |
| 8 | `screens/AssistantScreen.tsx` | 327–342 | **Architecture mixte `withObservables` + subscribe manuel pour `user`** : `programs` est injecté via `withObservables` (pattern projet), mais `user` est récupéré via un `useEffect` + `subscribe()` manuel dans le composant wrapper. Incohérence de pattern, et si on oublie d'unsubscribe dans un futur refactor, memory leak garanti. | Incohérence architecturale, risque de memory leak. |
| 9 | `screens/WorkoutScreen.tsx` | 99, 108 | **`console.error` en production sans guard `__DEV__`** : deux appels `console.error` non protégés. Violation explicite des règles CLAUDE.md. Les erreurs ne sont pas non plus routées vers Sentry. | Pollution logs prod, erreurs DB swallowées silencieusement en prod. |

---

### 🔵 Suggestions

| # | Fichier | Ligne | Problème | Suggestion |
|---|---------|-------|----------|------------|
| 10 | `model/models/Program.ts` | 17–57 | **`duplicate()` : N+1 `create()` au lieu de `batch`** : la méthode crée le Programme, puis chaque Session, puis chaque SessionExercise via des `await db.get(...).create()` individuels dans une même transaction. Avec un programme de 4 séances × 6 exercices = 25 `create()` séquentiels. | Refactoriser avec `prepareCreate` + `database.batch()`, comme le fait déjà `importPresetProgram` dans `databaseHelpers.ts`. |
| 11 | `components/ProgramSection.tsx` | 19–22 | **`sessions` dans l'interface `Props` est trompeur** : la prop est déclarée dans l'interface ET injectée par `withObservables`. Le parent passe `sessions={[]}` (valeur vide immédiatement écrasée par le HOC). La prop `sessions` dans l'interface donne l'impression qu'elle est contrôlée par le parent, ce qui est faux. | Supprimer `sessions` de l'interface `Props` interne. Utiliser un type partiel `Omit<Props, 'sessions'>` pour les props externalisées. |
| 12 | `components/AssistantPreviewSheet.tsx` | 68–79 | **Index de tableau utilisés comme `key` React** : `key={si}` pour les sessions, `key={ei}` pour les exercices. Si le plan généré est modifié et re-rendu (via le bouton "Modifier"), React peut mal réconcilier les éléments. | Utiliser `session.name` ou une combinaison stable comme clé (`key={${session.name}-${si}}`). |
| 13 | `services/ai/aiService.ts` | 26, 87 | **Clé API stockée en clair dans WatermelonDB (SQLite)** : `user.aiApiKey` est une colonne texte en base non chiffrée. Sur Android, la base SQLite est accessible après root/backup ADB. La clé est aussi construite directement dans les headers HTTP sans masquage. | Stocker la clé via `expo-secure-store` (Keychain iOS / Keystore Android). WatermelonDB ne chiffre pas le contenu à moins d'utiliser SQLCipher. |

---

## Récapitulatif par catégorie

| Catégorie | Nb |
|-----------|----|
| Performance (re-renders, fetch non filtrés) | 5 |
| Sécurité (clé API en clair, state obsolète) | 2 |
| TypeScript / Qualité du code | 3 |
| Architecture / Pattern violations | 2 |
| Maintenance / Lisibilité | 1 |

## Fichiers les plus problématiques

1. `screens/AssistantScreen.tsx` — 2 issues (🟡 + 🔵)
2. `screens/HomeScreen.tsx` — 1 issue critique sur renderItem
3. `screens/ChartsScreen.tsx` — 2 issues (🔴 + 🟡)
4. `services/ai/aiService.ts` — 2 issues (🔴 + 🔵)
5. `screens/SettingsScreen.tsx` — 1 issue 🔴
