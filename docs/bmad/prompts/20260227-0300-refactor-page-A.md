<!-- v1.0 — 2026-02-27 -->
# Rapport — Refactor page.tsx — Groupe A — 20260227-0300

## Objectif
Créer les fichiers de données et les deux sections qui les consomment :
1. `web/src/data/features.ts` — exporte le tableau FEATURES
2. `web/src/data/pricing.ts` — exporte le tableau PRICING
3. `web/src/components/sections/FeaturesSection.tsx` — section Features de la landing
4. `web/src/components/sections/PricingSection.tsx` — section Pricing de la landing

## Fichiers concernés
- **Créer** : `web/src/data/features.ts`
- **Créer** : `web/src/data/pricing.ts`
- **Créer** : `web/src/components/sections/FeaturesSection.tsx`
- **Créer** : `web/src/components/sections/PricingSection.tsx`
- **Ne pas toucher** : `web/src/app/page.tsx` (sera mis à jour par Groupe C)

## Contexte technique
- Projet : Next.js 14 (App Router) + TypeScript strict
- Les composants sont des Client Components (pas de `"use client"` requis ici car pas de state/hooks)
- Styling : Tailwind CSS + variables CSS custom (`var(--bg)`, `var(--accent)`, etc.)
- Classes Tailwind custom : `shadow-neu-out`, `shadow-neu-in`, `reveal` (animation scroll)
- Le dossier `web/src/data/` n'existe pas encore — le créer

## Code source à extraire (depuis `web/src/app/page.tsx`)

### FEATURES (lignes 9-46) :
```ts
export const FEATURES = [
  { icon: "🏋️", title: "Programmes sur mesure", description: "Cree tes propres programmes et seances. Organise tes exercices par muscle, equipement et objectif." },
  { icon: "📊", title: "Suivi de performance", description: "Enregistre chaque serie, chaque rep. Visualise ta progression avec des graphiques detailles." },
  { icon: "⚡", title: "100% Offline", description: "Pas besoin de wifi a la salle. Tout fonctionne en local sur ton telephone, instantanement." },
  { icon: "📱", title: "Interface intuitive", description: "Pensee pour la salle de sport. Navigation rapide, saisie facile, mode sombre qui repose les yeux." },
  { icon: "📈", title: "Historique complet", description: "Retrouve toutes tes seances passees. Analyse tes records et tes tendances sur la duree." },
  { icon: "🎯", title: "Objectifs clairs", description: "Definis tes objectifs et suis ta progression. L\u2019app s\u2019adapte a ton niveau." },
]
```
NB : copier les valeurs Unicode exactes depuis `web/src/app/page.tsx` (lignes 9-46), pas les emoji raccourcis ci-dessus.

### PRICING (lignes 48-90) :
```ts
export const PRICING = [
  { name: "Gratuit", price: "0€", period: "", features: [...], cta: "Commencer gratuitement", highlighted: false },
  { name: "Pro", price: "2,50€", period: "/mois", features: [...], cta: "Essai gratuit 7 jours", highlighted: true },
  { name: "Pro Annuel", price: "19.99€", period: "/an", features: [...], cta: "Economiser 33%", highlighted: false },
]
```
NB : copier les valeurs exactes depuis `web/src/app/page.tsx` (lignes 48-90).

### FeaturesSection (lignes 218-249 de page.tsx) :
Section `<section id="features">` complète, avec import de FEATURES depuis `@/data/features`.

### PricingSection (lignes 251-302 de page.tsx) :
Section `<section id="pricing">` complète, avec import de PRICING depuis `@/data/pricing`.

## Étapes
1. Lire `web/src/app/page.tsx` pour récupérer le code exact
2. Créer `web/src/data/features.ts` avec le type et l'export de FEATURES
3. Créer `web/src/data/pricing.ts` avec le type et l'export de PRICING
4. Créer `web/src/components/sections/FeaturesSection.tsx` — extraire la section features, importer FEATURES depuis `@/data/features`
5. Créer `web/src/components/sections/PricingSection.tsx` — extraire la section pricing, importer PRICING depuis `@/data/pricing`

## Structure attendue

### `web/src/data/features.ts`
```ts
export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [ /* ... */ ];
```

### `web/src/data/pricing.ts`
```ts
export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export const PRICING: PricingPlan[] = [ /* ... */ ];
```

### `web/src/components/sections/FeaturesSection.tsx`
```tsx
import { FEATURES } from "@/data/features";

export default function FeaturesSection() {
  return (
    <section id="features" ...>
      {/* contenu extrait de page.tsx */}
    </section>
  );
}
```

### `web/src/components/sections/PricingSection.tsx`
```tsx
import { PRICING } from "@/data/pricing";

export default function PricingSection() {
  return (
    <section id="pricing" ...>
      {/* contenu extrait de page.tsx */}
    </section>
  );
}
```

## Contraintes
- Ne PAS modifier `web/src/app/page.tsx`
- TypeScript strict — pas de `any`
- Copier le JSX exact (classes Tailwind, structure HTML) — ne rien modifier dans le rendu
- Ne pas ajouter `"use client"` sur ces composants (pas de hooks/state)

## Critères de validation
- Les 4 fichiers créés existent
- `cd web && npx tsc --noEmit` → zéro erreur TypeScript

## Dépendances
Aucune dépendance inter-groupes — peut s'exécuter en parallèle avec Groupe B.

## Statut
✅ Résolu — 20260227-0300

## Résolution
Rapport do : docs/bmad/do/20260227-0300-refactor-page-A.md
