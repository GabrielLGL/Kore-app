# Passe 5/8 — Cohérence WatermelonDB — 20260220-2303

## Schéma v16 vs Modèles

### programs ✅
- Schema: name(string), position(number,opt), created_at, updated_at
- Model: @text('name'), @field('position')?, @readonly @date('created_at/updated_at'), @children('sessions')
- Résultat: OK

### sessions ✅
- Schema: program_id(string,idx), name(string), position(number,opt), created_at, updated_at, deleted_at(number,opt)
- Model: @field('name'), @field('position')!, @relation program, @children histories/session_exercises, @date('deleted_at')
- Note: @field au lieu de @text sur name — fonctionnel (WatermelonDB accepte les deux)
- Résultat: OK

### session_exercises ✅
- Schema: session_id(idx), exercise_id(idx), position, sets_target(opt), reps_target(opt), weight_target(opt), created_at, updated_at
- Model: tous les @field corrects, relations OK
- Résultat: OK

### exercises ✅
- Schema: name(string), is_custom(boolean), muscles(string,opt), equipment(string,opt), created_at, updated_at
- Model: @text('name'), @field('is_custom'), @text('_muscles'), @text('equipment'), @readonly dates
- Résultat: OK

### performance_logs ✅
- Schema: exercise_id(idx), sets, weight, reps, created_at (pas d'updated_at)
- Model: @field('sets/weight/reps'), @relation exercise, @readonly @date('created_at')
- Résultat: OK (pas d'updated_at intentionnel pour table de logs)

### users ✅
- Schema v16: email, timer_enabled, rest_duration, onboarding_completed, ai_provider(opt), ai_api_key(opt), created_at, updated_at
- Model: @text('email'), @field('timer_enabled/rest_duration/onboarding_completed'), @text('ai_provider/ai_api_key'), @readonly dates
- Résultat: OK

### histories ✅
- Schema: session_id(idx), start_time, end_time(opt), note(opt), created_at, updated_at, deleted_at(opt)
- Model: @date('start_time/end_time'), @text('note'), @relation session, @children sets, deleted_at
- Résultat: OK

### sets ✅
- Schema: history_id(idx), exercise_id(idx), weight, reps, set_order, is_pr, created_at, updated_at
- Model: @field('weight/reps/set_order/is_pr'), relations history+exercise, @readonly dates
- Résultat: OK

## Mutations WDB
- Toutes les mutations analysées sont dans `database.write()` ✅
- `duplicate()` dans Program.ts: wrappé dans `db.write()` ✅
- `deleteAllAssociatedData()` dans Exercise.ts: wrappé dans `this.database.write()` ✅
- Batch dans HomeScreen drag-drop: wrappé dans `database.write()` ✅

## Associations
- Relations bidirectionnelles cohérentes ✅
- Soft-delete sur Session et History via `deleted_at` ✅

## Score WatermelonDB : ✅ AUCUN PROBLÈME
