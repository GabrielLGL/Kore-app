# S01 — Migration schéma v16 → v17

## Description
Migrer le schéma WatermelonDB de la version 16 à la version 17 en ajoutant le champ `name` sur la table `users` et en créant la nouvelle table `body_measurements`. Créer le modèle `BodyMeasurement` et mettre à jour `User`.

## Fichiers à modifier
- `mobile/src/model/schema.ts` — version bump + colonnes
- `mobile/src/model/models/User.ts` — ajout `@text('name')`
- `mobile/src/model/models/BodyMeasurement.ts` — nouveau fichier
- `mobile/src/model/index.ts` — ajout BodyMeasurement dans modelClasses

## Tâches techniques

### 1. schema.ts
- Changer `version: 16` → `version: 17`
- Sur la table `users` : ajouter `{ name: 'name', type: 'string', isOptional: true }`
- Ajouter nouvelle table :
```typescript
tableSchema({
  name: 'body_measurements',
  columns: [
    { name: 'date', type: 'number' },
    { name: 'weight', type: 'number', isOptional: true },
    { name: 'waist', type: 'number', isOptional: true },
    { name: 'hips', type: 'number', isOptional: true },
    { name: 'chest', type: 'number', isOptional: true },
    { name: 'arms', type: 'number', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ]
})
```

### 2. User.ts
Ajouter le decorator : `@text('name') name!: string | null`

### 3. BodyMeasurement.ts (nouveau)
```typescript
import { Model } from '@nozbe/watermelondb'
import { field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class BodyMeasurement extends Model {
  static table = 'body_measurements'

  @field('date') date!: number
  @field('weight') weight!: number | null
  @field('waist') waist!: number | null
  @field('hips') hips!: number | null
  @field('chest') chest!: number | null
  @field('arms') arms!: number | null
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}
```

### 4. index.ts
Importer et ajouter `BodyMeasurement` dans `modelClasses`.

## Critères d'acceptation
- [ ] `npx tsc --noEmit` passe sans erreur
- [ ] Schéma version 17
- [ ] Colonnes `name` présente sur users (isOptional)
- [ ] Table `body_measurements` présente avec toutes les colonnes
- [ ] Modèle BodyMeasurement correctement typé (no `any`)
- [ ] `modelClasses` inclut BodyMeasurement
- [ ] Données existantes non corrompues (migration addColumns compatible)

## Estimation : S (< 1h)
## Dépendances : aucune
