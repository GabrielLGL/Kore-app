import React, { createContext, useContext, useState, useCallback } from 'react'
import { ThemeMode, ThemeColors, getThemeColors, getThemeNeuShadow } from '../theme'
import { database } from '../model'
import User from '../model/models/User'

interface ThemeContextValue {
  mode: ThemeMode
  colors: ThemeColors
  neuShadow: ReturnType<typeof getThemeNeuShadow>
  isDark: boolean
  toggleTheme: () => Promise<void>
  setThemeMode: (mode: ThemeMode) => Promise<void>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: React.ReactNode
  initialMode?: ThemeMode
}

export function ThemeProvider({ children, initialMode = 'dark' }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode)

  const persistTheme = useCallback(async (newMode: ThemeMode) => {
    try {
      const users = await database.get<User>('users').query().fetch()
      const user = users[0]
      if (!user) return
      await database.write(async () => {
        await user.update(u => { u.themeMode = newMode })
      })
    } catch (error) {
      if (__DEV__) console.error('[ThemeContext] persist error:', error)
    }
  }, [])

  const toggleTheme = useCallback(async () => {
    const newMode: ThemeMode = mode === 'dark' ? 'light' : 'dark'
    setMode(newMode)
    await persistTheme(newMode)
  }, [mode, persistTheme])

  const setThemeMode = useCallback(async (newMode: ThemeMode) => {
    setMode(newMode)
    await persistTheme(newMode)
  }, [persistTheme])

  const value: ThemeContextValue = {
    mode,
    colors: getThemeColors(mode),
    neuShadow: getThemeNeuShadow(mode),
    isDark: mode === 'dark',
    toggleTheme,
    setThemeMode,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme() appelé hors ThemeProvider')
  return ctx
}

/** Alias pratique pour les composants qui ont juste besoin des couleurs */
export function useColors(): ThemeColors {
  return useTheme().colors
}
