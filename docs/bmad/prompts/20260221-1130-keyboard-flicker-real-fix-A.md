<!-- v1.0 — 2026-02-21 -->
# Rapport — keyboard-flicker-real-fix — Groupe A — 20260221-1130

## Objectif
Corriger le vrai bug de flickering clavier lors du renommage d'un programme/séance.
Le fix précédent (InteractionManager) n'a rien changé : l'animation BottomSheet utilise
`useNativeDriver: true`, donc elle s'exécute sur le thread natif — InteractionManager
ne la track pas et fire IMMÉDIATEMENT. Le CustomModal s'ouvre toujours pendant l'animation.

Deux approches valides (choisir selon la ligne de code la plus simple) :
- **Option A (recommandée)** : `setTimeout(300)` stocké dans un `useRef` avec cleanup
- **Option B** : supprimer `autoFocus` du TextInput (le clavier ne s'ouvre pas automatiquement)

## Cause racine confirmée
`BottomSheet.tsx` animation de fermeture : 200ms, `useNativeDriver: true` → thread natif.
`InteractionManager.runAfterInteractions()` ne track que le thread JS → fire immédiatement.
Le CustomModal s'ouvre à t=0ms, le BottomSheet ferme entre t=0 et t=200ms → conflit.

## Fichiers concernés
- `mobile/src/screens/HomeScreen.tsx` uniquement

## Contexte technique
- `BottomSheet.tsx` animation close : 200ms slide + 150ms fade, useNativeDriver: true
- `HomeScreen.tsx` ligne ~284 : handler "Renommer le Programme"
- `HomeScreen.tsx` ligne ~301 : handler "Renommer la Séance"
- Actuellement ces handlers utilisent `InteractionManager.runAfterInteractions()` (inefficace)
- `CustomModal` a `autoFocus` sur le TextInput (ligne ~253 de HomeScreen)
- CLAUDE.md : setTimeout OK si cleanup via useRef

## Étapes

### Option A — setTimeout(300) avec cleanup via useRef (recommandée)

#### 1. Déclarer les refs de timer en haut du composant (dans la section useState/useRef)
```tsx
const renameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
const renameSessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
```

#### 2. Ajouter un useEffect de cleanup pour les timers
Dans la section des useEffect existants, ajouter :
```tsx
useEffect(() => {
  return () => {
    if (renameTimerRef.current) clearTimeout(renameTimerRef.current)
    if (renameSessionTimerRef.current) clearTimeout(renameSessionTimerRef.current)
  }
}, [])
```

#### 3. Remplacer le handler "Renommer le Programme" (ligne ~284)
Avant :
```tsx
onPress={() => { if (selectedProgram) prepareRenameProgram(selectedProgram); setIsOptionsVisible(false); InteractionManager.runAfterInteractions(() => { setIsProgramModalVisible(true) }) }}
```
Après :
```tsx
onPress={() => {
  if (selectedProgram) prepareRenameProgram(selectedProgram)
  setIsOptionsVisible(false)
  renameTimerRef.current = setTimeout(() => {
    setIsProgramModalVisible(true)
    renameTimerRef.current = null
  }, 300)
}}
```

#### 4. Remplacer le handler "Renommer la Séance" (ligne ~301)
Avant :
```tsx
onPress={() => { if (selectedSession) prepareRenameSession(selectedSession); setIsSessionOptionsVisible(false); InteractionManager.runAfterInteractions(() => { setIsSessionModalVisible(true) }) }}
```
Après :
```tsx
onPress={() => {
  if (selectedSession) prepareRenameSession(selectedSession)
  setIsSessionOptionsVisible(false)
  renameSessionTimerRef.current = setTimeout(() => {
    setIsSessionModalVisible(true)
    renameSessionTimerRef.current = null
  }, 300)
}}
```

#### 5. Supprimer l'import InteractionManager (plus utilisé)
Dans l'import react-native ligne 2, retirer `InteractionManager` de la liste.

### Option B — Supprimer autoFocus (alternative simple)

Si l'Option A ne résout pas complètement ou semble trop complexe :
Trouver le TextInput du modal programme (ligne ~253) et supprimer `autoFocus`.
Trouver le TextInput du modal séance et supprimer `autoFocus`.
→ Le clavier ne s'ouvre pas automatiquement, l'utilisateur tape dessus pour taper.
→ Supprimer aussi InteractionManager du handler et remettre la version directe.

## Contraintes
- Ne PAS modifier `CustomModal.tsx` ni `BottomSheet.tsx`
- Respecter CLAUDE.md : tout setTimeout doit avoir cleanup via useRef
- Pas de `any`, pas de hardcoded colors
- L'import `InteractionManager` doit être retiré s'il n'est plus utilisé

## Critères de validation
- `npx tsc --noEmit` → zéro erreur
- `npm test` → zéro fail
- Comportement attendu (Option A) : le clavier apparaît UNE SEULE FOIS après que le BottomSheet a fini de se fermer (~300ms après le tap)
- Comportement attendu (Option B) : aucun flickering, user tape sur le TextInput pour ouvrir le clavier

## Dépendances
Aucune dépendance inter-groupes. Seul groupe.

## Statut
⏳ En attente
