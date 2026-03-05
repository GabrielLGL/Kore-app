<!-- v1.0 — 2026-03-06 -->
# Prompt — Deep Testing Android — 20260306-0100

## Demande originale
MVP Deep testing Android (5+ appareils)

## Groupes générés
| Groupe | Rapport | Contenu | Vague | Statut |
|--------|---------|---------|-------|--------|
| A | `20260306-0100-deep-testing-android-A.md` | Plan de test complet (83 scénarios, 6 appareils, checklist par device) | 1 | ⏳ |

## Note
Ce prompt génère un **seul groupe** car il s'agit d'un plan de test manuel, pas de code à écrire en parallèle. Le document A contient :
- Matrice de 6 appareils/émulateurs cibles
- 83 scénarios de test répartis en 10 sections
- Checklist reproductible par appareil
- Points d'attention spécifiques par type d'appareil
- Processus de test recommandé (~45-60 min par appareil)

## Ordre d'exécution
1. Lire le rapport A
2. Créer les émulateurs Android Studio listés
3. Build l'app (`npx expo run:android` ou EAS preview)
4. Exécuter le plan de test sur chaque appareil
5. Consigner les résultats dans un rapport de test
