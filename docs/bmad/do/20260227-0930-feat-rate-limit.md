# feat(subscribe) — Rate limiting in-memory sur /api/subscribe
Date : 2026-02-27 09:30

## Instruction
`/do docs/bmad/prompts/20260227-0900-rate-limit-A.md`

## Rapport source
`docs/bmad/prompts/20260227-0900-rate-limit-A.md`

## Classification
Type : feat
Fichiers modifiés :
- `web/src/lib/rateLimit.ts` (créé)
- `web/src/app/api/subscribe/route.ts` (modifié)

## Ce qui a été fait
- Créé `web/src/lib/rateLimit.ts` : helper in-memory avec `checkRateLimit()` (5 req/h/IP, cleanup automatique) et `getClientIp()` (x-forwarded-for → x-real-ip → "unknown")
- Modifié `route.ts` : rate limit check AVANT validation email, retourne 429 + `Retry-After` + message FR si dépassé, ajoute headers `X-RateLimit-*` sur les réponses 200

## Vérification
- TypeScript : ✅ zéro erreur (`npx tsc --noEmit`)
- Tests : ✅ 17 passed, 0 failed (4 suites)
- Nouveau test créé : non (couverture Groupe B à faire)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260227-0930

## Commit
[à remplir]
