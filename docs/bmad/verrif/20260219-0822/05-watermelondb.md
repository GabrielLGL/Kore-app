# Cohérence WatermelonDB — 2026-02-19 (run 0822)

## Résultat : ✅ CLEAN — Aucune incohérence

---

## Schéma actuel : v16

---

## Vérification schema ↔ modèles

| Table | Schema colonnes | Modèle @decorators | Statut |
|-------|----------------|-------------------|--------|
| `programs` | name, position, created_at, updated_at | @field name, @field position, @date created_at, @date updated_at | ✅ |
| `sessions` | program_id, name, position, created_at, updated_at, deleted_at | @field name, @field position, @relation program, @date created_at, @date updated_at, @date deleted_at | ✅ |
| `session_exercises` | session_id, exercise_id, position, sets_target, reps_target, weight_target, created_at, updated_at | @field position, @field sets_target, @field reps_target, @field weight_target, @relation session, @relation exercise, @date created_at, @date updated_at | ✅ |
| `exercises` | name, is_custom, muscles, equipment, created_at, updated_at | @text name, @field is_custom, @text _muscles, @text equipment, @date created_at, @date updated_at | ✅ |
| `performance_logs` | exercise_id, sets, weight, reps, created_at | @field sets, @field weight, @field reps, @relation exercise, @date created_at | ✅ |
| `users` | email, timer_enabled, rest_duration, onboarding_completed, ai_provider, ai_api_key, created_at, updated_at | @text email, @field timer_enabled, @field rest_duration, @field onboarding_completed, @text ai_provider, @text ai_api_key, @date created_at, @date updated_at | ✅ |
| `histories` | session_id, start_time, end_time, note, created_at, updated_at, deleted_at | @date start_time, @date end_time, @text note, @relation session, @children sets, @date created_at, @date updated_at, @date deleted_at | ✅ |
| `sets` | history_id, exercise_id, weight, reps, set_order, is_pr, created_at, updated_at | @field weight, @field reps, @field set_order, @field is_pr, @relation history, @relation exercise, @date created_at, @date updated_at | ✅ |

---

## Vérification des relations

| Relation | Type | Foreign Key | Cohérence |
|----------|------|------------|-----------|
| Program → Session | has_many | program_id | ✅ |
| Session → Program | belongs_to | program_id | ✅ |
| Session → History | has_many | session_id | ✅ |
| Session → SessionExercise | has_many | session_id | ✅ |
| History → Session | belongs_to | session_id | ✅ |
| History → Set | has_many | history_id | ✅ |
| Set → History | belongs_to | history_id | ✅ |
| Set → Exercise | belongs_to | exercise_id | ✅ |
| Exercise → SessionExercise | has_many | exercise_id | ✅ |
| Exercise → PerformanceLog | has_many | exercise_id | ✅ |
| Exercise → Set | has_many | exercise_id | ✅ |
| SessionExercise → Session | belongs_to | session_id | ✅ |
| SessionExercise → Exercise | belongs_to | exercise_id | ✅ |
| PerformanceLog → Exercise | belongs_to | exercise_id | ✅ |
| User | standalone | — | ✅ |

## Conclusion
Schéma v16 entièrement cohérent avec les modèles. Toutes les colonnes et relations sont alignées.
