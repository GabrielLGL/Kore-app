# REFACTOR(web) — Créer HeroSection, FooterSection, SubscribeSection
Date : 2026-02-27 03:20

## Instruction
docs/bmad/prompts/20260227-0300-refactor-page-B.md

## Rapport source
docs/bmad/prompts/20260227-0300-refactor-page-B.md

## Classification
Type : refactor
Fichiers modifiés :
- web/src/components/sections/HeroSection.tsx (créé)
- web/src/components/sections/FooterSection.tsx (créé)
- web/src/components/sections/SubscribeSection.tsx (créé)

## Ce qui a été fait
- Créé HeroSection.tsx avec "use client" — inclut nav sticky (navVisible interne), hero complet avec SocialProof + formulaire hero inline. Props nécessaires (adaptation vs rapport initial) : email, name, status, setEmail, setName, onSubmit (page.tsx a évolué depuis la génération du rapport — un formulaire hero inline a été ajouté).
- Créé FooterSection.tsx — composant serveur statique, aucune prop
- Créé SubscribeSection.tsx avec "use client" — props : email, name, status, setEmail, setName, onSubmit. Section download avec le formulaire principal d'inscription.

## Adaptation par rapport au rapport initial
Le rapport B prévoyait HeroSection sans props (navVisible interne uniquement). Mais page.tsx a été modifié pour inclure un formulaire inline dans la section hero (SocialProof + hero-email/hero-name). HeroSection reçoit donc les mêmes props de formulaire que SubscribeSection.

## Vérification
- TypeScript : ✅ npx tsc --noEmit — zéro erreur
- Tests : ⚠️ 6 failed — ÉCHECS PRÉ-EXISTANTS non liés à Group B
  - SocialProof non mocké dans page.test.tsx (fetch /api/subscribers-count)
  - Deux inputs email dans page.tsx (hero-email + subscribe-email) → getByLabelText ambiguë
  - Ces échecs existaient avant les changements de Group B
- Nouveau test créé : non

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260227-0320

## Commit
8ec743f refactor(web): create HeroSection, FooterSection, SubscribeSection
