# feat(reminders) — Backend rappels d'entraînement
Date : 2026-03-05 22:45

## Instruction
/do docs/bmad/prompts/20260305-2230-rappels-A.md

## Rapport source
docs/bmad/prompts/20260305-2230-rappels-A.md

## Classification
Type : feat
Fichiers modifiés :
- mobile/src/model/schema.ts (v30→v31, +4 colonnes users)
- mobile/src/model/migrations.ts (+migration v31)
- mobile/src/model/models/User.ts (+4 décorateurs reminder)
- mobile/src/services/notificationService.ts (+5 fonctions reminder)
- mobile/src/services/__tests__/notificationService.test.ts (+12 tests)

## Ce qui a été fait
1. **Schema v31** : Ajout de `reminders_enabled` (boolean), `reminder_days` (string, optional), `reminder_hour` (number), `reminder_minute` (number) à la table `users`
2. **Migration v31** : `addColumns` sur `users` avec les 4 nouveaux champs
3. **User model** : Ajout des décorateurs `@field`/`@text` pour les 4 champs avec types corrects
4. **notificationService.ts** :
   - `setupReminderChannel()` — channel Android dédié `training-reminders`
   - `isoToExpoWeekday()` — conversion ISO (1=lun) → expo (1=dim)
   - `scheduleWeeklyReminders(days, hour, minute)` — planifie N notifications hebdomadaires
   - `cancelAllReminders()` — annule seulement les notifications du channel reminder
   - `updateReminders(enabled, days, hour, minute)` — cancel + reschedule
5. **Tests** : 12 nouveaux tests couvrant toutes les fonctions (channel, weekday mapping, scheduling, cancellation, update)

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 19 passed (7 existants + 12 nouveaux)
- Nouveau test créé : oui (12 tests)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260305-2245
