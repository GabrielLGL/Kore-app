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
