<!-- v1.0 — 2026-02-25 -->
# Rapport — Landing Page Kore — Groupe A — 20260225

## Objectif
Corriger les bugs, restructurer et enrichir `site/index.html` pour en faire une landing page professionnelle et convertissante pour l'app Kore (musculation RPG & data, offline-first).

## Fichiers concernés
- `site/index.html` (fichier principal, ~620 lignes)

## Contexte technique
- Landing page statique HTML/CSS/JS (pas de framework)
- Design : Neumorphisme (ombres outset/inset), light/dark theme
- Hébergement : Netlify (formulaire `data-netlify="true"`)
- Font : Outfit (Google Fonts)
- App name : **KORE** (anciennement WEGOGYM en interne)
- Branding : gradient violet `#6c5ce7` → cyan `#00cec9`
- Le fichier est un single-page monolithique (CSS + JS inline)

## Bugs à corriger en priorité

1. **`typing-text` manquant** : Le JS (ligne 594) cherche `document.getElementById('typing-text')` mais cet élément n'existe pas dans le HTML. Deux options :
   - Ajouter un `<span id="typing-text">` dans le `<h1>` hero (remplacer le mot fixe "LEGACY" par le typing effect qui alterne entre BODY / MIND / DATA / LEGACY)
   - Ou supprimer le code JS inutile (lignes 589-605)
   → Recommandation : implémenter le typing effect dans le hero, c'est plus dynamique

2. **OG Image placeholder** : `https://i.imgur.com/votre-image-de-preview.png` → mettre un vrai lien ou un commentaire TODO clair

3. **Classes `reveal` manquantes** : Le JS `reveal()` est implémenté (ligne 558) mais aucun élément n'a la classe `reveal`. Ajouter `class="reveal"` sur :
   - Chaque `.card` de la grille features
   - La section footer/CTA
   - Le phone mockup

## Améliorations de contenu et structure

4. **Ajouter une section "Comment ça marche"** entre le hero et les features :
   - 3 étapes visuelles (icones + texte court)
   - Ex: "1. Log tes séances → 2. Ton skill tree grandit → 3. Bats des boss et débloque des récompenses"
   - Style : cards neumorphiques horizontales ou en ligne

5. **Ajouter une section Social Proof / Témoignages** :
   - Même si c'est une bêta, ajouter 2-3 citations fictives de "beta testers" avec avatar placeholder
   - Ou un compteur "X personnes déjà inscrites"

6. **Améliorer le CTA footer** :
   - Ajouter un badge "Gratuit pendant la bêta" ou "Offre Fondateur : accès à vie"
   - Rendre le formulaire plus visible (espacement, titre plus gros)

7. **SEO & Meta** :
   - Ajouter `<meta name="robots" content="index, follow">`
   - Ajouter un `<link rel="canonical" href="https://kore-app.netlify.app/">`
   - Corriger la description meta pour inclure des mots-clés pertinents

8. **Accessibilité basique** :
   - Ajouter `alt` text sur les images/SVG
   - Ajouter `aria-label` sur le bouton theme toggle
   - S'assurer que le contraste est suffisant en mode light

## Style & polish

9. **Smooth scroll** : Ajouter `html { scroll-behavior: smooth; }` pour le lien `#join`

10. **Animations d'entrée du hero** : Ajouter un fade-in + slide-up au chargement pour le logo, titre, sous-titre et CTA button

11. **Mobile responsive** : Vérifier et améliorer le responsive (le media query actuel ne couvre que `max-width: 768px`, ajouter `max-width: 480px` pour petits écrans)

## Contraintes
- Ne pas casser : le formulaire Netlify (attributs `data-netlify`, `name`, `action`)
- Ne pas casser : le système de theme switch (localStorage)
- Garder le design neumorphique cohérent
- Garder tout dans un seul fichier HTML (pas de build tool pour l'instant)
- Langue du contenu : Français (sauf le hero "SCULPT YOUR LEGACY" qui reste en anglais pour le branding)

## Critères de validation
- Ouvrir `index.html` dans un navigateur → pas d'erreur console JS
- Le typing effect fonctionne dans le hero
- Les cards apparaissent avec animation au scroll
- Le theme toggle fonctionne (light ↔ dark)
- Le formulaire fonctionne (action vers /merci.html)
- Responsive : le site est utilisable sur mobile (375px)
- Le lien "Accès Bêta" scroll smoothly vers le formulaire

## Dépendances
Aucune dépendance — ce groupe peut être lancé indépendamment.

## Statut
Done
