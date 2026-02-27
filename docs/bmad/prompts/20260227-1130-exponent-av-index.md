<!-- v1.0 — 2026-02-27 -->
# Prompt — exponent-av crash fix — 20260227-1130

## Demande originale
```
Error: Cannot find native module 'ExponentAV'
(NOBRIDGE) — Bridgeless mode is enabled
```

## Analyse
`expo-av` est dans `package.json` mais le build Android installé ne contient pas le module natif `ExponentAV`.
L'import **statique** dans `timerBeep.ts` et `RestTimer.tsx` provoque un crash immédiat au démarrage.

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | docs/bmad/prompts/20260227-1130-exponent-av-A.md | timerBeep.ts, RestTimer.tsx | 1 | ⏳ |

## Ordre d'exécution
1 seul groupe — pas de dépendances.

## Action développeur requise après le fix code
```bash
cd mobile && npm run android   # rebuild natif — inclut ExponentAV
```
