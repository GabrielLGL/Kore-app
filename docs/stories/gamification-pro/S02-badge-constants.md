# S02 — Constantes badges (BADGES_LIST — 50 badges)

## Story
**En tant que** développeur,
**je veux** un fichier de constantes décrivant les 50 badges,
**afin d'** avoir une source de vérité unique sans hardcode dans les composants.

## Tâches techniques
1. Créer `mobile/src/model/utils/badgeConstants.ts`
2. Définir `type BadgeCategory = 'sessions' | 'tonnage' | 'streak' | 'level' | 'pr' | 'session_volume' | 'exercises'`
3. Définir `interface BadgeDefinition { id: string; title: string; emoji: string; description: string; category: BadgeCategory; threshold: number }`
4. Exporter `BADGES_LIST: BadgeDefinition[]` avec les 50 badges ci-dessous
5. Exporter `getBadgeById(id: string): BadgeDefinition | undefined`
6. `npx tsc --noEmit` → 0 erreur

## Liste complète des 50 badges

### Séances (9)
| id | emoji | title | description | threshold |
|----|-------|-------|-------------|-----------|
| `sessions_1` | 🏋️ | Premier pas | La première, la plus importante. | 1 |
| `sessions_5` | 🌟 | Prise de contact | Tu commences à prendre tes marques. | 5 |
| `sessions_10` | 💪 | Lancé | Le rythme commence à s'installer. | 10 |
| `sessions_25` | 🔥 | Habitué | Tu fais partie des réguliers. | 25 |
| `sessions_50` | ⭐ | Dédié | 50 séances. Ce n'est pas rien. | 50 |
| `sessions_100` | 🏆 | Centurion | 100 séances d'entraînement. Respect. | 100 |
| `sessions_250` | 👑 | Élite | Tu es dans la cour des grands. | 250 |
| `sessions_500` | 🦾 | Légendaire | 500 séances. Inarrêtable. | 500 |
| `sessions_1000` | 🌌 | Mythique | 1 000 séances. Une vie d'effort. | 1000 |

### Volume total en kg (9)
| id | emoji | title | description | threshold (kg) |
|----|-------|-------|-------------|----------------|
| `tonnage_1` | ⚙️ | Premier kilo | La mécanique est lancée. | 1000 |
| `tonnage_5` | 🏗️ | Fondations | Les bases sont là. | 5000 |
| `tonnage_10` | 🔧 | Bâtisseur | 10 tonnes de posées. | 10000 |
| `tonnage_25` | 🚛 | Costaud | 25 tonnes. Ça commence à compter. | 25000 |
| `tonnage_50` | 🚗 | Camionneur | Le poids d'un camion. | 50000 |
| `tonnage_100` | 🏠 | Architecte | Le poids d'une maison. | 100000 |
| `tonnage_250` | 🏭 | Industriel | Niveau industriel. | 250000 |
| `tonnage_500` | ✈️ | Titan | Le poids d'un avion. | 500000 |
| `tonnage_1000` | 🚀 | Cosmique | 1 000 tonnes. Interstellaire. | 1000000 |

### Régularité — best_streak en semaines (8)
| id | emoji | title | description | threshold |
|----|-------|-------|-------------|-----------|
| `streak_2` | 🌱 | Début de quelque chose | 2 semaines de suite. Continue. | 2 |
| `streak_4` | 🌿 | Régulier | Un mois sans fléchir. | 4 |
| `streak_8` | 🔗 | Fer forgé | 2 mois. La discipline prend forme. | 8 |
| `streak_12` | 🛡️ | Blindé | 3 mois de régularité. Solide. | 12 |
| `streak_16` | ⚡ | Inarrêtable | 4 mois. Rien ne t'arrête. | 16 |
| `streak_20` | 💎 | Invaincu | 5 mois sans relâche. | 20 |
| `streak_30` | 🌊 | Force de nature | Plus de 7 mois consécutifs. | 30 |
| `streak_52` | 🏅 | Un an sans fléchir | 52 semaines. Une année entière. | 52 |

### Niveau XP (9)
| id | emoji | title | description | threshold |
|----|-------|-------|-------------|-----------|
| `level_2` | 🥉 | Initié | Tu commences à progresser. | 2 |
| `level_5` | 🎯 | Apprenti | Les bases sont acquises. | 5 |
| `level_10` | 🥈 | Guerrier | Tu as prouvé ta détermination. | 10 |
| `level_15` | ⚔️ | Combattant | Niveau 15. Sérieux. | 15 |
| `level_20` | 🏹 | Vétéran | L'expérience se voit. | 20 |
| `level_25` | 🥇 | Maître | Niveau 25. Maîtrise confirmée. | 25 |
| `level_35` | 💫 | Grand Maître | Au-delà de la moyenne. | 35 |
| `level_50` | 🌟 | Légende Vivante | Niveau 50. Tu inspires. | 50 |
| `level_75` | 🦅 | Transcendant | Niveau 75. Au-delà des limites. | 75 |

### Records Personnels — total_prs (6)
| id | emoji | title | description | threshold |
|----|-------|-------|-------------|-----------|
| `pr_1` | 🎯 | Nouveau record | Premier record personnel battu. | 1 |
| `pr_5` | 📈 | En progression | 5 PRs. La courbe monte. | 5 |
| `pr_10` | 🔝 | Performeur | 10 records. Tu t'améliores. | 10 |
| `pr_25` | 💥 | Machine à PRs | 25 records. Impressionnant. | 25 |
| `pr_50` | 🏋️ | Bête de force | 50 PRs. Tu repousses tes limites. | 50 |
| `pr_100` | 🌋 | Indestructible | 100 records. Incroyable. | 100 |

### Volume par séance en kg (5)
| id | emoji | title | description | threshold (kg) |
|----|-------|-------|-------------|----------------|
| `session_vol_200` | 💦 | Bonne séance | 200 kg en une séance. Bien joué. | 200 |
| `session_vol_500` | 🏊 | Séance intense | 500 kg soulevés en une séance. | 500 |
| `session_vol_1000` | ⚡ | Séance de titan | 1 tonne en une séance. | 1000 |
| `session_vol_2000` | 🔥 | Séance XXL | 2 tonnes. Séance de monstre. | 2000 |
| `session_vol_5000` | 💣 | Mode berserk | 5 tonnes en une séance. Légendaire. | 5000 |

### Exercices distincts pratiqués (4)
| id | emoji | title | description | threshold |
|----|-------|-------|-------------|-----------|
| `exercises_5` | 🎲 | Curieux | 5 exercices différents pratiqués. | 5 |
| `exercises_10` | 📚 | Explorateur | 10 exercices maîtrisés. | 10 |
| `exercises_20` | 🗺️ | Érudit | 20 exercices dans ton répertoire. | 20 |
| `exercises_30` | 🔬 | Expert | 30 exercices. Tu connais ton affaire. | 30 |

## Critères d'acceptation
- [ ] Fichier `badgeConstants.ts` créé
- [ ] Interface `BadgeDefinition` typée sans `any`
- [ ] Type `BadgeCategory` union exhaustif (7 valeurs)
- [ ] `BADGES_LIST` contient exactement 50 éléments
- [ ] `getBadgeById()` retourne `undefined` si id inconnu
- [ ] Aucun hardcode de couleur ou style
- [ ] `npx tsc --noEmit` passe

## Dépend de
- S01 (pour les types liés au model)

## Estimation
M (~45min)
