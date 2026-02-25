<!-- v1.0 — 2026-02-25 -->
# Rapport — Landing Page Kore — Groupe B — 20260225

## Objectif
Améliorer `site/merci.html` (page de confirmation) et créer les fichiers d'infrastructure manquants (CSS partagé, 404, assets).

## Fichiers concernés
- `site/merci.html` (page de confirmation, ~165 lignes)
- `site/404.html` (nouveau — page 404 Netlify)
- `site/_redirects` (nouveau — config Netlify)

## Contexte technique
- Landing page pour l'app **Kore** (musculation RPG offline-first)
- Hébergement Netlify — le formulaire est géré par Netlify Forms
- Design : neumorphisme, light/dark theme
- Branding : gradient `#6c5ce7` → `#00cec9`, font Outfit
- `merci.html` est la page affichée après soumission du formulaire (action="/merci.html")
- Le CSS variables sont dupliquées entre index.html et merci.html (pas de fichier CSS partagé pour l'instant, mais on garde le pattern single-file)

## Améliorations de merci.html

1. **Enrichir le contenu de confirmation** :
   - Ajouter un message plus engageant ("Tu es le fondateur #XX")
   - Ajouter une estimation de date de sortie ou "Bêta Q2 2026"
   - Ajouter des liens sociaux supplémentaires (Instagram, Discord si applicable)
   - Remplacer le lien TikTok placeholder par un vrai lien ou le rendre configurable

2. **Ajouter le logo Kore** (même SVG que index.html) en haut de la card

3. **Ajouter un confetti effect** léger au chargement (CSS only, pas de lib) :
   - Des petites particules qui tombent pendant 2-3 secondes
   - Utiliser des `@keyframes` CSS avec des pseudo-éléments

4. **Maintenir la cohérence** avec les améliorations du Groupe A :
   - Si le Groupe A ajoute `smooth scroll`, l'ajouter ici aussi
   - Garder les mêmes variables CSS

## Créer une page 404

5. **`site/404.html`** — Page 404 personnalisée style Kore :
   - Même design neumorphique
   - Message fun gaming ("Error 404 — Ce boss n'existe pas encore")
   - Bouton retour à l'accueil
   - Background blobs animés (comme les autres pages)

## Configuration Netlify

6. **`site/_redirects`** — Fichier de redirects Netlify :
   ```
   # Netlify redirects
   /* /index.html 200
   ```
   (SPA fallback si besoin futur, sinon juste la config de base)

7. **`site/netlify.toml`** (optionnel) — Config build :
   ```toml
   [build]
     publish = "site/"

   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
   ```

## Contraintes
- Ne pas casser : la navigation `merci.html → index.html`
- Ne pas casser : le système de thème (localStorage partagé entre les pages)
- Garder le même design system neumorphique
- Pas de dépendances externes (pas de libs JS)
- Langue : Français

## Critères de validation
- `merci.html` s'ouvre sans erreur console
- Le thème est conservé entre index.html et merci.html
- La page 404 s'affiche correctement
- Le lien "Retour à l'accueil" fonctionne sur toutes les pages
- Responsive sur mobile (375px)

## Dépendances
Aucune dépendance — ce groupe peut être lancé en parallèle avec le Groupe A.
NOTE : Si le Groupe A modifie le design system (nouvelles variables CSS), il faudra aligner manuellement après.

## Statut
En attente
