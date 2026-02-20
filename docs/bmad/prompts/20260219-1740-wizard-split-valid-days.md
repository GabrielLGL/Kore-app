# Prompt analysé — wizard-split-valid-days — 2026-02-19

## Demande originale
"pour les types de programme il faut des limites qu'on va faire ensemble comme un ppl est en 3 ou 6 jours, un push pull en 2 4 ou 6, un 5 jour en 5 jours etc"

Mapping final validé par l'utilisateur :
- `auto`       → 2, 3, 4, 5, 6
- `fullbody`   → 2, 3, 4, 5, 6
- `upperlower` → 2, 4
- `ppl`        → 3, 6
- `brosplit`   → 5
- `arnold`     → 3, 6
- `phul`       → 4
- `fiveday`    → 5
- `pushpull`   → 2, 4, 6
- `fullbodyhi` → 2, 3, 4, 5, 6

## Analyse
Modification du wizard dans AssistantScreen.tsx pour filtrer les jours disponibles selon le split sélectionné.
Comportement : sélection split → jours filtrés → auto-correction si jours courants invalides.

## Commandes générées
| Groupe | /do | Fichiers | Parallèle |
|--------|-----|----------|-----------|
| A | voir ci-dessous | AssistantScreen.tsx | seul |

---

## /do complet

```
/do Dans mobile/src/screens/AssistantScreen.tsx, ajouter des contraintes de jours valides par type de split dans le wizard de création de programme.

CONTEXTE :
- Stack : React Native (Expo 52) + TypeScript + Fabric. Pas de Redux/Context. WatermelonDB.
- Fichier cible : mobile/src/screens/AssistantScreen.tsx
- Les splits disponibles sont définis dans le type AISplit (mobile/src/services/ai/types.ts) :
  'auto' | 'fullbody' | 'upperlower' | 'ppl' | 'brosplit' | 'arnold' | 'phul' | 'fiveday' | 'pushpull' | 'fullbodyhi'
- Les jours par semaine sont actuellement [2, 3, 4, 5, 6] (ligne ~74 de AssistantScreen.tsx)
- L'étape "split" vient AVANT l'étape "jours" dans le wizard (buildSteps())

OBJECTIF :
Quand l'utilisateur sélectionne un type de split, les jours disponibles doivent se filtrer selon ce mapping :
- auto       → [2, 3, 4, 5, 6]
- fullbody   → [2, 3, 4, 5, 6]
- upperlower → [2, 4]
- ppl        → [3, 6]
- brosplit   → [5]
- arnold     → [3, 6]
- phul       → [4]
- fiveday    → [5]
- pushpull   → [2, 4, 6]
- fullbodyhi → [2, 3, 4, 5, 6]

ÉTAPES :
1. Lire AssistantScreen.tsx en entier pour comprendre la structure
2. Lire mobile/src/services/ai/types.ts pour le type AISplit
3. Ajouter une constante SPLIT_VALID_DAYS : Record<AISplit, number[]> avec le mapping ci-dessus, juste après les autres constantes (après DAYS_OPTIONS ou les daysPerWeek actuels)
4. Ajouter une fonction getDaysForSplit(split: AISplit | undefined): number[] qui retourne SPLIT_VALID_DAYS[split] si défini, sinon [2,3,4,5,6] (fallback pour 'auto' ou undefined)
5. Dans le rendu du step "daysPerWeek", remplacer l'array fixe [2,3,4,5,6] par getDaysForSplit(formData.split) pour calculer les options affichées
6. Quand le split change (onPress du split dans le wizard) : après avoir mis à jour formData.split, vérifier si formData.daysPerWeek est toujours valide pour le nouveau split. Si non, auto-sélectionner le premier jour valide du nouveau split.
7. Si le split est undefined ou 'auto', garder tous les jours disponibles
8. S'assurer que le typage est strict (pas de `any`)

CONTRAINTES :
- Ne PAS modifier types.ts ni offlineEngine.ts ni databaseHelpers.ts
- Ne PAS changer l'ordre des étapes du wizard ni la logique buildSteps()
- Ne PAS utiliser de Modal natif — uniquement Portal/BottomSheet si besoin
- Ne PAS utiliser de couleurs hardcodées — utiliser colors.* de theme/index.ts
- Respecter la convention : pas de console.log en prod (guard __DEV__ si nécessaire)
- Typage strict TypeScript (pas de any)

VÉRIFICATION :
- cd mobile && npx tsc --noEmit (0 erreur)
- npm test (tous les tests passent)
- Vérifier visuellement que si on sélectionne "ppl", seuls 3 et 6 jours apparaissent
- Vérifier que si on était sur 4 jours + ppl, ça auto-sélectionne 3

COMMIT :
git add mobile/src/screens/AssistantScreen.tsx
git commit -m "feat(assistant): filter valid days per split type in wizard"

RAPPORT :
Sauvegarder un rapport dans docs/bmad/do/20260219-1740-feat-wizard-split-valid-days.md avec :
- Les changements effectués
- Le mapping implémenté
- Résultats tsc + tests
```
