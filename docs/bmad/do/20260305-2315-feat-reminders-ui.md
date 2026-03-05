# feat(reminders) — UI Settings rappels d'entraînement
Date : 2026-03-05 23:15

## Instruction
/do docs/bmad/prompts/20260305-2230-rappels-B.md

## Rapport source
docs/bmad/prompts/20260305-2230-rappels-B.md

## Classification
Type : feat
Fichiers modifiés :
- mobile/src/screens/SettingsScreen.tsx (section rappels + time picker)
- mobile/src/i18n/fr.ts (traductions rappels)
- mobile/src/i18n/en.ts (traductions rappels)

## Ce qui a été fait
1. **i18n FR + EN** : Ajout section `settings.reminders` avec 9 clés (title, enable, days, time, dayLabels, permissionNeeded, hours, minutes, timeSheetTitle)
2. **SettingsScreen — section Rappels** :
   - Toggle Activer/Désactiver avec demande de permission notification
   - Sélecteur de jours : 7 boutons toggle (Lun-Dim), multi-select, style neumorphique
   - Sélecteur d'heure : affichage "HH:MM" pressable → ouvre BottomSheet avec FlatList heures (0-23) + minutes (0-55 par pas de 5)
   - LayoutAnimation sur toggle pour reveal/hide fluide
   - Sauvegarde immédiate en DB + replanification des notifications via `updateReminders()`
   - Message inline si permissions refusées (pas d'alerte bloquante)
   - Haptics sur chaque interaction (toggle, jour, heure, confirmation)
   - Position : entre Timer et Gamification

## Vérification
- TypeScript : ✅ zéro erreur
- Tests : ✅ 1572 passed (93 suites)
- Nouveau test créé : non (tests existants passent)

## Documentation mise à jour
aucune

## Statut
✅ Résolu — 20260305-2315
