<!-- v1.0 — 2026-02-27 -->
# Rapport — Audit 3 Site Kore — Groupe C : Composants UI — 20260227-1700

## Objectif
Corriger 4 problèmes UX/accessibilité dans les composants :
1. `ThemeToggle` : aria-label sans accent + remplacer emojis par SVG
2. `SubscribeSection` : gestion du status 429 manquante + `aria-busy` mal placé
3. `FeaturesSection` : `aria-label` redondant sur les divs icône emoji

## Fichiers concernés
- `web/src/components/ThemeToggle.tsx`
- `web/src/components/sections/SubscribeSection.tsx`
- `web/src/components/sections/FeaturesSection.tsx`

## Contexte technique
- `ThemeToggle` et `SubscribeSection` : `"use client"` — Client Components
- `FeaturesSection` : Server Component pur — PAS de `"use client"` (ne pas en ajouter)
- `npx tsc --noEmit` (depuis `web/`) doit rester à 0 erreur
- Pas de `any` TypeScript
- Logique métier de SubscribeSection (rate limit, duplicate check, API call) inchangée

---

## Problème 1 — ThemeToggle : aria-label sans accent + emojis

### 1a. Accent manquant (minor mais incorrect)
**Actuel :**
```tsx
aria-label="Changer le theme clair/sombre"
```
**Fix :**
```tsx
aria-label="Changer le thème clair/sombre"
```

### 1b. Emojis ☀️/🌙 → SVG icons (cohérence design)
**Problème :** Les emojis unicode varient visuellement selon l'OS (Android vs Windows vs macOS) et ne sont pas stylisables via CSS. Le design neumorphique mérite des icônes cohérentes.

**Fix :** Remplacer le `<span>` emoji par des SVG inline simples :
```tsx
{theme === "light" ? (
  // Soleil
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
) : (
  // Lune
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)}
```
Supprimer le `<span aria-hidden="true">` et remplacer par les SVG directement dans le bouton.

---

## Problème 2 — SubscribeSection : status 429 non géré

### 2a. Gestion du 429 (rate limit)
**Problème :** L'API `/api/subscribe` renvoie un 429 avec message "Trop de tentatives. Réessayez dans une heure." mais le front ne traite que `res.ok`, `res.status === 409`, et les autres (→ "error" générique). L'utilisateur rate-limité voit "Une erreur est survenue. Réessaie." — message trompeur.

**Fix :** Ajouter un état `"ratelimit"` et la gestion dans `handleSubmit` :

```ts
// État
const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate" | "ratelimit">("idle");

// Dans handleSubmit :
} else if (res.status === 429) {
  setStatus("ratelimit");
} else if (res.status === 409) {
  setStatus("duplicate");
} else {
  setStatus("error");
}
```

```tsx
{status === "ratelimit" && (
  <p role="alert" className="text-[var(--accent)] text-sm font-semibold">
    Trop de tentatives. Réessaie dans une heure.
  </p>
)}
```

### 2b. `aria-busy` mal placé
**Actuel :** `aria-busy` est sur le `<button>`. Or `aria-busy` est sémantiquement correct sur la **région** en cours de chargement, pas sur le bouton qui déclenche l'action. Le `<button>` devrait utiliser uniquement `aria-disabled`.

**Fix :** Déplacer `aria-busy` sur le `<form>` :
```tsx
<form
  onSubmit={handleSubmit}
  aria-busy={status === "loading"}
  className="reveal space-y-4 max-w-md mx-auto"
  aria-label="Formulaire d'inscription"
>
```
Et sur le bouton, supprimer `aria-busy` :
```tsx
<button
  type="submit"
  aria-disabled={status === "loading"}
  tabIndex={status === "loading" ? -1 : 0}
  ...
>
```

---

## Problème 3 — FeaturesSection : `aria-label` redondant sur div emoji

**Actuel :**
```tsx
<div className="..." role="img" aria-label={feature.title}>
  {feature.icon}
</div>
<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
```
**Problème :** `aria-label={feature.title}` sur la div icône est identique au contenu du `<h3>` → redondance pour les screenreaders (annonce deux fois le même texte).

**Fix :** Rendre la div icône décorative :
```tsx
<div
  className="w-[70px] h-[70px] rounded-[20px] bg-[var(--bg)] shadow-neu-in flex items-center justify-center text-3xl mb-6"
  aria-hidden="true"
>
  {feature.icon}
</div>
```
Supprimer `role="img"` et `aria-label`. La `<h3>` qui suit décrit déjà la carte.

---

## Contraintes
- `FeaturesSection` : rester Server Component — ne pas ajouter `"use client"`
- `SubscribeSection` : ne pas modifier la logique d'appel API (fetch, headers, body)
- `ThemeToggle` : conserver la logique `localStorage` et `setAttribute` exactement
- Types stricts — le nouveau type union doit inclure `"ratelimit"` explicitement

## Critères de validation
- `npx tsc --noEmit` (depuis `web/`) → 0 erreur
- Test visuel ThemeToggle : icônes SVG cohérentes avec le design neumorphique
- Test manuel SubscribeSection : simuler 5+ tentatives → message "Trop de tentatives" affiché
- `axe` DevTools → 0 violation sur FeaturesSection, ThemeToggle, SubscribeSection

## Dépendances
Aucune dépendance — peut tourner en parallèle avec Groupes A et B.

## Statut
⏳ En attente
