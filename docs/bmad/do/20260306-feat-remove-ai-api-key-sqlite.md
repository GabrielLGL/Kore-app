# feat(schema) — Remove ai_api_key from SQLite schema
Date : 2026-03-06

## Instruction
migration ai_api_key schema v32 — groupe B (parallèle)

## Rapport source
docs/bmad/verrif/20260306-1951/RAPPORT.md — Problème #2 : `ai_api_key` dans schema/modèle SQLite

## Classification
Type : feat (migration/cleanup)
Fichiers modifiés :
- mobile/src/model/schema.ts (v31 → v32, colonne retirée)
- mobile/src/model/migrations.ts (ajout step v32 vide)
- mobile/src/model/models/User.ts (suppression @text ai_api_key)
- mobile/src/services/secureKeyStore.ts (migrateKeyFromDB utilise _raw)
- mobile/src/model/utils/exportHelpers.ts (schemaVersion 32)
- mobile/src/screens/__tests__/AssistantScreen.test.tsx (suppression aiApiKey mock)
- mobile/src/screens/__tests__/SettingsScreen.test.tsx (suppression aiApiKey mock)
- mobile/src/services/__tests__/secureKeyStore.test.ts (mocks _raw format)
- mobile/src/model/utils/__tests__/exportHelpers.test.ts (schemaVersion 32)

## Ce qui a été fait
1. Supprimé la colonne `ai_api_key` du schéma WatermelonDB (la colonne SQLite reste physiquement mais n'est plus mappée par le modèle)
2. Bump schema v31 → v32 avec migration step vide (évite reset DB)
3. Supprimé `@text('ai_api_key') aiApiKey` du modèle User
4. Mis à jour `migrateKeyFromDB()` pour accéder à la colonne via `user._raw` au lieu de la propriété modèle (backward compat pour les utilisateurs qui n'ont pas encore migré)
5. Gardé `sanitizeUserRecord` dans exportHelpers (défensif pour les anciennes DB)
6. Mis à jour tous les tests affectés

## Vérification
- TypeScript : ✅ 0 erreur
- Tests : ✅ 1571 passed, 93 suites
- Nouveau test créé : non (tests existants mis à jour)

## Documentation mise à jour
aucune (CLAUDE.md déjà à jour sur la règle données sensibles)

## Statut
✅ Résolu — 20260306

## Commit
