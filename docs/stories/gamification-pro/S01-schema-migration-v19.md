# S01 — Migration schema v19 — Table user_badges + total_prs

## Story
**En tant que** système,
**je veux** que le schema WatermelonDB soit migré en v19 avec la table `user_badges` et la colonne `total_prs` sur `users`,
**afin que** les badges débloqués et le compteur de PRs soient persistés.

## Tâches techniques
1. Modifier `mobile/src/model/schema.ts` : version 18 → 19
   - Nouvelle table `user_badges` : colonnes `badge_id` (string), `unlocked_at` (number)
   - Nouvelle colonne `total_prs` (number) sur la table `users`
2. Créer `mobile/src/model/models/UserBadge.ts`
   - `@field('badge_id')` : string
   - `@date('unlocked_at')` : Date
3. Modifier `mobile/src/model/models/User.ts`
   - Ajouter `@field('total_prs') totalPrs: number`
4. Modifier `mobile/src/model/index.ts`
   - Ajouter `UserBadge` dans les collections
5. `npx tsc --noEmit` → 0 erreur

## Colonnes ajoutées

### Table user_badges (nouvelle)
| Colonne | Type WatermelonDB | Description |
|---------|-------------------|-------------|
| `badge_id` | string | Identifiant du badge (ex: "sessions_100") |
| `unlocked_at` | number (date) | Timestamp de déblocage |

### Table users (ajout)
| Colonne | Type | Default | Description |
|---------|------|---------|-------------|
| `total_prs` | number | 0 | Compteur total de PRs détectés |

## Critères d'acceptation
- [ ] Schema version = 19
- [ ] Table `user_badges` avec 2 colonnes
- [ ] Model `UserBadge` avec `@field('badge_id')` + `@date('unlocked_at')`
- [ ] Model `User` avec `@field('total_prs')`
- [ ] `UserBadge` enregistré dans les collections de index.ts
- [ ] Schema ↔ Model en sync parfait
- [ ] `npx tsc --noEmit` passe

## Estimation
S (~30min)
