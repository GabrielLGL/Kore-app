# fix(web) — SocialProof count=0 + autoComplete inputs
Date : 2026-02-27 18:10

## Instruction
`/do docs/bmad/prompts/20260227-1800-audit4-social-form-A.md`

## Rapport source
`docs/bmad/prompts/20260227-1800-audit4-social-form-A.md`

## Classification
Type : fix
Fichiers modifiés :
- `web/src/components/SocialProof.tsx`
- `web/src/components/sections/SubscribeSection.tsx`

## Ce qui a été fait
1. **SocialProof bug count=0** : condition `count === null` élargie à `count === null || count === 0` — quand Supabase renvoie 0 inscrits, affiche "Rejoins les premiers inscrits" au lieu de "0 personnes déjà inscrites".
2. **SubscribeSection autoComplete** : ajout `autoComplete="given-name"` sur le champ prénom et `autoComplete="email"` sur le champ email — les navigateurs peuvent maintenant proposer l'autofill.

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit` depuis `web/`)
- Tests : n/a
- Nouveau test créé : non

## Documentation mise à jour
Aucune

## Statut
✅ Résolu — 20260227-1810

## Commit
`46d4e65` fix(web): SocialProof count=0 fallback, SubscribeSection autoComplete
