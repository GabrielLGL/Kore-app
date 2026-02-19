# fix(settings) — Afficher message d'erreur réel lors du test de connexion AI
Date : 2026-02-19 14:30

## Problème
Le bloc `catch` de `handleTestConnection()` affichait toujours un message générique :
`Impossible de joindre ${aiProvider}. Vérifie ta clé API.`
Le message d'erreur réel (ex: "Gemini API erreur 403: API_KEY_INVALID") était ignoré.

## Solution appliquée

### Avant
```typescript
} catch (error) {
  haptics.onDelete()
  Alert.alert('Erreur de connexion ❌', `Impossible de joindre ${aiProvider}. Vérifie ta clé API.`)
}
```

### Après
```typescript
} catch (error) {
  haptics.onDelete()
  const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
  const isGemini403 = aiProvider === 'gemini' && (errorMessage.includes('403') || errorMessage.includes('API_NOT_ENABLED'))
  const hint = isGemini403
    ? '\n\nVérifiez que l\'API Generative Language est activée dans Google Cloud Console.'
    : ''
  Alert.alert('Erreur de connexion ❌', `Impossible de joindre ${aiProvider}.\n\n${errorMessage}${hint}`)
}
```

## Résultats
- TypeScript : ✅
- Tests : ✅ 24/24 passed
- Commit : cff2bd5
