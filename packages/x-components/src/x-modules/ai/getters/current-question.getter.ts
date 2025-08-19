import type { AiXStoreModule } from '../store'

/**
 * Default implementation for the {@link AiGetters.currentQuestion} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the ai
 * module.
 * @returns The ai request to fetch data from the API.
 *
 * @public
 */
export const currentQuestion: AiXStoreModule['getters']['currentQuestion'] = ({
  questionsByQuery,
  query,
}) => questionsByQuery[query]?.questions[0]
