<!-- v1.0 — 2026-02-23 -->
# Prompt — Coverage Tests — 20260223-1400

## Demande originale
continue le coverage

## État actuel
- **Coverage lignes** : 65.48% (cible : 80%+)
- **Tests** : 847 passent, 0 fail
- **Score santé** : 93/100 (coverage = 15/20)

## Groupes générés
| Groupe | Rapport | Fichiers | Gain estimé | Vague | Statut |
|--------|---------|----------|-------------|-------|--------|
| A — Stats Screens | `20260223-1400-coverage-A.md` | 7 screens Stats | +5-8% lines | 1 | ⏳ |
| B — ProgramGenerator | `20260223-1400-coverage-B.md` | 4 modules logique | +3-5% lines | 1 | ⏳ |
| C — Écrans restants | `20260223-1400-coverage-C.md` | 3 screens (Programs, Assistant, Charts) | +4-6% lines | 1 | ⏳ |

## Ordre d'exécution
**Vague 1 — TOUT en parallèle :**
Les 3 groupes touchent des fichiers complètement différents et n'ont aucune dépendance entre eux. Ils peuvent tous être lancés simultanément.

## Gain total estimé
- Actuel : 65.48%
- Gain estimé : +12-19%
- Cible après exécution : **77-84%** lines coverage
- Si ≥80% → score santé coverage passe de 15/20 à **20/20** → santé totale **98/100**

## Notes
- Les hooks et components sont déjà à 100% de coverage
- Les model/utils sont déjà à ~98% de coverage
- Le plus gros gap est sur les screens (33% testés) et le programGenerator (17% testé)
- Les providers AI (claude, gemini, openai) sont déjà testés dans `providers.test.ts`
