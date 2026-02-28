# Passe 5 — WatermelonDB
> Run : 20260228-1911

## Schéma version : 26

## Vérification par modèle

| Modèle | Fichier | @fields | Colonnes schema | Problèmes |
|--------|---------|---------|-----------------|-----------|
| User | User.ts | 23 | 23 | ✅ |
| Program | Program.ts | 4 | 6 | ✅ |
| Session | Session.ts | 3 | 6 | ⚠️ @field → @text pour string |
| SessionExercise | SessionExercise.ts | 5 | 9 | ✅ |
| Exercise | Exercise.ts | 7 | 9 | ✅ |
| PerformanceLog | PerformanceLog.ts | 3 | 5 | ✅ |
| History | History.ts | 4 | 7 | ✅ |
| Set | Set.ts | 4 | 8 | ✅ |
| BodyMeasurement | BodyMeasurement.ts | 6 | 8 | ✅ |
| UserBadge | UserBadge.ts | 2 | 4 | ⚠️ @field → @text pour string |

## Problèmes trouvés

| # | Modèle | Champ | Problème | Sévérité |
|---|--------|-------|----------|----------|
| 1 | `Session` | `name` | `@field('name') name!: string` — devrait être `@text('name')` pour les strings | 🟡 |
| 2 | `UserBadge` | `badge_id` | `@field('badge_id') badgeId!: string` — devrait être `@text('badge_id')` pour les strings | 🟡 |
| 3 | `BodyMeasurement` | `date` | Propriété nommée `date` mais stocke un `number` (timestamp) — source de confusion | 🔵 |

**Note :** `@field` fonctionne techniquement pour les strings en WatermelonDB, mais `@text` est le décorateur sémantiquement correct et recommandé par la lib. Sévérité modérée, pas de crash.

## Relations (Foreign Keys)

| Relation | FK Colonne | Schéma | Status |
|----------|-----------|--------|--------|
| Program → Session | program_id | ✅ | ✅ |
| Session → History | session_id | ✅ | ✅ |
| Session → SessionExercise | session_id | ✅ | ✅ |
| SessionExercise → Exercise | exercise_id | ✅ | ✅ |
| Exercise → PerformanceLog | exercise_id | ✅ | ✅ |
| Exercise → Set | exercise_id | ✅ | ✅ |
| History → Set | history_id | ✅ | ✅ |

## Méthodes duplicate()

| Modèle | Method | Complétude |
|--------|--------|-----------|
| Program | ✅ | ✅ Complet (name, position, equipment, frequency + relations) |
| Session | — | Pas de méthode (non utilisée) |
| Exercise | — | Pas de méthode (non utilisée) |

## Score WatermelonDB : 18/20
- Relations FK : toutes correctes ✅
- Schema v26 cohérent ✅
- 2 décorateurs @field→@text à corriger (🟡, pas critique) : -2
