/**
 * Mock global pour ThemeContext — utilisé dans les tests Jest.
 * Évite la dépendance transitoire ThemeContext → database → SQLiteAdapter.
 */
import { colors, neuShadow } from '../src/theme'
import type { ThemeColors } from '../src/theme'

export function useTheme() {
  return {
    mode: 'dark' as const,
    colors,
    neuShadow,
    isDark: true,
    toggleTheme: jest.fn(),
    setThemeMode: jest.fn(),
  }
}

export function useColors(): ThemeColors {
  return colors
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement
}
