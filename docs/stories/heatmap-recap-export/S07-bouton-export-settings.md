# S07 — Bouton export dans SettingsScreen + partage

## Description
En tant qu'utilisateur, je veux un bouton "Exporter mes donnees" dans les parametres, afin de telecharger/partager toutes mes donnees en un tap.

## Dependance
S06 (helper exportAllData)

## Fichiers concernes
- `mobile/src/screens/SettingsScreen.tsx` (MODIFIE)

## Taches techniques

### 1. Imports
```typescript
import * as Sharing from 'expo-sharing'
import { exportAllData } from '../model/utils/exportHelpers'
import { AlertDialog } from '../components/AlertDialog'
```

### 2. State
```typescript
const [exporting, setExporting] = useState(false)
const [exportError, setExportError] = useState(false)
```

### 3. Handler
```typescript
const handleExport = async () => {
  haptics.onPress()
  setExporting(true)
  try {
    const filePath = await exportAllData()
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: 'Exporter mes donnees WEGOGYM',
    })
  } catch (error) {
    if (__DEV__) console.error('Export failed:', error)
    setExportError(true)
  } finally {
    setExporting(false)
  }
}
```

### 4. Section "Donnees" dans le JSX
Inserer entre la section "Intelligence Artificielle" et "A propos" :
```tsx
<View style={styles.section}>
  <Text style={styles.sectionTitle}>💾 Donnees</Text>
  <TouchableOpacity
    style={[styles.exportButton, exporting && styles.exportButtonDisabled]}
    onPress={handleExport}
    disabled={exporting}
    activeOpacity={0.7}
  >
    <Text style={styles.exportButtonText}>
      {exporting ? 'Export en cours...' : 'Exporter mes donnees'}
    </Text>
  </TouchableOpacity>
  <Text style={styles.exportHint}>Vos donnees vous appartiennent</Text>
</View>
```

### 5. AlertDialog d'erreur
```tsx
<AlertDialog
  visible={exportError}
  title="Erreur d'export"
  message="Impossible d'exporter les donnees. Veuillez reessayer."
  confirmText="OK"
  confirmColor={colors.primary}
  onConfirm={() => setExportError(false)}
  onCancel={() => setExportError(false)}
  hideCancel
/>
```

### 6. Styles
```typescript
exportButton: {
  backgroundColor: colors.primary,
  borderRadius: borderRadius.sm,
  padding: spacing.md,
  alignItems: 'center',
}
exportButtonDisabled: {
  opacity: 0.6,
}
exportButtonText: {
  color: colors.text,
  fontSize: fontSize.md,
  fontWeight: '600',
}
exportHint: {
  color: colors.textSecondary,
  fontSize: fontSize.sm,
  textAlign: 'center',
  marginTop: spacing.sm,
}
```

## Criteres d'acceptation
- [ ] Section "Donnees" visible dans Settings (avant "A propos")
- [ ] Bouton "Exporter mes donnees"
- [ ] Haptic `onPress` au tap
- [ ] Loading state (texte change, bouton disabled)
- [ ] Dialog de partage systeme apres generation
- [ ] AlertDialog d'erreur si echec
- [ ] Hint "Vos donnees vous appartiennent"
- [ ] Fonctionne offline
- [ ] `npx tsc --noEmit` → 0 erreur

## Estimation
S (15-30 min)
