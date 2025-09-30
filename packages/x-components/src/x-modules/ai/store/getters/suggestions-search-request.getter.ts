import type { AiXStoreModule } from '../types'

/**
 * Default implementation for the {@link AiGetters.suggestionsSearchRequest} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the ai
 * module.
 *
 * @returns The ai request to fetch data from the API.
 *
 * @public
 */
export const suggestionsSearchRequest: AiXStoreModule['getters']['suggestionsSearchRequest'] = ({
  params,
  queries,
  origin,
}) => {
  return queries.length ? { queries, extraParams: { ...params, origin } } : null
}
