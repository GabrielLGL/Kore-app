# WEGOGYM — Contexte projet pour brainstorming

> Fichier à passer comme `context_file` au workflow BMAD brainstorming.
> Mis à jour : 2026-02-21

---

## Qu'est-ce que WEGOGYM ?

Application mobile de **suivi de musculation offline-first**. L'utilisateur crée des programmes d'entraînement, suit ses séances en temps réel, consulte son historique de performances et reçoit des recommandations générées par IA (locale ou API). L'app fonctionne sans connexion internet.

---

## Stack technique (contraintes absolues)

| Couche | Technologie |
|--------|-------------|
| Runtime | React Native **Expo 52** + TypeScript + **Fabric (New Arch)** |
| Base de données | **WatermelonDB** (SQLite/JSI) — schéma v16 |
| Navigation | **React Navigation 7** — Native Stack + Bottom Tabs |
| State management | **Aucun Redux/Context** pour les données — uniquement `withObservables` |
| Plateforme cible | **Android priority** |
| Thème | **Dark Mode uniquement** (`#121212` bg, `#1C1C1E` cards) |
| Langue UI | **Français (fr-FR)** |

---

## Fonctionnalités existantes (ne pas dupliquer)

### Core — Programmes & Séances
- **Programmes** : création, édition, duplication — modèle `Program` (1:N) `Session` (1:N) `SessionExercise`
- **Séances d'entraînement** : sélection exercices, saisie séries/reps/poids, validation en temps réel
- **Validation des sets** : keyboardType numeric, `validateWorkoutInput()`, détection PR
- **Résumé de fin de séance** : durée, volume total, PRs, note — BottomSheet animé
- **Dernière performance** : affichage "Dernière fois : 3x10 @ 80 kg — il y a 3 jours" sous chaque exercice

### Historique & Performance
- **Historique** (`History`) : soft-delete via `deleted_at`, lié à `Set` (séries individuelles)
- **PerformanceLog** : données historiques par exercice (non utilisé en Sprint 1, réservé analytics)
- **Charts** : graphiques de progression migrés sur la table `sets` (WEGO-007)

### Exercices
- **Bibliothèque d'exercices** : filtres muscle/équipement (`ChipSelector`), recherche par nom
- **Métadonnées exercices** : `sfr` (Stimulus/Fatigue Ratio), `injury_risk`, `stretch_focus`
- **Derniers sets** : helper `getLastNSetsForExercise()` — pré-remplissage des poids
- **Redesign carte workout** : header stats, poids précédents affichés (exercice-list-redesign)

### Minuteur & Notifications
- **Timer de repos** : `start_time`, `end_time` sur History — chrono actif pendant séance
- **Notifications push** : expo-notifications — alerte fin de repos en background (WEGO-005)

### Onboarding
- **Programmes prédéfinis** : BottomSheet au premier lancement — PPL, Full Body, Push Pull (WEGO-006)
- **User preferences** : table `User` (single row) — `onboarding_completed`, `ai_provider`, `ai_api_key`

### Assistant IA
- **Moteur offline** (`offlineEngine`) : algorithme local — génère des plans personnalisés sans API
- **Providers API** : Gemini (`gemini-2.0-flash`, v1beta), Claude — configurables dans Réglages IA
- **Wizard de génération** : questions sur objectifs, niveau, équipement, fréquence, focus musculaire
- **AssistantScreen** : interface chat, historique des suggestions, badge provider
- **Suppression chat** : `AlertDialog` de confirmation, soft-delete
- **Preview enrichie** : BottomSheet détaillé avant validation d'un plan généré
- **Bouton recommencer** : régénération d'un programme depuis le résumé

---

## Schéma base de données (v16)

Tables principales :
- `programs` — `name`, `description`, `position`
- `sessions` — `name`, `position`, liée à `program_id`
- `session_exercises` — `position`, `sets`, `reps`, `weight_target`, liée à `session_id` + `exercise_id`
- `histories` — `start_time`, `end_time`, `note`, `deleted_at`, liée à `session_id`
- `sets` — `reps`, `weight`, `position`, liée à `history_id` + `exercise_id`
- `exercises` — `name`, `muscles`, `equipment`, `sfr`, `injury_risk`, `stretch_focus`
- `performance_logs` — `exercise_id`, données historiques de performance
- `users` — `onboarding_completed`, `ai_provider`, `ai_api_key` (single row)
- `ai_suggestions` — plans générés par l'IA, liés à l'historique de chat

---

## Personas utilisateurs

| Persona | Profil | Besoins |
|---------|--------|---------|
| **Débutant** | Commence la musculation, peu de connaissances | Guidage, programmes clés-en-main, explications |
| **Intermédiaire** | Pratique régulière (6-24 mois) | Progression visible, comparaison de perfs, suggestions |
| **Avancé** | Compétiteur ou coach | Contrôle granulaire, analytics détaillées, personnalisation totale |
| **Contexte commun** | 18-45 ans, seul en salle ou domicile, offline possible | — |

---

## Composants et patterns réutilisables

### Composants UI disponibles (`components/`)
- `AlertDialog` — confirmation destructive (fade/scale animation)
- `BottomSheet` — modal slide-up (Portal pattern)
- `Button` — variantes `primary | danger | secondary | ghost`, tailles `sm | md | lg`
- `ChipSelector` — filtres horizontaux scrollables

### Hooks disponibles (`hooks/`)
- `useModalState()` — gestion état modal + sync tab bar auto
- `useMultiModalSync(states)` — sync plusieurs modals avec tab bar
- `useHaptics()` — feedback haptique sémantique (`onPress`, `onDelete`, `onSuccess`, `onSelect`)
- `useKeyboardAnimation(offset)` — animation keyboard show/hide

### Helpers DB (`model/utils/`)
- `databaseHelpers.ts` : `getNextPosition()`, `parseNumericInput()`, `filterExercises()`, `searchExercises()`, `buildExerciseStatsFromData()`
- `validationHelpers.ts` : `isValidText()`, `validateWorkoutInput()`, `validateExerciseInput()`

---

## Contraintes à respecter dans les idées

**Obligatoire :**
- Pas de native `<Modal>` → crashes Fabric → utiliser `Portal` + `AlertDialog`/`BottomSheet`
- Toutes les mutations DB dans `database.write()` ou `database.batch()`
- Données réactives via `withObservables` HOC uniquement
- Pas de `console.log` sans `__DEV__`
- Pas de `any` TypeScript
- Pas de couleurs hardcodées → `colors.*` de `theme/index.ts`
- `AbortSignal.timeout()` inexistant sur Hermes → utiliser `withTimeout(ms)` de `providerUtils.ts`

**Gemini API :**
- Modèle stable : `gemini-2.0-flash` (v1beta)
- Free tier EU/UK/CH a `limit: 0` → billing Google Cloud requis

---

## Questions guide pour le brainstorming WEGOGYM

1. **Valeur utilisateur** : Comment cette idée améliore-t-elle concrètement l'expérience d'entraînement ?
2. **Offline-first** : L'utilisateur peut-il s'en servir sans connexion internet ?
3. **Données** : Quelles tables WatermelonDB sont impliquées ? Faut-il migrer le schéma ?
4. **UI cohérente** : Est-ce compatible Dark Mode, fr-FR, et les composants existants ?
5. **Valeur différentielle** : Qu'est-ce que cette feature apporte par rapport à ce qui existe déjà ?
6. **Persona** : Pour quel persona cette feature est-elle prioritaire ?
7. **Complexité** : Peut-on livrer un MVP utile sans sur-ingénierie ?
