# PRD — Assistant IA Refonte Wizard — 2026-02-19

## Contexte
Refonte de l'assistant IA : suppression du mode chat, wizard unifié premium,
nouvelles options de personnalisation (split type + focus musculaire).

---

## MUST HAVE

### US-1 — Suppression du mode chat
> En tant qu'utilisateur, je vois toujours le wizard, quel que soit mon provider configuré.

**Critères d'acceptation :**
- `isConnectedMode` supprimé — plus de branching UI
- Supprimé : `chatMessages`, `chatStep`, `chatFormData`, `chatScrollRef`, `chatInitRef`
- Supprimé : `renderChatUI`, `handleChatSelect`, `handleEquipmentChatNext`, `toggleChatEquipment`
- Les providers cloud fonctionnent toujours via `generatePlan()` — seul l'UI change
- Tous les styles `chat*` supprimés des StyleSheet

---

### US-2 — Wizard unifié & nettoyage DRY
> En tant que développeur, le code ne contient qu'un seul `toggleEquipment` et qu'un seul état de formulaire.

**Critères d'acceptation :**
- `formData` unique (plus de `chatFormData`)
- `toggleEquipment` unique (plus de `toggleChatEquipment`)
- `buildSteps()` conservé et étendu (cf US-7)
- AssistantScreen.tsx < 500 lignes après refonte

---

### US-3 — Progress bar & transitions améliorées
> En tant qu'utilisateur, je vois clairement ma progression et les transitions entre étapes sont fluides.

**Critères d'acceptation :**
- Progress bar : hauteur 6px (au lieu de 3px), `colors.primary`, `borderRadius.sm`
- Transition entre étapes : fade out/in (`Animated.timing`, 150ms) sur le contenu
- Step counter : `fontSize.md` (au lieu de sm), couleur `colors.text`

---

### US-4 — Badge provider dans le wizard
> En tant qu'utilisateur, je sais quel moteur génère mon plan sans lire un texte gris minuscule.

**Critères d'acceptation :**
- Remplacer `providerHint` (texte xs en bas) par un badge dans le header
- Format : `⚡ Gemini` / `⚡ Claude` / `⚡ GPT-4o` / `🔌 Offline`
- Style badge : `colors.card`, `borderRadius.lg`, `fontSize.sm`, `fontWeight: '600'`
- Positionnement : coin supérieur droit du header (à côté du step counter)

---

### US-5 — PreviewSheet enrichie
> En tant qu'utilisateur, je vois les poids cibles et un résumé du plan pour évaluer rapidement.

**Critères d'acceptation :**
- Afficher `weightTarget` quand > 0 : format `~45 kg` en `colors.textSecondary`
- Résumé sous le titre : `"3 séances · 15 exercices"` (ou `"1 séance · 6 exercices"`)
- Titre dynamique : `"Programme généré"` ou `"Séance générée"` selon `form.mode`
- ScrollView → `flex: 1` (plus de `maxHeight: 320` fixe)

---

### US-6 — Choix du type de split (mode programme)
> En tant qu'utilisateur, je peux choisir le style de mon programme plutôt que de laisser l'algo décider.

**Critères d'acceptation :**
- Nouveau type : `AIFormData.split?: 'auto' | 'fullbody' | 'upperlower' | 'ppl'`
- Nouvelle étape wizard (après `daysPerWeek`, mode programme uniquement) :
  - "Quel style de programme ?" — 4 options avec sous-titres :
    - Automatique — *L'IA choisit selon tes jours*
    - Full Body — *Tout le corps à chaque séance*
    - Upper / Lower — *Haut et bas du corps en alternance*
    - PPL — *Push · Pull · Legs*
- `offlineEngine.ts` : si `form.split !== 'auto'`, utiliser le split fourni plutôt qu'auto-calculer depuis les jours
- Les providers cloud reçoivent `split` dans le prompt système

---

### US-7 — Focus musculaire (mode programme)
> En tant qu'utilisateur, je peux indiquer les muscles que je veux prioriser, et le programme leur donne plus de volume.

