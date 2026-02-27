<!-- v1.0 — 2026-02-27 -->
# Rapport — Audit 6 Site Kore — Groupe C : 404 Not-Found Skip Link — 20260227-2000

## Objectif
La page 404 (`not-found.tsx`) n'a pas de **skip link** ni d'`id="main-content"` sur `<main>`, contrairement à la page d'accueil. Ajouter ces deux éléments pour une accessibilité cohérente.

## Fichiers concernés
- `web/src/app/not-found.tsx`

## Contexte technique
- Page Next.js App Router (Server Component — pas de `"use client"`)
- Actuellement, le composant retourne directement un `<main>` sans fragment parent → il faut envelopper dans `<>...</>` pour ajouter le skip link avant `<main>`
- Le skip link utilise exactement les mêmes classes Tailwind que dans `page.tsx` et `privacy/page.tsx`
- `npx tsc --noEmit` (depuis `web/`) doit rester à 0 erreur

## État actuel du fichier

```tsx
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
      {/* ... contenu ... */}
    </main>
  );
}
```

## Étapes

### 1. Envelopper dans un fragment et ajouter le skip link + id

```tsx
export default function NotFound() {
  return (
    <>
      {/* Skip link — navigation clavier */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-[var(--accent)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Aller au contenu principal
      </a>
      <main id="main-content" className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
        {/* contenu inchangé */}
      </main>
    </>
  );
}
```

Tout le contenu interne de `<main>` reste strictement identique — seule la balise `<main>` reçoit `id="main-content"` et un fragment `<>` est ajouté en wrapper.

## Contraintes
- Ne modifier QUE la structure externe (fragment + skip link + id)
- Le contenu interne de `<main>` (logo pill, card 404, lien retour) reste identique
- Utiliser `var(--accent)` via les classes Tailwind inline (pas de hardcode couleur)

## Critères de validation
- `npx tsc --noEmit` (depuis `web/`) → 0 erreur
- Navigation Tab sur `/404` : le skip link apparaît en premier au focus
- Aucune régression visuelle sur la page 404

## Dépendances
Aucune dépendance — peut tourner en parallèle avec Groupes A et B.

## Statut
✅ Résolu — 20260227-2030

## Résolution
Rapport do : docs/bmad/do/20260227-2030-fix-notfound-skip-link.md
