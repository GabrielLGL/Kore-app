# HEALTH.md — Score de santé WEGOGYM

## Système de notation (0-100)

| Dimension  | Poids | Critères |
|------------|-------|----------|
| Build      | 20    | TypeScript sans erreur, `npx tsc --noEmit` OK |
| Tests      | 20    | Toutes les suites passent, 0 fail |
| Bugs       | 20    | Verrif SCAN-4 (bugs silencieux) OK |
| Qualité    | 20    | Verrif SCAN-6 (code mort, qualité) OK |
| Coverage   | 20    | Barème : <20%=0 · 20-40%=5 · 40-60%=10 · 60-80%=15 · >80%=20 |

---

## Historique des scores

| Date | Build | Tests | Bugs | Qualité | Coverage | **Total** | Tendance |
|------|-------|-------|------|---------|----------|-----------|----------|
| 2026-02-19 | 20 | 20 | 20 | 20 | 10 | **90/100** | — |

---

## Détail — 2026-02-19

**Score : 90/100**

| Dimension | Score | Détail |
|-----------|-------|--------|
| Build     | 20/20 | ✅ `npx tsc --noEmit` — 0 erreur |
| Tests     | 20/20 | ✅ 432 tests, 0 fail (verrif run 0822) |
| Bugs      | 20/20 | ✅ SCAN-4 bugs silencieux — OK |
| Qualité   | 20/20 | ✅ SCAN-6 code mort/qualité — OK |
| Coverage  | 10/20 | 📊 50.78% lignes (objectif suivant : 60%+) |

### Coverage détaillée (après P1→P5)
| Métrique   | Score  |
|------------|--------|
| Statements | 49.94% |
| Branches   | 41.46% |
| Functions  | 44.86% |
| Lines      | 50.78% |

### Source des données
- Verrif run : `docs/bmad/verrif/20260219-0822/STATUS.md`
- Coverage : `docs/bmad/verrif/coverage-report.md` (après P5)
- Tests non commités : 16 nouveaux fichiers (P3–P5) + 2 modifiés

### Prochains objectifs pour augmenter le score
- Coverage 60% (+5 pts) → tests sur screens principales (HomeScreen, SessionDetailScreen)
- Coverage 80% (+5 pts) → tests E2E / screens complexes
