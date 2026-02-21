# S10 — SettingsScreen — Champ nom utilisateur

## Description
Ajouter une section "Mon profil" dans SettingsScreen pour permettre à l'utilisateur de saisir et modifier son prénom.

## Fichiers à modifier
- `mobile/src/screens/SettingsScreen.tsx`

## Tâches techniques
- Ajouter une section "Mon profil" au-dessus des sections existantes
- Input texte pour le champ `name` (avec valeur actuelle pré-remplie)
- Validation via `isValidText()` (si vide → sauvegarder `null`)
- Sauvegarde : `database.write()` → `user.update(u => { u.name = value || null })`
- Affichage réactif via `withObservables` (déjà en place)

## UI
```
┌─────────────────────────────────────────┐
│ 👤 Mon profil                           │
│ Prénom                                  │
│ [Gabriel__________________________]     │
│ Affiché sur votre dashboard stats       │
└─────────────────────────────────────────┘
```

## Critères d'acceptation
- [ ] Champ prénom visible et modifiable
- [ ] Valeur actuelle pré-remplie
- [ ] Sauvegarde dans `database.write()`
- [ ] Si vide → `null` sauvegardé (dashboard affichera "Toi")
- [ ] `npx tsc --noEmit` passe

## Estimation : XS (< 1h)
## Dépendances : S01
