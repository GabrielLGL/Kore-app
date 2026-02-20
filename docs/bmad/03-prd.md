# PRD — Redesign Liste Exercices Séance
> Date : 2026-02-20

## User Stories

### MUST HAVE

#### US-01 — Suppression du poids cible dans l'édition
En tant qu'utilisateur, je veux que la liste des exercices d'une séance affiche uniquement séries × reps (sans poids cible) pour simplifier la configuration.

**Critères d'acceptation :**
- `SessionExerciseItem` n'affiche plus le champ `weightTarget`
- Le tap pour éditer les objectifs ne propose plus le poids
- Les données `weight_target` en DB restent intactes (juste masquées)

#### US-02 — Pré-remplissage des poids depuis la dernière session
En tant qu'utilisateur, je veux que les champs poids soient pré-remplis avec mes poids de la dernière fois pour ne pas avoir à les retaper.

**Critères d'acceptation :**
- Au lancement du workout, chaque input poids est rempli avec la valeur de la dernière `Set` correspondante (même exercice, même `set_order`)
- Si pas d'historique → champ vide (0 en placeholder gris)
- Les reps restent toujours en placeholder gris "6-8" (champ vide)

#### US-03 — Affichage de la dernière perf par exercice
En tant qu'utilisateur, je veux voir un résumé de ma dernière performance pour chaque exercice afin de me donner un repère.

**Critères d'acceptation :**
- Dans chaque `WorkoutExerciseCard`, afficher : "Dernière : Moy. X kg × Y reps sur Z séries"
- Données issues de la dernière `History` associée à cet exercice (via `Set`)
- Si pas d'historique → ne pas afficher la ligne

#### US-04 — Toggle de validation des séries
En tant qu'utilisateur, je veux pouvoir valider une série d'un clic (✓ passe vert) et annuler d'un re-clic pour corriger une erreur.

**Critères d'acceptation :**
- Bouton ✓ rond : état normal → état vert validé au clic
- Re-clic sur ✓ vert → retour à l'état normal (série invalidée)
- Pas de flèche ↩, pas de dialog de confirmation

#### US-05 — Header workout : volume + séries
En tant qu'utilisateur, je veux voir en permanence le volume total soulevé et le nombre de séries validées pour suivre ma progression en temps réel.

**Critères d'acceptation :**
- Header affiche : Timer | Séries validées (ex: "6 séries") | Volume (ex: "1 840 kg")
- Volume = somme (poids × reps) de toutes les séries validées
- Mis à jour instantanément à chaque validation/invalidation

### SHOULD HAVE

#### US-06 — Objectif visible par exercice
Afficher l'objectif de la séance (ex: "Objectif : 4×8 reps") dans chaque card pendant l'entraînement.

**Critères d'acceptation :**
- Texte "Objectif : [setsTarget]×[repsTarget] reps" affiché sous le nom de l'exercice
- Données issues de `SessionExercise.setsTarget` et `SessionExercise.repsTarget`

### COULD HAVE

#### US-07 — Animation du ✓ lors de la validation
Petite animation (scale + couleur) quand une série est validée pour feedback haptique/visuel.

### WON'T HAVE (ce sprint)
- Modification du schéma DB
- Changement de WorkoutSummarySheet
- Statistiques avancées / graphiques

## MoSCoW Summary
| Story | Priorité | Complexité estimée |
|-------|----------|-------------------|
| US-01 | Must | Faible |
| US-02 | Must | Moyenne |
| US-03 | Must | Moyenne |
| US-04 | Must | Faible |
| US-05 | Must | Faible |
| US-06 | Should | Faible |
| US-07 | Could | Faible |
