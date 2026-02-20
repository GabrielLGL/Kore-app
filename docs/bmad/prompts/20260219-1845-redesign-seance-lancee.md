# Prompt analysé — redesign-seance-lancee — 2026-02-19 18:45

## Demande originale
`idee refaire bien les affichage de la seance lancé`

## Analyse

### Quoi
Refonte UI complète de l'écran de séance active (WorkoutScreen) et de tous ses sous-composants.

### Fichiers concernés
| Fichier | Taille | Rôle |
|---------|--------|------|
| `mobile/src/screens/WorkoutScreen.tsx` | 299 lignes | Coordinateur principal |
| `mobile/src/components/WorkoutHeader.tsx` | 43 lignes | Timer + volume (header) |
| `mobile/src/components/WorkoutExerciseCard.tsx` | 295 lignes | Carte d'exercice + set rows |
| `mobile/src/components/LastPerformanceBadge.tsx` | 34 lignes | Badge dernière perf |
| `mobile/src/components/WorkoutSummarySheet.tsx` | 144 lignes | Résumé fin de séance |
| `mobile/src/components/RestTimer.tsx` | 143 lignes | Timer de repos |

### Problèmes identifiés dans l'UI actuelle
1. **WorkoutHeader** : Timer 40px + volume en texte plat. Pas d'indicateur de progression des séries.
2. **WorkoutExerciseCard** : Aucune cible affichée (sets×reps@kg), inputs non pré-remplis, état validé basique, pas de complétion de carte.
3. **LastPerformanceBadge** : Simple texte italique peu lisible.
4. **WorkoutSummarySheet** : Grille 2×2 fonctionnelle mais sans personnalité, pas d'icônes.
5. **RestTimer** : Bannière bleue sans barre de progression.

### Commande alternative suggérée
`/ui WorkoutScreen` — mais le découpage en /do parallèles est plus adapté à l'ampleur du redesign (6 fichiers).

---

## Commandes générées

| Groupe | Fichiers | Parallèle | Description |
|--------|----------|-----------|-------------|
| A | WorkoutExerciseCard.tsx, LastPerformanceBadge.tsx | Oui (vague 1) | Carte exercice : cible, complétion, pre-fill, badges |
| B | WorkoutSummarySheet.tsx | Oui (vague 1) | Résumé : icônes stats, sous-titre conditionnel |
| C | RestTimer.tsx | Oui (vague 1) | Timer : barre de progression, couleur dynamique |
| D | WorkoutHeader.tsx + WorkoutScreen.tsx | Oui (vague 1) | Header : progress séries, layout compact |

Tous les groupes peuvent être lancés en parallèle car les interfaces entre fichiers ne changent pas (sauf WorkoutHeader qui est dans le même groupe que WorkoutScreen).

---

## Résumé des améliorations

### WorkoutHeader (Groupe D)
- Layout horizontal : timer à gauche, volume à droite
- Compteur "X / Y séries" centré en colors.success
- Barre de progression fine (non animée) en bas de la card

### WorkoutExerciseCard (Groupe A)
- Ligne "Objectif : Nx reps @ W kg" sous le nom
- Indicateur completion : bordure gauche verte si toutes les séries validées
- Pré-remplissage des placeholders avec les valeurs cibles
- État validé amélioré : numéro en cercle vert, PR badge stylé
- Bouton validate : couleur adaptée à l'état valid/invalid

### LastPerformanceBadge (Groupe A)
- Chip/badge avec fond cardSecondary
- Format "↑ N×R @ Wkg • date"
- "Première fois" en couleur warning

### WorkoutSummarySheet (Groupe B)
- Sous-titre conditionnel : "Nouveau record !" / "Beau travail !"
- Emojis devant chaque stat : ⏱ 🏋️ ✅ 🏆
- Stat values en fontSize.xxxl
- Label + style amélioré pour le champ note
- Bouton "Terminer" au lieu de "Fermer"

### RestTimer (Groupe C)
- Card avec bordure gauche bleue (au lieu de fond bleu plein)
- Barre de progression linéaire (width animée de 100% → 0%)
- Timer en couleur warning quand ≤ 10 secondes
- Bouton "Ignorer" stylé en chip semi-transparent
