<!-- v1.0 — 2026-02-24 -->
# Prompt — Phase 1 Fondations Kore — 20260224

## Demande originale
Implementer la Phase 1 (Fondations) de la vision Kore issue du brainstorming du 2026-02-23 (103 features, 5 phases). La Phase 1 cree le socle gratuit solide qui rend l'app excellente et prete pour la gamification Pro.

## Source
`docs/brainstorming/brainstorming-session-2026-02-23.md`

## Groupes generes

| Groupe | Rapport | Features | Fichiers principaux | Vague | Statut |
|--------|---------|----------|---------------------|-------|--------|
| A | `20260224-phase1-fondations-A.md` | #100 Niveaux/XP, #7 Streak, #86 Tonnage, #56 Anniversaires | schema, User model, HomeScreen | 1 | ⏳ |
| B | `20260224-phase1-fondations-B.md` | #91 Onboarding | schema, User model, OnboardingScreen, navigation | 1 | ⏳ |
| C | `20260224-phase1-fondations-C.md` | #23 Templates intelligents, #22 Notes exercice | schema, Exercise model, SessionDetail, databaseHelpers | 1 | ⏳ |
| D | `20260224-phase1-fondations-D.md` | #90 Heatmap, #8 Recap, #92 Export | HomeScreen, nouveaux composants, Settings | 1-2 | ⏳ |
| E | `20260224-phase1-fondations-E.md` | #99 Videos/animations | Exercise model, SessionExerciseItem, assets | 2 | ⏳ |

## Ordre d'execution

### Vague 1 — En PARALLELE (aucune dependance entre eux)
- **Groupe A** (Niveaux/XP/Streak/Tonnage) — socle gamification
- **Groupe B** (Onboarding) — premiere impression
- **Groupe C** (Templates + Notes) — core entrainement

### Vague 2 — Apres Vague 1
- **Groupe D** (Heatmap/Recap/Export) — depend partiellement de A pour afficher streak/tonnage dans le recap
- **Groupe E** (Animations) — peut commencer en vague 1 pour la structure, mais les assets viendront plus tard

## Schema migration
ATTENTION: Les groupes A, B, C et E touchent tous schema.ts. La migration doit etre coordonnee:
- Option 1: Un seul groupe fait la migration globale v17 → v18 avec TOUS les champs (recommande)
- Option 2: Chaque groupe fait sa migration incrementale (risque de conflit)
→ Recommandation: Groupe A fait la migration complete (incluant les champs de B, C, E) en vague 1.

## Phases suivantes (non couvertes ici)
- Phase 2: Gamification Pro (Skill Tree, Boss Fights, Saisons, Loot...)
- Phase 3: Stats & Coaching Pro (Dashboard, Volume tracker, Detection plateau...)
- Phase 4: Social & Contenu (Wrapped, Export story, Partage programme...)
- Phase 5: Polish & Avance (Builder drag & drop, Themes, Coach IA...)

Chaque phase fera l'objet d'un prompt similaire une fois la phase precedente terminee.
