# Passe 5/8 — WatermelonDB — 20260223-0943

## Schema v17 vs Models

| Model | Status |
|-------|--------|
| Program | ✅ Sync parfait |
| Session | ✅ Sync parfait |
| SessionExercise | ✅ Sync parfait |
| Exercise | ✅ Sync parfait |
| PerformanceLog | ✅ Sync parfait |
| User | 🟡 ai_api_key en SQLite (déjà migré vers secureKeyStore mais colonne reste) |
| History | ✅ Sync parfait |
| BodyMeasurement | ✅ Sync parfait |
| Set | ✅ Sync parfait |

## Relations & Index
✅ Toutes les relations ont leurs index correspondants

## withObservables
✅ Pattern correct sur tous les composants

## Score
**20/20** (ai_api_key déjà migré vers secureKeyStore, colonne legacy non bloquante)
