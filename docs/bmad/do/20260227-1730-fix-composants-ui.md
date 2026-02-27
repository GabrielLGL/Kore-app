# fix(web) — Composants UI : ThemeToggle, SubscribeSection, FeaturesSection
Date : 2026-02-27 17:30

## Instruction
`/do docs/bmad/prompts/20260227-1700-audit3-composants-C.md`

## Rapport source
`docs/bmad/prompts/20260227-1700-audit3-composants-C.md`

## Classification
Type : fix
Fichiers modifiés :
- `web/src/components/ThemeToggle.tsx`
- `web/src/components/sections/SubscribeSection.tsx`
- `web/src/components/sections/FeaturesSection.tsx`

## Ce qui a été fait

### ThemeToggle.tsx
1. **aria-label accent** : `"Changer le theme clair/sombre"` → `"Changer le thème clair/sombre"` (+ title corrigé)
2. **SVG icons** : suppression du `<span>` emoji `☀️`/`🌙` → SVG inline avec `aria-hidden="true"`. Soleil : cercle + 8 rayons. Lune : path croissant. Stylisables CSS via `stroke="currentColor"`, cohérents cross-OS.

### SubscribeSection.tsx
3. **État ratelimit** : type union étendu à `"ratelimit"`, gestion `res.status === 429` ajoutée avant le 409 dans `handleSubmit`
4. **Message 429** : `<p role="alert">Trop de tentatives. Réessaie dans une heure.</p>` affiché pour état `ratelimit`
5. **aria-busy déplacé** : retiré du `<button>`, ajouté sur le `<form>` — sémantiquement correct (c'est la région qui charge, pas le bouton)

### FeaturesSection.tsx
6. **aria-label redondant** : suppression `role="img"` et `aria-label={feature.title}` sur la div emoji, remplacés par `aria-hidden="true"` — le `<h3>` en dessous suffit pour les screenreaders

## Vérification
- TypeScript : ✅ 0 erreur (`npx tsc --noEmit` depuis `web/`)
- Tests : n/a (composants UI sans logique Jest testable)
- Nouveau test créé : non

## Documentation mise à jour
Aucune

## Statut
✅ Résolu — 20260227-1730

## Commit
`c579677` fix(web): ThemeToggle SVG icons, SubscribeSection 429, FeaturesSection aria
