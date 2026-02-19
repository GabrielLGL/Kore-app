// Mock @sentry/react-native avant tous les imports
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  setContext: jest.fn(),
  reactNavigationIntegration: jest.fn().mockReturnValue({ name: 'ReactNavigationIntegration' }),
}))

// Mock expo-constants
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: { sentryDsn: undefined },
      version: '2.0.0',
      android: { versionCode: 10 },
    },
  },
}))

import { initSentry, captureError } from '../sentry'
import * as Sentry from '@sentry/react-native'

const mockInit = Sentry.init as jest.Mock
const mockCaptureException = Sentry.captureException as jest.Mock
const mockSetContext = Sentry.setContext as jest.Mock

describe('sentry', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Supprimer le DSN de l'environnement par défaut
    delete (process.env as Record<string, string | undefined>).EXPO_PUBLIC_SENTRY_DSN
  })

  describe('initSentry', () => {
    it('ne fait rien quand __DEV__ est true et aucun DSN fourni', () => {
      // Dans l'environnement Jest (jest-expo), __DEV__ est true par défaut
      // Sans DSN, le premier guard s'applique : retour immédiat
      initSentry()

      expect(mockInit).not.toHaveBeenCalled()
    })

    it('ne fait rien quand EXPO_PUBLIC_SENTRY_DSN est une chaîne vide', () => {
      ;(process.env as Record<string, string>).EXPO_PUBLIC_SENTRY_DSN = ''

      initSentry()

      // '' est falsy donc SENTRY_DSN = undefined → même chemin que sans DSN
      expect(mockInit).not.toHaveBeenCalled()
    })

    it('ne fait pas de crash lors d\'un appel répété sans DSN', () => {
      expect(() => {
        initSentry()
        initSentry()
      }).not.toThrow()
    })
  })

  describe('captureError', () => {
    it('appelle Sentry.captureException avec l\'erreur fournie', () => {
      const error = new Error('Test error WEGOGYM')

      captureError(error)

      expect(mockCaptureException).toHaveBeenCalledTimes(1)
      expect(mockCaptureException).toHaveBeenCalledWith(error)
    })

    it('appelle Sentry.setContext puis captureException si contexte fourni', () => {
      const error = new Error('Erreur avec contexte')
      const context = { userId: '123', screen: 'HomeScreen' }

      captureError(error, context)

      expect(mockSetContext).toHaveBeenCalledTimes(1)
      expect(mockSetContext).toHaveBeenCalledWith('additional_context', context)
      expect(mockCaptureException).toHaveBeenCalledWith(error)
    })

    it('n\'appelle pas setContext si aucun contexte n\'est fourni', () => {
      const error = new Error('Erreur simple')

      captureError(error)

      expect(mockSetContext).not.toHaveBeenCalled()
      expect(mockCaptureException).toHaveBeenCalledWith(error)
    })

    it('n\'appelle pas setContext si contexte est undefined', () => {
      const error = new Error('Erreur undefined context')

      captureError(error, undefined)

      expect(mockSetContext).not.toHaveBeenCalled()
    })

    it('transmet le contexte complet avec plusieurs champs hétérogènes', () => {
      const error = new Error('Erreur enrichie')
      const context: Record<string, unknown> = {
        exerciseId: 'ex-42',
        action: 'delete',
        timestamp: 1704067200000,
        nested: { key: 'value' },
      }

      captureError(error, context)

      expect(mockSetContext).toHaveBeenCalledWith('additional_context', context)
    })

    it('transmet des instances d\'erreur de différents types', () => {
      const typeError = new TypeError('Mauvais type')
      captureError(typeError)
      expect(mockCaptureException).toHaveBeenCalledWith(typeError)

      jest.clearAllMocks()

      const rangeError = new RangeError('Hors plage')
      captureError(rangeError)
      expect(mockCaptureException).toHaveBeenCalledWith(rangeError)
    })

    it('peut être appelé plusieurs fois sans interaction entre les appels', () => {
      const error1 = new Error('Erreur 1')
      const error2 = new Error('Erreur 2')

      captureError(error1)
      captureError(error2)

      expect(mockCaptureException).toHaveBeenCalledTimes(2)
      expect(mockCaptureException).toHaveBeenNthCalledWith(1, error1)
      expect(mockCaptureException).toHaveBeenNthCalledWith(2, error2)
    })
  })
})
