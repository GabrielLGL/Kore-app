# Cohérence WatermelonDB — 2026-02-19

## Résultat : 🔴 7 incohérences (colonnes manquantes dans les modèles)

---

## Incohérences schéma ↔ modèles

| Table | Colonne schéma | Type schéma | Problème |
|-------|---------------|-------------|----------|
| `programs` | `updated_at` | number | ❌ Aucun `@date('updated_at')` dans `Program.ts` |
| `sessions` | `updated_at` | number | ❌ Aucun `@date('updated_at')` dans `Session.ts` |
| `sessions` | `deleted_at` | number (isOptional) | ❌ Aucun `@date('deleted_at')` dans `Session.ts` — soft-delete non exposé |
| `histories` | `updated_at` | number | ❌ Aucun `@date('updated_at')` dans `History.ts` |
| `histories` | `deleted_at` | number (isOptional) | ❌ Aucun `@date('deleted_at')` dans `History.ts` — soft-delete non exposé |
| `sets` | `created_at` | number | ❌ Aucun `@date('created_at')` dans `Set.ts` |
| `sets` | `updated_at` | number | ❌ Aucun `@date('updated_at')` dans `Set.ts` |

### Impact fonctionnel
- **`deleted_at` manquant** dans `Session` et `History` : impossible de lire/filtrer par soft-delete depuis le modèle. Les queries qui cherchent `Q.where('deleted_at', null)` fonctionnent au niveau SQL (WatermelonDB passe la colonne raw) mais le champ n'est pas accessible en TypeScript via `session.deletedAt` / `history.deletedAt`.
- **`updated_at` manquant** dans 4 modèles : colonne présente en base, jamais exposée. WatermelonDB l'écrit automatiquement via le mécanisme interne mais le modèle TypeScript ne peut pas la lire.
- **`created_at` manquant dans `Set`** : aucun accès à la date de création d'une série depuis le modèle.

---

## Décorateurs modèles sans colonne schéma

Aucun — tous les décorateurs des modèles ont leur colonne correspondante dans le schéma. ✅

---

## Relations

| Modèle | Relation | Statut |
|--------|----------|--------|
| `Program` | `@children('sessions')` → `foreignKey: 'program_id'` | ✅ Table et FK existent |
| `Session` | `@relation('programs', 'program_id')` | ✅ Table et colonne existent |
| `Session` | `@children('histories')` → `foreignKey: 'session_id'` | ✅ Table et FK existent |
| `Session` | `@children('session_exercises')` → `foreignKey: 'session_id'` | ✅ Table et FK existent |
| `SessionExercise` | `@relation('sessions', 'session_id')` | ✅ |
| `SessionExercise` | `@relation('exercises', 'exercise_id')` | ✅ |
| `Exercise` | `has_many session_exercises` → `foreignKey: 'exercise_id'` | ✅ |
| `Exercise` | `has_many performance_logs` → `foreignKey: 'exercise_id'` | ✅ |
| `PerformanceLog` | `@relation('exercises', 'exercise_id')` | ✅ |
| `History` | `@relation('sessions', 'session_id')` | ✅ |
| `History` | `@children('sets')` → `foreignKey: 'history_id'` | ✅ |
| `Set` | `@relation('histories', 'history_id')` | ✅ |
| `Set` | `@relation('exercises', 'exercise_id')` | ✅ |

Toutes les relations pointent vers des tables existantes. Aucune relation orpheline. ✅

---

## Migrations

ℹ️ **Aucun fichier de migrations** — `mobile/src/model/index.ts` initialise le `SQLiteAdapter` sans paramètre `migrations`. WatermelonDB recrée la base de données à chaque changement de version de schéma.

- En développement : comportement normal, pas d'erreur.
- **En production : DATA LOSS** si l'app est mise à jour avec une nouvelle version de schéma (toutes les données utilisateur sont effacées). À traiter avant la release.

---

## Cohérence modèles enregistrés (index.ts)

Tous les modèles sont bien déclarés dans `modelClasses` :

| Modèle | Enregistré |
|--------|-----------|
| Program | ✅ |
| Session | ✅ |
| History | ✅ |
| Set | ✅ |
| Exercise | ✅ |
| User | ✅ |
| SessionExercise | ✅ |
| PerformanceLog | ✅ |

---

## Corrections à apporter

### 1. `Program.ts` — ajouter `updated_at`
```typescript
@readonly @date('updated_at') updatedAt!: Date
```

### 2. `Session.ts` — ajouter `updated_at` et `deleted_at`
```typescript
@readonly @date('updated_at') updatedAt!: Date
@date('deleted_at') deletedAt?: Date
```

### 3. `History.ts` — ajouter `updated_at` et `deleted_at`
```typescript
@readonly @date('updated_at') updatedAt!: Date
@date('deleted_at') deletedAt?: Date
```

### 4. `Set.ts` — ajouter `created_at` et `updated_at`
```typescript
@readonly @date('created_at') createdAt!: Date
@readonly @date('updated_at') updatedAt!: Date
```
