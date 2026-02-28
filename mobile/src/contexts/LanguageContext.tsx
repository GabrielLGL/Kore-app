import React, { createContext, useContext, useState, useCallback } from 'react'
import { database } from '../model'
import User from '../model/models/User'
import { type Language, type Translations, translations } from '../i18n'

interface LanguageContextValue {
  language: Language
  t: Translations
  setLanguage: (lang: Language) => Promise<void>
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

interface LanguageProviderProps {
  children: React.ReactNode
  initialLang?: Language
}

export function LanguageProvider({ children, initialLang = 'fr' }: LanguageProviderProps) {
  const [language, setLang] = useState<Language>(initialLang)

  const persistLanguage = useCallback(async (lang: Language) => {
    try {
      const users = await database.get<User>('users').query().fetch()
      const user = users[0]
      if (!user) return
      await database.write(async () => {
        await user.update(u => { u.languageMode = lang })
      })
    } catch (error) {
      if (__DEV__) console.error('[LanguageContext] persist error:', error)
    }
  }, [])

  const setLanguage = useCallback(async (lang: Language) => {
    setLang(lang)
    await persistLanguage(lang)
  }, [persistLanguage])

  const value: LanguageContextValue = {
    language,
    t: translations[language],
    setLanguage,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage() appelé hors LanguageProvider')
  return ctx
}
