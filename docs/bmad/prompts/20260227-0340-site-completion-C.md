<!-- v1.0 — 2026-02-27 -->
# Rapport — Site completion — Groupe C — 20260227-0340

## Objectif
Corriger le state de chargement du composant SocialProof : afficher un skeleton pendant le fetch, le vrai count en cas de succès, et le fallback 342 seulement en cas d'erreur.

## Fichiers concernés
- `web/src/components/SocialProof.tsx`

## Contexte technique
`SocialProof` est un composant Client (`"use client"`) qui affiche le nombre d'inscrits dans un badge neumorphique dans le Hero.

**Problème actuel :**
```tsx
const [count, setCount] = useState<number | null>(null);
const displayed = count ?? FALLBACK; // → affiche 342 dès le rendu initial
```
- `count` démarre à `null` → `null ?? 342` = `342` → 342 affiché avant même que le fetch commence
- Pas de distinction entre "chargement en cours" et "erreur"
- Résultat : l'utilisateur voit 342, puis potentiellement un autre chiffre → UX jarring

**Fix :** Ajouter un état `loading: boolean` séparé. Pendant le chargement, afficher un skeleton animé avec `animate-pulse`. En cas de succès, afficher le vrai count. En cas d'erreur, afficher le fallback 342.

**Contexte design :**
- Classe `animate-pulse` disponible via Tailwind (déjà utilisé dans le projet)
- Couleurs : `var(--text-muted)` pour le skeleton, `var(--accent)` pour le vrai count
- Le skeleton doit avoir une largeur fixe (`w-8`) pour ne pas faire sauter le layout

## Étapes
Réécrire entièrement `web/src/components/SocialProof.tsx` :

```tsx
"use client";

import { useEffect, useState } from "react";

const FALLBACK = 342;

export default function SocialProof() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscribers-count")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { count: number }) => {
        setCount(data.count);
        setLoading(false);
      })
      .catch(() => {
        setCount(FALLBACK);
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="hero-fade inline-flex items-center gap-2 mt-6 px-5 py-2 rounded-full
        bg-[var(--glass)] border border-[var(--glass-border)] backdrop-blur-[10px]
        shadow-neu-out text-sm"
    >
      <span aria-hidden="true">🔥</span>
      <span className="text-[var(--text-muted)]">
        {loading ? (
          <span
            className="inline-block w-8 h-3 rounded bg-[var(--text-muted)] opacity-30 animate-pulse align-middle"
            aria-hidden="true"
          />
        ) : (
          <span className="font-black text-[var(--accent)]">{count ?? FALLBACK}</span>
        )}
        {" "}personnes déjà inscrites
      </span>
    </div>
  );
}
```

## Contraintes
- Garder le même markup DOM (classes, structure)
- Ne pas modifier l'API `/api/subscribers-count`
- `FALLBACK = 342` ne doit apparaître QUE si le fetch échoue (pas pendant le chargement)
- Le skeleton doit être `aria-hidden="true"` (décoratif)

## Critères de validation
- `npx tsc --noEmit` dans `web/` → zéro erreur
- Comportement :
  - Pendant le fetch → skeleton pulsant visible, pas "342"
  - Fetch OK → vrai count (ex: 0 si base vide)
  - Fetch KO → "342 personnes déjà inscrites"

## Dépendances
Aucune — peut s'exécuter en parallèle avec les groupes A, B, D.

## Statut
✅ Résolu — 20260227-0340

## Résolution
Rapport do : docs/bmad/do/20260227-0340-fix-SocialProof.md
