# Configuration Sentry

Ce guide explique comment configurer Sentry pour le monitoring des erreurs en production.

## 📋 Prérequis

✅ Package `@sentry/react-native` installé
✅ Plugin Sentry ajouté dans `app.json`
✅ Code Sentry intégré dans `ErrorBoundary.tsx` et `App.tsx`

## 🔧 Configuration

### 1. Créer un compte Sentry

1. Va sur : **https://sentry.io/signup/**
2. Crée un compte gratuit (10,000 événements/mois)
3. Confirme ton email

### 2. Créer un projet

1. Dans le dashboard Sentry, clique sur **"Create Project"**
2. Choisis la plateforme : **React Native**
3. Nom du projet : `WEGOGYM`
4. Team : Laisse par défaut ou crée un nouveau team
5. Clique sur **"Create Project"**

### 3. Obtenir la DSN

Après création du projet, Sentry affiche la **DSN** (Data Source Name) :

```
https://xxxxxxxxxxxxx@oxxxxxxx.ingest.sentry.io/xxxxxxx
```

**Copie cette DSN**, tu en auras besoin pour la configuration.

### 4. Configurer la DSN dans le projet

#### Option A : Fichier .env (Recommandé pour dev)

1. Crée un fichier `.env` dans `mobile/` :
   ```bash
   cp .env.example .env
   ```

2. Remplace la DSN dans `.env` :
   ```bash
   EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@oxxxxx.ingest.sentry.io/xxxxx
   ```

3. ⚠️ **IMPORTANT** : Ne commit **JAMAIS** le fichier `.env` ! (déjà dans `.gitignore`)

#### Option B : app.json (Pour production)

Modifie `mobile/app.json` :

```json
{
  "expo": {
    "extra": {
      "sentryDsn": "https://xxxxx@oxxxxx.ingest.sentry.io/xxxxx"
    }
  }
}
```

⚠️ **Attention** : Ne commit pas la vraie DSN dans `app.json` si le dépôt est public !

#### Option C : EAS Secrets (Recommandé pour CI/CD)

Si tu utilises EAS Build, configure la DSN comme secret :

```bash
cd mobile
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://xxxxx@oxxxxx.ingest.sentry.io/xxxxx"
```

Ensuite, dans `eas.json` :

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SENTRY_DSN": "@EXPO_PUBLIC_SENTRY_DSN"
      }
    }
  }
}
```

## 🧪 Tester Sentry

### 1. Mode développement

Par défaut, Sentry est **désactivé en dev** pour ne pas polluer ton quota. Les erreurs sont juste loggées en console.

Pour tester Sentry en dev, modifie `src/services/sentry.ts` :

```typescript
enabled: !__DEV__,  // Changer en : enabled: true,
```

### 2. Simuler une erreur

Ajoute un bouton de test dans n'importe quel écran :

```typescript
<TouchableOpacity onPress={() => {
  throw new Error('Test Sentry error!')
}}>
  <Text>Trigger Error</Text>
</TouchableOpacity>
```

### 3. Vérifier sur Sentry

1. Déclenche l'erreur en appuyant sur le bouton
2. Va sur : https://sentry.io/organizations/ton-org/issues/
3. Tu devrais voir l'erreur apparaître en quelques secondes ! 🎉

## 📊 Features Sentry activées

✅ **Error Tracking** - Capture automatique des erreurs React
✅ **Performance Monitoring** - Traces des performances (20% des transactions)
✅ **Release Tracking** - Associe les erreurs aux versions de l'app
✅ **Breadcrumbs** - Contexte avant l'erreur (navigations, actions, logs)
✅ **User Context** - Associe les erreurs aux utilisateurs (optionnel)
✅ **Environment** - Différencie dev/staging/production

## 🔍 Utilisation avancée

### Capturer une erreur manuellement

```typescript
import { captureError } from '@/services/sentry'

try {
  // Code qui peut échouer
} catch (error) {
  captureError(error as Error, {
    context: 'Additional info'
  })
}
```

### Ajouter du contexte utilisateur

```typescript
import { setUser } from '@/services/sentry'

// Après login
setUser('user123', 'user@example.com', 'John Doe')

// Après logout
clearUser()
```

### Ajouter des breadcrumbs

```typescript
import { addBreadcrumb } from '@/services/sentry'

addBreadcrumb('User clicked on button', 'user-action', {
  buttonId: 'submit',
  screenName: 'HomeScreen'
})
```

### Capturer des messages custom

```typescript
import { captureMessage } from '@/services/sentry'

captureMessage('Something unusual happened', 'warning')
```

## 🚀 Configuration CI/CD

Pour que Sentry fonctionne dans GitHub Actions :

1. Ajoute la DSN comme secret GitHub :
   - Va dans : **Settings → Secrets → Actions**
   - Ajoute : `EXPO_PUBLIC_SENTRY_DSN`

2. Modifie `.github/workflows/ci.yml` :

```yaml
env:
  EXPO_PUBLIC_SENTRY_DSN: ${{ secrets.EXPO_PUBLIC_SENTRY_DSN }}
```

## 📈 Limites du plan gratuit

- **10,000 événements/mois**
- **90 jours de rétention**
- **1 projet**
- Support communautaire

Pour plus d'événements, upgrade vers un plan payant.

## 🔗 Ressources

- Documentation Sentry : https://docs.sentry.io/platforms/react-native/
- Dashboard Sentry : https://sentry.io/
- Support : https://forum.sentry.io/

---

**Note** : En production, Sentry est activé automatiquement. Les erreurs seront capturées et envoyées sans action de ta part ! 🎉
