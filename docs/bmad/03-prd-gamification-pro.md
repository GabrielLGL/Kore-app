# PRD — Gamification Pro (Badges) — 2026-02-26

## User Stories

### Epic A — Données & Logique

**US-A1 (MUST)** — Migration schema
> En tant que système, je veux une table `user_badges` + colonne `total_prs` sur `users` pour persister les badges débloqués et le compteur de PRs.
- Table `user_badges` : `id`, `badge_id` string, `unlocked_at` timestamp
- Colonne `total_prs` (number, default 0) sur `users`
- Model `UserBadge` avec `@field('badge_id')` + `@date('unlocked_at')`
- Model `User` : nouveau `@field('total_prs')`
- Schema ↔ Model en sync parfait
- `npx tsc --noEmit` passe

**US-A2 (MUST)** — Constantes badges
> En tant que développeur, je veux un fichier de constantes décrivant les 50 badges.
- Interface `BadgeDefinition { id, title, emoji, description, category, threshold }`
- Type `BadgeCategory = 'sessions' | 'tonnage' | 'streak' | 'level' | 'pr' | 'session_volume' | 'exercises'`
- Constante `BADGES_LIST: BadgeDefinition[]` — 50 badges
- Exportée depuis `model/constants.ts` ou fichier dédié
- Aucun hardcode dans les composants

**US-A3 (MUST)** — Helper `checkBadges()`
> En tant que système, je veux un helper qui retourne les badges nouvellement débloqués.
- Signature : `checkBadges(params: CheckBadgesParams): BadgeDefinition[]`
- `CheckBadgesParams` : `{ user, existingBadgeIds: string[], sessionCount: number, sessionVolume: number, distinctExerciseCount: number }`
- Logique pour les 7 catégories
- Tests unitaires couvrant chaque catégorie
- `npx tsc --noEmit` passe

**US-A4 (MUST)** — Incrément `total_prs`
> En tant que système, je veux que `total_prs` soit incrémenté à chaque PR détecté pendant une séance.
- Intégration dans le flow de validation des sets (là où les PRs sont déjà détectés)
- `database.write()` wrappé
- Pas de double-comptage

**US-A5 (MUST)** — Intégration fin de séance
> En tant que système, je veux que `checkBadges()` soit appelé après chaque séance et que les badges soient persistés.
- Calcul `sessionVolume` depuis les sets de la session
- Requête `distinctExerciseCount` (distinct exercise_ids dans sets)
- Insert `user_badges` pour chaque nouveau badge, dans `database.write()`
- Badges non dupliqués (vérif existingBadgeIds)
- `npx tsc --noEmit` passe

### Epic B — UI

**US-B1 (MUST)** — Composant `BadgeCard`
> En tant que pratiquant, je veux voir chaque badge sous forme de carte avec emoji, titre et statut.
- Props : `{ badge: BadgeDefinition, unlocked: boolean, unlockedAt?: Date }`
- Coloré si débloqué, grisé (opacity 0.35) si non débloqué
- Emoji 32px, titre en dessous, colors.* du theme
- `npx tsc --noEmit` passe

**US-B2 (MUST)** — Écran "Mes Badges"
> En tant que pratiquant, je veux consulter ma collection complète.
- Route : `BadgesScreen`
- Grille 3 colonnes, sections par catégorie avec titre
- Compteur total "X/50 badges débloqués"
- withObservables sur `userBadges`
- Navigation depuis HomeScreen
- `npx tsc --noEmit` passe

**US-B3 (MUST)** — BottomSheet célébration badge
> En tant que pratiquant, je veux être célébré quand je débloque un badge.
- Réutilise `<BottomSheet>` existant
- Emoji 48px, titre, description, bouton "Super !" (Button primary)
- Haptic `onSuccess` à l'ouverture
- Si plusieurs badges débloqués : afficher le plus rare (dernier dans la liste)
- S'enchaîne avec la célébration milestones S09

**US-B4 (SHOULD)** — Entrée HomeScreen
> En tant que pratiquant, je veux accéder à mes badges depuis le dashboard.
- Lien/bouton "Mes Badges" + compteur sur HomeScreen
- Navigation vers BadgesScreen

## Catalogue des 50 badges

