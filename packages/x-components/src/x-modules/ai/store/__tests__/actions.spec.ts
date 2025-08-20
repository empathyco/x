import type { SafeStore } from '../../../../store/__tests__/utils'
import type { AiActions, AiGetters, AiMutations, AiState } from '../types'
import { mount } from '@vue/test-utils'
import { Store } from 'vuex'
import { getAiQuestionsStub } from '../../../../__stubs__'
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils'
import { aiXStoreModule } from '../module'
import { resetAiStateWith } from './utils'

describe('testing ai module actions', () => {
  const mockedQuestions = getAiQuestionsStub()

  const adapter = getMockedAdapter({
    aiQuestions: { resolved: true, items: mockedQuestions, taskId: 'task-1' },
    aiTasks: { result: { resolved: true, items: mockedQuestions } },
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

  describe('fetchAiQuestions', () => {
    it('should return ai questions', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      const questions = await store.dispatch('fetchAiQuestions', store.getters.request)
      expect(questions).toEqual(mockedQuestions)
    })

    it('should return null if there is no request', async () => {
      const questions = await store.dispatch('fetchAiQuestions', store.getters.request)
      expect(questions).toBeNull()
    })
  })
})