**Critères d'acceptation :**
- Nouveau type : `AIFormData.musclesFocus?: string[]`
- Nouvelle étape wizard (après `split`, mode programme uniquement) :
  - "Sur quels muscles veux-tu progresser ?" — multi-select + option "Équilibré"
  - Options : Pecs, Dos, Épaules, Bras, Jambes, Abdos, Équilibré
  - "Équilibré" est une option exclusive : la sélectionner vide les autres sélections
- Sélectionner un muscle désélectionne automatiquement "Équilibré"
- "Équilibré" sélectionné → `musclesFocus: []` (tableau vide = pas de biais)
- `offlineEngine.ts` comportement priorité de volume :
  - Si `musclesFocus` non vide : lors du `buildSession`, placer en premier les exercices ciblant les muscles focus, puis compléter avec les autres
  - Les muscles non-focus restent présents mais minoritaires (pas de filtre strict)
- Les providers cloud reçoivent `musclesFocus` dans le prompt système via `buildPrompt`
- `buildPrompt` ajoute dans CONTRAINTES : `Split souhaité : PPL` + `Muscles prioritaires : Dos, Bras`

---

## SHOULD HAVE

### US-8 — Bouton Recommencer
> En tant qu'utilisateur, je peux recommencer le wizard depuis le début en un tap.

**Critères d'acceptation :**
- Bouton "✕" dans le header, visible dès step > 0
- Confirmation `AlertDialog` si step > 2 : "Recommencer depuis le début ?"
- Remet `formData` à `{ equipment: [] }` et `currentStep` à 0
- `useHaptics().onDelete()` sur l'action de reset

---

## Wizard steps — récapitulatif final

### Mode Programme (8 étapes)
| # | Step | Field | Kind |
|---|------|-------|------|
| 1 | Que veux-tu générer ? | mode | single |
| 2 | Quel est ton objectif ? | goal | single |
| 3 | Quel est ton niveau ? | level | single |
| 4 | Quel équipement as-tu ? | equipment | multi |
| 5 | Combien de temps par séance ? | durationMin | single |
| 6 | Combien de jours par semaine ? | daysPerWeek | single |
| 7 | Quel style de programme ? | split | single — NEW |
| 8 | Sur quels muscles progresser ? | musclesFocus | multi — NEW |

### Mode Séance (7 étapes — inchangé)
| # | Step | Field | Kind |
|---|------|-------|------|
| 1 | Que veux-tu générer ? | mode | single |
| 2 | Quel est ton objectif ? | goal | single |
| 3 | Quel est ton niveau ? | level | single |
| 4 | Quel équipement as-tu ? | equipment | multi |
| 5 | Combien de temps par séance ? | durationMin | single |
| 6 | Quel groupe musculaire ? | muscleGroup | single |
| 7 | Dans quel programme ? | targetProgramId | programs |

---

## Fichiers impactés

| Fichier | Type de changement |
|---------|-------------------|
| `services/ai/types.ts` | + `split`, `musclesFocus` dans AIFormData |
| `services/ai/offlineEngine.ts` | Utiliser `form.split` + logique `musclesFocus` priorité volume |
| `services/ai/providerUtils.ts` | Injecter `split` + `musclesFocus` dans le prompt |
| `screens/AssistantScreen.tsx` | Refonte complète : suppression chat, ajout steps, badge |
| `components/AssistantPreviewSheet.tsx` | Afficher poids, résumé, titre dynamique |

---

## Priorisation MoSCoW

| Story | Priorité | Effort |
|-------|----------|--------|
| US-1 Suppression chat | Must | M |
| US-2 DRY wizard | Must | S |
| US-3 Progress + transitions | Must | S |
| US-4 Badge provider | Must | XS |
| US-5 PreviewSheet enrichie | Must | S |
| US-6 Split type | Must | S |
| US-7 Focus musculaire | Must | M |
| US-8 Bouton recommencer | Should | XS |

**Total : 7 Must + 1 Should — 8 stories**
