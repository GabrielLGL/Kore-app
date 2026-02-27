<!-- v1.0 — 2026-02-27 -->
# Rapport — Audit 4 Site Kore — Groupe A : SocialProof & Form — 20260227-1800

## Objectif
Corriger 2 problèmes dans SocialProof.tsx et SubscribeSection.tsx :
1. **Bug** : `count === 0` affiche "0 personnes déjà inscrites" — pire message de social proof possible
2. **UX** : inputs sans `autoComplete` — les navigateurs ne proposent pas l'autofill

## Fichiers concernés
- `web/src/components/SocialProof.tsx`
- `web/src/components/sections/SubscribeSection.tsx`

## Contexte technique
- `SocialProof` : Server Component pur — PAS de `"use client"` (ne pas en ajouter)
- `SubscribeSection` : `"use client"` — Client Component React
- `npx tsc --noEmit` (depuis `web/`) doit rester à 0 erreur
- Pas de `any` TypeScript
- `SocialProof` reçoit `count: number | null` depuis page.tsx (getSubscriberCount)

---

## Problème 1 — SocialProof : count === 0 non géré (BUG)

**Actuel :**
```tsx
if (count === null) {
  return <div>Rejoins les premiers inscrits</div>;
}
// sinon : affiche "{count} personnes déjà inscrites"
```

**Problème :** Si `count === 0`, affiche "**0** personnes déjà inscrites" — message contre-productif pour la conversion.

**Fix :** Traiter `count === 0` exactement comme `count === null` (message neutre) :
```tsx
if (count === null || count === 0) {
  return (
    <div ...>
      <span aria-hidden="true">🔥</span>
      <span className="text-[var(--text-muted)]">Rejoins les premiers inscrits</span>
    </div>
  );
}
```
La condition `count === null` est simplement élargie avec `|| count === 0`. Le reste du composant est inchangé.

---

## Problème 2 — SubscribeSection : autoComplete manquant

**Actuel :**
```tsx
<input type="text" placeholder="Ton prénom (optionnel)" value={name} ... />
<input type="email" placeholder="Ton email" value={email} ... required />
```

**Problème :** Sans `autoComplete`, les navigateurs ne proposent pas le remplissage automatique → friction inutile pour l'utilisateur.

**Fix :**
```tsx
{/* Champ prénom */}
<input
  id="subscribe-name"
  type="text"
  autoComplete="given-name"
  placeholder="Ton prénom (optionnel)"
  ...
/>

{/* Champ email */}
<input
  id="subscribe-email"
  type="email"
  autoComplete="email"
  placeholder="Ton email"
  ...
/>
```
Ajouter uniquement les attributs `autoComplete` — ne toucher à rien d'autre dans ce composant.

---

## Contraintes
- `SocialProof` : rester Server Component (aucun state, aucun hook)
- `SubscribeSection` : ne pas modifier la logique handleSubmit, les status, ni le style
- Ne pas modifier `page.tsx` (qui passe le count)

## Critères de validation
- `npx tsc --noEmit` (depuis `web/`) → 0 erreur
- Test manuel SocialProof : quand Supabase renvoie 0 → affiche "Rejoins les premiers inscrits"
- Test manuel SubscribeSection : focus sur le champ email → le navigateur propose l'autofill

## Dépendances
Aucune dépendance — peut tourner en parallèle avec Groupe B.

## Statut
⏳ En attente