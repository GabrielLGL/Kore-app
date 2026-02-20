# Cohérence WatermelonDB — 2026-02-20 (re-vérifié)

## Résultat : ✅ Cohérent (3 avertissements mineurs, 0 erreur critique)

Schéma v16 · 8 tables · 8 modèles · tous enregistrés dans `index.ts` ✅

---

## Incohérences schéma ↔ modèles

| Table | Colonne | Problème | Sévérité |
|-------|---------|----------|----------|
| `exercises` | `muscles` | Schéma : `isOptional: true` (peut être null). Modèle : `@text('muscles') _muscles!: string` (assertion non-null `!`). Le getter compense via `\|\| '[]'` mais le type TS est trompeur. | ⚠️ Mineur |
| `programs` | `position` | Schéma : `isOptional: true`. Modèle : `@field('position') position!: number` (non-null). WatermelonDB retourne `0` si null → aucun crash, mais le type TS est inexact. | ⚠️ Mineur |
| `sessions` | `position` | Même cas que `programs.position` ci-dessus. | ⚠️ Mineur |

**Aucune incohérence critique.** Aucune colonne manquante dans les modèles. Aucun décorateur sans colonne schéma.

---

## Correctifs appliqués depuis le rapport 2026-02-19

Les 7 incohérences précédemment reportées ont toutes été corrigées et confirmées intactes :

| Modèle | Correction |
|--------|-----------|
| `Program.ts` | `@readonly @date('updated_at') updatedAt!: Date` ✅ |
| `Session.ts` | `@readonly @date('updated_at') updatedAt!: Date` ✅ |
| `Session.ts` | `@date('deleted_at') deletedAt!: Date \| null` ✅ |
| `History.ts` | `@readonly @date('updated_at') updatedAt!: Date` ✅ |
| `History.ts` | `@date('deleted_at') deletedAt!: Date \| null` ✅ |
| `Set.ts` | `@readonly @date('created_at') createdAt!: Date` ✅ |
| `Set.ts` | `@readonly @date('updated_at') updatedAt!: Date` ✅ |

---

## Couverture schéma ↔ modèles

| Table | Modèle | Colonnes schéma | Décorateurs modèle | Statut |
|-------|--------|----------------:|-------------------:|--------|
| `programs` | `Program.ts` | 4 | 4 | ✅ |
| `sessions` | `Session.ts` | 6 | 6 | ✅ |
| `session_exercises` | `SessionExercise.ts` | 8 | 8 | ✅ |
| `exercises` | `Exercise.ts` | 6 | 6 | ✅ |
| `performance_logs` | `PerformanceLog.ts` | 5 | 5 | ✅ |
| `users` | `User.ts` | 8 | 8 | ✅ |
| `histories` | `History.ts` | 7 | 7 | ✅ |
| `sets` | `Set.ts` | 8 | 8 | ✅ |

---

## Relations

| Modèle | Type | Table cible | FK | Accesseur | Statut |
|--------|------|-------------|-----|-----------|--------|
| `Program` | has_many | `sessions` | `program_id` | `@children('sessions')` | ✅ |
| `Session` | belongs_to | `programs` | `program_id` | `@relation` | ✅ |
| `Session` | has_many | `histories` | `session_id` | `@children('histories')` | ✅ |
| `Session` | has_many | `session_exercises` | `session_id` | `@children('session_exercises')` | ✅ |
| `SessionExercise` | belongs_to | `sessions` | `session_id` | `@relation` | ✅ |
| `SessionExercise` | belongs_to | `exercises` | `exercise_id` | `@relation` | ✅ |
| `Exercise` | has_many | `session_exercises` | `exercise_id` | association seule (pas de `@children`) | ℹ️ |
| `Exercise` | has_many | `performance_logs` | `exercise_id` | association seule (pas de `@children`) | ℹ️ |
| `Exercise` | has_many | `sets` | `exercise_id` | association seule (pas de `@children`) | ℹ️ |
| `History` | belongs_to | `sessions` | `session_id` | `@relation` | ✅ |
| `History` | has_many | `sets` | `history_id` | `@children('sets')` | ✅ |
| `Set` | belongs_to | `histories` | `history_id` | `@relation` | ✅ |
| `Set` | belongs_to | `exercises` | `exercise_id` | `@relation` | ✅ |
| `PerformanceLog` | belongs_to | `exercises` | `exercise_id` | `@relation` | ✅ |

**Note ℹ️ Exercise** : 3 associations `has_many` dans `static associations` sans `@children` correspondant. Pas de crash — les associations sont utilisées par WatermelonDB pour les opérations internes. Les requêtes se font via `Q.where('exercise_id', id)` dans `deleteAllAssociatedData()`. Design intentionnel, cohérent avec l'usage réel.

Aucune relation orpheline. Toutes les FK correspondent à des colonnes indexées dans le schéma. ✅

---

## Migrations

ℹ️ **Pas de fichier de migrations.** `SQLiteAdapter` est initialisé sans paramètre `migrations`. WatermelonDB recrée la base à chaque changement de version du schéma.

- En développement : comportement normal, pas d'erreur.
- **En production : DATA LOSS** si mise à jour avec nouvelle version de schéma. À traiter avant toute release publique.

---

## Modèles enregistrés (index.ts)

| Modèle | Enregistré dans modelClasses |
|--------|------------------------------|
| `Program` | ✅ |
| `Session` | ✅ |
| `History` | ✅ |
| `Set` | ✅ |
| `Exercise` | ✅ |
| `User` | ✅ |
| `SessionExercise` | ✅ |
| `PerformanceLog` | ✅ |

---

## Notes complémentaires

- **`performance_logs`** sans colonne `updated_at` : cohérent, les logs sont immutables par conception.
- **`Program.duplicate()`** : les `collection.create()` imbriqués dans `db.write()` fonctionnent grâce à la ré-entrance WatermelonDB. Pas d'erreur fonctionnelle.
- **Schéma v16** : ajout `ai_provider` + `ai_api_key` sur `users`. Cohérent avec `User.ts`. ✅
- **`User.aiProvider` / `User.aiApiKey`** : `@text('ai_provider') aiProvider!: string | null` — le `!:` est l'assertion d'assignation définitive TypeScript (pattern WatermelonDB standard, nécessaire car les décorateurs injectent la valeur après construction). Le type `string | null` est correct et correspond à `isOptional: true` dans le schéma. ✅
- **`@text` vs `@field` pour strings** : `Program.name`, `Session.name`, `SessionExercise.repsTarget` utilisent `@field` au lieu de `@text` pour des colonnes `string`. Fonctionnellement identique dans WatermelonDB — les deux décorateurs sont équivalents pour les colonnes string.
