<!-- v1.0 — 2026-02-26 -->
# Prompt — fix-theme-portal — 20260226-2145

## Demande originale
Crash : `useTheme() appelé hors ThemeProvider` dans `ProgramDetailContentInner`
(via `ProgramDetailBottomSheet` → `BottomSheet` → Portal → `PortalHostComponent`).

## Cause racine
Dans `mobile/src/navigation/index.tsx`, `PortalProvider` enveloppe `ThemeProvider`.
Les composants rendus via Portal sont enfants de `PortalProvider` → hors `ThemeProvider`.

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | `docs/bmad/prompts/20260226-2145-fix-theme-portal-A.md` | `navigation/index.tsx` | 1 | ⏳ |

## Ordre d'exécution
Groupe unique — pas de dépendances.

## Fix en un coup d'œil
```tsx
// AVANT (bug)
<PortalProvider>
  <ThemeProvider>...</ThemeProvider>
</PortalProvider>

// APRÈS (fix)
<ThemeProvider>
  <PortalProvider>...</PortalProvider>
</ThemeProvider>
```
