# S04 — Incrément total_prs lors de la détection de PR

## Story
**En tant que** système,
**je veux** que `user.total_prs` soit incrémenté à chaque PR détecté pendant une séance,
**afin que** le compteur soit toujours à jour pour le déblocage des badges PR.

## Tâches techniques
1. Localiser le point exact où les PRs sont détectés dans le flow de validation des sets
   (probablement dans le handler de validation d'un set dans SessionDetailScreen ou similaire)
2. À chaque PR détecté, accumuler `prCount` dans le state local de la séance
3. À la fin de séance (dans le `database.write()` existant de S05 gamification-base) :
   - Lire `user.totalPrs` actuel
   - Écrire `user.totalPrs + prCount`
4. Vérifier qu'il n'y a pas de double-comptage si la séance est déjà sauvegardée
5. `npx tsc --noEmit` → 0 erreur

## Règles
- `prCount` est le nombre de PRs détectés pendant la séance courante uniquement
- L'incrémentation se fait dans le même `database.write()` que la mise à jour XP/tonnage/streak
- Pas de colonne supplémentaire — uniquement `total_prs` sur User

## Critères d'acceptation
- [ ] `user.totalPrs` incrémenté correctement après une séance avec PRs
- [ ] `user.totalPrs` inchangé si aucun PR dans la séance
- [ ] Incrémentation dans le même `database.write()` que le reste de la gamification
- [ ] Pas de double-comptage
- [ ] Flow existant (history, sets, XP, tonnage, streak) non cassé
- [ ] `npx tsc --noEmit` passe

## Dépend de
- S01 (colonne total_prs sur User)

## Estimation
S (~30min)
