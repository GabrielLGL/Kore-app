# Passe 6 — Code mort & qualité — 20260226-1451

## ✅ Conformes
- Imports inutilisés : 0
- `any` non justifié : 0
- `console.log` hors `__DEV__` : 0
- Code mort : 0
- Code commenté : 0

## 🟡 Problème détecté — Couleurs hardcodées dans chartConfig.ts

**Fichier :** `src/theme/chartConfig.ts:22-23`

```typescript
// PROBLÈME : couleurs hardcodées ne suivant pas le theme
color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,      // iOS blue ≠ colors.primary (#00cec9)
labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // blanc ≠ colors.text (#dfe6e9)
```

**Impact :** Les graphiques utilisent des couleurs incorrectes (iOS blue au lieu du teal de l'app).
Violation CLAUDE.md section 3.1 : "No hardcoded colors — always use `colors.*`".

**Les tests confirment le bug** (`chartConfig.test.ts` hardcode les mêmes valeurs fausses).

**Fix :** Utiliser un helper `hexToRgb` pour convertir `colors.primary` et `colors.text` en rgba.
`colors.primary = '#00cec9'` → `rgba(0, 206, 201, opacity)`
`colors.text = '#dfe6e9'` → `rgba(223, 230, 233, opacity)`

## Score Qualité : 18/20 (en attendant correction)