### Séances (9)
| ID | Emoji | Titre | Seuil |
|----|-------|-------|-------|
| `sessions_1` | 🏋️ | Premier pas | 1 |
| `sessions_5` | 🌟 | Prise de contact | 5 |
| `sessions_10` | 💪 | Lancé | 10 |
| `sessions_25` | 🔥 | Habitué | 25 |
| `sessions_50` | ⭐ | Dédié | 50 |
| `sessions_100` | 🏆 | Centurion | 100 |
| `sessions_250` | 👑 | Élite | 250 |
| `sessions_500` | 🦾 | Légendaire | 500 |
| `sessions_1000` | 🌌 | Mythique | 1000 |

### Volume total (9)
| ID | Emoji | Titre | Seuil (kg) |
|----|-------|-------|------------|
| `tonnage_1` | ⚙️ | Premier kilo | 1 000 |
| `tonnage_5` | 🏗️ | Fondations | 5 000 |
| `tonnage_10` | 🔧 | Bâtisseur | 10 000 |
| `tonnage_25` | 🚛 | Costaud | 25 000 |
| `tonnage_50` | 🚗 | Camionneur | 50 000 |
| `tonnage_100` | 🏠 | Architecte | 100 000 |
| `tonnage_250` | 🏭 | Industriel | 250 000 |
| `tonnage_500` | ✈️ | Titan | 500 000 |
| `tonnage_1000` | 🚀 | Cosmique | 1 000 000 |

### Régularité / Streak (8)
| ID | Emoji | Titre | Seuil (semaines) |
|----|-------|-------|-----------------|
| `streak_2` | 🌱 | Début de quelque chose | 2 |
| `streak_4` | 🌿 | Régulier | 4 |
| `streak_8` | 🔗 | Fer forgé | 8 |
| `streak_12` | 🛡️ | Blindé | 12 |
| `streak_16` | ⚡ | Inarrêtable | 16 |
| `streak_20` | 💎 | Invaincu | 20 |
| `streak_30` | 🌊 | Force de nature | 30 |
| `streak_52` | 🏅 | Un an sans fléchir | 52 |

### Niveau XP (9)
| ID | Emoji | Titre | Seuil |
|----|-------|-------|-------|
| `level_2` | 🥉 | Initié | 2 |
| `level_5` | 🎯 | Apprenti | 5 |
| `level_10` | 🥈 | Guerrier | 10 |
| `level_15` | ⚔️ | Combattant | 15 |
| `level_20` | 🏹 | Vétéran | 20 |
| `level_25` | 🥇 | Maître | 25 |
| `level_35` | 💫 | Grand Maître | 35 |
| `level_50` | 🌟 | Légende Vivante | 50 |
| `level_75` | 🦅 | Transcendant | 75 |

### Records Personnels (6)
| ID | Emoji | Titre | Seuil |
|----|-------|-------|-------|
| `pr_1` | 🎯 | Nouveau record | 1 |
| `pr_5` | 📈 | En progression | 5 |
| `pr_10` | 🔝 | Performeur | 10 |
| `pr_25` | 💥 | Machine à PRs | 25 |
| `pr_50` | 🏋️ | Bête de force | 50 |
| `pr_100` | 🌋 | Indestructible | 100 |

### Volume par séance (5)
| ID | Emoji | Titre | Seuil (kg) |
|----|-------|-------|------------|
| `session_vol_200` | 💦 | Bonne séance | 200 |
| `session_vol_500` | 🏊 | Séance intense | 500 |
| `session_vol_1000` | ⚡ | Séance de titan | 1 000 |
| `session_vol_2000` | 🔥 | Séance XXL | 2 000 |
| `session_vol_5000` | 💣 | Mode berserk | 5 000 |

### Exercices distincts (4)
| ID | Emoji | Titre | Seuil |
|----|-------|-------|-------|
| `exercises_5` | 🎲 | Curieux | 5 |
| `exercises_10` | 📚 | Explorateur | 10 |
| `exercises_20` | 🗺️ | Érudit | 20 |
| `exercises_30` | 🔬 | Expert | 30 |

## MoSCoW
- MUST : US-A1, A2, A3, A4, A5, B1, B2, B3
- SHOULD : US-B4
