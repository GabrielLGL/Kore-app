# Passe 5/8 — Cohérence WatermelonDB

**Date :** 2026-03-06

## Résultat

Schema v31, migrations v27→v31, 10 modèles enregistrés.

## Violations détectées

| # | Sévérité | Fichier | Ligne | Problème |
|---|----------|---------|-------|----------|
| 1 | 🔴 | schema.ts / User.ts | 84 / 31 | `ai_api_key` en SQLite — viole règle données sensibles |
| 2 | 🔴 | Program.ts | 63-64 | `duplicate()` ne copie pas `setsTargetMax` — perte de données |
| 3 | 🟡 | BodyMeasurement.ts | 7 | `@field('date')` au lieu de `@date('date')` — incohérent |
| 4 | 🟡 | Session.ts | 16 | `position!: number` mais schema `isOptional: true` — mismatch |
| 5 | 🟡 | migrations.ts | 1-66 | Migrations commencent à v27 — pas de chemin < v27 |

## Cross-référence Schema vs Modèles

✅ Toutes les colonnes de toutes les tables ont un décorateur correspondant dans les modèles.
✅ Toutes les relations `@relation` et `@children` pointent vers les bonnes tables et FK.
✅ Les 10 modèles sont enregistrés dans `modelClasses`.
✅ `tsconfig.json` : `experimentalDecorators: true`, `useDefineForClassFields: false`.
