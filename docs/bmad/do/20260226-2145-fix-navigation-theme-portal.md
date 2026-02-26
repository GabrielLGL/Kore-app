# fix(navigation) — ThemeProvider au-dessus de PortalProvider
Date : 2026-02-26 21:45

## Instruction
docs/bmad/prompts/20260226-2145-fix-theme-portal-A.md

## Rapport source
docs/bmad/prompts/20260226-2145-fix-theme-portal-A.md

## Classification
Type : fix
Fichiers modifiés : `mobile/src/navigation/index.tsx`

## Ce qui a été fait
Dans `AppNavigator()`, inversé l'ordre de `PortalProvider` et `ThemeProvider`.
`ThemeProvider` enveloppe désormais `PortalProvider`, ce qui garantit que tout
contenu rendu via Portal (BottomSheet, AlertDialog…) a accès au `ThemeContext`.

Avant :
```tsx
<PortalProvider>
  <ThemeProvider>...</ThemeProvider>
</PortalProvider>
```

Après :
```tsx
<ThemeProvider>
  <PortalProvider>...</PortalProvider>
</ThemeProvider>
```

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 1259 passed (75 suites)
- Nouveau test créé : non (fix d'ordre de providers, pas de logique)

## Documentation mise à jour
Aucune — pattern Portal déjà documenté dans CLAUDE.md.

## Statut
✅ Résolu — 20260226-2145

## Commit
[sera rempli après push]
