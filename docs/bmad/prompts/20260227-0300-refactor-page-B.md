<!-- v1.0 — 2026-02-27 -->
# Rapport — Refactor page.tsx — Groupe B — 20260227-0300

## Objectif
Créer les trois sections qui n'ont pas de dépendances vers les fichiers data/ :
1. `web/src/components/sections/HeroSection.tsx` — sticky nav + section hero (navVisible géré en interne)
2. `web/src/components/sections/FooterSection.tsx` — footer statique
3. `web/src/components/sections/SubscribeSection.tsx` — formulaire d'inscription (state passé via props)

## Fichiers concernés
- **Créer** : `web/src/components/sections/HeroSection.tsx`
- **Créer** : `web/src/components/sections/FooterSection.tsx`
- **Créer** : `web/src/components/sections/SubscribeSection.tsx`
- **Ne pas toucher** : `web/src/app/page.tsx` (sera mis à jour par Groupe C)

## Contexte technique
- Projet : Next.js 14 (App Router) + TypeScript strict
- **`"use client"` requis sur HeroSection** (useEffect + useState pour navVisible)
- **`"use client"` requis sur SubscribeSection** (props de callbacks, éventuellement)
- FooterSection : composant statique pur, pas de `"use client"`
- Styling : Tailwind CSS + variables CSS custom (`var(--bg)`, `var(--accent)`, etc.)
- Classes Tailwind custom : `shadow-neu-out`, `shadow-neu-in`, `hero-fade`, `gradient-text`, `btn-liquid`, `shimmer-text`, `reveal`
- Composants importés : `KoreLogo` depuis `@/components/KoreLogo`

## Code source à extraire (depuis `web/src/app/page.tsx`)

### HeroSection — lignes 141-216 :
- **Sticky nav** (lignes 141-169) : nav avec `navVisible` state
- **Hero** (lignes 171-216) : header avec logo, titre, stats, CTA
- Le `navVisible` state + son `useEffect` (lignes 96-104) sont à déplacer **dans** HeroSection

### FooterSection — lignes 379-406 :
- Footer avec liens, logo Kore, copyright

### SubscribeSection — lignes 304-377 :
- Section `<section id="download">` avec le formulaire d'inscription

## Interface Props

### HeroSection — aucune prop (navVisible est interne)

### FooterSection — aucune prop

### SubscribeSection
```tsx
interface SubscribeSectionProps {
  email: string;
  name: string;
  status: "idle" | "loading" | "success" | "error";
  setEmail: (value: string) => void;
  setName: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}
```

## Structure attendue

### `web/src/components/sections/HeroSection.tsx`
```tsx
"use client";

import { useState, useEffect } from "react";
import KoreLogo from "@/components/KoreLogo";

export default function HeroSection() {
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setNavVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* sticky nav */}
      <nav ...>...</nav>
      {/* hero header */}
      <header id="main-content" ...>...</header>
    </>
  );
}
```

### `web/src/components/sections/FooterSection.tsx`
```tsx
import KoreLogo from "@/components/KoreLogo";

export default function FooterSection() {
  return (
    <footer ...>
      {/* contenu extrait de page.tsx */}
    </footer>
  );
}
```

### `web/src/components/sections/SubscribeSection.tsx`
```tsx
interface SubscribeSectionProps {
  email: string;
  name: string;
  status: "idle" | "loading" | "success" | "error";
  setEmail: (value: string) => void;
  setName: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubscribeSection({ email, name, status, setEmail, setName, onSubmit }: SubscribeSectionProps) {
  return (
    <section id="download" ...>
      <form onSubmit={onSubmit} ...>
        {/* inputs email et name avec les props correspondantes */}
      </form>
    </section>
  );
}
```

## Contraintes
- Ne PAS modifier `web/src/app/page.tsx`
- TypeScript strict — pas de `any`
- Copier le JSX exact depuis page.tsx — ne rien modifier dans le rendu visuel
- HeroSection retourne un Fragment `<>...</>` (nav + header ensemble)
- Le `navVisible` state ET son `useEffect` sont déplacés de page.tsx vers HeroSection

## Critères de validation
- Les 3 fichiers créés existent
- `cd web && npx tsc --noEmit` → zéro erreur TypeScript

## Dépendances
Aucune dépendance inter-groupes — peut s'exécuter en parallèle avec Groupe A.

## Statut
✅ Résolu — 20260227-0320

## Résolution
Rapport do : docs/bmad/do/20260227-0320-refactor-page-B.md
Note : HeroSection a reçu les props de formulaire (email, name, status, setEmail, setName, onSubmit) car page.tsx avait évolué pour inclure un formulaire hero inline.
