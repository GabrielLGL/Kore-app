# Corriger le listing Play Store — mentions Pro/abonnements

## Statut : En attente

## Contexte
Le listing Play Store (`docs/play-store/`) contient potentiellement des mentions de fonctionnalites Pro ou d'abonnements. Le MVP est entierement gratuit, sans IAP. Google peut rejeter l'app si le listing mentionne des achats qui n'existent pas.

## Actions
1. Lire `docs/play-store/` pour identifier toutes les mentions Pro/premium/abonnement
2. Decision a prendre :
   - **Option A** : Retirer toutes les mentions (plus safe pour la review Google)
   - **Option B** : Garder avec mention "bientot disponible" (risque de rejet)
3. Appliquer les corrections
4. Commit : `docs(play-store): remove premium mentions for MVP free launch`

## Recommandation
**Option A** recommandee — retirer les mentions. On les rajoutera quand l'IAP sera implementee. Moins de risque de rejet Google.

## Risques
- Rejet Play Store si mentions d'achats absents
- Si Option B : Google peut demander une politique de remboursement

## Priorite : BLOQUANT
Le listing doit etre correct avant soumission.
