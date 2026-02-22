<!-- v1.0 — 2026-02-22 -->
# Rapport — Supprimer section Outils — Groupe A — 20260222-1430

## Objectif
Supprimer la section "Outils" du HomeScreen dashboard. Les accès vers Réglages (gear icon en header) et Assistant (via ProgramsScreen - Groupe B) sont maintenus par d'autres chemins.

## Fichiers concernés
- `mobile/src/screens/HomeScreen.tsx`

## Contexte technique
- Le HomeScreen utilise un tableau `SECTIONS` (ligne 40-67) pour générer les tuiles du dashboard.
- La section "Outils" est le 3e élément du tableau (lignes 60-66) et contient 2 tuiles : "Assistant" et "Réglages".
- L'icône gear (⚙️) dans le header du HomeScreen est définie dans `navigation/index.tsx` (lignes 136-143) et reste inchangée.
- Le pattern utilise `withObservables` HOC, thème centralisé (`colors`, `spacing`, etc.).

## Étapes
1. Lire `mobile/src/screens/HomeScreen.tsx`.
2. Supprimer le 3e élément du tableau `SECTIONS` (lignes 60-66) :
   ```tsx
   // SUPPRIMER CE BLOC :
   {
     title: 'Outils',
     tiles: [
       { icon: '✨', label: 'Assistant', route: 'Assistant' },
       { icon: '⚙️', label: 'Réglages', route: 'Settings' },
     ],
   },
   ```
3. Vérifier que le gear icon dans `navigation/index.tsx` (headerRight) est toujours présent et navigue vers 'Settings' — NE PAS MODIFIER ce fichier, juste vérifier.
4. Vérifier `npx tsc --noEmit` → zéro erreur.

## Contraintes
- Ne PAS modifier `navigation/index.tsx`
- Ne PAS modifier `ProgramsScreen.tsx` (c'est le Groupe B)
- Ne supprimer que la section "Outils", pas les sections "Entraînement" ni "Statistiques"
- Respecter les conventions : pas de `any`, pas de hardcoded colors

## Critères de validation
- `npx tsc --noEmit` → zéro erreur
- HomeScreen n'affiche plus la section "Outils"
- Le gear icon ⚙️ dans le header du HomeScreen fonctionne toujours (vérifier visuellement le code)
- Les sections "Entraînement" et "Statistiques" sont intactes

## Dépendances
Aucune dépendance — peut être exécuté en parallèle avec Groupe B.

## Statut
✅ Résolu — 20260222-1435

## Résolution
Rapport do : docs/bmad/do/20260222-1435-chore-remove-outils.md
