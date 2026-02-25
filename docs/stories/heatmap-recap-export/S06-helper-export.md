# S06 — Helper exportAllData + tests

## Description
En tant que systeme, je veux un helper qui collecte toutes les donnees et genere un fichier JSON, afin que l'utilisateur puisse exporter ses donnees en un tap.

## Dependance
S05 (expo-file-system installe)

## Fichiers concernes
- `mobile/src/model/utils/exportHelpers.ts` (NOUVEAU)
- `mobile/src/model/utils/__tests__/exportHelpers.test.ts` (NOUVEAU)

## Taches techniques

### 1. Type ExportData
```typescript
interface ExportData {
  metadata: {
    exportDate: string           // ISO 8601
    appVersion: string           // '1.0.0'
    schemaVersion: number        // 20
    tables: Record<string, number>  // nom table -> nombre d'enregistrements
  }
  programs: Array<Record<string, unknown>>
  sessions: Array<Record<string, unknown>>
  session_exercises: Array<Record<string, unknown>>
  exercises: Array<Record<string, unknown>>
  performance_logs: Array<Record<string, unknown>>
  histories: Array<Record<string, unknown>>
  sets: Array<Record<string, unknown>>
  body_measurements: Array<Record<string, unknown>>
  users: Array<Record<string, unknown>>
}
```

### 2. Fonction exportAllData
```typescript
export async function exportAllData(): Promise<string>
```

Implementation :
1. Pour chaque table : `database.get('table').query().fetch()`
2. Mapper chaque record vers `record._raw` (donnees brutes SQLite)
3. Pour `users` : exclure `ai_api_key` via destructuring
   ```typescript
   const { ai_api_key, ...safeUser } = userRaw
   ```
4. Construire l'objet `ExportData` avec metadata
5. `JSON.stringify(data, null, 2)`
6. `FileSystem.writeAsStringAsync(path, jsonString)`
   - `path = FileSystem.documentDirectory + 'wegogym-export-YYYY-MM-DD.json'`
7. Retourner le path

### 3. Securite
- `ai_api_key` JAMAIS dans le JSON exporte (Known Pitfall CLAUDE.md)
- Verifier dans les tests que le champ est absent

### 4. Tests unitaires
- Mocker `database.get().query().fetch()` pour retourner des records avec `_raw`
- Mocker `FileSystem.writeAsStringAsync` pour verifier l'appel
- Verifier la structure du JSON (metadata presente, toutes les tables)
- Verifier que `ai_api_key` est exclu du user exporte
- Verifier le nom du fichier (format date)

## Criteres d'acceptation
- [ ] Nouveau fichier `exportHelpers.ts`
- [ ] `exportAllData()` retourne le chemin du fichier
- [ ] 9 tables exportees (programs, sessions, session_exercises, exercises, performance_logs, histories, sets, body_measurements, users)
- [ ] Metadata complete (date, version, schema, counts)
- [ ] `ai_api_key` exclu
- [ ] Fichier nomme `wegogym-export-YYYY-MM-DD.json`
- [ ] Tests unitaires passent
- [ ] `npx tsc --noEmit` → 0 erreur

## Estimation
M (30-60 min)
