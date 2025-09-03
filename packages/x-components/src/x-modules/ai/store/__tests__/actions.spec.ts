import type { SafeStore } from '../../../../store/__tests__/utils'
import type { AiActions, AiGetters, AiMutations, AiState } from '../types'
import { mount } from '@vue/test-utils'
import { Store } from 'vuex'
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils'
import { aiXStoreModule } from '../module'
import { resetAiStateWith } from './utils'

describe('testing ai module actions', () => {
  const adapter = getMockedAdapter({
    aiSuggestions: {
      body: { getReader: () => ({ read: async () => Promise.resolve({ done: true }) }) },
      status: 200,
    } as unknown as Response,
  })

  const store: SafeStore<AiState, AiGetters, AiMutations, AiActions> = new Store(
    aiXStoreModule as any,
  )
  mount(
    {},
    {
      global: {
        plugins: [installNewXPlugin({ adapter, store })],
      },
    },
  )

  beforeEach(() => {
    resetAiStateWith(store)
  })

  describe('fetchAndSaveAiSuggestions', () => {
    it('should return ai questions', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      await expect(
        store.dispatch('fetchAndSaveAiSuggestions', store.getters.request),
      ).resolves.toBeUndefined()
    })
    it('should return null if there is no request', async () => {
      const response = await store.dispatch('fetchAndSaveAiSuggestions', store.getters.request)
      expect(response).toBeNull()
    })
  })
})
