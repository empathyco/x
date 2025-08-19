import type { AiXStoreModule } from '../store'

/**
 * Default implementation for the {@link AiGetters.currentQuestionLoading} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the ai
 * module.
 * @returns The ai request to fetch data from the API.
 *
 * @public
 */
export const currentQuestionLoading: AiXStoreModule['getters']['currentQuestionLoading'] = ({
  questionsByQuery,
  query,
}) => questionsByQuery[query]?.loading
