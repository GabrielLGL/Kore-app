import { fr } from './fr'
import { en } from './en'

export type Language = 'fr' | 'en'

export type Translations = typeof fr

export const translations: Record<Language, Translations> = { fr, en }

export { fr, en }
