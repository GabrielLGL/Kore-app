# Passe 6 — Qualité & code mort — 20260227-1220

## Résultat : 🟡 3 issues (0🔴 2🟡 1🔵)

### ✅ Points positifs
- Zéro `any` TypeScript dans tout le code mobile et web
- Zéro `console.log` côté client sans garde `__DEV__`
- Pas d'imports inutilisés détectés
- Conventions de nommage respectées (camelCase vars, PascalCase composants)
- Code DRY — pas de logique dupliquée détectée
- CSS variables bien utilisées dans les composants React/TSX

### 🟡 Issues MEDIUM

#### Q1 — Couleurs hardcodées dans globals.css (keyframes)
**Fichier:** `web/src/app/globals.css:128-131, 193`
```css
@keyframes pulseLogo {
  0%   { filter: drop-shadow(0 0 5px rgba(108, 92, 231, 0.4)); }  /* #6c5ce7 hardcodé */
  50%  { filter: drop-shadow(0 0 15px rgba(0, 206, 201, 0.6)); }  /* #00cec9 hardcodé */
}
.btn-liquid {
  background: linear-gradient(90deg, #6c5ce7, #00cec9, #6c5ce7); /* hardcodé */
}
```
**Fix:** Remplacer par `var(--accent)` et `var(--accent-secondary)`.

#### Q2 — theme-color hardcodé dans layout.tsx
**Fichier:** `web/src/app/layout.tsx:55`
```tsx
other: { "theme-color": "#6c5ce7" }
```
**Fix:** Valeur acceptable pour l'instant (PWA meta), mais pourrait être dynamique.

### 🔵 LOW

#### Q3 — console.error côté serveur sans garde env
**Fichier:** `web/src/app/api/subscribe/route.ts:51,68`
Logs serveur acceptables mais pourraient être wrappés:
```tsx
if (process.env.NODE_ENV !== 'production') console.error(...)
```
