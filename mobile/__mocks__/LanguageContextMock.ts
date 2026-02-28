/**
 * Mock global pour LanguageContext — utilisé dans les tests Jest.
 * Évite la dépendance transitoire LanguageContext → database → SQLiteAdapter.
 * Retourne le français par défaut (cohérent avec les strings attendues dans les tests).
 */
import { fr } from '../src/i18n/fr'
import type { Language, Translations } from '../src/i18n/index'

export function useLanguage(): { language: Language; t: Translations; setLanguage: (lang: Language) => Promise<void> } {
  return {
    language: 'fr',
    t: fr as Translations,
    setLanguage: jest.fn().mockResolvedValue(undefined),
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement
}
