# Prompt analysé — seed-exercises — 2026-02-19

## Demande originale
ajoute plein de nouveau exercices pour etailler la base de donnée, va les chercher sur google si besoin j'en veux vraiment beaucoup

## Analyse
Fichier concerné : `mobile/src/model/seed.ts` (tableau `BASIC_EXERCISES`, 52 entrées actuelles).
Objectif : ajouter ~81 exercices couvrant tous les groupes musculaires, sans doublon.
Muscles valides : Pecs, Dos, Quadriceps, Ischios, Mollets, Trapèzes, Epaules, Biceps, Triceps, Abdos, Cardio, Fessiers (déjà utilisé dans seed existant).
Équipements valides : Poids libre, Machine, Poulies, Poids du corps.
La seedExercises() est idempotente (vérifie doublons par name).

## Commandes générées
| Groupe | Description | Fichiers | Parallèle |
|--------|-------------|----------|-----------|
| A | Ajouter 81 exercices dans BASIC_EXERCISES | mobile/src/model/seed.ts | Non (seul fichier) |

## Nouveaux exercices prévus (81)
Pecs (10), Dos (10), Quadriceps (10), Ischios/Fessiers (5), Mollets (2),
Épaules (9), Trapèzes (2), Biceps (7), Triceps (6), Abdos (13), Cardio (8)

## Total après ajout
52 (existants) + 81 (nouveaux) = **133 exercices**
