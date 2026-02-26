<!-- v1.0 — 2026-02-26 -->
# Rapport — fix-theme-portal — Groupe A — 20260226-2145

## Objectif
Corriger l'erreur `useTheme() appelé hors ThemeProvider` qui crash l'app quand
`ProgramDetailBottomSheet` (et tout composant rendu via Portal) utilise `useColors()`
ou `useTheme()`.

## Fichiers concernés
- `mobile/src/navigation/index.tsx` (seul fichier à modifier)

## Contexte technique
`@gorhom/portal` fonctionne ainsi :
- `<PortalProvider>` crée un host où les portails sont rendus.
- Le contenu portalisé devient enfant du `PortalHostComponent`, qui est un enfant
  direct de `PortalProvider` dans l'arbre React.
- Si `ThemeProvider` est à l'INTÉRIEUR de `PortalProvider`, les composants rendus
  via Portal n'ont PAS accès au `ThemeContext`.

Situation actuelle (BUG) dans `AppNavigator()` :
```tsx
<ErrorBoundary>
  <PortalProvider>           // ← ThemeProvider est EN-DESSOUS
    <ThemeProvider initialMode={initialMode}>
      <AppContent />
    </ThemeProvider>
  </PortalProvider>
</ErrorBoundary>
```

## Étapes
1. Ouvrir `mobile/src/navigation/index.tsx`, fonction `AppNavigator` (lignes ~203-211).
2. Inverser `PortalProvider` et `ThemeProvider` — `ThemeProvider` doit envelopper
   `PortalProvider` :
```tsx
<ErrorBoundary>
  <ThemeProvider initialMode={initialMode}>
    <PortalProvider>
      <AppContent />
    </PortalProvider>
  </ThemeProvider>
</ErrorBoundary>
```
3. Vérifier que `AppContent` utilise toujours `useTheme()` (il l'utilise déjà) → OK.
4. Lancer `npx tsc --noEmit` depuis `mobile/` → zéro erreur attendu.

## Contraintes
- Ne PAS modifier `ThemeProvider`, `ThemeContext.tsx`, ni `BottomSheet.tsx`.
- Ne PAS modifier le contenu de `AppContent` — uniquement l'ordre des wrappers.
- Respecter les conventions de commit : `fix(navigation): move ThemeProvider above PortalProvider`

## Critères de validation
- `npx tsc --noEmit` → zéro erreur TypeScript
- `npm test` → zéro fail
- L'app se lance sans crash sur Android
- Ouvrir `ProgramDetailBottomSheet` → plus d'erreur `useTheme() hors ThemeProvider`

## Dépendances
Aucune dépendance — groupe unique.

## Statut
✅ Résolu — 20260226-2145

## Résolution
Rapport do : docs/bmad/do/20260226-2145-fix-navigation-theme-portal.md
