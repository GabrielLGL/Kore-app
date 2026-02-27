<!-- v1.0 — 2026-02-28 -->
# Rapport — post-action-navigation — Groupe A — 20260228-0047

## Objectif
Corriger les redirections post-validation dans AssistantScreen :
1. Mode 'program' → aller vers la liste des programmes (`Programs`) et non `Home`
2. Mode 'session' → aller vers `ProgramDetail` (liste des séances du programme) et non `SessionDetail`

## Fichiers concernés
- `mobile/src/screens/AssistantScreen.tsx` (lignes 413–435)

## Contexte technique
- Le wizard IA génère soit un programme complet (mode='program') soit une séance unique (mode='session')
- Après validation, `handleValidate` appelle `importGeneratedPlan()` ou `importGeneratedSession()` puis navigue
- `importGeneratedSession(plan.sessions[0], currentTargetProgramId)` retourne la `Session` créée
- `currentTargetProgramId` = `formData.targetProgramId` (l'ID du programme cible)
- La navigation est `navigation` de `useNavigation<NativeStackNavigationProp<RootStackParamList>>()`
- `RootStackParamList` : `Programs: undefined`, `ProgramDetail: { programId: string }` (voir `navigation/index.tsx`)

## Étapes
1. Lire `mobile/src/screens/AssistantScreen.tsx` pour confirmer le contexte exact des lignes 413–435
2. Modifier ligne ~424 : remplacer `navigation.navigate('Home')` par `navigation.navigate('Programs')`
3. Modifier ligne ~434 : remplacer `navigation.navigate('SessionDetail', { sessionId: session.id })` par `navigation.navigate('ProgramDetail', { programId: currentTargetProgramId })`

## Contraintes
- Ne pas modifier le reste de la logique (reset formData, fermeture modal, etc.)
- Ne pas casser le flow d'erreur (bloc catch)
- `currentTargetProgramId` est déjà disponible dans la closure (ligne 415)
- Respecter les types TypeScript stricts (pas de `as never` ni de cast)
- Pas de `console.log` en dehors de `__DEV__`

## Critères de validation
- `npx tsc --noEmit` → zéro erreur TypeScript
- Après validation d'un programme IA : l'app arrive sur la liste des programmes
- Après validation d'une séance IA : l'app arrive sur le détail du programme (liste des séances) où la nouvelle séance apparaît

## Dépendances
Aucune dépendance — groupe indépendant, peut tourner en parallèle avec Groupe B.

## Statut
⏳ En attente
