import type { AiQuestion } from '@empathyco/x-types'
import type { QueryState } from '../../../store'
import type { AiXStoreModule } from './types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { fetchAiQuestions } from './actions/fetch-ai-questions.action'
import { setUrlParams } from './actions/set-url-params.action'
import {
  aiCurrentQuestion as currentQuestion,
  aiCurrentQuestionLoading as currentQuestionLoading,
  aiQuery as query,
  aiQuestionsRequest as request,
} from './getters'
/**
 * {@link XStoreModule} For the ai module.
 *
 * @internal
 */
export const aiXStoreModule: AiXStoreModule = {
  state: () => ({
    query: '',
    questionsByQuery: {},
    config: {},
    params: {},
    relatedTags: [],
  }),
  getters: {
    request,
    query,
    currentQuestion,
    currentQuestionLoading,
  },
  mutations: {
    setConfig,
    mergeConfig,
    setQuery: (state: QueryState, query: string) => {
      state.query = query
    },
    setQuestionsByQuery: (
      state,
      params: { query: string; state: { questions: AiQuestion[]; loading: boolean } },
    ) => {
      if (!state.questionsByQuery[params.query]) {
        state.questionsByQuery[params.query] = {
          questions: [],
          loading: true,
        }
      }
      state.questionsByQuery[params.query] = params.state
    },
    setParams(state, params) {
      state.params = params
    },
    resetAiState(state) {
      state.questionsByQuery = {}
    },
    setAiRelatedTags(state, relatedTags) {
      state.relatedTags = relatedTags
    },
  },
  actions: {
    fetchAiQuestions,
    setUrlParams,
  },
}
