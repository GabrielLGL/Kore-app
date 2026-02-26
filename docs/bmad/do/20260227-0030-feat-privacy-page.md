# feat(privacy) — Nouvelle page /privacy (Politique de confidentialité RGPD)
Date : 2026-02-27 00:30

## Instruction
/do docs/bmad/prompts/20260227-0030-privacy-rgpd-A.md

## Rapport source
docs/bmad/prompts/20260227-0030-privacy-rgpd-A.md

## Classification
Type : feat
Fichiers modifiés :
- `web/src/app/privacy/page.tsx` (NOUVEAU)

## Ce qui a été fait
Création de la page `/privacy` en tant que server component Next.js App Router.
- 9 sections RGPD complètes (responsable, données, base légale, durée, sous-traitants, droits, app mobile, cookies, modifications)
- Design neumorphique cohérent : cards shadow-neu-out/in, CSS vars uniquement, Outfit font hérité
- Composants réutilisés : ThemeToggle, BackgroundBlobs, KoreLogo
- Tableau des données collectées (email/prénom)
- Cartes pour chaque sous-traitant (Supabase, Resend, Vercel) avec lien politique de confidentialité
- Lien CNIL (www.cnil.fr/fr/plaintes)
- Back link en haut ET en bas de page
- Métadonnées SEO (title + description)
- Aucune couleur hardcodée — 100% CSS vars

## Vérification
- TypeScript : ✅ 0 erreur (npx tsc --noEmit)
- Tests : ✅ 17 passed, 0 failed (4 fichiers)
- Nouveau test créé : non (page statique, pas de logique métier)

## Documentation mise à jour
Aucune

## Statut
✅ Résolu — 20260227-0030

## Commit
b770422 feat(privacy): add /privacy page — RGPD compliant policy
