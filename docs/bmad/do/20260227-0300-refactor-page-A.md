# REFACTOR(web) — Extraire FEATURES/PRICING en data/ + FeaturesSection + PricingSection
Date : 2026-02-27 03:00

## Instruction
docs/bmad/prompts/20260227-0300-refactor-page-A.md

## Rapport source
docs/bmad/prompts/20260227-0300-refactor-page-A.md

## Classification
Type : refactor
Fichiers modifiés :
- web/src/data/features.ts (créé)
- web/src/data/pricing.ts (créé)
- web/src/components/sections/FeaturesSection.tsx (créé)
- web/src/components/sections/PricingSection.tsx (créé)

## Ce qui a été fait
- Créé `web/src/data/` (nouveau dossier)
- Extrait la constante FEATURES avec interface `Feature` typée
- Extrait la constante PRICING avec interface `PricingPlan` typée
- Créé FeaturesSection.tsx — importe FEATURES, contient le JSX exact de page.tsx (lignes 280-310)
- Créé PricingSection.tsx — importe PRICING, contient le JSX exact de page.tsx (lignes 312-363)
- page.tsx NON modifié (sera traité par Groupe C)

## Vérification
- TypeScript : ✅ npx tsc --noEmit — zéro erreur
- Tests : ⚠️ 6 failed — ÉCHECS PRÉ-EXISTANTS non liés à Group A
  - `SocialProof` n'est pas mocké dans page.test.tsx (fetch vers /api/subscribers-count non mocké)
  - Deux inputs email dans page.tsx (hero-email + subscribe-email) → getByLabelText ambiguë
  - Ces échecs existaient avant les changements de Group A
- Nouveau test créé : non (Group A ne crée que des fichiers statiques sans logique)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260227-0300

## Commit
b843aca refactor(web): extract FEATURES/PRICING to data/ + FeaturesSection + PricingSection
