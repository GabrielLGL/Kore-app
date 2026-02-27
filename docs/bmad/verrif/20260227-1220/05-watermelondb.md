# Passe 5 — WatermelonDB cohérence — 20260227-1220

## Résultat : ✅ PASS (schéma v25)

### Audit complet — 10 tables

| Table | Colonnes schema | Décorateurs model | Relations | Status |
|-------|----------------|-------------------|-----------|--------|
| programs | 6 | 6 | has_many sessions | ✅ |
| sessions | 6 | 6 | belongs_to programs, has_many histories/session_exercises | ✅ |
| session_exercises | 8 | 8 | belongs_to sessions + exercises | ✅ |
| exercises | 8 | 8 (muscles via getter/setter JSON) | has_many session_exercises, performance_logs, sets | ✅ |
| performance_logs | 4 | 4 | belongs_to exercises | ✅ |
| users | 22 | 22 | — | ✅ |
| user_badges | 4 | 4 | — | ✅ |
| body_measurements | 7 | 7 | — | ✅ |
| histories | 7 | 7 | belongs_to sessions, has_many sets | ✅ |
| sets | 6 | 6 | belongs_to histories + exercises | ✅ |

### Enregistrement models (index.ts)
✅ 10/10 modèles enregistrés

### Index
✅ Foreign keys indexées: program_id, session_id, exercise_id, history_id

### Observations mineures
- `UserBadge` et `BodyMeasurement` n'ont pas de `user_id` FK — acceptable pour une app mono-utilisateur
- `ai_api_key` toujours dans le schéma (voir C2 code review) — la migration vers expo-secure-store existe mais doit être vérifiée

### Conclusion
Cohérence schéma ↔ modèles : **parfaite**. Aucune correction requise.
