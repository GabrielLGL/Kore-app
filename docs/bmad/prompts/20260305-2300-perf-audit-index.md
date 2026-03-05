<!-- v1.0 — 2026-03-05 -->
# Prompt — Performance Audit (listes, mémoire, startup) — 20260305-2300

## Demande originale
`MVP` Performance audit (listes longues, mémoire, startup)

## Résumé des problèmes détectés

### Listes (Groupe A)
- **8 FlatList** sans aucune prop d'optimisation (`getItemLayout`, `windowSize`, `maxToRenderPerBatch`, `removeClippedSubviews`, `initialNumToRender`)
- **4 renderItem inline** (arrow functions dans JSX) → nouvelle référence à chaque render
- **1 renderItem** non wrappé dans `useCallback`

### Startup (Groupe B)
- **22 écrans** importés statiquement dans `navigation/index.tsx`
- **Zéro** lazy loading — tout est chargé au démarrage
- Seuls HomeScreen et OnboardingScreen sont nécessaires au lancement

### Mémoire (Groupe C)
- **10+ fichiers** avec setTimeout/setInterval → cleanups à vérifier
- `useCallback`/`useMemo` manquants sur des renderItem et props passées à des enfants
- Potentiels objets/arrays recréés à chaque render dans le JSX

## Groupes générés

| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A — FlatList | `20260305-2300-perf-audit-A.md` | 8 screens | 1 | ⏳ |
| B — Startup | `20260305-2300-perf-audit-B.md` | navigation/index.tsx | 1 | ⏳ |
| C — Mémoire | `20260305-2300-perf-audit-C.md` | 10 fichiers | 1 | ⏳ |

## Ordre d'exécution
Tous les groupes sont **indépendants** → une seule vague, 3 sessions parallèles.
