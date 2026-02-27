<!-- v1.0 — 2026-02-27 -->
# Prompt — Refactor page.tsx en sections — 20260227-0300

## Demande originale
Refactorise web/src/app/page.tsx (actuellement 600+ lignes) en composants séparés dans web/src/components/sections/ : HeroSection.tsx, FeaturesSection.tsx, PricingSection.tsx, SubscribeSection.tsx, FooterSection.tsx. Déplace aussi les constantes FEATURES et PRICING dans web/src/data/. Le state (email, name, status) reste dans page.tsx et est passé en props à SubscribeSection.

## Groupes générés

| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `20260227-0300-refactor-page-A.md` | data/features.ts, data/pricing.ts, sections/FeaturesSection.tsx, sections/PricingSection.tsx | 1 | ⏳ |
| B | `20260227-0300-refactor-page-B.md` | sections/HeroSection.tsx, sections/FooterSection.tsx, sections/SubscribeSection.tsx | 1 | ⏳ |
| C | `20260227-0300-refactor-page-C.md` | app/page.tsx | 2 | ⏳ |

## Ordre d'exécution
- **Vague 1** : A et B en parallèle (créent tous les nouveaux fichiers)
- **Vague 2** : C uniquement après A et B (met à jour page.tsx pour utiliser les sections)

## Notes
- `navVisible` state déplacé dans HeroSection (encapsulé)
- Les tests `page.test.tsx` ne nécessitent aucune modification (Home garde la même interface)
- `web/src/data/` est un nouveau dossier à créer
