<!-- v1.0 — 2026-02-22 -->
# Prompt — HomeScreen Dashboard — 20260222-2100

## Demande originale
Refondre le HomeScreen en un dashboard hub avec des boutons/tuiles pour acceder a tous les ecrans : bibliotheque d'exercices, programmes, duree, volume, agenda, muscles, mesures, historique, assistant, reglages.

## Architecture du changement

### Avant
```
HomeScreen = Liste de programmes (drag & drop + CRUD)
Tab Bar : Exercices | Home | Assistant | Stats
StatsScreen = Grille de tuiles stats
```

### Apres
```
HomeScreen = Dashboard hub (header KPI + grille de tuiles navigation)
ProgramsScreen = Liste de programmes (ancien HomeScreen, nouveau fichier)
Tab Bar : Exercices | Home | Assistant | Stats (inchange)
StatsScreen = Grille de tuiles stats (inchange)
```

## Groupes generes

| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `20260222-2100-homescreen-dashboard-A.md` | `screens/ProgramsScreen.tsx` (CREER) | 1 | En attente |
| B | `20260222-2100-homescreen-dashboard-B.md` | `screens/HomeScreen.tsx` (MODIFIER) | 1 | En attente |
| C | `20260222-2100-homescreen-dashboard-C.md` | `navigation/index.tsx` (MODIFIER) | 2 | En attente |

## Ordre d'execution

```
Vague 1 — PARALLELE :
  Groupe A : Creer ProgramsScreen.tsx (copie du HomeScreen actuel)
  Groupe B : Refondre HomeScreen.tsx en dashboard

Vague 2 — SEQUENTIEL (apres A et B) :
  Groupe C : Brancher ProgramsScreen dans la navigation
```

**Pourquoi cet ordre ?**
- A et B touchent des fichiers differents -> parallele
- C a besoin que ProgramsScreen.tsx existe (A) et que HomeScreen soit a jour (B) -> sequentiel apres

## Risques identifies
1. **Navigation types** : Le Groupe B referencera la route 'Programs' avant qu'elle soit dans RootStackParamList. Utiliser un cast temporaire ou ajouter le type dans B puis le confirmer dans C.
2. **Onboarding** : L'OnboardingSheet est actuellement dans HomeScreen. Decider si elle reste dans le nouveau dashboard (recommande) ou migre vers ProgramsScreen.
3. **Tab switching** : Les tuiles du dashboard qui naviguent vers des tabs (Exercices, Assistant) doivent utiliser la bonne syntaxe de navigation imbriquee.

## Validation finale (apres tous les groupes)
- `npx tsc --noEmit` -> zero erreur
- `npm test` -> zero fail
- Le dashboard affiche toutes les tuiles avec icones
- Chaque tuile navigue correctement
- Les programmes sont accessibles via la tuile "Programmes"
- Le back button depuis ProgramsScreen ramene au dashboard
- Les 4 tabs fonctionnent toujours
- Les KPIs du header sont reactifs (withObservables)
