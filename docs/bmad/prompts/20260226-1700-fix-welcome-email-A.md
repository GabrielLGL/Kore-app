<!-- v1.0 — 2026-02-26 -->
# Rapport — fix(welcome-email) — Groupe A — 20260226-1700

## Objectif

Corriger 2 bugs dans l'email de bienvenue Kore (`welcome.tsx`) détectés lors de la review 20260226-1700 :

1. **URL CTA staging** — Le bouton "Découvrir Kore" pointe vers `https://kore-app-cyan.vercel.app` (URL preview Vercel) au lieu de `https://kore-app.com` (domaine production défini dans `web/src/app/layout.tsx`).

2. **Placeholder unsubscribe non fonctionnel** — Le lien "Se désinscrire" a `href="%unsubscribe_url%"`. Resend ne remplace pas ce placeholder automatiquement. Les utilisateurs cliquant sur ce lien seront envoyés vers l'URL littérale `%unsubscribe_url%`.

## Fichiers concernés

- `web/src/emails/welcome.tsx`

## Contexte technique

- Email template envoyé via **Resend** depuis `web/src/app/api/subscribe/route.ts`
- Resend ne supporte pas les placeholders `%xxx%` pour la désinscription automatique
- Pour la désinscription, Resend recommande d'ajouter un header `List-Unsubscribe` dans l'appel `resend.emails.send()`, ou de gérer la désinscription manuellement côté app
- L'URL canonique du site est `kore-app.com` (défini dans `web/src/app/layout.tsx:13`)
- C'est du code Next.js web, pas React Native — les règles CLAUDE.md mobile (WatermelonDB, Portal, etc.) ne s'appliquent pas ici

## Étapes

1. Ouvrir `web/src/emails/welcome.tsx`
2. **Correction #1** — Ligne ~217 : remplacer `href="https://kore-app-cyan.vercel.app"` par `href="https://kore-app.com"`
3. **Correction #2** — Ligne ~253 : remplacer le lien de désinscription :
   - Option recommandée (simple, honnête) : remplacer `href="%unsubscribe_url%"` par un lien mailto ou retirer le lien et remplacer par un texte statique expliquant comment se désinscrire (ex: "Pour te désinscrire, réponds à cet email.")
   - Ne PAS laisser un placeholder non résolu

## Contraintes

- Ne pas modifier la structure visuelle du template
- Ne pas modifier `route.ts` (pas concerné par ces bugs)
- Ne pas ajouter de nouvelles dépendances
- Corrections chirurgicales uniquement (2 lignes max)

## Critères de validation

- `web/src/emails/welcome.tsx` : URL CTA = `https://kore-app.com`
- `web/src/emails/welcome.tsx` : aucun placeholder `%..%` non résolu
- Revérifier visuellement que la structure du template n'a pas changé
- TypeScript : `npx tsc --noEmit` depuis `web/` → zéro erreur

## Commit attendu

```
fix(email): fix staging URL and broken unsubscribe link in WelcomeEmail
```

Ajouter uniquement : `web/src/emails/welcome.tsx`

## Dépendances

Aucune dépendance externe. Groupe unique.

## Statut

⏳ En attente
