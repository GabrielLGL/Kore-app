export type BadgeCategory =
  | 'sessions'
  | 'tonnage'
  | 'streak'
  | 'level'
  | 'pr'
  | 'session_volume'
  | 'exercises'

export interface BadgeDefinition {
  id: string
  title: string
  icon: string
  description: string
  category: BadgeCategory
  threshold: number
}

export const BADGES_LIST: BadgeDefinition[] = [
  // ── Séances ──────────────────────────────────────────────────────────────
  { id: 'sessions_1',    category: 'sessions', icon: 'barbell-outline', title: 'Premier pas',       description: 'La premi\u00e8re, la plus importante.',        threshold: 1    },
  { id: 'sessions_5',    category: 'sessions', icon: 'star-outline',    title: 'Prise de contact',  description: 'Tu commences \u00e0 prendre tes marques.',      threshold: 5    },
  { id: 'sessions_10',   category: 'sessions', icon: 'fitness-outline', title: 'Lanc\u00e9',         description: 'Le rythme commence \u00e0 s\'installer.',       threshold: 10   },
  { id: 'sessions_25',   category: 'sessions', icon: 'flame-outline',   title: 'Habitu\u00e9',        description: 'Tu fais partie des r\u00e9guliers.',            threshold: 25   },
  { id: 'sessions_50',   category: 'sessions', icon: 'star',            title: 'D\u00e9di\u00e9',    description: '50 s\u00e9ances. Ce n\'est pas rien.',          threshold: 50   },
  { id: 'sessions_100',  category: 'sessions', icon: 'trophy-outline',  title: 'Centurion',         description: '100 s\u00e9ances d\'entra\u00eenement. Respect.', threshold: 100  },
  { id: 'sessions_250',  category: 'sessions', icon: 'ribbon-outline',  title: '\u00c9lite',         description: 'Tu es dans la cour des grands.',               threshold: 250  },
  { id: 'sessions_500',  category: 'sessions', icon: 'person-outline',  title: 'L\u00e9gendaire',   description: '500 s\u00e9ances. Inarr\u00eatable.',           threshold: 500  },
  { id: 'sessions_1000', category: 'sessions', icon: 'planet-outline',  title: 'Mythique',          description: '1\u202f000 s\u00e9ances. Une vie d\'effort.',    threshold: 1000 },

  // ── Volume total (en kg) ────────────────────────────────────────────────
  { id: 'tonnage_1',    category: 'tonnage', icon: 'settings-outline',  title: 'Premier kilo',  description: 'La m\u00e9canique est lanc\u00e9e.',              threshold: 1_000     },
  { id: 'tonnage_5',    category: 'tonnage', icon: 'construct-outline', title: 'Fondations',    description: 'Les bases sont l\u00e0.',                         threshold: 5_000     },
  { id: 'tonnage_10',   category: 'tonnage', icon: 'hammer-outline',    title: 'B\u00e2tisseur', description: '10 tonnes de pos\u00e9es.',                       threshold: 10_000    },
  { id: 'tonnage_25',   category: 'tonnage', icon: 'car-sport-outline', title: 'Costaud',       description: '25 tonnes. \u00c7a commence \u00e0 compter.',     threshold: 25_000    },
  { id: 'tonnage_50',   category: 'tonnage', icon: 'car-outline',       title: 'Camionneur',    description: 'Le poids d\'un camion.',                          threshold: 50_000    },
  { id: 'tonnage_100',  category: 'tonnage', icon: 'home-outline',      title: 'Architecte',    description: 'Le poids d\'une maison.',                         threshold: 100_000   },
  { id: 'tonnage_250',  category: 'tonnage', icon: 'business-outline',  title: 'Industriel',    description: 'Niveau industriel.',                              threshold: 250_000   },
  { id: 'tonnage_500',  category: 'tonnage', icon: 'airplane-outline',  title: 'Titan',         description: 'Le poids d\'un avion.',                           threshold: 500_000   },
  { id: 'tonnage_1000', category: 'tonnage', icon: 'rocket-outline',    title: 'Cosmique',      description: '1\u202f000 tonnes. Interstellaire.',              threshold: 1_000_000 },

  // ── R\u00e9gularit\u00e9 — best_streak (semaines) ────────────────────────────────────────
  { id: 'streak_2',  category: 'streak', icon: 'leaf-outline',    title: 'D\u00e9but de quelque chose', description: '2 semaines de suite. Continue.',                 threshold: 2  },
  { id: 'streak_4',  category: 'streak', icon: 'leaf',            title: 'R\u00e9gulier',               description: 'Un mois sans fl\u00e9chir.',                     threshold: 4  },
  { id: 'streak_8',  category: 'streak', icon: 'link-outline',    title: 'Fer forg\u00e9',              description: '2 mois. La discipline prend forme.',              threshold: 8  },
  { id: 'streak_12', category: 'streak', icon: 'shield-outline',  title: 'Blind\u00e9',                 description: '3 mois de r\u00e9gularit\u00e9. Solide.',         threshold: 12 },
  { id: 'streak_16', category: 'streak', icon: 'flash-outline',   title: 'Inarr\u00eatable',            description: '4 mois. Rien ne t\'arr\u00eate.',                 threshold: 16 },
  { id: 'streak_20', category: 'streak', icon: 'diamond-outline', title: 'Invaincu',                    description: '5 mois sans rel\u00e2che.',                       threshold: 20 },
  { id: 'streak_30', category: 'streak', icon: 'water-outline',   title: 'Force de nature',             description: 'Plus de 7 mois cons\u00e9cutifs.',                threshold: 30 },
  { id: 'streak_52', category: 'streak', icon: 'medal-outline',   title: 'Un an sans fl\u00e9chir',     description: '52 semaines. Une ann\u00e9e enti\u00e8re.',        threshold: 52 },

  // ── Niveau XP ───────────────────────────────────────────────────────────
  { id: 'level_2',  category: 'level', icon: 'chevron-up-outline',  title: 'Initi\u00e9',          description: 'Tu commences \u00e0 progresser.',              threshold: 2  },
  { id: 'level_5',  category: 'level', icon: 'navigate-outline',    title: 'Apprenti',             description: 'Les bases sont acquises.',                     threshold: 5  },
  { id: 'level_10', category: 'level', icon: 'trending-up-outline', title: 'Guerrier',             description: 'Tu as prouv\u00e9 ta d\u00e9termination.',      threshold: 10 },
  { id: 'level_15', category: 'level', icon: 'cut-outline',         title: 'Combattant',           description: 'Niveau 15. S\u00e9rieux.',                      threshold: 15 },
  { id: 'level_20', category: 'level', icon: 'key-outline',         title: 'V\u00e9t\u00e9ran',   description: 'L\'exp\u00e9rience se voit.',                   threshold: 20 },
  { id: 'level_25', category: 'level', icon: 'trophy',              title: 'Ma\u00eetre',          description: 'Niveau 25. Ma\u00eetrise confirm\u00e9e.',       threshold: 25 },
  { id: 'level_35', category: 'level', icon: 'sparkles-outline',    title: 'Grand Ma\u00eetre',    description: 'Au-del\u00e0 de la moyenne.',                   threshold: 35 },
  { id: 'level_50', category: 'level', icon: 'star',                title: 'L\u00e9gende Vivante', description: 'Niveau 50. Tu inspires.',                       threshold: 50 },
  { id: 'level_75', category: 'level', icon: 'eye-outline',         title: 'Transcendant',         description: 'Niveau 75. Au-del\u00e0 des limites.',          threshold: 75 },

  // ── Records Personnels — total_prs ──────────────────────────────────────
  { id: 'pr_1',   category: 'pr', icon: 'navigate-circle-outline',  title: 'Nouveau record',   description: 'Premier record personnel battu.',           threshold: 1   },
  { id: 'pr_5',   category: 'pr', icon: 'trending-up-outline',      title: 'En progression',   description: '5 PRs. La courbe monte.',                   threshold: 5   },
  { id: 'pr_10',  category: 'pr', icon: 'arrow-up-circle-outline',  title: 'Performeur',       description: '10 records. Tu t\'am\u00e9liores.',          threshold: 10  },
  { id: 'pr_25',  category: 'pr', icon: 'flash',                    title: 'Machine \u00e0 PRs', description: '25 records. Impressionnant.',             threshold: 25  },
  { id: 'pr_50',  category: 'pr', icon: 'barbell',                  title: 'B\u00eate de force', description: '50 PRs. Tu repousses tes limites.',         threshold: 50  },
  { id: 'pr_100', category: 'pr', icon: 'flame',                    title: 'Indestructible',   description: '100 records. Incroyable.',                  threshold: 100 },

  // ── Volume par s\u00e9ance (en kg) ──────────────────────────────────────────────
  { id: 'session_vol_200',  category: 'session_volume', icon: 'water-outline',   title: 'Bonne s\u00e9ance',    description: '200 kg en une s\u00e9ance. Bien jou\u00e9.',  threshold: 200   },
  { id: 'session_vol_500',  category: 'session_volume', icon: 'pulse-outline',   title: 'S\u00e9ance intense',  description: '500 kg soulev\u00e9s en une s\u00e9ance.',    threshold: 500   },
  { id: 'session_vol_1000', category: 'session_volume', icon: 'flash-outline',   title: 'S\u00e9ance de titan', description: '1 tonne en une s\u00e9ance.',                threshold: 1_000 },
  { id: 'session_vol_2000', category: 'session_volume', icon: 'flame-outline',   title: 'S\u00e9ance XXL',      description: '2 tonnes. S\u00e9ance de monstre.',           threshold: 2_000 },
  { id: 'session_vol_5000', category: 'session_volume', icon: 'nuclear-outline', title: 'Mode berserk',         description: '5 tonnes en une s\u00e9ance. L\u00e9gendaire.', threshold: 5_000 },

  // ── Exercices distincts pratiqu\u00e9s ───────────────────────────────────────────
  { id: 'exercises_5',  category: 'exercises', icon: 'apps-outline',  title: 'Curieux',    description: '5 exercices diff\u00e9rents pratiqu\u00e9s.',    threshold: 5  },
  { id: 'exercises_10', category: 'exercises', icon: 'book-outline',  title: 'Explorateur', description: '10 exercices ma\u00eetris\u00e9s.',              threshold: 10 },
  { id: 'exercises_20', category: 'exercises', icon: 'map-outline',   title: '\u00c9rudit', description: '20 exercices dans ton r\u00e9pertoire.',        threshold: 20 },
  { id: 'exercises_30', category: 'exercises', icon: 'flask-outline', title: 'Expert',     description: '30 exercices. Tu connais ton affaire.',           threshold: 30 },
]

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGES_LIST.find(b => b.id === id)
}

export const BADGE_CATEGORY_LABELS: Record<BadgeCategory, string> = {
  sessions: 'S\u00e9ances',
  tonnage: 'Volume total',
  streak: 'R\u00e9gularit\u00e9',
  level: 'Niveau XP',
  pr: 'Records personnels',
  session_volume: 'Volume par s\u00e9ance',
  exercises: 'Exercices',
}
