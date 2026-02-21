<!-- v1.0 — 2026-02-21 -->
# Rapport — jsi-bridgeless — Groupe A — 20260221-1800

## Objectif
Résoudre le warning JSI SQLiteAdapter persistant après `npm run android` :
`[🍉] JSI SQLiteAdapter not available… falling back to asynchronous operation`

## Root cause identifiée
WatermelonDB 0.28.x utilise l'ancienne JSI bridge registration (non-TurboModule).
En mode Bridgeless (New Architecture activée via `BuildConfig.IS_NEW_ARCHITECTURE_ENABLED`),
cette registration ne fonctionne pas — le module JSI n'est jamais chargé.
C'est une incompatibilité connue WatermelonDB 0.28.x + Bridgeless.
Un clean build n'y changera rien : c'est architectural, pas un oubli de compilation.

## Fichiers concernés
- `mobile/src/model/index.ts`
- `mobile/android/gradle.properties` (lecture seule pour diagnostic)
- `mobile/app.json` ou `mobile/app.config.js` (lecture seule pour diagnostic)

## Contexte technique
- Stack : Expo 52, New Architecture, Bridgeless mode (confirmé par `(NOBRIDGE)` dans les logs)
- WatermelonDB : `^0.28.0`
- `MainApplication.kt` : `isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED`
- `model/index.ts` : `jsi: true` — correct mais inefficace en Bridgeless
- Options :
  1. Désactiver JSI dans `model/index.ts` → `jsi: false` (élimine le warning, légère perte perf)
  2. Désactiver New Architecture / Bridgeless (déconseillé)
  3. Garder `jsi: true` et documenter (solution actuelle partielle)

## Étapes
1. Lire `mobile/android/gradle.properties` pour vérifier `newArchEnabled`
2. Lire `mobile/app.json` ou `mobile/app.config.js` pour vérifier si New Architecture est forcée
3. **Décision :** Si le projet requiert Bridgeless (Expo 52 default) → passer à `jsi: false`
   dans `model/index.ts` pour éliminer le warning et éviter la confusion
4. Mettre à jour le commentaire dans `model/index.ts` :
   ```ts
   // JSI désactivé : incompatible avec Bridgeless (New Architecture Expo 52).
   // L'adapteur async est utilisé à la place — performance correcte.
   jsi: false,
   ```
5. Vérifier si `npm test` ou `npx tsc --noEmit` signalent quoi que ce soit

## Contraintes
- Ne pas toucher à `MainApplication.kt`
- Ne pas désactiver New Architecture / Bridgeless
- Ne pas modifier la logique DB (models, schema, queries)
- Si `jsi: false` cause une erreur TypeScript → laisser `jsi: true` et documenter seulement
- Respecter CLAUDE.md §5 : pas de `any`, pas de `console.log` sans `__DEV__`

## Critères de validation
- `npx tsc --noEmit` → zéro erreur
- `npm test` → zéro fail
- Warning JSI n'apparaît plus après le changement (nécessite `npm run android`)
- Ou : si `jsi: false` est incorrect → commentaire exhaustif en place et statut documenté

## Dépendances
Aucune dépendance (groupe indépendant)

## Statut
✅ Résolu — 20260221-1800

## Résolution
Rapport do : docs/bmad/do/20260221-1800-chore-jsi-bridgeless.md
