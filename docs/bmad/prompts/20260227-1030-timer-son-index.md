<!-- v1.0 — 2026-02-27 -->
# Prompt — timer-son — 20260227-1030

## Demande originale
"j'aimerais pour le timer qu'il fasse un son quand c'est finit, et dans les settings on choisis oui ou non vibration et oui ou non son"

## Groupes générés
| Groupe | Rapport | Fichiers | Vague | Statut |
|--------|---------|----------|-------|--------|
| A | 20260227-1030-timer-son-A.md | schema.ts, User.ts | 1 | ⏳ |
| B | 20260227-1030-timer-son-B.md | RestTimer.tsx, assets/sounds/ | 1 | ⏳ |
| C | 20260227-1030-timer-son-C.md | SettingsScreen.tsx, WorkoutScreen.tsx | 2 | ⏳ |

## Ordre d'exécution
- **Vague 1** : A et B en parallèle (indépendants)
  - A : DB fields (schema + modèle)
  - B : expo-av install + RestTimer modification + fichier son
- **Vague 2** : C après A+B (nécessite les champs DB et l'interface RestTimer)

## Schéma de données
```
User model (après Groupe A)
  vibrationEnabled: boolean  ← timer_enabled déjà existant, même pattern
  timerSoundEnabled: boolean

RestTimer props (après Groupe B)
  vibrationEnabled?: boolean  (défaut true)
  soundEnabled?: boolean      (défaut true)
```
