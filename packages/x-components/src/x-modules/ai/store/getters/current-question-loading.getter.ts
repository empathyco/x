import type { AiXStoreModule } from '../types'

/**
 * Default implementation for the {@link AiGetters.currentQuestionLoading} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the ai
 * module.
 * @returns The loading value of the current question.
 *
 * @public
 */
export const currentQuestionLoading: AiXStoreModule['getters']['currentQuestionLoading'] = ({
  questionsByQuery,
  query,
}) => questionsByQuery[query]?.loading
