# S05 — Installation expo-file-system + expo-sharing

## Description
En tant que systeme, je veux que expo-file-system et expo-sharing soient installes, afin que l'export de donnees fonctionne.

## Dependance
Aucune

## Fichiers concernes
- `mobile/package.json` (MODIFIE automatiquement)

## Taches techniques

### 1. Installation
```bash
cd mobile && npx expo install expo-file-system expo-sharing
```

### 2. Verification
- Les deux packages apparaissent dans `dependencies` de `package.json`
- `npx tsc --noEmit` passe (pas de conflit de types)

## Criteres d'acceptation
- [ ] `expo-file-system` dans package.json
- [ ] `expo-sharing` dans package.json
- [ ] `npx tsc --noEmit` → 0 erreur

## Estimation
XS (<15 min)
