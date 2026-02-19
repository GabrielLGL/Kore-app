// Mocks AVANT les imports (hoistés par Jest)
jest.mock('@nozbe/watermelondb', () => ({
  Q: {
    where: jest.fn().mockReturnValue({}),
    gte:   jest.fn().mockReturnValue({}),
    oneOf: jest.fn().mockReturnValue({}),
    sortBy: jest.fn().mockReturnValue({}),
    take:  jest.fn().mockReturnValue({}),
    desc:  'desc',
  },
}))

jest.mock('../../../model', () => ({
  database: {
    get: jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        fetch: jest.fn().mockResolvedValue([]),
      }),
    }),
  },
}))

jest.mock('../offlineEngine', () => ({
  offlineEngine: {
    generate: jest.fn().mockResolvedValue({ name: 'Plan Offline', sessions: [] }),
  },
}))

jest.mock('../claudeProvider', () => ({
  createClaudeProvider: jest.fn().mockReturnValue({
    generate: jest.fn().mockResolvedValue({ name: 'Plan Claude', sessions: [] }),
  }),
}))

jest.mock('../openaiProvider', () => ({
  createOpenAIProvider: jest.fn().mockReturnValue({
    generate: jest.fn().mockResolvedValue({ name: 'Plan OpenAI', sessions: [] }),
  }),
}))

jest.mock('../geminiProvider', () => ({
  createGeminiProvider: jest.fn().mockReturnValue({
    generate: jest.fn().mockResolvedValue({ name: 'Plan Gemini', sessions: [] }),
  }),
  testGeminiConnection: jest.fn().mockResolvedValue(undefined),
}))

import { generatePlan, testProviderConnection } from '../aiService'
import { createClaudeProvider } from '../claudeProvider'
import { createOpenAIProvider } from '../openaiProvider'
import { createGeminiProvider, testGeminiConnection } from '../geminiProvider'
import { offlineEngine } from '../offlineEngine'
import type { AIFormData } from '../types'

const testForm: AIFormData = {
  mode: 'session',
  goal: 'bodybuilding',
  level: 'débutant',
  equipment: [],
  durationMin: 30,
  muscleGroup: 'Pecs',
}

describe('aiService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generatePlan — sélection du provider', () => {
    it('utilise offlineEngine si user est null', async () => {
      const plan = await generatePlan(testForm, null)

      expect(offlineEngine.generate as jest.Mock).toHaveBeenCalled()
      expect(createClaudeProvider).not.toHaveBeenCalled()
      expect(plan.name).toBe('Plan Offline')
    })

    it("utilise offlineEngine si aiProvider est 'offline'", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = { aiProvider: 'offline', aiApiKey: 'any-key' } as any
      const plan = await generatePlan(testForm, user)

      expect(offlineEngine.generate as jest.Mock).toHaveBeenCalled()
      expect(createClaudeProvider).not.toHaveBeenCalled()
      expect(plan.name).toBe('Plan Offline')
    })

    it('utilise offlineEngine si aiApiKey est null', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = { aiProvider: 'claude', aiApiKey: null } as any
      const plan = await generatePlan(testForm, user)

      expect(offlineEngine.generate as jest.Mock).toHaveBeenCalled()
      expect(createClaudeProvider).not.toHaveBeenCalled()
      expect(plan.name).toBe('Plan Offline')
    })

    it("utilise claudeProvider si aiProvider='claude' avec clé valide", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = { aiProvider: 'claude', aiApiKey: 'sk-ant-test-key' } as any
      const plan = await generatePlan(testForm, user)

      expect(createClaudeProvider).toHaveBeenCalledWith('sk-ant-test-key')
      expect(offlineEngine.generate as jest.Mock).not.toHaveBeenCalled()
      expect(plan.name).toBe('Plan Claude')
    })

    it('retombe sur offlineEngine si le provider cloud throw', async () => {
      ;(createClaudeProvider as jest.MockedFunction<typeof createClaudeProvider>)
        .mockReturnValueOnce({
          generate: jest.fn().mockRejectedValue(new Error('API unavailable')),
        })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = { aiProvider: 'claude', aiApiKey: 'sk-ant-test-key' } as any
      const plan = await generatePlan(testForm, user)

      expect(createClaudeProvider).toHaveBeenCalledWith('sk-ant-test-key')
      expect(offlineEngine.generate as jest.Mock).toHaveBeenCalled()
      expect(plan.name).toBe('Plan Offline')
    })
  })

  describe('testProviderConnection', () => {
    it("retourne immédiatement si provider='offline'", async () => {
      await testProviderConnection('offline', 'any-key')

      expect(createClaudeProvider).not.toHaveBeenCalled()
      expect(createOpenAIProvider).not.toHaveBeenCalled()
      expect(createGeminiProvider).not.toHaveBeenCalled()
    })

    it("appelle provider.generate si provider='claude'", async () => {
      await testProviderConnection('claude', 'sk-ant-test-key')

      expect(createClaudeProvider).toHaveBeenCalledWith('sk-ant-test-key')
      const provider = (createClaudeProvider as jest.Mock).mock.results[0].value as { generate: jest.Mock }
      expect(provider.generate).toHaveBeenCalled()
    })

    it("appelle testGeminiConnection si provider='gemini'", async () => {
      await testProviderConnection('gemini', 'ai-google-test-key')

      expect(testGeminiConnection as jest.Mock).toHaveBeenCalledWith('ai-google-test-key')
      expect(createGeminiProvider).not.toHaveBeenCalled()
    })
  })
})
