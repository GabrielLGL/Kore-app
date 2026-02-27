<!-- v1.0 — 2026-02-27 -->
# Rapport — Site completion — Groupe A — 20260227-0340

## Objectif
Corriger le contraste de la couleur `--text-muted` en thème clair pour passer WCAG AA (≥ 4.5:1).

## Fichiers concernés
- `web/src/app/globals.css`

## Contexte technique
La landing page Next.js utilise des variables CSS custom pour le theming neumorphique.
- Bg clair : `--bg: #ebf0f7`
- Texte muted actuel : `--text-muted: #636e72`
- Contraste calculé : 4.26:1 → **FAIL WCAG AA** (minimum requis : 4.5:1)
- Thème sombre `--text-muted: #b2bec3` sur `--bg: #21242b` → déjà OK (≥ 9:1), ne pas toucher.

La couleur `--text-muted` est utilisée dans :
- `SocialProof.tsx` : texte secondaire dans le badge
- `HeroSection.tsx` : sous-titre, labels stats, liens nav, placeholder inputs
- `SubscribeSection.tsx` : paragraphe description, placeholder inputs, footer
- `FeaturesSection.tsx` : descriptions de features (probablement)
- `globals.css` : potentiellement dans des classes utilitaires

## Étapes
1. Ouvrir `web/src/app/globals.css`
2. Ligne 9, dans le bloc `:root { }`, remplacer :
   ```css
   --text-muted: #636e72;
   ```
   par :
   ```css
   --text-muted: #545c61;
   ```
   (contraste resultant : ≈ 5.5:1 avec #ebf0f7 → PASS WCAG AA)
3. Ne pas toucher le bloc `[data-theme="dark"]` — `#b2bec3` est déjà OK.

## Contraintes
- Ne changer QUE la valeur dans `:root`, pas dans `[data-theme="dark"]`
- Ne pas modifier d'autres propriétés
- Maintenir la même tonalité grise (juste plus foncée)

## Critères de validation
- `npx tsc --noEmit` dans `web/` → zéro erreur (ce changement CSS ne génère pas d'erreurs TS)
- Contraste `#545c61` sur `#ebf0f7` ≥ 4.5:1 ✓
- Le thème sombre reste inchangé

## Dépendances
Aucune — peut s'exécuter en parallèle avec les groupes B, C, D.

## Statut
✅ Résolu — 20260227-0340

## Résolution
Rapport do : docs/bmad/do/20260227-0340-fix-text-muted-wcag.md
