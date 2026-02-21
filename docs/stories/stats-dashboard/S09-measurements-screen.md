# S09 — StatsMeasurementsScreen

## Description
Créer l'écran de suivi des mesures corporelles avec saisie, graphique et historique.

## Fichiers à créer
- `mobile/src/screens/StatsMeasurementsScreen.tsx`

## UI (cf UX Design Écran 7)
- Dernière mesure en cards (5 metrics : poids, taille, hanches, bras, poitrine)
- ChipSelector pour choisir la mesure à afficher dans le graphique
- Line chart (VictoryLine) de l'évolution de la mesure sélectée
- Liste historique avec date + valeurs + bouton supprimer
- Bouton "+ Ajouter" dans le header → BottomSheet formulaire

## BottomSheet formulaire
- 5 inputs (keyboardType="decimal-pad", tous optionnels)
- Validation : au moins 1 champ rempli
- Enregistrement : `database.write()` → `bodyMeasurements.create(...)`

## Suppression
- `AlertDialog` "Supprimer cette mesure ?" + `haptics.onDelete()`
- `database.write()` → `measurement.destroyPermanently()`

## Données
`withObservables` sur `body_measurements` (trié par date desc)

## Critères d'acceptation
- [ ] Dernière mesure affichée en cards
- [ ] ChipSelector change le graphique affiché
- [ ] Line chart correct pour chaque métrique
- [ ] Ajout via BottomSheet (pas de native Modal)
- [ ] Validation : au moins 1 champ requis
- [ ] Suppression via AlertDialog
- [ ] Toutes mutations dans `database.write()`
- [ ] `npx tsc --noEmit` passe

## Estimation : L (3-4h)
## Dépendances : S01, S02, S03
